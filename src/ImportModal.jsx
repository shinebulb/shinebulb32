import React, { useState, useRef } from 'react';
import axios from 'axios';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';

function ImportModal({ importModal, settings, savedList, setSavedList }) {

    const defaultStatus = text[settings.language].importText[3];

    const [importStatus, setImportStatus] = useState(defaultStatus);
    const [progressValue, setProgressValue] = useState(0);

    const [progressVisibility, setProgressDisplay] = useState("hidden");

    const [themeField, setThemeField] = useState("");

    const uploadRef = useRef(null);

    function themeValid(theme) {
        return !(
            (Object.keys(theme).length > 3) ||
            (typeof theme.bg !== 'string') ||
            (typeof theme.font !== 'string') ||
            (theme.title && typeof theme.title !== 'string')
        );
    };

    function inputThemes(event) {
        setImportStatus(defaultStatus);
        setProgressValue(0);
        setProgressDisplay("hidden");
        setThemeField(event.target.value);
    }

    function uploadThemes(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    setThemeField(e.target.result);
                }
                catch (e) {
                    console.error(e);
                }
            };
            reader.readAsText(file);
            setImportStatus(defaultStatus);
            setProgressValue(0);
            setProgressDisplay("hidden");
        }
    };

    async function importThemes() {
        try {

            setProgressDisplay("visible");

            const themes = JSON.parse(themeField);
            const validThemes = [];

            let imported = 0;

            if (!Array.isArray(themes)) {
                setImportStatus("wrong input structure!");
                setProgressDisplay("hidden");
            }
            else {
                for (const [index, theme] of themes.entries()) {
                    
                    if (!themeValid(theme)) continue;

                    await axios.post(
                        `${import.meta.env.VITE_API_KEY}/savedthemes`, theme,
                        { headers: { accessToken: localStorage.getItem("accessToken") } }
                    ).then(response => {
                        imported += Number(response.data.status);
                        setImportStatus(`${imported}/${themes.length} imported`);
                        if (Number(response.data.status)) validThemes.push(theme);
                        setProgressValue(index + 1 / themes.length);
                    });
                }
                setSavedList([...savedList, ...validThemes]);
                setImportStatus("import completed!");
                setProgressDisplay("hidden");
            }
        }
        catch (e) {
            setImportStatus("wrong input structure!");
            setProgressDisplay("hidden");
        }
    }

    return (
        <dialog ref={importModal} className="export-modal">
            <p className="export-title">{text[settings.language].collectionActions[1]}</p>
            <hr style={{marginBottom: "0.8rem"}} />
            <p className="export-instructions">{text[settings.language].importText[0]}</p>
            <textarea value={themeField} onChange={inputThemes} />
            <div className="import-options">
                <p id="upload-json" className="export-instructions" style={{width: "40%"}}>{text[settings.language].importText[1]}</p>
                <button className="upload-themes" onClick={() => uploadRef.current.click()}>
                    <input ref={uploadRef} type="file" accept=".json" onChange={uploadThemes} style={{display: "none"}} />
                    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--button-font)" strokeWidth="4.48"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.376"><polyline points="48 24 32 8 16 24"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="48" x2="32" y2="8"></line></g><g id="SVGRepo_iconCarrier"><polyline points="48 24 32 8 16 24"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="48" x2="32" y2="8"></line></g></svg>
                    {text[settings.language].importText[2]}
                </button>
            </div>
            <div className="complete-import">
                <svg  preserveAspectRatio="none" fill="var(--font)" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.964 511.964" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="var(--font)" strokeWidth="36.9"></g><g id="SVGRepo_iconCarrier"><g><g><g><path d={paths.mountains[0]}/><path d={paths.mountains[1]}/><path d={paths.mountains[2]}/><path d={paths.mountains[3]}/><path d={paths.mountains[4]}/><path d={paths.mountains[5]}/></g></g></g></g></svg>
                <div className="import-status">
                    <span onClick={importThemes} style={{textDecoration: importStatus == defaultStatus ? "underline" : "none", margin: "auto"}}>
                        {importStatus}
                    </span>
                    {importStatus != "import completed!" ? <progress className="import-progress" value={progressValue} style={{visibility: progressVisibility}} />
                    : <p>see import log</p>}
                </div>
            </div>
            <hr />
            <button id="close-export-modal" onClick={() => importModal.current.close()}>{text[settings.language].close}</button>
        </dialog>
    )
}

export default ImportModal