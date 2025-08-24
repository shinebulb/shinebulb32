import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UsersCard from './UsersCard';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function Users({ settings, bulb }) {

    const { search, state } = useLocation();
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [user, setUser] = useState("");

    useEffect(() => {

        document.title = text[settings.language].leaderboard;

        const params = new URLSearchParams(search);
        setUser(params.get('user'));

        if (state?.scrollTo) {
            setTimeout(() => {
                const element = document.getElementById(state.scrollTo);
                if (element) {
                    element.scrollIntoView({ block: "center" });
                }
            }, 0);
        }
    
        axios.get(`${import.meta.env.VITE_API_KEY}/users/all`)
        .then(response => setUserList(response.data));
    }, [search, state, navigate]);

    return (
        <motion.div
            className='users'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <div style={{ height: "6rem" }} />
            <h2>{text[settings.language].leaderboard}</h2>
            <div style={{ height: "2rem" }} />
            <div className="users-table">
                {userList
                .sort((a, b) => b.bulbCount - a.bulbCount)
                .map((obj, index) => (
                    <UsersCard
                        key={obj.id}
                        user={obj}
                        place={index + 1}
                        settings={settings}
                        bulb={bulb}
                        selected={user === obj.username}
                    />
                ))}
            </div>
            <div style={{ height: "4rem" }} />
        </motion.div>
    )
}

export default Users