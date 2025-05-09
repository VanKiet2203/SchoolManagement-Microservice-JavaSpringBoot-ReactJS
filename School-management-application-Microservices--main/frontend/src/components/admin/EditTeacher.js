import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import teacherApi from '../../services/teacherApi';
import Header from '../common/Header';

function EditTeacher({ onLogout }) {
    const [form, setForm] = useState({
        fullName: '',
        address: '',
        email: '',
        phone: '',
        homeroomClass: '',
        subject: '',
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const loadTeacher = async () => {
            try {
                const res = await teacherApi.get(`/${id}`);
                setForm(res.data);
            } catch (err) {
                console.error('Lỗi tải dữ liệu giáo viên:', err);
                alert('Không tìm thấy giáo viên');
                navigate('/teacher-management');
            }
        };
        loadTeacher();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await teacherApi.put(`/update/${id}`, form);
            alert('✅ Cập nhật giáo viên thành công!');
            navigate('/teacher-management');
        } catch (error) {
            console.error('❌ Lỗi cập nhật giáo viên:', error);
            alert('Có lỗi khi cập nhật. Vui lòng thử lại!');
        }
    };

    return (
        <div>
            <Header onLogout={onLogout} />
        <div className="form-container">
            <h2 className="form-title">Cập nhật giáo viên</h2>
            <form onSubmit={handleSubmit} className="teacher-form">
                <input name="fullName" placeholder="Họ và tên" value={form.fullName} onChange={handleChange} required />
                <input name="address" placeholder="Địa chỉ" value={form.address} onChange={handleChange} required />
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} required />
                <input name="homeroomClass" placeholder="Lớp chủ nhiệm" value={form.homeroomClass} onChange={handleChange} required />
                <input name="subject" placeholder="Môn giảng dạy" value={form.subject} onChange={handleChange} required />
                <button type="submit" className="btn submit-btn">💾 Lưu thay đổi</button>
            </form>
        </div>
        </div>

    );
}

export default EditTeacher;
