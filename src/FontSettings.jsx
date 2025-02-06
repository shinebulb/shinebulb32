import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './assets/AuthContext';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function FontSettings({ settings, setSettings }) {

    const { authState } = useContext(AuthContext);

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
        <motion.div
            className='settings'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <div style={{ height: "3rem" }} />
            <h2>font settings</h2>
            <div className="container">
                <label>font family</label>
                <div>
                    <select style={{fontFamily: "var(--font-family)"}} value={settings.font} onChange={fontChange}>
                        <option style={{fontFamily: "Roboto Slab"}} value="Roboto Slab">roboto slab</option>
                        <option style={{fontFamily: "Consolas"}} value="Consolas">consolas</option>
                    </select>
                </div>
            </div>
        </motion.div>
    )
}

export default FontSettings