import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './assets/AuthContext';
import closeModal from './assets/closeModal';
import getFontFamily from './assets/getFontFamily';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';

function FontModal({ modal, settings, setSettings, width }) {

    const { authState } = useContext(AuthContext);

    const [preferred, setPreferred] = useState(settings.font.startsWith("https://fonts.googleapis.com") ? "custom" : "default");
    const [font, setFont] = useState(settings.font.startsWith("https://fonts.googleapis.com") ? "roboto slab" : settings.font);
    const [link, setLink] = useState(settings.font.startsWith("https://fonts.googleapis.com") ? settings.font : "");

    const [loadFont, setLoadFont] = useState(false);
    const [selected, setSelected] = useState(false);

    const fonts = ["roboto slab", "source code pro", "open sans", "shantell sans", "roboto", "eb garamond"];

    function saveFont() {
        setSelected(!selected)
    }

    function fontChange() {
        if (!authState.status) {
            localStorage.setItem("font", preferred == "default" ? font : link);
            if (preferred == "default") {
                document.documentElement.style.setProperty("--font-family", font);
                setSettings({...settings, font: font});
            }
            else {
                document.documentElement.style.setProperty("--font-family", getFontFamily(link));
                setSettings({...settings, font: link});
            }
            closeModal(modal);
        }
        else {
            setLoadFont(true);
            axios.put(
                `${import.meta.env.VITE_API_KEY}/users/changeFont`,
                { font: preferred == "default" ? font : link, id: authState.id },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            ).then(response => {
                if (preferred == "default") {
                    document.documentElement.style.setProperty("--font-family", response.data);
                    setSettings({...settings, font: response.data});
                }
                else {
                    document.documentElement.style.setProperty("--font-family", getFontFamily(response.data));
                    setSettings({...settings, font: response.data});
                }
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
                        <select value={font} onChange={(e) => setFont(e.target.value)} disabled={preferred !== 'default'} size={Math.min(fonts.length, 4)}>
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
                            {text[settings.language].customFont[0]} <a target="_blank" href="https://fonts.google.com/">google fonts</a>:
                        </label>
                        <input type="text" id="custom-font-input" placeholder={text[settings.language].customFont[1]} value={link} onChange={(e) => setLink(e.target.value)} disabled={preferred !== 'custom'}/>
                        <div className="save-font">
                            <button id="add-to-collection" onClick={saveFont} style={{backgroundColor: selected ? "var(--button-font)" : "var(--modal-button-bg)"}}>
                                <svg stroke={selected ? "var(--modal-button-bg)" : "transparent"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                            <label htmlFor="add-to-collection">add to collection</label>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className="font-option-actions">
                <button id="apply-font" onClick={fontChange} disabled={preferred == "custom" && link == ""} style={{opacity: preferred == "custom" && link == "" ? 0.5 : 1, cursor: preferred == "custom" && link == "" ? "not-allowed" : "pointer"}}>
                    {loadFont ? <span className="loader" style={{ margin: width >= 600 ? "0.4rem 0" : "0.2rem 0", width: "1.2rem", height: "1.2rem" }} />
                    : <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} stroke="var(--button-font)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
                <button id="close-font-modal" onClick={() => closeModal(modal)}>
                    <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="work-case" fill="var(--button-font)" transform="translate(91.520000, 91.520000)"><polygon id="Close" points={paths.cancel} /></g></g></svg>
                </button>
            </div>
        </dialog>
    )
}

export default FontModal