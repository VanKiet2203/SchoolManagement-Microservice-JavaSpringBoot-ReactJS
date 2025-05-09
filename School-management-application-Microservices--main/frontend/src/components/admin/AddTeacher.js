import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import teacherApi from '../../services/teacherApi';
import Header from '../common/Header';

function AddTeacher({ onLogout }) {
    const [teacher, setTeacher] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        homeroomClass: '',
        subject: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeacher({ ...teacher, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await teacherApi.post('/', teacher);
            alert("✅ Thêm giáo viên thành công!");
            navigate('/teacher-management');
        } catch (error) {
            console.error('❌ Lỗi khi thêm giáo viên:', error);
            alert("Lỗi khi thêm giáo viên. Vui lòng kiểm tra lại!");
        }
    };

    return (
        <div><Header onLogout={onLogout} />
        <div className="form-container">

            <h2 className="form-title">Thêm giáo viên</h2>
            <form onSubmit={handleSubmit} className="student-form">
                <input name="fullName" value={teacher.fullName} onChange={handleChange} placeholder="Họ và tên" required />
                <input name="email" value={teacher.email} onChange={handleChange} placeholder="Email" required />
                <input name="phone" value={teacher.phone} onChange={handleChange} placeholder="Số điện thoại" required />
                <input name="address" value={teacher.address} onChange={handleChange} placeholder="Địa chỉ" />
                <input name="homeroomClass" value={teacher.homeroomClass} onChange={handleChange} placeholder="Lớp chủ nhiệm" />
                <input name="subject" value={teacher.subject} onChange={handleChange} placeholder="Môn giảng dạy" />
                <button type="submit" className="btn submit-btn">➕ Thêm</button>
            </form>
        </div>
        </div>
    );
}

export default AddTeacher;
