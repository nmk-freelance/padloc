import { Platform } from "@padloc/core/src/platform";
import { WebPlatform } from "@padloc/app/src/lib/platform";
import { NativeStorage } from "./storage";
import { VaultItem } from "@padloc/core/src/item";
import { NativeBridge } from "./native-bridge";

export class NativePlatform extends WebPlatform implements Platform {
    storage = new NativeStorage();

    async cancelAutofill() {
        await NativeBridge.cancelAutofill();
    }

    async autofillSelected(vaultItem: VaultItem) {
        await NativeBridge.autofillSelected(vaultItem);
    }
}
