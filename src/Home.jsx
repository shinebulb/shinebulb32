import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import UBulb from './UBulb';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function Home({ settings }) {

    useEffect(() => {
        document.title = "shinebulb";
    }, []);

    return (
        <motion.div
            className='home'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <div className="header">
                <p className="p2">shineb</p><UBulb /><p className="p2">lb</p>
            </div>
            <div className="links">
                <Link to="/play">{text[settings.language].links[0]}</Link>
                <Link to="/settings">{text[settings.language].links[1]}</Link>
                <Link to="/about">{text[settings.language].links[2]}</Link>
                <Link to="/support">{text[settings.language].links[3]}</Link>
            </div>
            <Link to="/development" id="source">{text[settings.language].links[8]}</Link>
        </motion.div>
    )
}

export default Home