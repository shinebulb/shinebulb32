import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NoThemes from './NoThemes';
import SavedFontsLoader from './SavedFontsLoader';
import { AuthContext } from './assets/AuthContext';
import getFontUrl from './assets/getFontUrl';
import editingField from './assets/editingField';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';
import FontCard from './FontCard';
import LogInToView from './LogInToView';

function SavedFonts({ settings, setSettings, fontList, setFontList }) {

    const navigate = useNavigate();

    const { authState } = useContext(AuthContext);

    useEffect(() => {
        document.title = text[settings.language].links[9];
        document.addEventListener("keydown", navigateSettings);
        axios.get(`${import.meta.env.VITE_API_KEY}/savedfonts/byUser/${authState.id}`)
        .then(response => {
            if (response !== undefined) setFontList(response.data);
        });

        return () => document.removeEventListener("keydown", navigateSettings);
    }, []);

    function navigateSettings(event) {
        const key = event.key.toLowerCase();
        if (editingField(event.target)) return;
        if (key == "f" || key == "а") navigate("/settings");
    }

    return (
        <motion.div
            className='saved'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            {!authState.status ? <LogInToView settings={settings} /> 
            : <>
                {fontList.length > 0 && <SavedFontsLoader fontList={fontList.map(fontObj => getFontUrl(fontObj.fontFamily))} />}
                <h2 style={{fontSize: "1.9rem", marginTop: "6rem"}}>{text[settings.language].links[9]}</h2>
                <h3 style={{color: "var(--font)", fontStyle: "italic", marginBottom: "2rem"}}>
                    {fontList.length} {text[settings.language].savedThemes[1]}
                </h3>
                {fontList.length > 0 ? <div className="saved-display">{
                    fontList.map((fontObj, index) =>
                        <FontCard
                            key={index}
                            id={fontObj.id}
                            fontFamily={fontObj.fontFamily}
                            settings={settings}
                            setSettings={setSettings}
                            fontList={fontList}
                            setFontList={setFontList}
                        />
                    )
                }</div>
                : <NoThemes text={text[settings.language].noFonts} />}
                <div style={{height: "1.5rem"}}/>
                <Link to="/settings" id="saved-back-link">{text[settings.language].back}</Link>
                <div style={{height: "2rem"}} />
            </>}
        </motion.div>
    )
}

export default SavedFonts