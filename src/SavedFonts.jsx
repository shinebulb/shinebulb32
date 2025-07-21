import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SavedFontsLoader from './SavedFontsLoader';
import { AuthContext } from './assets/AuthContext';
import getFontUrl from './assets/getFontUrl';
import editingField from './assets/editingField';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';
import LogInToView from './LogInToView';

function SavedFonts({ settings, setSettings }) {

    const navigate = useNavigate();

    const { authState } = useContext(AuthContext);

    const [fontList, setFontList] = useState([]);

    useEffect(() => {
        document.title = text[settings.language].links[9];
        document.addEventListener("keydown", navigateSettings);
        axios.get(`${import.meta.env.VITE_API_KEY}/savedfonts/byUser/${authState.id}`)
        .then(response => {
            if (response !== undefined) setFontList(response.data.map(obj => obj.fontFamily));
        });

        return () => document.removeEventListener("keydown", navigateSettings);
    }, []);

    function navigateSettings(event) {
        const key = event.key.toLowerCase();
        if (editingField(event.target)) return;
        if (key == "f" || key == "а") navigate("/settings");
    }

    return (
        <motion.div
            className='saved'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            {!authState.status ? <LogInToView settings={settings} /> 
            : <>
                {fontList.length > 0 && <SavedFontsLoader fontList={fontList.map(font => getFontUrl(font))} />}
                <h2 style={{fontSize: "1.9rem", marginTop: "6rem"}}>saved fonts</h2>
                <h3 style={{color: "var(--font)", fontStyle: "italic", marginBottom: "2rem"}}>
                    {fontList.length} {text[settings.language].savedThemes[1]}
                </h3>
                {fontList.length > 0 && <div>{
                    fontList.map((fontFamily, index) => 
                        <p key={index} style={{ fontFamily: fontFamily, color: "var(--font)", fontSize: "1.3rem" }}>
                            {fontFamily}
                        </p>
                    )
                }</div>}
                <div style={{height: "1.5rem"}}/>
                <a onClick={() => navigate("/settings")} id="saved-back-link">{text[settings.language].back}</a>
                <div style={{height: "2rem"}} />
            </>}
        </motion.div>
    )
}

export default SavedFonts