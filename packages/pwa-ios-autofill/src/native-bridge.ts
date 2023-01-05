import { FieldType, VaultItem } from "@padloc/core/src/item";

declare var webkit: any;

enum ScriptMessageName {
    userDefaultsGetString = "userDefaultsGetString",
    userDefaultsSetString = "userDefaultsSetString",
    userDefaultsRemove = "userDefaultsRemove",
    userDefaultsClear = "userDefaultsClear",
    cancelAutofill = "cancelAutofill",
    autofillSelected = "autofillSelected",
}

export class NativeBridge {
    // User Defaults
    static userDefaultsGetString(key: string): Promise<string> {
        return webkit.messageHandlers[ScriptMessageName.userDefaultsGetString].postMessage(key);
    }
    static userDefaultsSetString(key: string, string: string): Promise<void> {
        return webkit.messageHandlers[ScriptMessageName.userDefaultsSetString].postMessage({ [`${key}`]: string });
    }
    static userDefaultsRemove(key: string): Promise<void> {
        return webkit.messageHandlers[ScriptMessageName.userDefaultsRemove].postMessage(key);
    }
    static userDefaultsClear(): Promise<void> {
        return webkit.messageHandlers[ScriptMessageName.userDefaultsClear].postMessage();
    }

    // Autofill Provider Extension
    static cancelAutofill(): Promise<void> {
        return webkit.messageHandlers[ScriptMessageName.cancelAutofill].postMessage();
    }

    static autofillSelected(vaultItem: VaultItem): Promise<void> {
        let usernames = vaultItem.fields.filter((field) => field.type === FieldType.Username);
        let passwords = vaultItem.fields.filter((field) => field.type === FieldType.Password);
        return webkit.messageHandlers[ScriptMessageName.autofillSelected].postMessage({
            username: usernames.length > 0 ? usernames[0].value : "",
            password: passwords.length > 0 ? passwords[0].value : "",
        });
    }
}
