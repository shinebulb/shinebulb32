import React, { useState, useEffect } from 'react';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function NoUser({ settings }) {

    const [width, setWidth] = useState(window.innerWidth);

    const locales = ["en-us", "ru-ru"];

    useEffect(() => {
        document.title = text[settings.language].nouser
        window.addEventListener("resize", () => setWidth(window.innerWidth));
        return () =>  { window.removeEventListener("resize", () => setWidth(window.innerWidth)) }
    }, []);

    return (
        <motion.div
            className='profile'
            style={{height: width >= 600 ? "260px" : (settings.language === 1 ? "420px" : "380px"), background: "var(--no-user-bg)" }}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <img src="../img/psycho-bulb.png" style={{ height: width >= 600 ? "100%" : "220px", transform: "rotate(-5deg)", marginRight: width >= 600 ? "1rem" : "0" }} />
            <div className="user-info" style={{ color: "#111111", fontFamily: "monospace" }}>
                <h1 style={{ color: "#111111" }}>{text[settings.language].nouser}</h1>
                <h2 style={{ color: "#111111" }} className="joined">{
                        `${text[settings.language].joined} ${
                        new Date("2024-08-30")
                        .toLocaleDateString(locales[settings.language], {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })
                        .toLowerCase()
                    }`}</h2>
                <h2 id="counter" style={{ display: "flex", alignItems: "center", justifyContent: width >= 600 ? "left" : "center", color: "#111111", fontWeight: "normal" }}>
                    <span>{text[settings.language].bulbCount}: </span>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ fill: "#111111", height: "2rem", marginLeft: "0.5rem" }} viewBox="0 -960 960 960"><path d="M220-260q-92 0-156-64T0-480q0-92 64-156t156-64q37 0 71 13t61 37l68 62-60 54-62-56q-16-14-36-22t-42-8q-58 0-99 41t-41 99q0 58 41 99t99 41q22 0 42-8t36-22l310-280q27-24 61-37t71-13q92 0 156 64t64 156q0 92-64 156t-156 64q-37 0-71-13t-61-37l-68-62 60-54 62 56q16 14 36 22t42 8q58 0 99-41t41-99q0-58-41-99t-99-41q-22 0-42 8t-36 22L352-310q-27 24-61 37t-71 13Z"/></svg>
                </h2>
            </div>
        </motion.div>
    )
}

export default NoUser