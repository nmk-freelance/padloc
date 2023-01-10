import { Platform } from "@padloc/core/src/platform";
import { WebPlatform } from "@padloc/app/src/lib/platform";
import { NativeStorage } from "./storage";
import { VaultItem } from "@padloc/core/src/item";
import { NativeBridge } from "./native-bridge";
import { base64ToBytes, bytesToBase64 } from "@padloc/core/src/encoding";
import { AuthType } from "@padloc/core/src/auth";
import { PublicKeyAuthClient } from "@padloc/core/src/auth/public-key";
import { StartRegisterAuthenticatorResponse, StartAuthRequestResponse } from "@padloc/core/src/api";

export class NativePlatform extends WebPlatform implements Platform {
    storage = new NativeStorage();

    async cancelAutofill() {
        await NativeBridge.cancelAutofill();
    }

    async autofillSelected(vaultItem: VaultItem) {
        await NativeBridge.autofillSelected(vaultItem);
    }

    get supportedAuthTypes() {
        return [AuthType.Email, AuthType.Totp, AuthType.PublicKey];
    }

    biometricKeyStore = {
        async isSupported() {
            return NativeBridge.localAuthAvailable();
        },

        async storeKey(id: string, key: Uint8Array) {
            try {
                await NativeBridge.localAuthDelete(id);
            } finally {
                return NativeBridge.localAuthAdd(id, bytesToBase64(key));
            }
        },

        async getKey(id: string) {
            let base64Key = await NativeBridge.localAuthLoad(id);
            return base64ToBytes(base64Key);
        },
    };

    private _publicKeyAuthClient = new PublicKeyAuthClient(this.biometricKeyStore);

    protected async _prepareRegisterAuthenticator(res: StartRegisterAuthenticatorResponse) {
        switch (res.type) {
            case AuthType.PublicKey:
                return this._publicKeyAuthClient.prepareRegistration(res.data);
            default:
                return super._prepareRegisterAuthenticator(res);
        }
    }

    protected async _prepareCompleteAuthRequest(res: StartAuthRequestResponse) {
        switch (res.type) {
            case AuthType.PublicKey:
                return this._publicKeyAuthClient.prepareAuthentication(res.data);
            default:
                return super._prepareCompleteAuthRequest(res);
        }
    }

    readonly platformAuthType = AuthType.PublicKey;

    supportsPlatformAuthenticator() {
        return this.biometricKeyStore.isSupported();
    }
}
