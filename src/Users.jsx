import { useState, useEffect } from 'react';
import axios from 'axios';
import UsersCard from './UsersCard';
import { motion } from 'framer-motion';

function Users({ settings }) {

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_KEY}/users/all`)
        .then(response => setUserList(response.data));
    });

    return (
        <motion.div
            className='users'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            {userList.map(user => <UsersCard key={user.id} user={user} />)}
        </motion.div>
    )
}

export default Users