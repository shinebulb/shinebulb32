import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RepoMenu from './RepoMenu';
import text from './assets/json/text.json';
import version from './assets/json/version.json';
import { motion } from 'framer-motion';

function DevPage({ settings }) {

    const navigate = useNavigate();

    useEffect(() => {
        document.title = text[settings.language].links[8];
    }, []);

    return (
        <motion.div
            className='devpage'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <p className="version">v{version}</p>
            <p className="p3" style={{fontSize: "1.7rem", fontWeight: "bold", margin: "1rem 0"}}>{text[settings.language].devSides[0]}</p>
            <RepoMenu />
            <div style={{height: "2rem"}}/>
            <a onClick={() => navigate("/")}>{text[settings.language].back}</a>
        </motion.div>
    )
}

export default DevPage