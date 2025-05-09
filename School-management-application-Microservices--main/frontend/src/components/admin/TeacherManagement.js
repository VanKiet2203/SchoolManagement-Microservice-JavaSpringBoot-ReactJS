import React, { useEffect, useState } from 'react';
import teacherApi from '../../services/teacherApi';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';

function TeacherManagement({ onLogout }) {
    const [teachers, setTeachers] = useState([]);
    const navigate = useNavigate();

    const fetchTeachers = async () => {
        try {
            const res = await teacherApi.get('/');
            setTeachers(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách giáo viên:", error);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const deleteTeacher = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa giáo viên này không?");
        if (!confirmDelete) return;

        try {
            await teacherApi.delete(`/${id}`);
            alert("Xóa giáo viên thành công!");
            fetchTeachers();
        } catch (error) {
            console.error("Lỗi khi xoá giáo viên:", error);
            alert("Lỗi khi xóa giáo viên. Vui lòng thử lại.");
        }
    };

    return (
        <div>
            <Header onLogout={onLogout} />

        <div className="teacher-container">
            <h2 className="teacher-title">Danh sách giáo viên</h2>

            <button
                className="btn add-btn"
                onClick={() => navigate('/teachers/add')}
            >
                ➕ Thêm Giáo Viên
            </button>

            <div className="teacher-table-wrapper">
                {teachers.length > 0 ? (
                    <table className="teacher-table">
                        <thead>
                        <tr>
                            <th>Họ và Tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Lớp chủ nhiệm</th>
                            <th>Giảng dạy môn</th>
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {teachers.map((t) => (
                            <tr key={t.teacherID}>
                                <td>{t.fullName}</td>
                                <td>{t.email}</td>
                                <td>{t.phone}</td>
                                <td>{t.address}</td>
                                <td>{t.homeroomClass}</td>
                                <td>{t.subject}</td>
                                <td>
                                    <button
                                        className="btn edit-btn"
                                        onClick={() => navigate(`/teachers/edit/${t.teacherID}`)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn delete-btn"
                                        onClick={() => deleteTeacher(t.teacherID)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data">Không có giáo viên nào trong danh sách.</p>
                )}
            </div>
        </div>
        </div>
    );
}

export default TeacherManagement;
