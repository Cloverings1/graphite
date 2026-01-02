//
//  AuthService.swift
//  Blip
//

import Foundation
import Combine

@MainActor
class AuthService: ObservableObject {
    static let shared = AuthService()

    @Published var isAuthenticated = false
    @Published var currentUser: BlipUser?
    @Published var accessToken: String?
    @Published var isLoading = false
    @Published var error: String?

    private let userDefaults = UserDefaults.standard
    private let tokenKey = "blip_access_token"
    private let refreshTokenKey = "blip_refresh_token"
    private let userKey = "blip_user"

    init() {
        loadStoredSession()
    }

    private func loadStoredSession() {
        if let tokenData = userDefaults.string(forKey: tokenKey),
           let userData = userDefaults.data(forKey: userKey),
           let user = try? JSONDecoder().decode(BlipUser.self, from: userData) {
            self.accessToken = tokenData
            self.currentUser = user
            self.isAuthenticated = true

            // Refresh token on startup
            Task {
                await refreshSession()
            }
        }
    }

    private func storeSession(accessToken: String, refreshToken: String, user: BlipUser) {
        userDefaults.set(accessToken, forKey: tokenKey)
        userDefaults.set(refreshToken, forKey: refreshTokenKey)
        if let userData = try? JSONEncoder().encode(user) {
            userDefaults.set(userData, forKey: userKey)
        }
    }

    private func clearSession() {
        userDefaults.removeObject(forKey: tokenKey)
        userDefaults.removeObject(forKey: refreshTokenKey)
        userDefaults.removeObject(forKey: userKey)
    }

    func signIn(email: String, password: String) async {
        isLoading = true
        error = nil

        do {
            let url = URL(string: "\(Config.supabaseURL)/auth/v1/token?grant_type=password")!
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue(Config.supabaseAnonKey, forHTTPHeaderField: "apikey")

            let body: [String: Any] = [
                "email": email,
                "password": password
            ]
            request.httpBody = try JSONSerialization.data(withJSONObject: body)

            let (data, response) = try await URLSession.shared.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse else {
                throw AuthError.invalidResponse
            }

            if httpResponse.statusCode == 200 {
                let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)
                let user = BlipUser(id: authResponse.user.id, email: authResponse.user.email)

                self.accessToken = authResponse.accessToken
                self.currentUser = user
                self.isAuthenticated = true

                storeSession(accessToken: authResponse.accessToken, refreshToken: authResponse.refreshToken, user: user)
            } else {
                let errorResponse = try? JSONDecoder().decode(AuthErrorResponse.self, from: data)
                throw AuthError.serverError(errorResponse?.errorDescription ?? "Authentication failed")
            }
        } catch let authError as AuthError {
            self.error = authError.localizedDescription
        } catch {
            self.error = error.localizedDescription
        }

        isLoading = false
    }

    func signUp(email: String, password: String) async {
        isLoading = true
        error = nil

        do {
            let url = URL(string: "\(Config.supabaseURL)/auth/v1/signup")!
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue(Config.supabaseAnonKey, forHTTPHeaderField: "apikey")

            let body: [String: Any] = [
                "email": email,
                "password": password
            ]
            request.httpBody = try JSONSerialization.data(withJSONObject: body)

            let (data, response) = try await URLSession.shared.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse else {
                throw AuthError.invalidResponse
            }

            if httpResponse.statusCode == 200 {
                let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)
                let user = BlipUser(id: authResponse.user.id, email: authResponse.user.email)

                self.accessToken = authResponse.accessToken
                self.currentUser = user
                self.isAuthenticated = true

                storeSession(accessToken: authResponse.accessToken, refreshToken: authResponse.refreshToken, user: user)
            } else {
                let errorResponse = try? JSONDecoder().decode(AuthErrorResponse.self, from: data)
                throw AuthError.serverError(errorResponse?.errorDescription ?? "Sign up failed")
            }
        } catch let authError as AuthError {
            self.error = authError.localizedDescription
        } catch {
            self.error = error.localizedDescription
        }

        isLoading = false
    }

    func signOut() {
        clearSession()
        accessToken = nil
        currentUser = nil
        isAuthenticated = false
    }

    private func refreshSession() async {
        guard let refreshToken = userDefaults.string(forKey: refreshTokenKey) else { return }

        do {
            let url = URL(string: "\(Config.supabaseURL)/auth/v1/token?grant_type=refresh_token")!
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue(Config.supabaseAnonKey, forHTTPHeaderField: "apikey")

            let body: [String: Any] = ["refresh_token": refreshToken]
            request.httpBody = try JSONSerialization.data(withJSONObject: body)

            let (data, response) = try await URLSession.shared.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                signOut()
                return
            }

            let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)
            let user = BlipUser(id: authResponse.user.id, email: authResponse.user.email)

            self.accessToken = authResponse.accessToken
            self.currentUser = user
            self.isAuthenticated = true

            storeSession(accessToken: authResponse.accessToken, refreshToken: authResponse.refreshToken, user: user)
        } catch {
            signOut()
        }
    }
}

// MARK: - Supporting Types

struct BlipUser: Codable, Identifiable {
    let id: String
    let email: String
}

struct AuthResponse: Decodable {
    let accessToken: String
    let refreshToken: String
    let user: AuthUser

    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case user
    }
}

struct AuthUser: Decodable {
    let id: String
    let email: String
}

struct AuthErrorResponse: Decodable {
    let error: String?
    let errorDescription: String?

    enum CodingKeys: String, CodingKey {
        case error
        case errorDescription = "error_description"
    }
}

enum AuthError: LocalizedError {
    case invalidResponse
    case serverError(String)

    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "Invalid server response"
        case .serverError(let message):
            return message
        }
    }
}
