import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './assets/AuthContext';
import paths from './assets/json/svg-paths.json';
import text from './assets/json/text.json';

function FontCard({ fontFamily, settings, setSettings }) {

    const { authState } = useContext(AuthContext);

    const [loadApply, setLoadApply] = useState(false);

    function applyFont() {
        setLoadApply(true);
        axios.put(
            `${import.meta.env.VITE_API_KEY}/users/changeFont`,
            { font: fontFamily, id: authState.id },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(response => {
            document.documentElement.style.setProperty("--font-family", response.data);
            setSettings({...settings, font: response.data});
            setLoadApply(false);
        });
    }

    return (
        <div className="font-card">
            <p style={{ fontFamily: fontFamily }}><span className="font-text">{fontFamily}</span></p>
            <div>
                {loadApply ? <span className="loader" />
                : <svg xmlns="http://www.w3.org/2000/svg" onClick={applyFont} viewBox="0 -960 960 960"><title>{text[settings.language].fontCard[0]}</title><path d={paths.applyFont}/></svg>}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><title>{text[settings.language].fontCard[1]}</title><path d={paths.delete}/></svg>
            </div>
        </div>
    )
}

export default FontCard