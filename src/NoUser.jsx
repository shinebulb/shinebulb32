import React, { useState, useEffect } from 'react';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function NoUser({ settings }) {

    const [width, setWidth] = useState(window.innerWidth);

    const locales = ["en-us", "ru-ru"];

    useEffect(() => {
        window.addEventListener("resize", () => setWidth(window.innerWidth));
        return () =>  { window.removeEventListener("resize", () => setWidth(window.innerWidth)) }
    }, []);

    return (
        <motion.div
            className='profile'
            style={{background: "var(--no-user-bg)", border: "white 3px solid", textShadow: `-1.2px -1.2px 0 #000, 1.2px -1.2px 0 #000, -1.2px  1.2px 0 #000, 1.2px 1.2px 0 #000`}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <img src="../img/psycho-bulb.png" style={{ height: width >= 600 ? "100%" : "220px", transform: "rotate(-5deg)", marginRight: width >= 600 ? "1rem" : "0" }} />
            <div className="user-info" style={{ color: "white", fontFamily: "var(--font-family)" }}>
                <h1 style={{ color: "white" }}>{text[settings.language].nouser[0]}</h1>
                <h2 style={{ color: "white" }} className="joined">{
                        `${text[settings.language].joined} ${
                        new Date("2024-08-30")
                        .toLocaleDateString(locales[settings.language], {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })
                        .toLowerCase()
                    }`}</h2>
                <h2 id="counter" style={{ color: "white", fontWeight: "normal" }}>
                    <span>{text[settings.language].bulbCount}: </span>
                    <span style={{
                        fontFamily: "consolas",
                        textWrap: "nowrap",
                        textShadow: "none",
                        fontSize: width >= 600 ? "1.1rem" : "1rem",
                        backgroundColor: "var(--no-user-undefined)",
                        color: "var(--no-user-undefined-font)",
                        border: "var(--no-user-undefined-font) 2px solid",
                        borderRadius: "5px",
                        padding: "0.2rem 0.5rem",
                        cursor: "not-allowed"
                    }}>
                        {text[settings.language].nouser[1]}
                    </span>
                </h2>
            </div>
        </motion.div>
    )
}

export default NoUser