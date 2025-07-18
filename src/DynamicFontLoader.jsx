import { useEffect } from "react";
import getFontUrl from './assets/getFontUrl';

function DynamicFontLoader({ settings }) {

    useEffect(() => {
        let existingLink = document.getElementById("dynamic-google-font");
        if (existingLink) {
            existingLink.href = getFontUrl(settings.font);
        }
        else {
            const link = document.createElement("link");
            link.id = "dynamic-google-font";
            link.rel = "stylesheet";
            link.href = getFontUrl(settings.font);
            document.head.appendChild(link);
        }
    }, [settings]);

    return null;
}

export default DynamicFontLoader;