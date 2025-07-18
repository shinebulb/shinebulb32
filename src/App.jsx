import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from './assets/AuthContext';
import AppLoader from './AppLoader';
import Home from './Home';
import Play from './Play';
import Settings from './Settings';
import About from './About';
import Support from './Support';
import DevPage from './DevPage';
import SavedThemes from './SavedThemes';
import SavedFonts from './SavedFonts';
import LogIn from './LogIn';
import SignUp from './SignUp';
import Verify from './Verify';
import Profile from './Profile';
import ChangePassword from './ChangePassword';
import NoUser from './NoUser';
import NoPage from './NoPage';
import DynamicFontLoader from './DynamicFontLoader';
import themes from './assets/themes';
import defaultLang from './assets/defaultLang';
import getFontUrl from './assets/getFontUrl';
import fonts from './assets/json/fonts.json';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';

function App() {

    const [authState, setAuthState] = useState({ username: "", id: 0, status: false });
    const [settings, setSettings] = useState({
        bulbCount: parseInt(localStorage.getItem("bulbCount")) || 0,
        bulbStatus: localStorage.getItem("bulbStatus") || "off",
        language: localStorage.getItem("language") === null ? defaultLang() : localStorage.getItem("language"),
        theme: parseInt(localStorage.getItem("theme")) || 0,
        invertTheme: parseInt(localStorage.getItem("invertTheme")) || 0,
        font: localStorage.getItem("font") || "Roboto Slab"
    });
    const [savedList, setSavedList] = useState([]);
    const [verificationRequired, setVerificationRequired] = useState(Boolean(localStorage.getItem("verificationRequired")));

    const [loadApp, setLoadApp] = useState(true);
    const [stuckHere, setStuckHere] = useState(false);

    useEffect(() => {
        themes[parseInt(localStorage.getItem("theme")) || 0](0);
        document.documentElement.style.setProperty("--font-family", localStorage.getItem("font") || "Roboto Slab");
        document.documentElement.style.setProperty("--verification-required-height", verificationRequired ? "3.2rem" : "0");
        setTimeout(() => { if (loadApp) setStuckHere(true) }, 2500);
        let id = 0;
        axios.get(
            `${import.meta.env.VITE_API_KEY}/users/auth`,
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(response => {
            setAuthState(response.data.error ?
            { ...authState, status: false }
            : {
                username: response.data.username,
                id: response.data.id,
                status: true
            });
            if (!response.data.error) {
                id = response.data.id
            }
            else {
                setLoadApp(false);
            }
            return axios.get(
                `${import.meta.env.VITE_API_KEY}/users/settings/${id}`,
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            );
        }).then(response => {
            if (!response.data.error) {
                setSettings({
                    bulbCount: response.data.bulbCount || 0,
                    bulbStatus: response.data.bulbStatus || "off",
                    language: response.data.language === null ? settings.language : response.data.language,
                    theme: response.data.theme === null ? settings.theme : response.data.theme,
                    invertTheme: response.data.invertTheme || false,
                    font: response.data.font || "Roboto Slab"
                });
                setLoadApp(false);
                themes[response.data.theme === null ? settings.theme : response.data.theme]();
                document.documentElement.style.setProperty("--font-family", response.data.font || "Roboto Slab");
                if ((response.data.bulbStatus === "on") && (bulb.current)) bulb.current.classList.add("on");
            }
        });
    }, []);
    
    const bulb = useRef(null);

    function resetSession() {
        localStorage.removeItem("accessToken");
        setStuckHere(false);
        window.location.reload();
    }

    function logout() {
        document.body.classList.add('theme-transition');
        setTimeout(() => document.body.classList.remove('theme-transition'), 500);
        setAuthState({ username: "", id: 0, status: false });
        setSettings({
            bulbCount: parseInt(localStorage.getItem("bulbCount")) || 0,
            bulbStatus: localStorage.getItem("bulbStatus") || "off",
            language: localStorage.getItem("language") === null ? defaultLang() : parseInt(localStorage.getItem("language")),
            theme: parseInt(localStorage.getItem("theme")) || 0,
            invertTheme: parseInt(localStorage.getItem("invertTheme")) || 0,
            font: localStorage.getItem("font") || "Roboto Slab"
        });
        setSavedList([]);
        if (localStorage.getItem("verificationRequired") === "") {
            localStorage.setItem("verificationRequired", "1");
            setVerificationRequired(true);
            document.documentElement.style.setProperty("--verification-required-height", "3.2rem");
        }
        localStorage.removeItem("accessToken");
        themes[parseInt(localStorage.getItem("theme")) || 0](0);
        document.documentElement.style.setProperty("--font-family", localStorage.getItem("font") || "Roboto Slab");
    }

    return (
        <AuthContext.Provider value={{ authState, setAuthState }}>
            <BrowserRouter>
                {loadApp ?
                <>
                    <AppLoader />
                    <div className="reset-session" style={{ visibility: stuckHere ? "visible" : "hidden"}}>
                        <span>{text[settings.language].stuckHere[0]}</span>
                        <button onClick={resetSession}>{text[settings.language].stuckHere[1]}</button>
                    </div>
                </>
                : <>
                    {!fonts.includes(settings.font) && <DynamicFontLoader settings={settings} />}
                    {verificationRequired &&
                    <div className="verification-required">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d={paths.inbox} stroke="var(--dark-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                        <span>{text[settings.language].verificationRequired}</span>
                        <svg onClick={() => {
                            setVerificationRequired(false);
                            localStorage.removeItem("verificationRequired");
                            document.documentElement.style.setProperty("--verification-required-height", "0");
                        }} style={{ cursor: "pointer" }} viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" strokeWidth="1" fill="var(--dark-yellow)" fillRule="evenodd"><g id="work-case" transform="translate(91.520000, 91.520000)"><polygon id="Close" points={paths.cancel} /></g></g></svg>
                    </div>}
                    <div className="navbar">
                        <div className="navbar-links">
                            <Link to="/" style={{ marginLeft: "calc(var(--navbar-margin) * 2)" }}>{text[settings.language || 0 || 0].home}</Link>
                            {authState.status && <Link to={`/user/${authState.username}`} style={{ fontStyle: "italic", fontWeight: "normal" }}>{authState.username}</Link>}
                            <div className="auth-links">{!authState.status ?
                                <>
                                    <Link to="/signup" style={{ marginRight: "var(--navbar-margin)" }}>{text[settings.language || 0 || 0].auth[1]}</Link>
                                    <Link to="/login" style={{ marginRight: "calc(var(--navbar-margin) * 2)" }}>{text[settings.language || 0 || 0].auth[0]}</Link>
                                </>
                                : <Link to="/" onClick={logout} style={{ marginRight: "calc(var(--navbar-margin) * 2)" }}>{text[settings.language || 0 || 0].auth[2]}</Link>
                            }</div>
                        </div>
                        <hr />
                    </div>
                    <Routes>
                        <Route index element={<Home settings={settings} />} />
                        <Route path="/play" element={<Play bulb={bulb} settings={settings} setSettings={setSettings} />} />
                        <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} />} />
                        <Route path="/about" element={<About settings={settings} />} />
                        <Route path="/support" element={<Support settings={settings} />} />
                        <Route path="/development" element={<DevPage settings={settings} />} />
                        <Route path="/savedthemes" element={<SavedThemes settings={settings} setSettings={setSettings} savedList={savedList} setSavedList={setSavedList} />} />
                        <Route path="/savedfonts" element={<SavedFonts settings={settings} setSettings={setSettings} />} />
                        <Route path="/login" element={<LogIn bulb={bulb} settings={settings} setSettings={setSettings} setSavedList={setSavedList} setVerificationRequired={setVerificationRequired} />} />
                        <Route path="/signup" element={<SignUp settings={settings} setVerificationRequired={setVerificationRequired} />} />
                        <Route path="/verify" element={<Verify settings={settings} setVerificationRequired={setVerificationRequired} />} />
                        <Route path="/user/:username" element={<Profile settings={settings} bulb={bulb} />} />
                        <Route path="/changepassword" element={<ChangePassword settings={settings} />} />
                        <Route path="/nouser" element={<NoUser settings={settings} />} />
                        <Route path="*" element={<NoPage settings={settings} />} />
                    </Routes>
                </>}
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default App