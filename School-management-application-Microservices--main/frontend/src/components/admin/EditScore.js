import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import studentApi from '../../services/studentApi';
import Header from '../common/Header';

const EditScore = ({ onLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await studentApi.get(`/${id}`);
                setForm(res.data);
            } catch (error) {
                console.error("Lỗi khi tải điểm:", error);
                alert("Không thể tải thông tin điểm.");
            }
        };
        fetchStudent();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedScores = {
            mathScore: form.mathScore,
            physicsScore: form.physicsScore,
            chemistryScore: form.chemistryScore,
            literatureScore: form.literatureScore,
            englishScore: form.englishScore,
            behaviorScore: form.behaviorScore,
        };
        try {
            await studentApi.put(`/updateScore/${id}`, updatedScores);
            alert("✅ Cập nhật điểm thành công!");
            navigate('/students');
        } catch (error) {
            console.error("❌ Lỗi cập nhật điểm:", error);
            alert("Lỗi khi cập nhật điểm học sinh.");
        }
    };

    if (!form) return <p className="text-center mt-10">Đang tải dữ liệu...</p>;

    return (
        <div>
            <Header onLogout={onLogout} />
            <div className="form-container">
                <h2 className="form-title">Cập nhật điểm</h2>
                <form onSubmit={handleSubmit} className="student-form">
                    <input name="mathScore" value={form.mathScore} onChange={handleChange} placeholder="Toán" type="number" />
                    <input name="physicsScore" value={form.physicsScore} onChange={handleChange} placeholder="Lý" type="number" />
                    <input name="chemistryScore" value={form.chemistryScore} onChange={handleChange} placeholder="Hóa" type="number" />
                    <input name="literatureScore" value={form.literatureScore} onChange={handleChange} placeholder="Văn" type="number" />
                    <input name="englishScore" value={form.englishScore} onChange={handleChange} placeholder="Anh" type="number" />
                    <input name="behaviorScore" value={form.behaviorScore} onChange={handleChange} placeholder="Hạnh kiểm" />
                    <button type="submit" className="btn submit-btn">💾 Lưu điểm</button>
                </form>
            </div>
        </div>
    );
};

export default EditScore;
