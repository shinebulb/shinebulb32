import { useEffect } from "react";

function DynamicFontLoader({ settings }) {

    useEffect(() => {
        let existingLink = document.getElementById("dynamic-google-font");
        if (existingLink) {
            existingLink.href = settings.font;
        }
        else {
            const link = document.createElement("link");
            link.id = "dynamic-google-font";
            link.rel = "stylesheet";
            link.href = settings.font;
            document.head.appendChild(link);
        }
    }, [settings]);

    return null;
}

export default DynamicFontLoader;