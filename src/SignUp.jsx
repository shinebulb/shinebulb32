import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './assets/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import closeModal from './assets/closeModal';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';
import { motion } from 'framer-motion';

function SignUp({ settings, setVerificationRequired }) {

    const { authState } = useContext(AuthContext);

    const [passwordFieldType, setPasswordFieldType] = useState("password");
    const [confirmFieldType, setConfirmFieldType] = useState("password");
    const [errorText, setErrorText] = useState(0);
    
    const [loadSignUp, setLoadSignUp] = useState(false);

    useEffect(() => {
        document.title = text[settings.language].auth[1];
    }, []);

    const navigate = useNavigate();

    const alertRef = useRef(null);

    const initialValues = {
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    };

    const validationSchema = Yup.object().shape({
        email: Yup
            .string()
            .trim()
            .lowercase()
            .required(text[settings.language].authErrors[0])
            .email(text[settings.language].authErrors[1]),
        username: Yup
            .string()
            .trim()
            .required(text[settings.language].authErrors[2])
            .min(3, text[settings.language].authErrors[3])
            .max(15, text[settings.language].authErrors[4])
            .matches(/^[A-Za-z0-9_]+$/, text[settings.language].authErrors[5]),
        password: Yup
            .string()
            .required(text[settings.language].authErrors[6])
            .min(8, text[settings.language].authErrors[7])
            .max(30, text[settings.language].authErrors[8]),
        confirmPassword: Yup
            .string()
            .required(text[settings.language].authErrors[9])
            .oneOf([Yup.ref("password"), null], text[settings.language].authErrors[10]),
        });

    function createUser(data) {
        setLoadSignUp(true);
        axios.post(`${import.meta.env.VITE_API_KEY}/users?lang=${settings.language}`, data)
        .then(response => {
            if (response.data.error) {
                console.log(response.data.error);
                setErrorText(Number(response.data.error));
                alertRef.current.showModal();
                setTimeout(() => closeModal(alertRef), 1500);
            }
            else {
                document.documentElement.style.setProperty("--verification-required-height", "3.2rem");
                setVerificationRequired(true);
                localStorage.setItem("verificationRequired", "1");
                navigate("/login");
            }
            setLoadSignUp(false);
        });
    }

    return (
        <motion.div
            className='auth'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            {!authState.status ?
            <>
                <div style={{height: "3rem"}}/>
                <Formik
                    initialValues={initialValues}
                    onSubmit={createUser}
                    validationSchema={validationSchema}
                >
                    <Form className="signup-form">
                        <label>{text[settings.language].signup[0]}:</label>
                        <Field
                            className="signup-input"
                            name="email"
                            placeholder={text[settings.language].signup[1]}
                        />
                        <ErrorMessage name="email" component="span" />
                        <label>{text[settings.language].signup[2]}:</label>
                        <Field
                            className="signup-input"
                            name="username"
                            placeholder={text[settings.language].signup[3]}
                        />
                        <ErrorMessage name="username" component="span" />
                        <label>{text[settings.language].signup[4]}:</label>
                        <div className="password-field">
                            <Field
                                className="signup-input"
                                type={passwordFieldType}
                                name="password"
                                placeholder={text[settings.language].signup[5]}
                            />
                            {passwordFieldType === "password"
                            ? <svg onClick={() => setPasswordFieldType("text")} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d={paths.hide[0]}/></svg>
                            : <svg onClick={() => setPasswordFieldType("password")} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d={paths.hide[1]}/></svg>}
                        </div>
                        <ErrorMessage name="password" component="span" />
                        <label>{text[settings.language].signup[6]}:</label>
                        <div className="password-field">
                            <Field
                                className="signup-input"
                                type={confirmFieldType}
                                name="confirmPassword"
                                placeholder={text[settings.language].signup[7]}
                            />
                            {confirmFieldType === "password"
                            ? <svg onClick={() => setConfirmFieldType("text")} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d={paths.hide[0]}/></svg>
                            : <svg onClick={() => setConfirmFieldType("password")} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d={paths.hide[1]}/></svg>}
                        </div>
                        <ErrorMessage name="confirmPassword" component="span" />
                        <button type="submit" disabled={loadSignUp}>{
                            loadSignUp ? <span className="loader" style={{ width: "1.6rem", height: "1.6rem" }} />
                            : text[settings.language].auth[1]
                        }</button>
                    </Form>
                </Formik>
                <dialog closedby="any"
                    className="save-alert"
                    ref={alertRef}
                    style={{
                        backgroundColor: "var(--light-red)",
                        color: "var(--dark-red)",
                        marginTop: "5rem"
                    }}
                >
                    <div>
                        <p>{text[settings.language].signupNotifications[errorText]}</p>
                        <button onClick={() => closeModal(alertRef)}>
                            <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" strokeWidth="1" fill="var(--dark-red)" fillRule="evenodd"><g id="work-case" transform="translate(91.520000, 91.520000)"><polygon id="Close" points={paths.cancel} /></g></g></svg>
                        </button>
                    </div>
                </dialog>
            </>
            : <div className="logged-in">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d={paths.loggedIn}/></svg>
                <h2 style={{width: "100%"}}>{text[settings.language].authErrors[5]}</h2>
            </div>}
        </motion.div>
    )
}

export default SignUp