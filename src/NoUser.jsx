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
            style={{backgroundColor: "var(--bg)", border: "var(--border-thick)"}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <img src="../img/psycho-bulb.png" style={{ height: "100%", transform: "rotate(-5deg)", marginRight: width >= 600 ? "1rem" : "0" }} />
            <div className="user-info" style={{ color: "var(--font)", fontFamily: "trebuchet ms" }}>
                <h1>unknown</h1>
                <h2 className="joined">{
                        `${text[settings.language].joined} ${
                        new Date("2024-08-30")
                        .toLocaleDateString(locales[settings.language], {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })
                        .toLowerCase()
                    }`}</h2>
                <h2 id="counter" style={{ fontWeight: "normal" }}>
                    <span>{text[settings.language].bulbCount}: </span>
                    <span style={{
                        fontFamily: "consolas",
                        fontSize: width >= 600 ? "1.1rem" : "1rem",
                        border: "var(--border-thin)",
                        borderRadius: "5px",
                        padding: "0.2rem 0.5rem",
                        opacity: "70%",
                        cursor: "not-allowed"
                    }}>
                        undefined
                    </span>
                </h2>
            </div>
        </motion.div>
    )
}

export default NoUser