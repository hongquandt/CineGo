import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userAccountService from "../../services/userAccountService";
import "../../assets/styles/user-account/Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || "",
    gender: user?.gender || "",
    address: user?.address || "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => userAccountService.updateProfile(data),
    onSuccess: (data) => {
      updateUser(data);
      queryClient.invalidateQueries(["user-profile"]);
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    },
    onError: (error) => {
      alert(`Lỗi: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Thông tin cá nhân</h1>
        <button
          className="btn btn-primary"
          onClick={() =>
            isEditing
              ? handleSubmit({ preventDefault: () => {} })
              : setIsEditing(true)
          }
        >
          {isEditing ? "Lưu thay đổi" : "Chỉnh sửa"}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className="profile-avatar-placeholder">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
          </div>
          <button className="btn-change-avatar">
            <i className="bx bx-camera"></i> Đổi ảnh đại diện
          </button>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              rows="3"
            />
          </div>

          {isEditing && (
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user?.name || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    dateOfBirth: user?.dateOfBirth || "",
                    gender: user?.gender || "",
                    address: user?.address || "",
                  });
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending
                  ? "Đang lưu..."
                  : "Lưu thay đổi"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
