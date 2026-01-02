//
//  Transfer.swift
//  Blip
//

import Foundation

enum TransferDirection {
    case incoming
    case outgoing
}

enum TransferStatus: Equatable {
    case pending
    case accepted
    case inProgress(progress: Double)
    case completed
    case rejected
    case cancelled
    case failed(reason: String)
}

struct FileTransfer: Identifiable {
    let id: String
    let direction: TransferDirection
    let peerId: String
    let peerName: String
    let fileName: String
    let fileSize: Int64
    let fileType: String
    var status: TransferStatus
    var bytesTransferred: Int64 = 0
    var fileData: Data?

    var progress: Double {
        guard fileSize > 0 else { return 0 }
        return Double(bytesTransferred) / Double(fileSize)
    }

    var formattedSize: String {
        ByteCountFormatter.string(fromByteCount: fileSize, countStyle: .file)
    }
}
