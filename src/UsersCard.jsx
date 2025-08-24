import { useNavigate } from 'react-router-dom';
import text from './assets/json/text.json';
import timeSinceJoined from './assets/timeSinceJoined';
import paths from './assets/json/svg-paths.json';

const trophies = ["#ffd700", "#b0b0b0", "#b87333"]

function UsersCard({ user, place, settings }) {

    const navigate = useNavigate();

    return (
        <div className="user-card">
            <div className="name-label">
                {place <= 3 ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill={trophies[place - 1]}><path d={paths.trophy}/></svg>
                : <span>{place}</span>}
                <a onClick={() => navigate(`/user/${user.username}`)}>{user.username}</a>
            </div>
            <div className="count-label" onClick={() => navigate(`/user/${user.username}`)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d={paths.bulb}/></svg>
                <span>{user.bulbCount || 0}</span>
            </div>
        </div>
    )
}

export default UsersCard