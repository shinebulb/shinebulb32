import axios from 'axios';
import custom from './json/custom.json';

const systemTheme = () => {
    window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ?
    darkTheme() : lightTheme();
}

const lightTheme = () => {
    axios.get(
        `${import.meta.env.VITE_API_KEY}/users/changeTheme`,
        { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then(response => {
        if (response.data.invertTheme && response.data.bulbStatus == "on") {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
        }
        else {
            document.body.classList.remove("dark");
            document.body.classList.add("light");
        }
    });
}

const darkTheme = () => {
    axios.get(
        `${import.meta.env.VITE_API_KEY}/users/changeTheme`,
        { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then(response => {
        if (response.data.invertTheme && response.data.bulbStatus == "on") {
            document.body.classList.remove("dark");
            document.body.classList.add("light");
        }
        else {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
        }
    });
}

const customTheme = () => {
    axios.get(
        `${import.meta.env.VITE_API_KEY}/users/changeTheme`,
        { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then(response => {

        let bg;
        let font;

        document.body.classList.remove("dark");
        document.body.classList.remove("light");
        document.body.classList.add('theme-transition');
        setTimeout(() => document.body.classList.remove('theme-transition'), 500);

        if (response.data.invertTheme && response.data.bulbStatus == "on") {
            bg = response.data.lastFont;
            font = response.data.lastBg;
        }
        else {
            bg = response.data.lastBg;
            font = response.data.lastFont;
        }

        const customProperties = [bg, font, bg, bg, bg, bg, `${font} 3px solid`, `${font} 1px solid`, bg, font, font, font]
        for (let i = 0; i < customProperties.length; i++) {
            document.documentElement.style.setProperty(custom[i], customProperties[i]);
        }
    });
}

const themes = [
    systemTheme, lightTheme, darkTheme, customTheme, () => {}
]

export default themes