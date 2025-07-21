import { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './assets/AuthContext';
import closeModal from './assets/closeModal';
import paths from './assets/json/svg-paths.json';
import text from './assets/json/text.json';

function FontCard({ id, fontFamily, settings, setSettings, fontList, setFontList }) {

    const { authState } = useContext(AuthContext);

    const [loadApply, setLoadApply] = useState(false);
    const [loadDelete, setLoadDelete] = useState(false);

    const deleteRef = useRef(null);

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

    function deleteFont() {
        setLoadDelete(true);
        closeModal(deleteRef);
        axios.delete(
            `${import.meta.env.VITE_API_KEY}/savedfonts/${id}`,
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(response => {
            setFontList(fontList.filter(font => font.id !== Number(response.data)));
            setLoadDelete(false);
        });
    }

    return (
        <>
            <div className="font-card">
                <p style={{ fontFamily: fontFamily }}><span className="font-text">{fontFamily}</span></p>
                <div>
                    {loadApply ? <span className="loader" />
                    : <svg xmlns="http://www.w3.org/2000/svg" onClick={applyFont} viewBox="0 -960 960 960"><title>{text[settings.language].fontCard[0]}</title><path d={paths.applyFont}/></svg>}
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => deleteRef.current.showModal()} viewBox="0 -960 960 960"><title>{text[settings.language].fontCard[1]}</title><path d={paths.delete}/></svg>
                </div>
            </div>

            <dialog closedby="any" ref={deleteRef} disabled={loadDelete} className="confirm">
                <p>{text[settings.language].deleteFont.replace("font", `"${fontFamily}"`)}</p>
                <button onClick={deleteFont}>{
                    loadDelete ? <span className="loader" style={{ width: "1rem", height: "1rem" }} />
                    : text[settings.language].confirm[1]
                }</button>
                <button onClick={() => closeModal(deleteRef)}>{text[settings.language].confirm[2]}</button>
            </dialog>
        </>
    )
}

export default FontCard