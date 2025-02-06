import { useNavigate } from 'react-router-dom';
import closeModal from './assets/closeModal';
import paths from './assets/json/svg-paths.json';
import text from './assets/json/text.json';

function More({ more, settings }) {

    const navigate = useNavigate();

    return (
        <dialog className="more" ref={more}>
            <div className="options">
                <div onClick={() => {
                    more.current.close();
                    navigate("/fonts");
                }}>
                    <p>
                    <svg id="font-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.7"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.256"></g><g id="SVGRepo_iconCarrier"><path d={paths.font}></path></g></svg>
                        {text[settings.language].fontSettings}
                    </p>
                    <span>{text[settings.language].optionDescriptions[1]}</span>
                </div>
                <hr />
                <div onClick={() => {
                    more.current.close();
                    navigate("/saved");
                }}>
                    <p>
                        <svg id="saved-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.save} strokeWidth="2" strokeLinejoin="round"/></svg>
                        {text[settings.language].saved}
                    </p>
                    <span>{text[settings.language].optionDescriptions[0]}</span>
                </div>
                <hr />
                <button onClick={() => more.current.close()}>{text[settings.language].back}</button>
            </div>
        </dialog>
    )
}

export default More