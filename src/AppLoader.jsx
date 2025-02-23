import React from 'react';
import './ImageTransition.css';

function AppLoader() {
    return (
        <div className="image-transition-wrapper">
            <img src="img/off.svg" height="200" className="background-image" />
            <div 
                className="overlay-container" 
                style={{ animation: "revealAnimation 1500ms linear infinite" }}
            >
                <img src="img/on.svg" height="200" className="overlay-image" />
            </div>
        </div>
    )
}

export default AppLoader