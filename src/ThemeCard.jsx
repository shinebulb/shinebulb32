import React, { useState, useRef, useContext } from 'react';
import { AuthContext } from './assets/AuthContext';
import axios from 'axios';
import closeModal from './assets/closeModal';
import paths from './assets/json/svg-paths.json';
import text from './assets/json/text.json';
import custom from './assets/json/custom.json';

function ThemeCard({ id, index, bg, font, title, savedList, setSavedList, settings, setSettings }) {

    const { authState } = useContext(AuthContext);
    
    const [loadRename, setLoadRename] = useState(false);
    const [loadApply, setLoadApply] = useState(false);
    const [loadDelete, setLoadDelete] = useState(false);

    const [themeName, setThemeName] = useState(title || "");

    const renameRef = useRef(null);
    const deleteRef = useRef(null);

    const inverted = settings.invertTheme && settings.bulbStatus == "on"
    
    const loaderStyles = {
        width: "1.1rem",
        height: "1.1rem",
        borderColor: font,
        borderBottomColor: "transparent"
    }

    const buttonStyles = {
        backgroundColor: inverted ? font : bg,
        border: `${inverted ? bg : font} 3px solid`
    }

    function renameTheme() {
        setLoadRename(true);
        axios.put(
            `${import.meta.env.VITE_API_KEY}/savedthemes/title`,
            { title: themeName, id: id },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(response => {
            setSavedList(savedList.map(theme => 
                theme.id === id ? { ...theme, title: response.data } : theme
            ));
            closeModal(renameRef);
            setLoadRename(false);
        });
    }

    function applyTheme() {
        setLoadApply(true);
        axios.put(
            `${import.meta.env.VITE_API_KEY}/users/theme`,
            { theme: 3, id: authState.id },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(() => {

            setSettings({ ...settings, theme: 3 });

            return axios.put(
                `${import.meta.env.VITE_API_KEY}/users/lastTheme`,
                { lastBg: bg, lastFont: font, id: authState.id },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            )
        }).then(response => {

            let bg;
            let font;

            setLoadApply(false);

            document.body.classList.remove("dark");
            document.body.classList.remove("light");
            document.body.classList.add('theme-transition');
            setTimeout(() => document.body.classList.remove('theme-transition'), 500);

            if (settings.invertTheme && settings.bulbStatus == "on") {
                bg = response.data.lastFont;
                font = response.data.lastBg;
            }
            else {
                bg = response.data.lastBg;
                font = response.data.lastFont;
            }

            const customProperties = [bg, font, bg, bg, bg, bg, `${font} 3px solid`, `${font} 1px solid`, bg, font, font, font]
            for (let i = 0; i < customProperties.length; i++) {
                document.documentElement.style.setProperty(custom[i], customProperties[i]);
            }
        });
    }

    function deleteTheme() {
        setLoadDelete(true);
        closeModal(deleteRef);
        axios.delete(
            `${import.meta.env.VITE_API_KEY}/savedthemes/${id}`,
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(response => {
            setSavedList(savedList.filter(theme => theme.id !== Number(response.data)));
            localStorage.removeItem(`selected${index}`);
            setLoadDelete(false);
        });
    }

    return (
        <div className="theme-card" style={{backgroundColor: inverted ? font : bg, paddingBottom: id ? "0" : "0.8rem"}}>
            <p title={title} style={{
                color: inverted ? bg : font,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
            }}>
                {title || `${text[settings.language].themeCard[0]} #${index + 1}`}
            </p>
            {id ? <div className="saved-controls">
                <button
                    title={text[settings.language].themeCard[1]}
                    style={buttonStyles}
                    onClick={() => renameRef.current.showModal()}
                >
                    <svg fill={inverted ? bg : font} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d={paths.rename[0]}/><path fillRule="evenodd" clipRule="evenodd" d={paths.rename[1]}/></svg>
                </button>
                <button
                    title={text[settings.language].themeCard[2]}
                    style={buttonStyles}
                    onClick={applyTheme}
                    disabled={loadApply}
                >
                    {loadApply ? <span className="loader" style={loaderStyles} />
                    : <svg fill={inverted ? bg : font} version="1.1" id="Uploaded to svgrepo.com" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xmlSpace="preserve"><path className="bentblocks_een" d={paths.paint}/></svg>}
                </button>
                <button
                    title={text[settings.language].themeCard[3]}
                    style={buttonStyles}
                    onClick={() => deleteRef.current.showModal()}
                >
                    <svg fill={inverted ? bg : font} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 482.428 482.429" xmlSpace="preserve"><g><g><path d={paths.delete[0]}/><path d={paths.delete[1]}/><path d={paths.delete[2]}/><path d={paths.delete[3]}/></g></g></svg>
                </button>
                
                <dialog closedby="any" ref={renameRef} className="confirm" style={buttonStyles}>
                    <input type="text" placeholder={text[settings.language].savedDialogs[0]} style={{...buttonStyles, color: inverted ? bg : font}} value={themeName} onChange={event => setThemeName(event.target.value)} />
                    <button onClick={renameTheme} disabled={loadRename} style={{...buttonStyles, color: inverted ? bg : font}}>{
                        loadRename ? <span className="loader" style={{ width: "1rem", height: "1rem", borderColor: inverted ? bg : font, borderBottomColor: "transparent" }} />
                        : text[settings.language].themeControls[0]
                    }</button>
                    <button onClick={() => closeModal(renameRef)} style={{...buttonStyles, color: inverted ? bg : font}}>{text[settings.language].themeControls[1]}</button>
                </dialog>
                <dialog closedby="any" ref={deleteRef} disabled={loadDelete} className="confirm" style={buttonStyles}>
                    <p style={{color: inverted ? bg : font}}>{text[settings.language].savedDialogs[1]}</p>
                    <button onClick={deleteTheme} style={{...buttonStyles, color: inverted ? bg : font}}>{
                        loadDelete ? <span className="loader" style={{ width: "1rem", height: "1rem", borderColor: inverted ? bg : font, borderBottomColor: "transparent" }} />
                        : text[settings.language].confirm[1]
                    }</button>
                    <button onClick={() => closeModal(deleteRef)} style={{...buttonStyles, color: inverted ? bg : font}}>{text[settings.language].confirm[2]}</button>
                </dialog>
            </div> :
            <button className="reload-to-access" onClick={() => window.location.reload()} style={{...buttonStyles, color: inverted ? bg : font}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill={inverted ? bg : font}><path d={paths.refresh}/></svg>
                <span>{text[settings.language].refreshPage}</span>
            </button>}
        </div>
    )
}

export default ThemeCard