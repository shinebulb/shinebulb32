export default function editingField(target) {
    if (target.isContentEditable) return true;
    if (target.tagName === "TEXTAREA") return true;
    if (target.tagName === "INPUT") {
        const textTypes = [
            "text", "password", "email", "search", "url", 
            "tel", "number", "date", "datetime-local"
        ];
        return textTypes.includes(target.type);
    }
    return false;
}