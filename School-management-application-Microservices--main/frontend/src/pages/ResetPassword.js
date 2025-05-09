import React, { useState } from 'react';
import userApi from '../services/userApi';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const res = await userApi.post('/auth/reset-password', { email });
            setMessage('Mật khẩu mới đã được gửi tới email của bạn');
            setError('');
        } catch (err) {
            setError('Không thể gửi email. Vui lòng kiểm tra lại.');
            setMessage('');
        }
    };

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleReset}>
                <h2 className="login-title">Quên mật khẩu</h2>
                <input
                    className="login-input"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className="login-button" type="submit">Gửi lại mật khẩu</button>
                {message && <p className="login-success">{message}</p>}
                {error && <p className="login-error">{error}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;
