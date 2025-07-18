import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './assets/AuthContext';
import closeModal from './assets/closeModal';
import fonts from './assets/json/fonts.json';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';

function FontModal({ modal, settings, setSettings, width }) {

    const { authState } = useContext(AuthContext);

    const [preferred, setPreferred] = useState(!fonts.includes(settings.font) ? "custom" : "default");
    const [font, setFont] = useState(!fonts.includes(settings.font) ? "roboto slab" : settings.font);
    const [customFont, setCustomFont] = useState(!fonts.includes(settings.font) ? settings.font : "");

    const [saveStatus, setSaveStatus] = useState(0);

    const [loadSave, setLoadSave] = useState(false);
    const [loadFont, setLoadFont] = useState(false);

    const alertRef = useRef(null);

    const loaderStyles = {
        width: "1.1rem",
        height: "1.1rem",
        borderColor: "var(--button-font)",
        borderBottomColor: "transparent"
    }

    function saveFont() {
        setLoadSave(true);
        axios.post(
            `${import.meta.env.VITE_API_KEY}/savedfonts`,
            { fontFamily: customFont },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(response => {
            setLoadSave(false);
            setSaveStatus(Number(response.data.status));
            alertRef.current.showModal();
            setTimeout(() => {
                if (alertRef.current) closeModal(alertRef);
            }, 2000);
        });
    }

    function fontChange() {
        if (!authState.status) {
            localStorage.setItem("font", preferred == "default" ? font : customFont);
            if (preferred == "default") {
                document.documentElement.style.setProperty("--font-family", font);
                setSettings({...settings, font: font});
            }
            else {
                document.documentElement.style.setProperty("--font-family", customFont);
                setSettings({...settings, font: customFont});
            }
            closeModal(modal);
        }
        else {
            setLoadFont(true);
            axios.put(
                `${import.meta.env.VITE_API_KEY}/users/changeFont`,
                { font: preferred == "default" ? font : customFont, id: authState.id },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            ).then(response => {
                document.documentElement.style.setProperty("--font-family", response.data);
                setSettings({...settings, font: response.data});
                setLoadFont(false);
                closeModal(modal);
            });
        }
    }

    return (
        <dialog closedby="any" ref={modal} className="font-modal">
            <h2>{text[settings.language].fontOptions[0]}</h2>
            <hr />
            <div className="radio-container">
                <div className="option-container">
                    <label className="font-option-name">
                        <div className="radio-input">
                            <input type="radio" name="font-option" value="default" checked={preferred === "default"} onChange={() => setPreferred("default")} />
                            <svg id="default-check-mark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} stroke="var(--modal-button-bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        {text[settings.language].fontOptions[1]}
                    </label>
                    <div className="font-editor" style={{opacity: preferred === 'default' ? 1 : 0.5, pointerEvents: preferred === 'default' ? 'auto' : 'none'}}>
                        <select value={font} onChange={(e) => setFont(e.target.value)} disabled={preferred !== 'default'} size={Math.min(fonts.length, 3)}>
                            {fonts.map((value, index) => (
                                <option key={index} value={value} style={{fontFamily: value, backgroundColor: value == font ? "var(--font)" : "transparent", color: value == font ? "var(--modal-bg)" : "var(--font)"}}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="option-container">
                    <label className="font-option-name">
                        <div className="radio-input">
                            <input type="radio" name="font-option" value="custom" checked={preferred === "custom"} onChange={() => setPreferred("custom")}/>
                            <svg id="custom-check-mark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} stroke="var(--modal-button-bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        {text[settings.language].fontOptions[2]}
                    </label>
                    <div className="custom-font-container" style={{opacity: preferred === 'custom' ? 1 : 0.5, pointerEvents: preferred === 'custom' ? 'auto' : 'none'}}>
                        <label htmlFor="custom-font-input">
                            {text[settings.language].customFont[0]} <a target="_blank" href="https://fonts.google.com/">google fonts</a> {text[settings.language].customFont[1]}:
                        </label>
                        <div className="font-field">
                            <input type="text" id="custom-font-input" placeholder={text[settings.language].customFont[2]} value={customFont} onChange={(e) => setCustomFont(e.target.value)} disabled={preferred !== 'custom'}/>
                            <button onClick={saveFont} disabled={loadSave || !customFont} title={text[settings.language].themeControls[2]}>
                                {loadSave ? <span className="loader" style={loaderStyles} />
                                : <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.save} stroke="var(--button-font)" strokeWidth="2.5" strokeLinejoin="round"/></svg>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className="font-option-actions">
                <button id="apply-font" onClick={fontChange} disabled={preferred == "custom" && customFont == ""} style={{opacity: preferred == "custom" && customFont == "" ? 0.5 : 1, cursor: preferred == "custom" && customFont == "" ? "not-allowed" : "pointer"}}>
                    {loadFont ? <span className="loader" style={{ margin: width >= 600 ? "0.4rem 0" : "0.2rem 0", width: "1.2rem", height: "1.2rem" }} />
                    : <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} stroke="var(--button-font)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
                <button id="close-font-modal" onClick={() => closeModal(modal)}>
                    <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="work-case" fill="var(--button-font)" transform="translate(91.520000, 91.520000)"><polygon id="Close" points={paths.cancel} /></g></g></svg>
                </button>
            </div>

            <dialog closedby="any"
                className="save-alert"
                ref={alertRef}
                style={{
                    backgroundColor: `var(--light-${saveStatus ? "green" : "red"})`,
                    color: `var(--dark-${saveStatus ? "green" : "red"})`,
                    marginTop: width >= 600 ? "35.3rem" : "35.9rem"
                }}>
                <div>
                    <p>
                        {text[settings.language].fontSavedStatus[saveStatus][0]}
                        <span onClick={() => navigate("/savedfonts")} style={{textDecoration: "underline", color: "blue", cursor: "pointer"}}>
                            {text[settings.language].fontSavedStatus[saveStatus][1]}
                        </span>!
                    </p>
                    <button onClick={() => closeModal(alertRef)}>
                        <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" strokeWidth="1" fill={`var(--dark-${saveStatus ? "green" : "red"})`} fillRule="evenodd"><g id="work-case" transform="translate(91.520000, 91.520000)"><polygon id="Close" points={paths.cancel} /></g></g></svg>
                    </button>
                </div>
            </dialog>
        </dialog>
    )
}

export default FontModal