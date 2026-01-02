//
//  Friend.swift
//  Blip
//

import Foundation

struct Friend: Identifiable, Codable, Equatable, Hashable {
    let id: String
    var displayName: String
    var email: String?
    var avatarUrl: String?
    var isOnline: Bool

    static func == (lhs: Friend, rhs: Friend) -> Bool {
        lhs.id == rhs.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}
