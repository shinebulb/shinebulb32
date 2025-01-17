import React, { useState } from 'react';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';

function ImportModal({ importModal, settings, savedList, setSavedList }) {

    return (
        <dialog ref={importModal} className="export-modal">
            <p className="export-title">import themes</p>
            <hr style={{marginBottom: "0.8rem"}} />
            <p>paste the code containing themes you want to import here:</p>
            <textarea />
            <p>or upload it from a .json file:</p>
            <button>upload themes</button>
            <hr />
            <button id="close-export-modal" onClick={() => importModal.current.close()}>{text[settings.language].close}</button>
        </dialog>
    )
}

export default ImportModal