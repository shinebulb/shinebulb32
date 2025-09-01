import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function NoPage({ settings }) {
    
    useEffect(() => {
        document.title = text[settings.language].links[7];
    }, []);
    
    return (
        <motion.div
            className='no-page'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <div className="no-page-text">
                <div>
                    <p style={{fontWeight: "bold"}}>
                        {text[settings.language].pageNotFound[0]}
                    </p>
                    <p style={{fontSize: "1.1rem", fontStyle: "italic", margin: "0.5rem 0"}}>
                        {text[settings.language].pageNotFound[1]}
                    </p>
                    <div className="no-page-links">
                        <Link to="/">{text[settings.language].home}</Link>
                        <Link to="/play">{text[settings.language].links[0].toLowerCase()}</Link>
                        <Link to="/settings">{text[settings.language].links[1]}</Link>
                        <Link to="/about">{text[settings.language].links[2]}</Link>
                        <Link to="/support">{text[settings.language].links[3]}</Link>
                    </div>
                </div>
                <img title="sauron" src="https://i.pinimg.com/originals/20/bc/ac/20bcacc9571e85a27bef9cbfad961b4a.png" />
            </div>
        </motion.div>
    )
}

export default NoPage