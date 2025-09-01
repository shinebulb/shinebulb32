import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function Support({ settings }) {
    
    useEffect(() => {
        document.title = text[settings.language].links[3];
    }, []);

    return (
        <motion.div
            className='support'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <a className="donate-button" href={`https://nowpayments.io/donation?api_key=${import.meta.env.VITE_DONATION_API_KEY}`} target="_blank" rel="noreferrer noopener">
                <span>{text[settings.language].donate}</span>
                <img src="img/donate.svg"/>
            </a>
            <div style={{height: "1rem"}}/>
            <Link to="/">{text[settings.language].back}</Link>
        </motion.div>
    )
}

export default Support