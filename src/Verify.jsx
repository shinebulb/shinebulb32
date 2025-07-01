import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function Verify({ settings, setVerificationRequired }) {

    const { search } = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(search);
        const token = params.get('token');

        if (!token) {
            setStatus(1);
            return;
        }

        axios.get(`${import.meta.env.VITE_API_KEY}/users/verify?token=${token}`)
        .then(response => {
            setStatus(Number(response.data.status))
            if (Number(response.data.status) == 3) {
                document.documentElement.style.setProperty("--verification-required-height", "0");
                setVerificationRequired(false);
                localStorage.removeItem("verificationRequired");
            }
        })
        .catch(() => setStatus(2));
    }, [search, navigate]);

    return (
        <motion.div
            className='verify'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <p>{text[settings.language].verifyStatus[status]}</p>
            {status === 1 || status === 2 ?
            <button onClick={() => window.location.reload()}>
                {text[settings.language].verifyActions[0]}
            </button> :
            <button onClick={() => navigate("/login")}>
                {text[settings.language].verifyActions[1]}
            </button>}
        </motion.div>
    );
}

export default Verify