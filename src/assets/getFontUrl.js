export default function getFontUrl(fontFamily) {
    if (typeof fontFamily !== 'string' || !fontFamily.trim()) {
        throw new Error(`${fontFamily} is not a valid font family name. Please provide a valid font family name.`);
    }

    const familyParam = fontFamily
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .map(part => encodeURIComponent(part))
    .join('+');

    return `https://fonts.googleapis.com/css2?family=${familyParam}:wght@400&display=swap`;
}