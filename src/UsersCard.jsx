import { useNavigate } from 'react-router-dom';
import text from './assets/json/text.json';

function UsersCard({ user }) {

    const navigate = useNavigate();

    return (
        <div className="user-card">
            <a onClick={() => navigate(`/user/${user.username}`)}>{user.username}</a>
        </div>
    )
}

export default UsersCard