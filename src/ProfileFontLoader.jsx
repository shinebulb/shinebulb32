import { useEffect } from "react";

function ProfileFontLoader({ profileFont }) {

    useEffect(() => {
        let existingLink = document.getElementById("dynamic-google-font");
        if (existingLink) {
            existingLink.href = profileFont;
        }
        else {
            const link = document.createElement("link");
            link.id = "dynamic-google-font";
            link.rel = "stylesheet";
            link.href = profileFont;
            document.head.appendChild(link);
        }
    }, [profileFont]);

    return null;
}

export default ProfileFontLoader;