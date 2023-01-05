//
//  Handler.swift
//  Autofill Provider Extension
//
//  Created by Nay Min Ko on 04/01/2023.
//

import Foundation
import WebKit
import AuthenticationServices

let defaults = UserDefaults(suiteName: Config.suite)!

class Handler: NSObject, WKScriptMessageHandlerWithReply {
    static let shared = Handler()

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage, replyHandler: @escaping (Any?, String?) -> Void) {
        switch message.name {
        case ScriptMessageName.userDefaultsGetString.rawValue:
            if let string = defaults.string(forKey: message.body as! String) {
                replyHandler(string, nil)
            } else {
                replyHandler(NSNull(), nil)
            }
        case ScriptMessageName.userDefaultsSetString.rawValue:
            let dict = message.body as! [String: String]
            let key = dict.keys.first!
            defaults.set(dict[key]!, forKey: key)
            replyHandler(NSNull(), nil)
        case ScriptMessageName.userDefaultsRemove.rawValue:
            defaults.removeObject(forKey: message.body as! String)
            replyHandler(NSNull(), nil)
        case ScriptMessageName.userDefaultsClear.rawValue:
            defaults.removePersistentDomain(forName: Config.suite)
            replyHandler(NSNull(), nil)

        case ScriptMessageName.cancelAutofill.rawValue:
            CredentialProviderViewController.current.cancel()
        case ScriptMessageName.autofillSelected.rawValue:
            let dict = message.body as! [String: String]
            let username = dict["username"]!
            let password = dict["password"]!
            CredentialProviderViewController.current.passwordSelected(passwordCredential: ASPasswordCredential(user: username, password: password))
        default:
            fatalError()
        }
    }
}

enum ScriptMessageName: String {
    case userDefaultsGetString
    case userDefaultsSetString
    case userDefaultsRemove
    case userDefaultsClear

    case cancelAutofill
    case autofillSelected
}
