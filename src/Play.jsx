import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './assets/AuthContext';
import axios from 'axios';
import themes from './assets/themes';
import closeModal from './assets/closeModal';
import paths from './assets/json/svg-paths.json';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function Play({ bulb, settings, setSettings }) {
    const { authState } = useContext(AuthContext);
    const [loadSwitch, setLoadSwitch] = useState(false);
    const [loadReset, setLoadReset] = useState(false);
    const [bulbMuted, setBulbMuted] = useState(parseInt(localStorage.getItem("bulbMuted")) || 0);

    useEffect(() => {
        document.title = text[settings.language].links[0].toLowerCase();
        if ((settings.bulbStatus === "on") && (bulb.current)) bulb.current.classList.add("on");
    }, []);

    const bulbStates = ["off", "on"];
    const navigate = useNavigate();
    const modal = useRef(null);

    function playMilestoneSound(count) {
        if (!bulbMuted) {
            if (count === 100) {
                new Audio('audio/100.mp3').play();
            } else if (count === 1000) {
                new Audio('audio/1000.mp3').play();
            } else if (count === 10000) {
                new Audio('audio/10000.mp3').play();
            }
        }
    }

    function updateCount() {
        if (authState.status) {
            setLoadSwitch(true);
            axios.all([
                axios.put(
                    `${import.meta.env.VITE_API_KEY}/users/count`,
                    { count: settings.bulbCount + Number(!bulbStates.indexOf(settings.bulbStatus)), id: authState.id },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                ),
                axios.put(
                    `${import.meta.env.VITE_API_KEY}/users/bulb`,
                    { status: Number(!bulbStates.indexOf(settings.bulbStatus)) ? "on" : "off", id: authState.id },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                )
            ]).then(axios.spread((count, status) => {
                setSettings({
                    ...settings,
                    bulbCount: count.data,
                    bulbStatus: status.data
                });
                playMilestoneSound(count.data);
                if (!bulbMuted) new Audio(`audio/${status.data}.mp3`).play();
                bulb.current.classList.toggle("on");
                setLoadSwitch(false);
                if (settings.invertTheme) {
                    document.body.classList.add('theme-transition');
                    setTimeout(() => {
                        document.body.classList.remove('theme-transition');
                    }, 200);
                    themes[settings.theme]();
                }
            }));
        }
        else {
            const newCount = settings.bulbStatus === "off" ? settings.bulbCount + 1 : settings.bulbCount;
            setSettings({
                ...settings,
                bulbCount: newCount,
                bulbStatus: settings.bulbStatus === "off" ? "on" : "off"
            });
            playMilestoneSound(newCount);
            if (!bulbMuted) new Audio(`audio/${settings.bulbStatus === "off" ? "on" : "off"}.mp3`).play();
            bulb.current.classList.toggle("on");
            localStorage.setItem("bulbCount", newCount);
            localStorage.setItem("bulbStatus", settings.bulbStatus === "off" ? "on" : "off");
            if (settings.invertTheme) {
                document.body.classList.add('theme-transition');
                setTimeout(() => {
                    document.body.classList.remove('theme-transition');
                }, 200);
                themes[settings.theme]();
            }
        }
    }

    function resetCount() {
        if (authState.status) {
            setLoadReset(true);
            axios.all([
                axios.put(
                    `${import.meta.env.VITE_API_KEY}/users/count`,
                    { count: 0, id: authState.id },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                ),
                axios.put(
                    `${import.meta.env.VITE_API_KEY}/users/bulb`,
                    { status: "off", id: authState.id },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                )
            ]).then(axios.spread((count, status) => {
                setSettings({
                    ...settings,
                    bulbCount: count.data,
                    bulbStatus: status.data
                });
                playMilestoneSound(count.data);
                if (!bulbMuted) new Audio(`audio/off.mp3`).play();
                bulb.current.classList.remove("on");
                closeModal(modal);
                if (settings.invertTheme) {
                    document.body.classList.add('theme-transition');
                    setTimeout(() => {
                        document.body.classList.remove('theme-transition');
                    }, 200);
                    themes[settings.theme]();
                }
            }));
        }
        else {
            setSettings({
                ...settings,
                bulbCount: 0,
                bulbStatus: "off"
            });
            playMilestoneSound(0);
            localStorage.removeItem("bulbCount");
            localStorage.removeItem("bulbStatus");
            if (!bulbMuted) new Audio(`audio/off.mp3`).play();
            bulb.current.classList.remove("on");
            closeModal(modal);
            if (settings.invertTheme) {
                document.body.classList.add('theme-transition');
                setTimeout(() => {
                    document.body.classList.remove('theme-transition');
                }, 200);
                themes[settings.theme]();
            }
        }
    }

    return (
        <motion.div 
            className="play"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            {/* ... rest of your JSX remains the same ... */}
        </motion.div>
    )
}

export default Play;
