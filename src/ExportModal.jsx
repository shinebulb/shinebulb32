import React, { useState } from 'react';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';

function ExportModal({ exportModal, settings, savedList }) {

    const [current, setCurrent] = useState(0);
    const itemDisplay = 4;

    const displayedThemes = savedList.slice(
        current,
        current + itemDisplay
    );

    return (
        <dialog ref={exportModal} className="export-modal">
            <p className="export-title">choose themes to export:</p>
            <hr style={{marginBottom: "1rem"}} />
            <div className="export-container">
                {displayedThemes.map((theme, index) => 
                    <div className="theme-preview" key={index}>
                        <p style={{backgroundColor: theme.bg, color: theme.font}}>
                            {theme.title || `${text[settings.language].themeCard[0]} #${savedList.indexOf(theme) + 1}`}
                        </p>
                        <button>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                    </div>
                )}
            </div>
            <div className="theme-slider">
                <button
                    disabled={current === 0}
                    onClick={() => setCurrent(0)}
                >⟪</button>
                <button
                    disabled={current === 0}
                    onClick={() => {if (current - itemDisplay >= 0) setCurrent(current - itemDisplay)}}
                >⟨</button>
                <button
                    disabled={current + itemDisplay >= savedList.length}
                    onClick={() => {if (current + itemDisplay < savedList.length) setCurrent(current + itemDisplay)}}
                >⟩</button>
                <button
                    disabled={current + itemDisplay >= savedList.length}
                    onClick={() => setCurrent(Math.max(0, savedList.length - (savedList.length % itemDisplay == 0 ? itemDisplay : savedList.length % itemDisplay)))}
                >⟫</button>
            </div>
            <div className="export-options">
                <button>
                    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--button-font)" strokeWidth="4.48"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.376"><polyline points="48 24 32 8 16 24"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="48" x2="32" y2="8"></line></g><g id="SVGRepo_iconCarrier"><polyline points="48 24 32 8 16 24"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="48" x2="32" y2="8"></line></g></svg>
                    download
                </button>
                <button>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d={paths.copy[0]} fill="var(--button-font)"></path><path d={paths.copy[1]} fill="var(--button-font)"></path></g></svg>
                    copy
                </button>
            </div>
            <hr />
            <button id="close-export-modal" onClick={() => exportModal.current.close()}>{text[settings.language].close}</button>
        </dialog>
    )
}

export default ExportModal