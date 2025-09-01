import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import RepoMenu from './RepoMenu';
import text from './assets/json/text.json';
import version from './assets/json/version.json';
import { motion } from 'framer-motion';

function DevPage({ settings }) {

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
            <div style={{height: "2rem"}}/>
            <p className="version">v{version}</p>
            <p className="p3" style={{fontWeight: "bold", margin: "1rem 0"}}>{text[settings.language].devSides[0]}</p>
            <RepoMenu settings={settings} />
            <div style={{height: "2rem"}}/>
            <Link to="/">{text[settings.language].back}</Link>
        </motion.div>
    )
}

export default DevPage