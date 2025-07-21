import { useEffect } from "react";

function ProfileFontLoader({ fontList }) {

    useEffect(() => {
        for (let font of fontList) {
            let existingLink = document.getElementById(`saved-google-font-${font}`);
            if (existingLink) {
                existingLink.href = font;
            }
            else {
                const link = document.createElement("link");
                link.id = `saved-google-font-${font}`;
                link.rel = "stylesheet";
                link.href = font;
                document.head.appendChild(link);
            }
        }
    }, [fontList]);

    return null;
}

export default ProfileFontLoader;