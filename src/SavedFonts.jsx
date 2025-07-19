import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './assets/AuthContext';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';
import LogInToView from './LogInToView';

function SavedFonts({ settings, setSettings }) {

    const { authState } = useContext(AuthContext);

    const [fontList, setFontList] = useState([]);

    useEffect(() => {
        document.title = "saved fonts";
        axios.get(`${import.meta.env.VITE_API_KEY}/savedfonts/byUser/${authState.id}`)
        .then(response => {
            if (response !== undefined) setFontList(response.data.map(obj => obj.url));
        });
    }, []);

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
                <h2 style={{fontSize: "1.9rem", marginTop: "6rem"}}>saved fonts</h2>
                <h3 style={{color: "var(--font)", fontStyle: "italic", marginBottom: "2rem"}}>
                    {fontList.length} {text[settings.language].savedThemes[1]}
                </h3>
            </>}
        </motion.div>
    )
}

export default SavedFonts