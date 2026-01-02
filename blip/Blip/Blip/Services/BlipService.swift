//
//  BlipService.swift
//  Blip
//

import Foundation
import Combine
import AppKit

@MainActor
class BlipService: ObservableObject {
    static let shared = BlipService()

    @Published var isConnected = false
    @Published var connectCode: String?
    @Published var friends: [Friend] = []
    @Published var activeTransfers: [FileTransfer] = []
    @Published var pendingIncomingTransfer: FileTransfer?
    @Published var error: String?

    private var webSocket: URLSessionWebSocketTask?
    private var pingTimer: Timer?
    private let authService = AuthService.shared

    private var receivingTransfers: [String: Data] = [:]

    func connect() {
        guard let token = authService.accessToken else {
            error = "Not authenticated"
            return
        }

        disconnect()

        let urlString = "\(Config.blipWSURL)?token=\(token)"
        guard let url = URL(string: urlString) else {
            error = "Invalid URL"
            return
        }

        let session = URLSession(configuration: .default)
        webSocket = session.webSocketTask(with: url)
        webSocket?.resume()

        receiveMessage()
        startPingTimer()
    }

    func disconnect() {
        pingTimer?.invalidate()
        pingTimer = nil
        webSocket?.cancel(with: .goingAway, reason: nil)
        webSocket = nil
        isConnected = false
    }

    private func startPingTimer() {
        pingTimer = Timer.scheduledTimer(withTimeInterval: 25, repeats: true) { [weak self] _ in
            Task { @MainActor in
                self?.send(.ping)
            }
        }
    }

    private func receiveMessage() {
        webSocket?.receive { [weak self] result in
            Task { @MainActor in
                switch result {
                case .success(let message):
                    switch message {
                    case .string(let text):
                        self?.handleMessage(text)
                    case .data(let data):
                        if let text = String(data: data, encoding: .utf8) {
                            self?.handleMessage(text)
                        }
                    @unknown default:
                        break
                    }
                    self?.receiveMessage()

                case .failure(let error):
                    print("WebSocket receive error: \(error)")
                    self?.isConnected = false
                    // Attempt reconnect after delay
                    DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                        if self?.authService.isAuthenticated == true {
                            self?.connect()
                        }
                    }
                }
            }
        }
    }

    private func handleMessage(_ text: String) {
        guard let data = text.data(using: .utf8),
              let message = try? JSONDecoder().decode(BlipIncomingMessage.self, from: data) else {
            print("Failed to decode message: \(text)")
            return
        }

        switch message.type {
        case "connected":
            isConnected = true
            // Request connect code and friends on connection
            send(.getConnectCode)
            send(.getFriends)

        case "pong":
            break // Keepalive response

        case "connect_code":
            connectCode = message.code

        case "friends_list":
            friends = message.friends ?? []

        case "friend_added":
            if let friend = message.friend {
                friends.append(friend)
            }

        case "friend_online":
            if let friendId = message.friendId,
               let index = friends.firstIndex(where: { $0.id == friendId }) {
                friends[index].isOnline = true
            }

        case "friend_offline":
            if let friendId = message.friendId,
               let index = friends.firstIndex(where: { $0.id == friendId }) {
                friends[index].isOnline = false
            }

        case "error":
            error = message.message

        case "transfer_incoming":
            if let transferId = message.transferId,
               let senderId = message.senderId,
               let senderName = message.senderName,
               let fileName = message.fileName,
               let fileSize = message.fileSize,
               let fileType = message.fileType {
                let transfer = FileTransfer(
                    id: transferId,
                    direction: .incoming,
                    peerId: senderId,
                    peerName: senderName,
                    fileName: fileName,
                    fileSize: fileSize,
                    fileType: fileType,
                    status: .pending
                )
                pendingIncomingTransfer = transfer
            }

        case "transfer_pending":
            if let transferId = message.transferId,
               let index = activeTransfers.firstIndex(where: { $0.id == transferId }) {
                activeTransfers[index].status = .pending
            }

        case "transfer_accepted":
            if let transferId = message.transferId,
               let index = activeTransfers.firstIndex(where: { $0.id == transferId }) {
                activeTransfers[index].status = .inProgress(progress: 0)
                // Start sending file data
                startSendingFile(transferId: transferId)
            }

        case "transfer_rejected":
            if let transferId = message.transferId,
               let index = activeTransfers.firstIndex(where: { $0.id == transferId }) {
                activeTransfers[index].status = .rejected
            }

        case "transfer_chunk":
            if let transferId = message.transferId,
               let chunkBase64 = message.chunk,
               let chunkData = Data(base64Encoded: chunkBase64),
               let index = activeTransfers.firstIndex(where: { $0.id == transferId }) {

                // Append chunk to receiving data
                if receivingTransfers[transferId] == nil {
                    receivingTransfers[transferId] = Data()
                }
                receivingTransfers[transferId]?.append(chunkData)

                let bytesReceived = Int64(receivingTransfers[transferId]?.count ?? 0)
                activeTransfers[index].bytesTransferred = bytesReceived
                activeTransfers[index].status = .inProgress(progress: activeTransfers[index].progress)
            }

        case "transfer_complete":
            if let transferId = message.transferId,
               let index = activeTransfers.firstIndex(where: { $0.id == transferId }) {
                activeTransfers[index].fileData = receivingTransfers[transferId]
                activeTransfers[index].status = .completed
                receivingTransfers.removeValue(forKey: transferId)

                // Save file
                saveReceivedFile(transfer: activeTransfers[index])
            }

        case "transfer_success":
            if let transferId = message.transferId,
               let index = activeTransfers.firstIndex(where: { $0.id == transferId }) {
                activeTransfers[index].status = .completed
            }

        case "transfer_cancelled":
            if let transferId = message.transferId,
               let index = activeTransfers.firstIndex(where: { $0.id == transferId }) {
                activeTransfers[index].status = .cancelled
                receivingTransfers.removeValue(forKey: transferId)
            }

        case "transfer_failed":
            if let transferId = message.transferId,
               let index = activeTransfers.firstIndex(where: { $0.id == transferId }) {
                activeTransfers[index].status = .failed(reason: message.reason ?? "Transfer failed")
            }

        default:
            print("Unknown message type: \(message.type)")
        }
    }

    func send(_ message: BlipOutgoingMessage) {
        guard let data = try? JSONEncoder().encode(message),
              let text = String(data: data, encoding: .utf8) else {
            return
        }

        webSocket?.send(.string(text)) { error in
            if let error = error {
                print("WebSocket send error: \(error)")
            }
        }
    }

    // MARK: - Friend Management

    func addFriend(code: String) {
        send(.addFriend(code: code.uppercased()))
    }

    // MARK: - File Transfer

    func sendFile(to friend: Friend, fileURL: URL) {
        guard let fileData = try? Data(contentsOf: fileURL) else {
            error = "Could not read file"
            return
        }

        let fileName = fileURL.lastPathComponent
        let fileSize = Int64(fileData.count)
        let fileType = fileURL.pathExtension

        // Create transfer and store file data
        let transferId = UUID().uuidString
        let transfer = FileTransfer(
            id: transferId,
            direction: .outgoing,
            peerId: friend.id,
            peerName: friend.displayName,
            fileName: fileName,
            fileSize: fileSize,
            fileType: fileType,
            status: .pending,
            fileData: fileData
        )
        activeTransfers.append(transfer)

        // Request transfer
        send(.transferRequest(recipientId: friend.id, fileName: fileName, fileSize: fileSize, fileType: fileType))
    }

    func acceptTransfer() {
        guard let transfer = pendingIncomingTransfer else { return }

        var acceptedTransfer = transfer
        acceptedTransfer.status = .inProgress(progress: 0)
        activeTransfers.append(acceptedTransfer)
        pendingIncomingTransfer = nil

        send(.transferAccept(transferId: transfer.id))
    }

    func rejectTransfer() {
        guard let transfer = pendingIncomingTransfer else { return }
        send(.transferReject(transferId: transfer.id))
        pendingIncomingTransfer = nil
    }

    func cancelTransfer(_ transferId: String) {
        send(.transferCancel(transferId: transferId))
        if let index = activeTransfers.firstIndex(where: { $0.id == transferId }) {
            activeTransfers[index].status = .cancelled
        }
        receivingTransfers.removeValue(forKey: transferId)
    }

    private func startSendingFile(transferId: String) {
        guard let index = activeTransfers.firstIndex(where: { $0.id == transferId }),
              let fileData = activeTransfers[index].fileData else {
            return
        }

        let chunkSize = 64 * 1024 // 64KB chunks
        var offset: Int64 = 0

        Task {
            while offset < Int64(fileData.count) {
                let end = min(Int(offset) + chunkSize, fileData.count)
                let chunkData = fileData.subdata(in: Int(offset)..<end)
                let chunkBase64 = chunkData.base64EncodedString()

                send(.transferChunk(transferId: transferId, chunk: chunkBase64, offset: offset))

                offset = Int64(end)

                // Update progress
                await MainActor.run {
                    if let idx = activeTransfers.firstIndex(where: { $0.id == transferId }) {
                        activeTransfers[idx].bytesTransferred = offset
                        activeTransfers[idx].status = .inProgress(progress: activeTransfers[idx].progress)
                    }
                }

                // Small delay to prevent overwhelming
                try? await Task.sleep(nanoseconds: 1_000_000) // 1ms
            }

            // Signal completion
            send(.transferComplete(transferId: transferId))
        }
    }

    private func saveReceivedFile(transfer: FileTransfer) {
        guard let fileData = transfer.fileData else { return }

        let downloadsURL = FileManager.default.urls(for: .downloadsDirectory, in: .userDomainMask).first!
        let fileURL = downloadsURL.appendingPathComponent(transfer.fileName)

        // Handle duplicate names
        var finalURL = fileURL
        var counter = 1
        while FileManager.default.fileExists(atPath: finalURL.path) {
            let name = fileURL.deletingPathExtension().lastPathComponent
            let ext = fileURL.pathExtension
            finalURL = downloadsURL.appendingPathComponent("\(name) (\(counter)).\(ext)")
            counter += 1
        }

        do {
            try fileData.write(to: finalURL)
            print("File saved to: \(finalURL.path)")
            // Open in Finder
            NSWorkspace.shared.selectFile(finalURL.path, inFileViewerRootedAtPath: "")
        } catch {
            self.error = "Failed to save file: \(error.localizedDescription)"
        }
    }
}
