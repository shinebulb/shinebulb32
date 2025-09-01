import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './assets/AuthContext';
import axios from 'axios';
import themes from './assets/themes';
import closeModal from './assets/closeModal';
import defaultLang from './assets/defaultLang';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';
import { motion } from 'framer-motion';

function LogIn({ bulb, settings, setSettings, setSavedList, setVerificationRequired }) {

    const { authState, setAuthState } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = text[settings.language].auth[0];
    }, []);


    const [loginValue, setLoginValue] = useState("");
    const [password, setPassword] = useState("");

    const [fieldType, setFieldType] = useState("password");

    const [errorText, setErrorText] = useState(0);
    const [loadLogIn, setLoadLogIn] = useState(false);

    const alertRef = useRef(null);

    function login() {
        let id = 0;
        setLoadLogIn(true);
        axios.post(`${import.meta.env.VITE_API_KEY}/users/login`, {
            loginValue: loginValue,
            password: password
        })
        .then(response => {
            if (response.data.error) {
                setLoadLogIn(false);
                setErrorText(Number(response.data.error));
                alertRef.current.showModal();
                setTimeout(() => closeModal(alertRef), 1500);
            }
            else {
                if (localStorage.getItem("verificationRequired") === "1") {
                    localStorage.setItem("verificationRequired", "");
                    setVerificationRequired(false);
                    document.documentElement.style.setProperty("--verification-required-height", "0");
                }
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({
                    username: response.data.username,
                    id: response.data.id,
                    status: true
                });
                if (localStorage.getItem("currentPage") === "/signup") navigate("/");
                else navigate(localStorage.getItem("currentPage") || "/");
                localStorage.removeItem("currentPage");
                id = response.data.id;
                return axios.get(
                    `${import.meta.env.VITE_API_KEY}/users/settings/${id}`,
                    { headers: { accessToken: response.data.token } }
                );
            }
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
                themes[response.data.theme === null ? settings.theme : response.data.theme]();
                document.documentElement.style.setProperty("--font-family", response.data.font || "Roboto Slab");
                if ((response.data.bulbStatus === "on") && (bulb.current)) bulb.current.classList.add("on");
                return axios.get(`${import.meta.env.VITE_API_KEY}/savedthemes/byUser/${response.data.id}`);
            }
            else {
                themes[parseInt(localStorage.getItem("theme")) || 0]();
                document.documentElement.style.setProperty("--font-family", "Roboto Slab");
                setSettings({
                    bulbCount: 0,
                    bulbStatus: "off",
                    language: localStorage.getItem("language") === null ? defaultLang() : parseInt(localStorage.getItem("language")),
                    theme: parseInt(localStorage.getItem("theme")) || 0,
                    invertTheme: parseInt(localStorage.getItem("invertTheme")) || 0,
                    font: localStorage.getItem("font") || "Roboto Slab"
                });
            }
        }).then(response => {
            if (response !== undefined) setSavedList(response.data);
        });
    }

    return (
        <motion.div
            className='auth'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            {!authState.status ?
            <>
                <div style={{height: "3rem"}}/>
                <form className="login-form">
                    <label>{text[settings.language].login[0]}:</label>
                    <input
                        type="text"
                        onChange={event => setLoginValue(event.target.value)}
                        value={loginValue}
                        placeholder={text[settings.language].login[1]}
                    />
                    <label>{text[settings.language].signup[4]}:</label>
                    <div className="password-field">
                        <input
                            type={fieldType}
                            onChange={event => setPassword(event.target.value)}
                            value={password}
                            placeholder={text[settings.language].login[2]}
                        />
                        {fieldType === "password"
                        ? <svg onClick={() => setFieldType("text")} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d={paths.hide[0]}/></svg>
                        : <svg onClick={() => setFieldType("password")} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d={paths.hide[1]}/></svg>}
                    </div>
                    <button type="submit" onClick={login} disabled={loadLogIn || password == "" || loginValue == ""}>{
                        loadLogIn ? <span className="loader" style={{ width: "1.6rem", height: "1.6rem" }} />
                        : text[settings.language].auth[0]
                    }</button>
                </form>

                <dialog closedby="any"
                    className="save-alert"
                    ref={alertRef}
                    style={{
                        backgroundColor: "var(--light-red)",
                        color: "var(--dark-red)",
                        marginTop: "5rem"
                    }}
                >
                    <div>
                        <p>{text[settings.language].authNotifications[errorText]}</p>
                        <button onClick={() => closeModal(alertRef)}>
                            <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" strokeWidth="1" fill="var(--dark-red)" fillRule="evenodd"><g id="work-case" transform="translate(91.520000, 91.520000)"><polygon id="Close" points={paths.cancel} /></g></g></svg>
                        </button>
                    </div>
                </dialog>
            </>
            : <div className="logged-in">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d={paths.loggedIn}/></svg>
                <h2 style={{width: "100%"}}>{text[settings.language].authErrors[11]}</h2>
            </div>}
        </motion.div>
    )
}

export default LogIn