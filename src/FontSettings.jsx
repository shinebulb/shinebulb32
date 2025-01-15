import React from 'react';
import { useNavigate } from 'react-router-dom';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function FontSettings({ settings, setSettings }) {
    return (
        <motion.div
            className='fonts'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <p className="p1">this section is in progress!</p>
        </motion.div>
    )
}

export default FontSettings