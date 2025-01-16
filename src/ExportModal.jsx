import React, { useState } from 'react';
import ThemePreview from './ThemePreview';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';

function ExportModal({ exportModal, settings, savedList }) {

    const [current, setCurrent] = useState(0);
    const [themeExport, setThemeExport] = useState([]);

    const itemDisplay = 4;

    const displayedThemes = savedList.slice(current, current + itemDisplay);

    function downloadThemes() {
        const themesJSON = JSON.stringify(themeExport, null, 2);
        const blob = new Blob([themesJSON], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${text[settings.language].themes}_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    function copyThemes() {

    }

    return (
        <dialog ref={exportModal} className="export-modal">
            <p className="export-title">{text[settings.language].exportModal[0]}</p>
            <hr style={{marginBottom: "0.8rem"}} />
            <div className="export-container">
                {displayedThemes.map(theme =>
                    <ThemePreview key={savedList.indexOf(theme) + 1} theme={theme} savedList={savedList} settings={settings} themeExport={themeExport} setThemeExport={setThemeExport} />
                )}
            </div>
            <div className="theme-slider">
                <button
                    title={text[settings.language].navigationButtons[0]}
                    disabled={current === 0}
                    onClick={() => setCurrent(0)}
                >⟪</button>
                <button
                    title={text[settings.language].navigationButtons[1]}
                    disabled={current === 0}
                    onClick={() => {if (current - itemDisplay >= 0) setCurrent(current - itemDisplay)}}
                >⟨</button>
                <button
                    title={text[settings.language].navigationButtons[2]}
                    disabled={current + itemDisplay >= savedList.length}
                    onClick={() => {if (current + itemDisplay < savedList.length) setCurrent(current + itemDisplay)}}
                >⟩</button>
                <button
                    title={text[settings.language].navigationButtons[3]}
                    disabled={current + itemDisplay >= savedList.length}
                    onClick={() => setCurrent(Math.max(0, savedList.length - (savedList.length % itemDisplay == 0 ? itemDisplay : savedList.length % itemDisplay)))}
                >⟫</button>
            </div>
            <div className="export-options">
                <button onClick={downloadThemes} disabled={themeExport.length == 0}>
                    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--button-font)" strokeWidth="4.48"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.376"><polyline points="16 32 32 48 48 32"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="8" x2="32" y2="48"></line></g><g id="SVGRepo_iconCarrier"><polyline points="16 32 32 48 48 32"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="8" x2="32" y2="48"></line></g></svg>
                    {text[settings.language].exportModal[1]}
                </button>
                <button onClick={copyThemes} disabled={themeExport.length == 0}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d={paths.copy[0]} fill="var(--button-font)"></path><path d={paths.copy[1]} fill="var(--button-font)"></path></g></svg>
                    {text[settings.language].exportModal[2]}
                </button>
            </div>
            <hr />
            <button id="close-export-modal" onClick={() => exportModal.current.close()}>{text[settings.language].close}</button>
        </dialog>
    )
}

export default ExportModal