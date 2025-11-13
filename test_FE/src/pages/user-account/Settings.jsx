import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import userAccountService from "../../services/userAccountService";
import "../../assets/styles/user-account/Settings.css";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("password");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    promotionalEmails: false,
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => userAccountService.changePassword(data),
    onSuccess: () => {
      alert("Đổi mật khẩu thành công!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error) => {
      alert(`Lỗi: ${error.message}`);
    },
  });

  const updateNotificationSettingsMutation = useMutation({
    mutationFn: (data) => userAccountService.updateNotificationSettings(data),
    onSuccess: () => {
      alert("Cập nhật cài đặt thành công!");
    },
    onError: (error) => {
      alert(`Lỗi: ${error.message}`);
    },
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
  };

  const handleSaveNotifications = () => {
    updateNotificationSettingsMutation.mutate(notificationSettings);
  };

  return (
    <div className="settings-page">
      <h1>Cài đặt</h1>

      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          <i className="bx bx-lock"></i> Đổi mật khẩu
        </button>
        <button
          className={`settings-tab ${
            activeTab === "notifications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          <i className="bx bx-bell"></i> Thông báo
        </button>
        <button
          className={`settings-tab ${activeTab === "privacy" ? "active" : ""}`}
          onClick={() => setActiveTab("privacy")}
        >
          <i className="bx bx-shield"></i> Quyền riêng tư
        </button>
      </div>

      <div className="settings-content">
        {activeTab === "password" && (
          <div className="settings-section">
            <h2>Đổi mật khẩu</h2>
            <form
              onSubmit={handlePasswordSubmit}
              className="settings-form password-form"
            >
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Nhập mật khẩu mới"
                  required
                />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Xác nhận mật khẩu mới"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-change-password-full"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending
                  ? "Đang đổi..."
                  : "ĐỔI MẬT KHẨU"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="settings-section">
            <h2>Cài đặt thông báo</h2>
            <div className="notification-settings">
              <div className="notification-item">
                <div className="notification-info">
                  <h3>Thông báo qua Email</h3>
                  <p>Nhận thông báo về đặt vé và cập nhật qua email</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={() =>
                      handleNotificationChange("emailNotifications")
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h3>Thông báo qua SMS</h3>
                  <p>Nhận thông báo quan trọng qua tin nhắn SMS</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={() =>
                      handleNotificationChange("smsNotifications")
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h3>Thông báo đẩy</h3>
                  <p>Nhận thông báo trên trình duyệt</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notificationSettings.pushNotifications}
                    onChange={() =>
                      handleNotificationChange("pushNotifications")
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h3>Email khuyến mãi</h3>
                  <p>Nhận email về các chương trình khuyến mãi và ưu đãi</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notificationSettings.promotionalEmails}
                    onChange={() =>
                      handleNotificationChange("promotionalEmails")
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleSaveNotifications}
            >
              Lưu cài đặt
            </button>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="settings-section">
            <h2>Quyền riêng tư</h2>
            <div className="privacy-settings">
              <div className="privacy-item">
                <h3>Chia sẻ thông tin cá nhân</h3>
                <p>
                  Cho phép CineGo chia sẻ thông tin với các đối tác để cải thiện
                  dịch vụ
                </p>
                <label className="switch">
                  <input type="checkbox" defaultChecked={false} />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="privacy-item">
                <h3>Hiển thị hồ sơ công khai</h3>
                <p>Cho phép người khác xem thông tin cơ bản của bạn</p>
                <label className="switch">
                  <input type="checkbox" defaultChecked={false} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
