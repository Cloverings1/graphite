//
//  BlipMessage.swift
//  Blip
//

import Foundation

// MARK: - Outgoing Messages

enum BlipOutgoingMessage: Encodable {
    case ping
    case getConnectCode
    case addFriend(code: String)
    case getFriends
    case transferRequest(recipientId: String, fileName: String, fileSize: Int64, fileType: String)
    case transferAccept(transferId: String)
    case transferReject(transferId: String)
    case transferChunk(transferId: String, chunk: String, offset: Int64)
    case transferComplete(transferId: String)
    case transferCancel(transferId: String)

    enum CodingKeys: String, CodingKey {
        case type, code, recipientId, fileName, fileSize, fileType, transferId, chunk, offset
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)

        switch self {
        case .ping:
            try container.encode("ping", forKey: .type)
        case .getConnectCode:
            try container.encode("get_connect_code", forKey: .type)
        case .addFriend(let code):
            try container.encode("add_friend", forKey: .type)
            try container.encode(code, forKey: .code)
        case .getFriends:
            try container.encode("get_friends", forKey: .type)
        case .transferRequest(let recipientId, let fileName, let fileSize, let fileType):
            try container.encode("transfer_request", forKey: .type)
            try container.encode(recipientId, forKey: .recipientId)
            try container.encode(fileName, forKey: .fileName)
            try container.encode(fileSize, forKey: .fileSize)
            try container.encode(fileType, forKey: .fileType)
        case .transferAccept(let transferId):
            try container.encode("transfer_accept", forKey: .type)
            try container.encode(transferId, forKey: .transferId)
        case .transferReject(let transferId):
            try container.encode("transfer_reject", forKey: .type)
            try container.encode(transferId, forKey: .transferId)
        case .transferChunk(let transferId, let chunk, let offset):
            try container.encode("transfer_chunk", forKey: .type)
            try container.encode(transferId, forKey: .transferId)
            try container.encode(chunk, forKey: .chunk)
            try container.encode(offset, forKey: .offset)
        case .transferComplete(let transferId):
            try container.encode("transfer_complete", forKey: .type)
            try container.encode(transferId, forKey: .transferId)
        case .transferCancel(let transferId):
            try container.encode("transfer_cancel", forKey: .type)
            try container.encode(transferId, forKey: .transferId)
        }
    }
}

// MARK: - Incoming Messages

struct BlipIncomingMessage: Decodable {
    let type: String
    let userId: String?
    let email: String?
    let code: String?
    let message: String?
    let friends: [Friend]?
    let friend: Friend?
    let friendId: String?
    let transferId: String?
    let senderId: String?
    let senderName: String?
    let fileName: String?
    let fileSize: Int64?
    let fileType: String?
    let chunk: String?
    let offset: Int64?
    let progress: Double?
    let reason: String?
}
