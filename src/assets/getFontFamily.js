export default function getFontFamily(url) {
    try {
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        const familyParam = params.get("family");
        
        if (familyParam) {
            return familyParam.split(":")[0].replace(/\+/g, " ");
        }
        
        return null;
    }
    catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
}