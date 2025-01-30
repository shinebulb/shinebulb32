import React from 'react';
import { useNavigate } from 'react-router-dom';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function FontSettings({ settings, setSettings }) {
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
                    <select style={{fontFamily: "var(--font-family)"}}>
                        <option style={{fontFamily: "Roboto Slab"}} value="roboto slab">roboto slab</option>
                        <option style={{fontFamily: "consolas"}} value="consolas">consolas</option>
                    </select>
                </div>
            </div>
        </motion.div>
    )
}

export default FontSettings