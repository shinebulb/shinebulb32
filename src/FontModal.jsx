import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './assets/AuthContext';
import closeModal from './assets/closeModal';
import text from './assets/json/text.json';

function FontModal({ modal, settings, setSettings }) {

    const { authState } = useContext(AuthContext);

    const [selectedOption, setSelectedOption] = useState('default');
    const [selectedFont, setSelectedFont] = useState('Arial');
    const [customLink, setCustomLink] = useState('');

    const fonts = [
        'Arial',
        'Helvetica',
        'Times New Roman',
        'Courier New',
        'Verdana',
        'Georgia',
        'Palatino',
        'Garamond',
        'Comic Sans MS',
        'Trebuchet MS',
        // add more fonts as needed...
    ];
    
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    


    function fontChange(event) {
        axios.put(
            `${import.meta.env.VITE_API_KEY}/users/changeFont`,
            { font: event.target.value, id: authState.id },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(response => {
            document.documentElement.style.setProperty("--font-family", response.data);
            setSettings({...settings, font: response.data});
        })
    }

    return (
        <dialog ref={modal} className="font-modal">
            <h2>select font option</h2>
            <hr />
            <div className="radio-container">
                <div>
                    <label>
                        <input type="radio" name="font-option" value="default" checked={selectedOption === 'default'} onChange={handleOptionChange} />
                        default
                    </label>
                    <div style={{opacity: selectedOption === 'default' ? 1 : 0.5, pointerEvents: selectedOption === 'default' ? 'auto' : 'none'}}>
                        <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} disabled={selectedOption !== 'default'} size={Math.min(fonts.length, 5)}>
                            {fonts.map((font, index) => (
                                <option key={index} value={font}>
                                    {font}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label>
                        <input type="radio" name="font-option" value="custom" checked={selectedOption === 'custom'} onChange={handleOptionChange}/>
                        custom
                    </label>
                    <div style={{opacity: selectedOption === 'custom' ? 1 : 0.5, pointerEvents: selectedOption === 'custom' ? 'auto' : 'none'}}>
                        <label htmlFor="custom-font-input">
                            paste a link to google fonts here:
                        </label>
                        <input type="text" id="custom-font-input" value={customLink} onChange={(e) => setCustomLink(e.target.value)} disabled={selectedOption !== 'custom'}/>
                    </div>
                </div>
            </div>
            <hr />
            <button id="close-export-modal" onClick={() => closeModal(modal)}>{text[settings.language].close}</button>
        </dialog>
    )
}

export default FontModal