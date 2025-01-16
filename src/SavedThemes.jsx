import React, { useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './assets/AuthContext';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';
import { motion } from 'framer-motion';
import NoThemes from './NoThemes';
import ThemeCard from './ThemeCard';
import LogInToView from './LogInToView';

function SavedThemes({ settings, setSettings, savedList, setSavedList }) {

    const { authState } = useContext(AuthContext);

    useEffect(() => {
        document.title = text[settings.language].links[5];
        axios.get(`${import.meta.env.VITE_API_KEY}/savedthemes/byUser/${authState.id}`)
        .then(response => {
            if (response !== undefined) setSavedList(response.data);
        });
    }, []);

    const navigate = useNavigate();

    const exportModal = useRef(null);

    const inverted = settings.invertTheme && settings.bulbStatus == "on";
    
    return (
        <motion.div
            className='saved'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >{!authState.status ? <LogInToView settings={settings} />
            : <>
                <h2 style={{fontSize: "1.7rem", marginTop: "6rem"}}>{text[settings.language].savedThemes[0]}</h2>
                <h3 style={{color: "var(--font)", fontStyle: "italic", marginBottom: "2rem"}}>
                    {savedList.length} {text[settings.language].savedThemes[1]}
                </h3>
                {inverted &&
                <div style={{color: "var(--font)", fontStyle: "italic", margin: "-0.2rem 0 1.7rem 0", justifyContent: "center"}}>
                    ({text[settings.language].themeCurrentlyInverted})
                </div>}
                {savedList.length > 0
                ? <div className="saved-display">{
                    savedList.map((theme, index) => 
                        <ThemeCard
                            key={index}
                            id={theme.id}
                            index={index}
                            bg={theme.bg}
                            font={theme.font}
                            title={theme.title}
                            savedList={savedList}
                            setSavedList={setSavedList}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    )
                }</div>
                : <NoThemes settings={settings} />}
                <div style={{height: "0.5rem"}}/>
                <div className="collection-actions">
                    <button onClick={() => exportModal.current.showModal()}>
                        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--button-font)" strokeWidth="4.48"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.376"><polyline points="48 24 32 8 16 24"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="48" x2="32" y2="8"></line></g><g id="SVGRepo_iconCarrier"><polyline points="48 24 32 8 16 24"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="48" x2="32" y2="8"></line></g></svg>
                        {text[settings.language].collectionActions[0]}
                    </button>
                    <button>
                        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--button-font)" strokeWidth="4.48"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.376"><polyline points="16 32 32 48 48 32"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="8" x2="32" y2="48"></line></g><g id="SVGRepo_iconCarrier"><polyline points="16 32 32 48 48 32"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="8" x2="32" y2="48"></line></g></svg>
                        {text[settings.language].collectionActions[1]}
                    </button>
                </div>
                <div style={{height: "1.5rem"}}/>
                <a onClick={() => navigate("/settings")} id="saved-back-link">{text[settings.language].back}</a>
                <div style={{height: "2rem"}} />

                <dialog ref={exportModal} className="export-modal">
                    <p className="export-title">choose themes to export:</p>
                    <hr style={{marginBottom: "1rem"}} />
                    {savedList.map((theme, index) => 
                        <div className="theme-preview" key={index}>
                            <p style={{backgroundColor: theme.bg, color: theme.font}}>
                                {theme.title}
                            </p>
                            <button>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                        </div>
                    )}
                    <div className="export-options">
                        <button>
                            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--button-font)" strokeWidth="4.48"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.376"><polyline points="48 24 32 8 16 24"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="48" x2="32" y2="8"></line></g><g id="SVGRepo_iconCarrier"><polyline points="48 24 32 8 16 24"></polyline><line x1="56" y1="56" x2="8" y2="56"></line><line x1="32" y1="48" x2="32" y2="8"></line></g></svg>
                            download
                        </button>
                        <button>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d={paths.copy[0]} fill="var(--button-font)"></path><path d={paths.copy[1]} fill="var(--button-font)"></path></g></svg>
                            copy
                        </button>
                    </div>
                    <hr />
                    <button id="close-export-modal" onClick={() => exportModal.current.close()}>{text[settings.language].close}</button>
                </dialog>
            </>
        }</motion.div>
    )
}

export default SavedThemes