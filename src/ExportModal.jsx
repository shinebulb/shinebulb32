import { useState } from 'react';
import ThemePreview from './ThemePreview';
import closeModal from './assets/closeModal';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';

function ExportModal({ exportModal, settings, savedList }) {

    const [current, setCurrent] = useState(0);

    const [themeExport, setThemeExport] = useState([]);

    const [allSelected, setAllSelected] = useState(false);
    const [copied, setCopied] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    const itemDisplay = 4;

    const displayedThemes = savedList.slice(current, current + itemDisplay);

    function selectAll() {
        if (allSelected) {
            setAllSelected(false);
            setThemeExport([]);
            for (let i = 0; i < savedList; i++) {
                localStorage.removeItem(`selected${i}`);
            }
        }
        else {
            setAllSelected(true);
            setThemeExport(savedList.map(theme => {
                return { title: theme.title, bg: theme.bg, font: theme.font }
            }));
            for (let i = 0; i < savedList; i++) {
                localStorage.setItem(`selected${i}`, 1);
            }
        }
    }

    function downloadThemes() {
        const themesJSON = JSON.stringify(themeExport, null, 2);
        const blob = new Blob([themesJSON], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${text[settings.language].themes}_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        setDownloaded(true);
    }

    function copyThemes() {
        navigator.clipboard.writeText(JSON.stringify(themeExport, null, 2))
        .then(() => setCopied(true));
    }

    return (
        <dialog closedby="any" ref={exportModal} className="export-modal">
            <p className="export-title">{text[settings.language].exportModal[0]}</p>
            <hr style={{marginBottom: "0.7rem"}} />
            <button onClick={selectAll} style={{marginBottom: "0.5rem"}} className="select-all">{text[settings.language].selectAll[Number(allSelected)]}</button>
            <div className="export-container">
                {displayedThemes.map(theme =>
                    <ThemePreview
                        key={savedList.indexOf(theme) + 1}
                        theme={theme}
                        savedList={savedList}
                        settings={settings}
                        themeExport={themeExport}
                        setThemeExport={setThemeExport}
                        setCopied={setCopied}
                        setDownloaded={setDownloaded}
                        allSelected={allSelected}
                    />
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
                    {text[settings.language].exportModal[Number(downloaded) + 1]}
                </button>
                <button onClick={copyThemes} disabled={themeExport.length == 0}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d={paths.copy[0]} fill="var(--button-font)"></path><path d={paths.copy[1]} fill="var(--button-font)"></path></g></svg>
                    {text[settings.language].exportModal[Number(copied) + 3]}
                </button>
            </div>
            <hr />
            <button id="close-export-modal" onClick={() => closeModal(exportModal)}>{text[settings.language].close}</button>
        </dialog>
    )
}

export default ExportModal