import React, { useState } from 'react';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';

function ThemePreview({ theme, savedList, settings, themeExport, setThemeExport, setCopied }) {

    const [selected, setSelected] = useState(parseInt(localStorage.getItem(`selected${savedList.indexOf(theme)}`)) || 0);

    function selectTheme() {
        if (selected) {
            setSelected(false);
            localStorage.removeItem(`selected${savedList.indexOf(theme)}`);
            setThemeExport(themeExport.filter(item => item.bg !== theme.bg && item.font !== theme.font));
        }
        else {
            setSelected(true);
            localStorage.setItem(`selected${savedList.indexOf(theme)}`, 1);
            setThemeExport([
                ...themeExport,
                { title: theme.title, bg: theme.bg, font: theme.font }
            ]);
        }
        setCopied(false);
    }     

    return (
        <div className="theme-preview">
            <p style={{backgroundColor: theme.bg, color: theme.font}}>
                {theme.title || `${text[settings.language].themeCard[0]} #${savedList.indexOf(theme) + 1}`}
            </p>
            <button onClick={selectTheme} style={{backgroundColor: selected ? "var(--button-font)" : "var(--modal-button-bg)"}}>
                <svg stroke={selected ? "var(--modal-button-bg)" : "transparent"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
        </div>
    )
}

export default ThemePreview