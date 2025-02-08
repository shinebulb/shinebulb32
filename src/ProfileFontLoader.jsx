import { useEffect } from "react";

function ProfileFontLoader({ profileFont }) {

    useEffect(() => {
        let existingLink = document.getElementById("profile-google-font");
        if (existingLink) {
            existingLink.href = profileFont;
        }
        else {
            const link = document.createElement("link");
            link.id = "profile-google-font";
            link.rel = "stylesheet";
            link.href = profileFont;
            document.head.appendChild(link);
        }
    }, [profileFont]);

    return null;
}

export default ProfileFontLoader;