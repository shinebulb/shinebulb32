import React, { useState, useRef } from 'react';
import ImportGraph from './ImportGraph';
import axios from 'axios';
import closeModal from './assets/closeModal';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';

function ImportModal({ importModal, settings, savedList, setSavedList }) {

    const boldStats = {fontWeight: "bold"};

    const defaultStatus = text[settings.language].importText[3];

    const [importStatus, setImportStatus] = useState(defaultStatus);
    const [progressValue, setProgressValue] = useState(0);
    const [openLog, setOpenLog] = useState(false);

    const [progressVisibility, setProgressDisplay] = useState("hidden");

    const [themeField, setThemeField] = useState("");

    const uploadRef = useRef(null);

    const [pending, setPending] = useState(0);
    const [imported, setImported] = useState(0);
    const [invalid, setInvalid] = useState(0);

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

            setPending(Array.isArray(themes) ? themes.length : 0);
            setImported(0);
            setInvalid(0);

            let current = 0;

            if (!Array.isArray(themes)) {
                setImportStatus(text[settings.language].importText[6]);
                setProgressDisplay("hidden");
            }
            else {
                for (const [index, theme] of themes.entries()) {
                    
                    if (!themeValid(theme)) {
                        setInvalid(i => i + 1);
                        setProgressValue((index + 1) / pending);
                        continue
                    }

                    await axios.post(
                        `${import.meta.env.VITE_API_KEY}/savedthemes`, theme,
                        { headers: { accessToken: localStorage.getItem("accessToken") } }
                    ).then(response => {
                        current += Number(response.data.status);
                        setImported(i => i + Number(response.data.status));
                        setImportStatus(`${current}/${themes.length} ${text[settings.language].importText[5]}`);
                        if (Number(response.data.status)) validThemes.push(theme);
                        setProgressValue((index + 1) / themes.length);
                    });
                }
                setSavedList([...savedList, ...validThemes]);
                setImportStatus(text[settings.language].importText[6]);
                setProgressDisplay("hidden");
            }
        }
        catch (e) {
            setImportStatus(text[settings.language].importText[4]);
            setProgressDisplay("hidden");
        }
    }

    return (
        <dialog closedby="any" ref={importModal} className="export-modal">
            <p className="export-title">{text[settings.language].collectionActions[1]}</p>
            <hr style={{marginBottom: "0.8rem"}} />
            <div className="import-content">
            {!openLog ? <>
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
                        {importStatus != text[settings.language].importText[6] ? <progress className="import-progress" value={progressValue} style={{visibility: progressVisibility}} />
                        : <p onClick={() => setOpenLog(true)}>{text[settings.language].importText[7]}</p>}
                    </div>
                </div>
            </> : <div className="import-log">
                <ImportGraph pending={pending} imported={imported} invalid={invalid} />
                <div className="import-table">
                    <p>{text[settings.language].importLog[0]}</p><p>{pending}</p>
                    <p style={{ color: "var(--stats-green)" }}>{text[settings.language].importLog[1]}</p><p style={{ color: "var(--stats-green)" }}>{imported}</p>
                    <p style={{ color: "var(--stats-red)" }}>{text[settings.language].importLog[2]}</p><p style={{ color: "var(--stats-red)" }}>{invalid}</p>
                    <p style={{ color: "var(--stats-yellow)"}}>{text[settings.language].importLog[3]}</p><p style={{ color: "var(--stats-yellow)"}}>{pending - imported - invalid}</p>
                </div>
                <button onClick={() => setOpenLog(false)}>{text[settings.language].closeImportLog}</button>
            </div>}
            </div>
            <hr />
            <button id="close-export-modal" onClick={() => closeModal(importModal)}>{text[settings.language].close}</button>
        </dialog>
    )
}

export default ImportModal