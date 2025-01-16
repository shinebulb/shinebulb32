import React, { useState } from 'react';
import paths from './assets/json/svg-paths.json';

function ThemePreview({ theme, savedList }) {

    const [selected, setSelected] = useState(false);

    return (
        <div className="theme-preview">
            <p style={{backgroundColor: theme.bg, color: theme.font}}>
                {theme.title || `${text[settings.language].themeCard[0]} #${savedList.indexOf(theme) + 1}`}
            </p>
            <button onClick={() => setSelected(!selected)} style={{backgroundColor: selected ? "var(--button-font)" : "var(--modal-button-bg)"}}>
                <svg stroke={selected ? "var(--modal-button-bg)" : "transparent"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
        </div>
    )
}

export default ThemePreview