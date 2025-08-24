import { useState, useEffect } from 'react';
import axios from 'axios';
import UsersCard from './UsersCard';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function Users({ settings }) {

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_KEY}/users/all`)
        .then(response => setUserList(response.data));
    }, []);

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
                .map((obj, index) => <UsersCard key={obj.id} user={obj} place={index + 1} settings={settings} />)}
            </div>
            <div style={{ height: "4rem" }} />
        </motion.div>
    )
}

export default Users