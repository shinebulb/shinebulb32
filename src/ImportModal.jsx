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
                <svg  preserveAspectRatio="none" fill="var(--font)" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.964 511.964" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="var(--font)" strokeWidth="36.9"></g><g id="SVGRepo_iconCarrier"><g><g><g><path d="M509.065,412.113L329.502,232.55c-0.335-0.334-0.692-0.645-1.071-0.929l-1.926-1.444 c-3.98-2.986-9.552-2.589-13.071,0.929l-0.908,0.908l-50.491-79.588c-1.807-2.848-4.928-4.593-8.3-4.642 c-0.049,0-0.097-0.001-0.145-0.001c-3.318,0-6.425,1.647-8.286,4.401l-15.283,22.62L174.55,82.353 c-1.967-3.278-5.629-5.154-9.44-4.817c-3.809,0.331-7.096,2.804-8.468,6.373L45.919,371.787 c-0.132,0.344-0.241,0.691-0.333,1.039L2.929,415.483c-3.905,3.905-3.905,10.237,0,14.143c3.906,3.905,10.236,3.905,14.143,0 l1.005-1.005L140.46,306.236l55.985,55.985c0.002,0.003,0.005,0.005,0.007,0.008s0.005,0.005,0.008,0.007l30.389,30.389 l35.184,35.184c2.422,2.422,4.723,5.348,8.152,6.302c5.903,1.643,12.028-2.599,12.615-8.673c0.285-2.952-0.785-5.933-2.882-8.03 l-62.251-62.251l103.079-103.079l174.177,174.177c4.178,4.178,11.26,3.75,14.92-0.872 C512.951,421.457,512.603,415.652,509.065,412.113z M203.527,341.014l-55.992-55.992c-1.879-1.874-4.422-2.928-7.075-2.928 c-2.652,0-5.195,1.054-7.071,2.929l-53.091,53.091l64.031-166.48h20.683c5.522,0,10-4.477,10-10c0-0.325-0.018-0.646-0.049-0.963 c-0.485-5.071-4.754-9.037-9.951-9.037h-12.99l15.927-41.41l24.962,41.603c-4.282,0.846-7.58,4.425-8.003,8.844 c-0.03,0.317-0.048,0.638-0.048,0.963c0,5.523,4.478,10,10,10h9.936l16.15,26.917c1.758,2.93,4.891,4.759,8.307,4.852 c3.389,0.097,6.642-1.567,8.555-4.398l15.521-22.971l44.708,70.471L203.527,341.014z"></path> <path d="M239.213,211.347c-4.711,2.881-6.194,9.037-3.313,13.749l19.569,31.999c1.886,3.083,5.173,4.784,8.541,4.784 c1.778,0,3.579-0.475,5.207-1.47c4.712-2.881,6.195-9.037,3.314-13.749l-19.569-31.999 C250.081,209.95,243.928,208.466,239.213,211.347z"></path> <path d="M375.849,329.746c-3.942-3.869-10.272-3.81-14.142,0.131c-3.869,3.941-3.811,10.272,0.13,14.142l76.153,74.759 c1.947,1.911,4.477,2.864,7.005,2.864c2.591,0,5.179-1,7.137-2.995c3.869-3.941,3.811-10.272-0.13-14.142L375.849,329.746z"></path> <path d="M330.006,284.743c-3.942-3.869-10.273-3.81-14.142,0.131c-3.869,3.941-3.811,10.272,0.13,14.142l21.998,21.595 c1.947,1.911,4.477,2.864,7.005,2.864c2.591,0,5.18-1,7.137-2.995c3.869-3.941,3.811-10.272-0.13-14.142L330.006,284.743z"></path> <path d="M193.008,375.108c-3.942-3.869-10.272-3.81-14.142,0.131c-3.869,3.941-3.811,10.272,0.13,14.142l35.998,35.339 c1.947,1.911,4.477,2.864,7.005,2.864c2.591,0,5.179-1,7.137-2.995c3.869-3.941,3.811-10.272-0.13-14.142L193.008,375.108z"></path> <path d="M155.964,338.743c-3.942-3.869-10.274-3.81-14.142,0.131c-3.869,3.941-3.811,10.272,0.13,14.142l13.171,12.93 c1.947,1.911,4.477,2.864,7.005,2.864c2.591,0,5.18-1,7.137-2.995c3.869-3.941,3.811-10.272-0.13-14.142L155.964,338.743z"></path></g></g></g></g></svg>
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