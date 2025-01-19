import React, { useState } from 'react';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';

function ImportModal({ importModal, settings, savedList, setSavedList }) {

    return (
        <dialog ref={importModal} className="export-modal">
            <p className="export-title">import themes</p>
            <hr style={{marginBottom: "0.8rem"}} />
            <p className="export-instructions">paste the code containing themes you want to import here:</p>
            <textarea />
            <p className="export-instructions">or upload it from a .json file:</p>
            <button className="upload-themes">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--button-font)" strokeWidth="4.48"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.376"><polyline points="48 24 32 8 16 24"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="48" x2="32" y2="8"></line></g><g id="SVGRepo_iconCarrier"><polyline points="48 24 32 8 16 24"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="48" x2="32" y2="8"></line></g></svg>
                upload themes
            </button>
            <hr />
            <button id="close-export-modal" onClick={() => importModal.current.close()}>{text[settings.language].close}</button>
        </dialog>
    )
}

export default ImportModal