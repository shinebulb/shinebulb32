import { Link } from 'react-router-dom';
import text from './assets/json/text.json';

function LogInToView({ settings }) {
    return (
        <>
            <img src="img/off.svg" className="background-bulb" />
            <div className="log-in-to-view">
                <p>{text[settings.language].logInToView}</p>
                <Link to="/signup">{text[settings.language].auth[1]}</Link>
                <Link to="/login">{text[settings.language].auth[0]}</Link>
            </div>
        </>
    )
}

export default LogInToView