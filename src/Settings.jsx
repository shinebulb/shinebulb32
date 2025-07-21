import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './assets/AuthContext';
import axios from 'axios';
import ThemeConstructor from './ThemeConstructor';
import FontModal from './FontModal';
import ToggleInfo from './ToggleInfo';
import themes from './assets/themes';
import closeModal from './assets/closeModal';
import editingField from './assets/editingField';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';
import modes from './assets/json/modes.json';
import languages from './assets/json/languages.json';
import {motion} from 'framer-motion';

function Settings({ settings, setSettings }) {

    const { authState } = useContext(AuthContext);

    const [loadLang, setLoadLang] = useState(false);
    const [loadTheme, setLoadTheme] = useState(false);
    const [loadToggle, setLoadToggle] = useState(false);
    
    const [width, setWidth] = useState(window.innerWidth);
    
    let constructorClosed = true;

    const navigate = useNavigate();

    useEffect(() => {
        document.title = text[settings.language].links[1];
        document.addEventListener("keydown", openConstructor);
        document.addEventListener("keydown", navigateThemes);
        document.addEventListener("keydown", navigateFonts);
        window.addEventListener("resize", () => setWidth(window.innerWidth));

        return () =>  {
            window.removeEventListener("resize", () => setWidth(window.innerWidth));
            document.removeEventListener("keydown", openConstructor);
            document.removeEventListener("keydown", navigateThemes);
            document.removeEventListener("keydown", navigateFonts);
        }
    }, []);

    const constructorRef = useRef(null);
    const fontRef = useRef(null);
    const infoRef = useRef(null);

    const loaderStyles = {
        width: "1.5rem",
        height: "1.5rem",
        borderColor: "var(--font)",
        borderBottomColor: "transparent",
        marginRight: "0.7rem"
    };

    function openConstructor(event) {

        const key = event.key.toLowerCase();

        if (editingField(event.target)) return;
    
        else if (constructorRef.current && (key == "c" || key == "с")) {
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

    function navigateThemes(event) {
        const key = event.key.toLowerCase();
        if (editingField(event.target)) return;
        if (key == "t" || key == "е") navigate("/savedthemes")
    }

    function navigateFonts(event) {
        const key = event.key.toLowerCase();
        if (editingField(event.target)) return;
        if (key == "f" || key == "а") navigate("/savedfonts")
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
        else constructorRef.current.showModal();
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
            setLoadToggle(true);
            axios.put(
                `${import.meta.env.VITE_API_KEY}/users/invertTheme`,
                { invertTheme: invert, id: authState.id },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            ).then(response => {
                setSettings(
                    { ...settings, invertTheme: response.data || invert }
                );
                setLoadToggle(false);
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
            <div style={{ height: "8rem" }} />
            <h2>{text[settings.language].headings[1]}</h2>
            <div style={{ height: "5rem" }} />
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
                    {settings.theme === 3 && <svg xmlns="http://www.w3.org/2000/svg" onClick={() => constructorRef.current.showModal()} style={{height: "1.8rem", marginRight: "0.5rem", cursor: "pointer"}} viewBox="0 -960 960 960" fill="var(--font)"><path d={paths.colorize}/></svg>}
                    <select onChange={themeChange} value={modes[settings.theme]}>
                        <option value="system">{text[settings.language].mode[0]}</option>
                        <option value="light">{text[settings.language].mode[1]}</option>
                        <option value="dark">{text[settings.language].mode[2]}</option>
                        <option value="custom">{text[settings.language].mode[3]}{width >= 600 && " (c)"}</option>
                    </select>
                </div>
            </div>
            <div style={{ height: "3rem" }} />
            <div className="container">
                <label className="settingName" style={{textAlign: "left"}}>{text[settings.language].fontFamily}</label>
                <button className="explore-fonts" onClick={() => fontRef.current.showModal()} title={settings.font.toLowerCase()}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="var(--button-font)"><path d={paths.edit}/></svg>
                    <span>{settings.font.toLowerCase()}</span>
                </button>
            </div>
            <div style={{height: "3rem"}} />
            <div className="container">
                <label style={{fontStyle: "italic", fontSize: "1rem", width: "20ch", textAlign: "left"}}>
                    {text[settings.language].invertTheme}
                    <button id="toggle-info" onClick={() => infoRef.current.showModal()}>i</button>
                </label>
                <div>
                    {width >= 600 && loadToggle && <span className="loader" style={loaderStyles} />}
                    <div className="toggle">
                        <input type="checkbox" id="switch" checked={settings.invertTheme} onChange={toggleInvertTheme} />
                        <label htmlFor="switch" />
                    </div>
                </div>
            </div>
            <div style={{ height: "3rem" }} />
            <h3 className="collections-title">{text[settings.language].yourCollections[0]}</h3>
            <div style={{ height: "1.5rem" }} />
            <div className="collections">
                <button onClick={() => navigate("/savedthemes")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="var(--button-font)"><path d={paths.theme}/></svg>
                    {text[settings.language].yourCollections[1]}{width >= 600 ? " (t)" : ""}
                </button>
                <button onClick={() => navigate("/savedfonts")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="var(--button-font)"><path d={paths.fonts}/></svg>
                    {text[settings.language].yourCollections[2]}{width >= 600 ? " (f)" : ""}
                </button>
            </div>
            <div style={{ height: "4rem" }} />
            <a onClick={() => navigate("/")}>{text[settings.language].back}</a>
            <div style={{ height: "3rem" }} />
            <ThemeConstructor
                constructor={constructorRef}
                settings={settings}
                setSettings={setSettings}
                width={width}
            />
            <FontModal modal={fontRef} settings={settings} setSettings={setSettings} width={width} />
            <ToggleInfo info={infoRef} settings={settings} />
        </motion.div>
    );
}

export default Settings;
