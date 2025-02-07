import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FontModal from './FontModal';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';
import { motion } from 'framer-motion';

function FontSettings({ settings, setSettings }) {

    const navigate = useNavigate();

    const modal = useRef(null);

    return (
        <motion.div
            className='settings'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <div style={{ height: "3rem" }} />
            <h2>{text[settings.language].fontSettings}</h2>
            <div className="container">
                <label className="settingName" style={{textAlign: "left"}}>{text[settings.language].fontFamily}</label>
                <button className="explore-fonts" onClick={() => modal.current.showModal()}>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="var(--button-font)" stroke="none" stroke-Width="0.36"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d={paths.explore[0]}/><path fill="none" d={paths.explore[1]}/></g></svg>
                    {text[settings.language].explore}...
                </button>
            </div>
            <div style={{ height: "4rem" }} />
            <a onClick={() => navigate("/settings")}>{text[settings.language].back}</a>

            <FontModal modal={modal} settings={settings} setSettings={setSettings} />
        </motion.div>
    )
}

export default FontSettings