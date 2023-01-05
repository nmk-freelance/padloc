import { setPlatform } from "@padloc/core/src/platform";
import { NativePlatform } from "./platform";

if (window.location.search !== "?spinner") {
    (async () => {
        setPlatform(new NativePlatform());

        await import("@padloc/app/src/elements/app");

        window.onload = () => {
            const app = document.createElement("pl-app");
            document.body.appendChild(app);
        };
    })();
}
