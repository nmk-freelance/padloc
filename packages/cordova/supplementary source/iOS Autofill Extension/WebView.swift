//
//  WebView.swift
//  Autofill Provider Extension
//
//  Created by Nay Min Ko on 04/01/2023.
//

import WebKit

let nativeBridgeContentController: WKUserContentController = {
    let controller = WKUserContentController()
    controller.addScriptMessageHandler(Handler.shared, contentWorld: .page, name: ScriptMessageName.userDefaultsGetString.rawValue)
    controller.addScriptMessageHandler(Handler.shared, contentWorld: .page, name: ScriptMessageName.userDefaultsSetString.rawValue)
    controller.addScriptMessageHandler(Handler.shared, contentWorld: .page, name: ScriptMessageName.userDefaultsRemove.rawValue)
    controller.addScriptMessageHandler(Handler.shared, contentWorld: .page, name: ScriptMessageName.userDefaultsClear.rawValue)

    controller.addScriptMessageHandler(Handler.shared, contentWorld: .page, name: ScriptMessageName.cancelAutofill.rawValue)
    controller.addScriptMessageHandler(Handler.shared, contentWorld: .page, name: ScriptMessageName.autofillSelected.rawValue)

    controller.addScriptMessageHandler(Handler.shared, contentWorld: .page, name: ScriptMessageName.localAuthAvailable.rawValue)
    controller.addScriptMessageHandler(Handler.shared, contentWorld: .page, name: ScriptMessageName.localAuthAdd.rawValue)
    controller.addScriptMessageHandler(Handler.shared, contentWorld: .page, name: ScriptMessageName.localAuthLoad.rawValue)
    controller.addScriptMessageHandler(Handler.shared, contentWorld: .page, name: ScriptMessageName.localAuthDelete.rawValue)
    return controller
}()

let webViewConfig: WKWebViewConfiguration = {
    let config = WKWebViewConfiguration()
    config.setURLSchemeHandler(WebViewAssetHandler.shared, forURLScheme: Config.urlScheme)
    config.userContentController = nativeBridgeContentController
    return config
}()

func makeWebView() -> WKWebView {
    return WKWebView(frame: .zero, configuration: webViewConfig)
}
