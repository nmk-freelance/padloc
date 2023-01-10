//
//  LocalAuth.swift
//  Some Biometric
//
//  Created by Nay Min Ko on 08/01/2023.
//

import Foundation
import LocalAuthentication

struct LocalAuth {
    static private let access = SecAccessControlCreateWithFlags(nil,kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly, .biometryCurrentSet, nil)

    struct StoreError: Error {
        var localizedDescription: String
    }

    static var available: Bool {
        let context = LAContext()
        var error: NSError?
        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            return true
        } else {
            return false
        }
    }

    static func add(id: String, key: String) throws {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                    kSecAttrAccessControl as String: access as Any,
                                    kSecAttrAccount as String: id,
                                    kSecValueData as String: key.data(using: .utf8)!]
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw StoreError(localizedDescription: SecCopyErrorMessageString(status, nil)! as String)
        }
    }

    static func load(id: String) throws -> String {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                    kSecAttrAccessControl as String: access as Any,
                                    kSecAttrAccount as String: id,
                                    kSecReturnData as String: true,
                                    kSecMatchLimit as String: 1]
        var result: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        guard status == errSecSuccess else {
            throw StoreError(localizedDescription: SecCopyErrorMessageString(status, nil)! as String)
        }
        guard let key = String(data: result as! Data, encoding: .utf8) else {
            fatalError()
        }
        return key
    }

    static func delete(id: String) throws {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                    kSecAttrAccessControl as String: access as Any,
                                    kSecAttrAccount as String: id]
        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess else {
            throw StoreError(localizedDescription: SecCopyErrorMessageString(status, nil)! as String)
        }
    }
}
