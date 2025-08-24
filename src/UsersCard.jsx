import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import text from './assets/json/text.json';
import on from './assets/svg/on.svg';
import off from './assets/svg/off.svg';
import timeSinceJoined from './assets/timeSinceJoined';
import paths from './assets/json/svg-paths.json';
import closeModal from './assets/closeModal';

const trophies = ["#ffd700", "#b0b0b0", "#b87333"]

function UsersCard({ user, place, settings, bulb }) {

    const navigate = useNavigate();

    const userBio = useRef(null);

    const bg = Number(user.invertTheme && user.bulbStatus == "on") || 0;
    const font = Number(!user.invertTheme || user.bulbStatus != "on") || 0;

    const userTheme = [
        ["var(--modal-bg)", "#f4f0e8", "#171717", user.lastBg],
        ["var(--font)", "#232323", "#dcdcdc", user.lastFont]
    ];

    return (
        <div className="user-card" onMouseLeave={() => closeModal(userBio)}>
            <div className="name-label">
                {place <= 3 ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill={trophies[place - 1]}><path d={paths.trophy}/></svg>
                : <span>{place}</span>}
                <a
                    onClick={() => navigate(`/user/${user.username}`)}
                    onMouseEnter={() => userBio.current.show()}
                >
                    {user.username}
                </a>
            </div>
            <div className="count-label" onClick={() => navigate(`/user/${user.username}`)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d={paths.bulb}/></svg>
                <span>{user.bulbCount || 0}</span>
            </div>

            <dialog
                ref={userBio}
                closedby="any"
                className="user-bio"
                onMouseEnter={() => userBio.current.show()}
                onMouseLeave={() => closeModal(userBio)}
                style={{ backgroundColor: userTheme[bg][user.theme || 0] }}
            >
                <div className="bio-container">
                    <div className="play">
                        <img ref={bulb} className={user.bulbStatus} src={user.bulbStatus == "on" ? on : off} />
                    </div>
                    <div className="bio-description">
                        <a
                            onClick={() => navigate(`/user/${user.username}`)}
                            style={{ color: userTheme[font][user.theme || 0] }}
                        >
                            {user.username}
                        </a>
                        <div className="count-label">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill={userTheme[font][user.theme || 0]}><path d={paths.bulb}/></svg>
                            <span style={{ color: userTheme[font][user.theme || 0] }}>{user.bulbCount || 0}</span>
                        </div>
                        <span style={{ color: userTheme[font][user.theme || 0] }}>
                            {text[settings.language].joined} {timeSinceJoined(user.createdAt, settings.language)}
                        </span>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default UsersCard