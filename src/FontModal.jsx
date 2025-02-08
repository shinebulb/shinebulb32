import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './assets/AuthContext';
import closeModal from './assets/closeModal';
import getFontFamily from './assets/getFontFamily';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';

function FontModal({ modal, settings, setSettings }) {

    const { authState } = useContext(AuthContext);

    const [preferred, setPreferred] = useState(settings.font.startsWith("https://fonts.googleapis.com") ? "custom" : "default");
    const [font, setFont] = useState(settings.font.startsWith("https://fonts.googleapis.com") ? "roboto slab" : settings.font);
    const [link, setLink] = useState(settings.font.startsWith("https://fonts.googleapis.com") ? settings.font : "");

    const fonts = ["roboto slab", "consolas", "trebuchet ms", "helvetica", "verdana", "georgia", "palatino", "garamond"];
    
    const handleOptionChange = (event) => {
        setPreferred(event.target.value);
    };

    function fontChange() {
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
            closeModal(modal);
        });
    }

    return (
        <dialog ref={modal} className="font-modal">
            <h2>{text[settings.language].fontOptions[0]}</h2>
            <hr />
            <div className="radio-container">
                <div>
                    <label className="font-option-name">
                        <input type="radio" name="font-option" value="default" checked={preferred === 'default'} onChange={handleOptionChange} />
                        {text[settings.language].fontOptions[1]}
                    </label>
                    <div style={{opacity: preferred === 'default' ? 1 : 0.5, pointerEvents: preferred === 'default' ? 'auto' : 'none'}}>
                        <select value={font} onChange={(e) => setFont(e.target.value)} disabled={preferred !== 'default'} size={Math.min(fonts.length, 3)}>
                            {fonts.map((font, index) => (
                                <option key={index} value={font} style={{fontFamily: font}}>
                                    {font}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="font-option-name">
                        <input type="radio" name="font-option" value="custom" checked={preferred === 'custom'} onChange={handleOptionChange}/>
                        {text[settings.language].fontOptions[2]}
                    </label>
                    <div className="custom-font-container" style={{opacity: preferred === 'custom' ? 1 : 0.5, pointerEvents: preferred === 'custom' ? 'auto' : 'none'}}>
                        <label htmlFor="custom-font-input">
                            {text[settings.language].customFont[0]} <a href="https://fonts.google.com/">google fonts</a>:
                        </label>
                        <input type="text" id="custom-font-input" placeholder={text[settings.language].customFont[1]} value={link} onChange={(e) => setLink(e.target.value)} disabled={preferred !== 'custom'}/>
                    </div>
                </div>
            </div>
            <hr />
            <div className="font-option-actions">
                <button id="apply-font" onClick={fontChange} disabled={preferred == "custom" && link == ""} style={{opacity: preferred == "custom" && link == "" ? 0.5 : 1, cursor: preferred == "custom" && link == "" ? "not-allowed" : "pointer"}}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} stroke="var(--button-font)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button onClick={() => closeModal(modal)}>
                    <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="work-case" fill="var(--button-font)" transform="translate(91.520000, 91.520000)"><polygon id="Close" points={paths.cancel} /></g></g></svg>
                </button>
            </div>
        </dialog>
    )
}

export default FontModal