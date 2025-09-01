import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './assets/AuthContext';
import ProfileFontLoader from './ProfileFontLoader';
import closeModal from './assets/closeModal';
import getFontUrl from './assets/getFontUrl';
import axios from 'axios';
import fonts from './assets/json/fonts.json';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';
import on from './assets/svg/on.svg';
import off from './assets/svg/off.svg';
import { motion } from 'framer-motion';

function Profile({ settings, bulb }) {
    
    const navigate = useNavigate();

    const { authState } = useContext(AuthContext);

    const [user, setUser] = useState({});

    const [width, setWidth] = useState(window.innerWidth);
    
    const [loadUser, setLoadUser] = useState(false);

    const [bgCopied, setBgCopied] = useState(false);
    const [strokeCopied, setStrokeCopied] = useState(false);
    const [fontCopied, setFontCopied] = useState(false);

    const copyModal = useRef(null);

    const { username } = useParams();
    
    useEffect(() => {
        setLoadUser(true);
        setBgCopied(false);
        setStrokeCopied(false);
        setFontCopied(false);
        document.title = `${username} — shinebulb`;
        window.addEventListener("resize", () => setWidth(window.innerWidth));
        axios.get(`${import.meta.env.VITE_API_KEY}/users/userinfo/${username}`)
        .then(response => {
            if (response.data) {
                setUser(response.data);
                setLoadUser(false);
            }
            else {
                navigate("/user");
            }
        });
        return () =>  window.removeEventListener("resize", () => setWidth(window.innerWidth));
    }, [username]);

    const customFont = !fonts.includes(user?.font);
    const customTheme = user?.theme == 3;

    const userMatch = authState.username === username;

    const userFont = user?.font || settings.font;

    const bg = Number(user?.invertTheme && user?.bulbStatus == "on") || 0;
    const font = Number(!user.invertTheme || user.bulbStatus != "on") || 0;

    const userTheme = [
        ["transparent", "#f4f0e8", "#171717", user?.lastBg],
        ["var(--font)", "#232323", "#dcdcdc", user?.lastFont]
    ];

    const locales = ["en-us", "ru-ru"];

    async function share() {
        if (!navigator.share) {
            navigator.clipboard.writeText(window.location.href);
            return;
        }

        try {
            await navigator.share({
                title: `${text[settings.language].shinebulbProfile}: ${username}`,
                text: `${text[settings.language].shareProfileText[Number(!userMatch)][0].replace("user", username)} ${user?.bulbCount || 0} ${text[settings.language].shareProfileText[Number(!userMatch)][1]}`,
                url: window.location.href,
            });
        }
        catch (err) {
            navigator.clipboard.writeText(window.location.href);
        }
    }
    
    return (
        <motion.div
            className='profile'
            style={{
                height: width >= 600 ? "260px" : (settings.language === 1 ? "420px" : "380px"),
                backgroundColor: (!loadUser && userTheme[bg][user?.theme || 0]),
                border: (!loadUser && `${userTheme[font][user?.theme || 0]} 3px solid`)
            }}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            {loadUser ? <span className="loader" style={{width: "5rem", height: "5rem", borderWidth: "7px", margin: "auto"}} />
            : <>
                {!fonts.includes(userFont) && <ProfileFontLoader profileFont={getFontUrl(userFont)} />}
                <button
                    className="user-actions"
                    title={text[settings.language].userActions[2]}
                    onClick={() => navigate(`/leaderboard?user=${username}`, { state: { scrollTo: "selected" } })}
                    style={{
                        top: width >= 600 ? "calc(50% - 202px)" : (settings.language === 1 ? "calc(50% - 274px)" : "calc(50% - 254px)"),
                        left:  width >= 600 ? "calc(50% + 88px)" : "calc(50% - 10px)",
                        backgroundColor: userTheme[bg][user?.theme || 0],
                        border: `${userTheme[font][user?.theme || 0]} 3px solid`,
                        borderRight: "none",
                        borderRadius: width >= 600 ? "15px 0 0 0" : "12px 0 0 0"
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill={userTheme[font][user?.theme || 0]}><path d={paths.public} /></svg>
                </button>
                {(customTheme || user?.font) && <button
                    className="user-actions"
                    title={text[settings.language].userActions[0]}
                    onClick={() => copyModal.current.showModal()}
                    style={{
                        top: width >= 600 ? "calc(50% - 202px)" : (settings.language === 1 ? "calc(50% - 274px)" : "calc(50% - 254px)"),
                        left:  width >= 600 ? "calc(50% + 144px)" : "calc(50% + 35px)",
                        backgroundColor: userTheme[bg][user?.theme || 0],
                        border: `${userTheme[font][user?.theme || 0]} 3px solid`,
                        borderRight: "none",
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d={paths.copy[0]} fill={userTheme[font][user?.theme || 0]}></path><path d={paths.copy[1]} fill={userTheme[font][user?.theme || 0]}></path></g></svg>
                </button>}
                <button
                    className="user-actions"
                    title={text[settings.language].userActions[1]}
                    onClick={share}
                    style={{
                        top: width >= 600 ? "calc(50% - 202px)" : (settings.language === 1 ? "calc(50% - 274px)" : "calc(50% - 254px)"),
                        left:  width >= 600 ? "calc(50% + 200px)" : "calc(50% + 80px)",
                        backgroundColor: userTheme[bg][user?.theme || 0],
                        border: `${userTheme[font][user?.theme || 0]} 3px solid`,
                        borderRadius: customTheme || user?.font ? (width >= 600 ? "0 15px 0 0" : "0 12px 0 0") : (width >= 600 ? "15px 15px 0 0" : "12px 12px 0 0")
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill={userTheme[font][user?.theme || 0]}><path d={paths.share}/></svg>
                </button>
                <div className="play">
                    <img ref={bulb} className={user.bulbStatus} src={user.bulbStatus == "on" ? on : off} />
                </div>
                <div className="user-info" style={{fontFamily: userFont}}>
                    <h1 style={{color: userTheme[font][user?.theme || 0]}}>{username}</h1>
                    <h2 className="joined" style={{color: userTheme[font][user?.theme || 0]}}>
                        {text[settings.language].joined} {
                        new Date(user.createdAt)
                        .toLocaleDateString(locales[settings.language], {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })
                        .toLowerCase()
                    }</h2>
                    <h2 id="counter" style={{color: userTheme[font][user?.theme || 0]}}>
                        <span style={{fontWeight: "normal"}}>{text[settings.language].bulbCount}: </span>
                        <span style={{fontStyle: "italic"}}>{user.bulbCount || 0}</span>
                    </h2>
                </div>
                {userMatch &&
                <Link
                    to="/changepassword"
                    className="change-password"
                    style={{
                        top: width >= 600 ? "calc(50% + 146px)" : (settings.language === 1 ? "calc(50% + 226px)" : "calc(50% + 206px)"),
                    }}
                >
                    {text[settings.language].changePassword[0]}
                </Link>}
            </>}
            <dialog closedby="any" ref={copyModal} className="copy-modal">
                <h2>{text[settings.language].pickCopyColors[0]}</h2>
                <hr />
                <div
                    className="copy-section"
                    style={{color: userTheme[font][user?.theme || 0]}}
                    onClick={() => {
                        if (customTheme) {
                            navigator.clipboard.writeText(userTheme[bg][user?.theme || 0])
                            .then(() => setBgCopied(true));
                        }
                    }}
                >
                    <div className="color-display" style={
                        customTheme ?
                        {backgroundColor: userTheme[bg][user?.theme || 0]} :
                        {
                            background: `repeating-conic-gradient(var(--modal-button-bg) 0deg 90deg, var(--font) 90deg 180deg)`,
                            backgroundSize: `16px 16px`
                        }
                    }/>
                    <div>
                        <svg style={{display: bgCopied ? "block" : "none"}} className="asset-copied" id="bg-copied" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} stroke="var(--button-font)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {customTheme ? <>
                            <p style={{fontWeight: "bold"}}>{userTheme[bg][user?.theme || 0]}</p>
                            <p style={{fontStyle: "italic"}}>{text[settings.language].pickCopyColors[1]}</p>
                        </> :
                        <p style={{fontStyle: "italic"}}>
                            {text[settings.language].userThemeStatus[Number(userMatch)]}
                        </p>}
                    </div>
                </div>
                <div
                    className="copy-section"
                    style={{color: userTheme[bg][user?.theme || 0]}}
                    onClick={() => {
                        if (customTheme) {
                            navigator.clipboard.writeText(userTheme[font][user?.theme || 0])
                            .then(() => setStrokeCopied(true));
                        }
                    }}
                >
                    <div className="color-display" style={
                        customTheme ?
                        {backgroundColor: userTheme[font][user?.theme || 0]} :
                        {
                            background: `repeating-conic-gradient(var(--modal-button-bg) 0deg 90deg, var(--font) 90deg 180deg)`,
                            backgroundSize: `16px 16px`
                        }
                    } />
                    <div>
                        <svg style={{display: strokeCopied ? "block" : "none"}} className="asset-copied" id="stroke-copied" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} stroke="var(--button-font)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {customTheme ? <>
                            <p style={{fontWeight: "bold"}}>{userTheme[font][user?.theme || 0]}</p>
                            <p style={{fontStyle: "italic"}}>{text[settings.language].pickCopyColors[2]}</p>
                        </> :
                        <p style={{fontStyle: "italic"}}>
                            {text[settings.language].userThemeStatus[Number(userMatch)]}
                        </p>}
                    </div>
                </div>
                <hr />
                <div
                    className="copy-section"
                    style={{color: "var(--button-font)"}}
                    onClick={() => {
                        if (customFont) navigator.clipboard.writeText(userFont).then(() => setFontCopied(true))
                    }}
                >
                    <div className="color-display" style={{backgroundColor: "var(--modal-button-bg)"}}>
                        <span style={{fontFamily: userFont}}>{userFont.toLowerCase()}</span>
                    </div>
                    <div>
                        <svg style={{display: fontCopied ? "block" : "none"}} className="asset-copied" id="font-copied" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} stroke="var(--button-font)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <p style={{fontStyle: "italic"}}>
                            {userMatch ? text[settings.language].yourFontStatus[Number(customFont)] : text[settings.language].userFontStatus[Number(customFont)]}
                        </p>
                    </div>
                </div>
                <hr />
                <div onClick={() => closeModal(copyModal)} className="close-copy">{text[settings.language].close}</div>
            </dialog>
        </motion.div>
    )
}

export default Profile