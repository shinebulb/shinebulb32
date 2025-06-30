import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Verify({ settings }) {

    const { search } = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Verifying your account...');

    useEffect(() => {
        const params = new URLSearchParams(search);
        const token = params.get('token');

        if (!token) {
            setStatus('Invalid or missing verification token.');
            return;
        }

        axios.get(`${import.meta.VITE_API_KEY}/verify?token=${token}`)
        .then(response => {
            if (!response.data.error) {
                setStatus('Email verified successfully!');
            }
        })
        .catch(() => {
            setStatus('Verification failed or link expired. Please try again.');
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