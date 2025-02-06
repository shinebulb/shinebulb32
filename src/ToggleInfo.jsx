import paths from './assets/json/svg-paths.json';
import closeModal from './assets/closeModal';
import text from './assets/json/text.json';

function ToggleInfo({ info, settings }) {
    return (
        <dialog className="toggle-info-modal" ref={info}>
            <p>{text[settings.language].toggleInfo[0]}</p>
            <p>{text[settings.language].toggleInfo[1]}</p>
            <p>{text[settings.language].toggleInfo[2]}</p>
            <hr />
            <button onClick={() => closeModal(info)}>{text[settings.language].close}</button>
        </dialog>
    )
}

export default ToggleInfo