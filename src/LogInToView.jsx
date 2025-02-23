import React from 'react';
import { useNavigate } from 'react-router-dom';
import text from './assets/json/text.json';

function LogInToView({ settings }) {

    const navigate = useNavigate();

    return (
        <>
            <img src="img/off.svg" className="background-bulb" />
            <div className="log-in-to-view">
                <p>{text[settings.language].logInToView}</p>
                <button onClick={() => navigate("/signup")}>{text[settings.language].auth[1]}</button>
                <button onClick={() => navigate("/login")}>{text[settings.language].auth[0]}</button>
            </div>
        </>
    )
}

export default LogInToView