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
import getFontFamily from './assets/getFontFamily';
import text from './assets/json/text.json';

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

    useEffect(() => {
        themes[parseInt(localStorage.getItem("theme")) || 0](0);
        document.documentElement.style.setProperty("--font-family", localStorage.getItem("font")?.startsWith("https://fonts.googleapis.com") ? getFontFamily(localStorage.getItem("font")) : localStorage.getItem("font") || "Roboto Slab");
        document.documentElement.style.setProperty("--verification-required-height", verificationRequired ? "3.2rem" : "0");
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
                document.documentElement.style.setProperty(
                    "--font-family",
                    response.data.font && response.data.font.startsWith("https://fonts.googleapis.com") ? getFontFamily(response.data.font) : response.data.font || "Roboto Slab"
                );
                if ((response.data.bulbStatus === "on") && (bulb.current)) bulb.current.classList.add("on");
            }
        });
    }, []);
    
    const bulb = useRef(null);

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
        document.documentElement.style.setProperty("--font-family", localStorage.getItem("font")?.startsWith("https://fonts.googleapis.com") ? getFontFamily(localStorage.getItem("font")) : localStorage.getItem("font") || "Roboto Slab");
    }

    return (
        <AuthContext.Provider value={{ authState, setAuthState }}>
            <BrowserRouter>
                {loadApp ? <AppLoader />
                : <>
                    {settings.font.startsWith("https://fonts.googleapis.com") && <DynamicFontLoader settings={settings} />}
                    {verificationRequired &&
                    <div className="verification-required">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M9 9.72222L10.8462 11.5L15 7.5M4 14H6.67452C7.1637 14 7.40829 14 7.63846 14.0553C7.84254 14.1043 8.03763 14.1851 8.21657 14.2947C8.4184 14.4184 8.59136 14.5914 8.93726 14.9373L9.06274 15.0627C9.40865 15.4086 9.5816 15.5816 9.78343 15.7053C9.96237 15.8149 10.1575 15.8957 10.3615 15.9447C10.5917 16 10.8363 16 11.3255 16H12.6745C13.1637 16 13.4083 16 13.6385 15.9447C13.8425 15.8957 14.0376 15.8149 14.2166 15.7053C14.4184 15.5816 14.5914 15.4086 14.9373 15.0627L15.0627 14.9373C15.4086 14.5914 15.5816 14.4184 15.7834 14.2947C15.9624 14.1851 16.1575 14.1043 16.3615 14.0553C16.5917 14 16.8363 14 17.3255 14H20M7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.07989 20 7.2V16.8C20 17.9201 20 18.4802 19.782 18.908C19.5903 19.2843 19.2843 19.5903 18.908 19.782C18.4802 20 17.9201 20 16.8 20H7.2C6.0799 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4 18.4802 4 17.9201 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.0799 4 7.2 4Z" stroke="var(--dark-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                        <span>{text[settings.language].verificationRequired}</span>
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
                        <Route path="/saved" element={<SavedThemes settings={settings} setSettings={setSettings} savedList={savedList} setSavedList={setSavedList} />} />
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