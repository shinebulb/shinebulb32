import paths from './assets/json/svg-paths.json';
import text from './assets/json/text.json';

function FontCard({ fontFamily, settings }) {
    return (
        <div className="font-card">
            <p style={{ fontFamily: fontFamily }}><span className="font-text">{fontFamily}</span></p>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><title>{text[settings.language].fontCard[0]}</title><path d={paths.applyFont}/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><title>{text[settings.language].fontCard[1]}</title><path d={paths.delete}/></svg>
            </div>
        </div>
    )
}

export default FontCard