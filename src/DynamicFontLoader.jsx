import { useEffect } from "react";

function DynamicFontLoader({ settings }) {

    useEffect(() => {
        
        const root = document.documentElement;
        let fontName = getComputedStyle(root)
        .getPropertyValue("--font-family")
        .trim()
        .replace(/ /g, "+");

        if (!fontName) fontName = "Roboto Slab";

        const googleFontUrl = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;700&display=swap`;

        let existingLink = document.getElementById("dynamic-google-font");
        if (existingLink) {
            existingLink.href = googleFontUrl;
        }
        else {
            const link = document.createElement("link");
            link.id = "dynamic-google-font";
            link.rel = "stylesheet";
            link.href = googleFontUrl;
            document.head.appendChild(link);
        }
    }, [settings]);

    return null;
}

export default DynamicFontLoader;