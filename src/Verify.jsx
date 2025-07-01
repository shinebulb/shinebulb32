import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Verify({ settings }) {

    const { search } = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying your account...');

    useEffect(() => {
        const params = new URLSearchParams(search);
        const token = params.get('token');

        if (!token) {
            setStatus('invalid or missing verification token.');
            return;
        }

        axios.get(`${import.meta.env.VITE_API_KEY}/users/verify?token=${token}`)
        .then(response => {
            if (!response.data.error) {
                setStatus('email verified successfully!');
            }
            else {
                setStatus('verification failed or link expired. please try again.');
            }
        })
        .catch(() => {
            setStatus('verification failed or link expired. please try again.');
        });
    }, [search, navigate]);

    return (
        <div>
            <p style={{ color: "var(--font)" }}>{status}</p>
            {status.toLowerCase().includes('failed') && (
            <button
                style={{ backgroundColor: "var(--button-bg)", color: "var(--button-font)" }}
                onClick={() => window.location.reload()}
            >
                Retry
            </button>
            )}
        </div>
    );
}

export default Verify