import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './assets/AuthContext';
import axios from 'axios';
import ThemeConstructor from './ThemeConstructor';
import FontModal from './FontModal';
import ToggleInfo from './ToggleInfo';
import themes from './assets/themes';
import closeModal from './assets/closeModal';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';
import modes from './assets/json/modes.json';
import languages from './assets/json/languages.json';
import {motion} from 'framer-motion';

function Settings({ settings, setSettings }) {

    const { authState } = useContext(AuthContext);

    const [loadLang, setLoadLang] = useState(false);
    const [loadTheme, setLoadTheme] = useState(false);
    
    const [width, setWidth] = useState(window.innerWidth);
    
    let constructorClosed = true;

    const navigate = useNavigate();

    useEffect(() => {
        document.title = text[settings.language].links[1];
        document.addEventListener("keydown", event => openConstructor(event.key.toLowerCase()));
        document.addEventListener("keydown", event => {if (constructorRef.current && (event.key.toLowerCase() == "s" || event.key.toLowerCase() == "ы")) navigate("/saved")});
        window.addEventListener("resize", () => setWidth(window.innerWidth));

        return () =>  {
            window.removeEventListener("resize", () => setWidth(window.innerWidth));
            document.removeEventListener("keydown", event => openConstructor(event.key.toLowerCase()));
            document.removeEventListener("keydown", event => {if (constructorRef.current && (event.key.toLowerCase() == "s" || event.key.toLowerCase() == "ы")) navigate("/saved")});
        }
    }, []);

    const constructorRef = useRef(null);
    const fontRef = useRef(null);
    const moreRef = useRef(null);
    const infoRef = useRef(null);

    const loaderStyles = {
        width: "1.5rem",
        height: "1.5rem",
        borderColor: "var(--font)",
        borderBottomColor: "transparent",
        marginRight: "0.7rem"
    };

    function openConstructor(key) {
        if (constructorRef.current && (key == "c" || key == "с")) {
            if (constructorClosed) {
                constructorRef.current.showModal();
                constructorClosed = false;
            }
            else {
                closeModal(constructorRef);
                constructorClosed = true;
            }
        }
    }

    function themeChange(event) {
        const mode = modes.indexOf(event.target.value);
        if (mode < 3) {
            if (!authState.status) {
                document.body.classList.add('theme-transition');
                setTimeout(() => {
                    document.body.classList.remove('theme-transition');
                }, 500);
                themes[mode]();
                setSettings({...settings, theme: mode});
                localStorage.setItem("theme", mode);
            }
            else {
                setLoadTheme(true);
                axios.put(
                    `${import.meta.env.VITE_API_KEY}/users/theme`,
                    { theme: mode, id: authState.id },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                ).then(response => {
                    document.body.classList.add('theme-transition');
                    setTimeout(() => {
                        document.body.classList.remove('theme-transition');
                    }, 500);
                    themes[mode]();
                    setSettings({...settings, theme: response.data});
                    setLoadTheme(false);
                });
            }
        }
        else if (mode === 3) {
            constructorRef.current.showModal();
        }
        else if (mode === 4) {
            navigate("/saved");
        }
    }

    function languageChange(event) {
        const newLang = languages.indexOf(event.target.value);
        if (!authState.status) {
            localStorage.setItem("language", newLang);
            setSettings(
                { ...settings, language: newLang }
            );
        }
        else {
            setLoadLang(true);
            axios.put(
                `${import.meta.env.VITE_API_KEY}/users/language`,
                { language: newLang, id: authState.id },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            ).then(response => {
                setSettings(
                    { ...settings, language: response.data || newLang }
                );
                document.title = text[response.data || newLang].links[1];
                setLoadLang(false);
            });
        }
    }

    function toggleInvertTheme() {
        const invert = !settings.invertTheme
        if (!authState.status) {
            localStorage.setItem("invertTheme", Number(invert));
            setSettings(
                { ...settings, invertTheme: invert }
            );
            document.body.classList.add('theme-transition');
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 500);
            themes[settings.theme](0);
        }
        else {
            axios.put(
                `${import.meta.env.VITE_API_KEY}/users/invertTheme`,
                { invertTheme: invert, id: authState.id },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            ).then(response => {
                setSettings(
                    { ...settings, invertTheme: response.data || invert }
                );
                document.body.classList.add('theme-transition');
                setTimeout(() => {
                    document.body.classList.remove('theme-transition');
                }, 500);
                themes[settings.theme]();
            });
        }
    }

    return (
        <motion.div
            className='settings'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <div style={{ height: "5rem" }} />
            <h2>{text[settings.language].headings[1]}</h2>
            <div className="container">
                <label>{text[settings.language].settings[1]}</label>
                <div>
                    {loadLang && <span className="loader" style={loaderStyles} />}
                    <select onChange={languageChange} value={languages[settings.language]}>
                        <option value="en">english</option>
                        <option value="ru">русский</option>
                    </select>
                </div>
            </div>
            <div style={{ height: "3rem" }} />
            <div className="container">
                <label className="settingName">{text[settings.language].settings[0]}</label>
                <div>
                    {loadTheme && <span className="loader" style={loaderStyles} />}
                    <select onChange={themeChange} value={modes[settings.theme]}>
                        <option value="system">{text[settings.language].mode[0]}</option>
                        <option value="light">{text[settings.language].mode[1]}</option>
                        <option value="dark">{text[settings.language].mode[2]}</option>
                        <option value="custom">{text[settings.language].mode[3]}{width >= 600 && " (c)"}</option>
                        {authState.status && <option value="saved">{text[settings.language].mode[4]}{width >= 600 && " (s)"}</option>}
                    </select>
                </div>
            </div>
            <div style={{ height: "3rem" }} />
            <div className="container">
                <label className="settingName" style={{textAlign: "left"}}>{text[settings.language].fontFamily}</label>
                <button className="explore-fonts" onClick={() => fontRef.current.showModal()}>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="var(--button-font)" stroke="none" strokeWidth="0.36"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d={paths.explore[0]}/><path fill="none" d={paths.explore[1]}/></g></svg>
                    {text[settings.language].explore}...
                </button>
            </div>
            <div style={{height: "3rem"}} />
            <div className="container">
                <label style={{fontStyle: "italic", fontSize: "1.1rem", width: "18ch", textAlign: "left"}}>
                    {text[settings.language].invertTheme}
                    <button id="toggle-info" onClick={() => infoRef.current.showModal()}>i</button>
                </label>
                <div className="toggle">
                    <input type="checkbox" id="switch" checked={settings.invertTheme} onChange={toggleInvertTheme} />
                    <label htmlFor="switch" />
                </div>
            </div>
            <div style={{ height: "4rem" }} />
            <a onClick={() => navigate("/")}>{text[settings.language].back}</a>
            <ThemeConstructor
                constructor={constructorRef}
                settings={settings}
                setSettings={setSettings}
                width={width}
            />
            <FontModal modal={fontRef} settings={settings} setSettings={setSettings} />
            <ToggleInfo info={infoRef} settings={settings} />
        </motion.div>
    );
}

export default Settings;
