//
//  BlipApp.swift
//  Blip
//

import SwiftUI

@main
struct BlipApp: App {
    @StateObject private var authService = AuthService.shared

    var body: some Scene {
        WindowGroup {
            Group {
                if authService.isAuthenticated {
                    MainView()
                } else {
                    LoginView()
                }
            }
            .animation(.easeInOut, value: authService.isAuthenticated)
        }
        .windowStyle(.hiddenTitleBar)
        .defaultSize(width: 800, height: 600)
        .commands {
            CommandGroup(replacing: .newItem) { }
        }
    }
}
