import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userAccountService from "../../services/userAccountService";

const Payments = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const queryClient = useQueryClient();
  const { data: paymentMethods = [], isLoading } = useQuery({
    queryKey: ["user-payment-methods"],
    queryFn: () => userAccountService.getPaymentMethods(),
  });

  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    isDefault: false,
  });

  const addCardMutation = useMutation({
    mutationFn: (cardData) => userAccountService.addPaymentMethod(cardData),
    onSuccess: () => {
      queryClient.invalidateQueries(["user-payment-methods"]);
      setShowAddCard(false);
      setNewCard({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
        isDefault: false,
      });
      alert("Thêm thẻ thành công!");
    },
    onError: (error) => {
      alert(`Lỗi: ${error.message}`);
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (cardId) => userAccountService.deletePaymentMethod(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries(["user-payment-methods"]);
      alert("Xóa thẻ thành công!");
    },
  });

  const setDefaultCardMutation = useMutation({
    mutationFn: (cardId) => userAccountService.setDefaultPaymentMethod(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries(["user-payment-methods"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addCardMutation.mutate(newCard);
  };

  const maskCardNumber = (number) => {
    return "**** **** **** " + number.slice(-4);
  };

  if (isLoading) {
    return (
      <div className="payments-page">
        <h1>Thanh toán</h1>
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="payments-header">
        <h1>Thanh toán</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddCard(!showAddCard)}
        >
          <i className="bx bx-plus"></i> {showAddCard ? "Hủy" : "Thêm thẻ mới"}
        </button>
      </div>

      {showAddCard && (
        <div className="add-card-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Số thẻ</label>
              <input
                type="text"
                value={newCard.cardNumber}
                onChange={(e) =>
                  setNewCard({ ...newCard, cardNumber: e.target.value })
                }
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>
            <div className="form-group">
              <label>Tên chủ thẻ</label>
              <input
                type="text"
                value={newCard.cardHolder}
                onChange={(e) =>
                  setNewCard({ ...newCard, cardHolder: e.target.value })
                }
                placeholder="NGUYEN VAN A"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ngày hết hạn</label>
                <input
                  type="text"
                  value={newCard.expiryDate}
                  onChange={(e) =>
                    setNewCard({ ...newCard, expiryDate: e.target.value })
                  }
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  value={newCard.cvv}
                  onChange={(e) =>
                    setNewCard({ ...newCard, cvv: e.target.value })
                  }
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={addCardMutation.isPending}
              >
                {addCardMutation.isPending ? "Đang thêm..." : "Thêm thẻ"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="payment-methods-list">
        {paymentMethods.length === 0 ? (
          <div className="empty-state">
            <i className="bx bx-credit-card"></i>
            <p>Bạn chưa có phương thức thanh toán nào</p>
          </div>
        ) : (
          paymentMethods.map((card) => (
            <div
              key={card.id}
              className={`payment-card ${card.isDefault ? "default" : ""}`}
            >
              <div className="payment-card-header">
                <div className="card-type">
                  <i className="bx bx-credit-card"></i>
                  <span>{card.type}</span>
                </div>
                {card.isDefault && (
                  <span className="default-badge">Mặc định</span>
                )}
              </div>
              <div className="payment-card-body">
                <div className="card-number">
                  {maskCardNumber(card.cardNumber)}
                </div>
                <div className="card-info">
                  <span>{card.cardHolder}</span>
                  <span>{card.expiryDate}</span>
                </div>
              </div>
              <div className="payment-card-footer">
                {!card.isDefault && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setDefaultCardMutation.mutate(card.id)}
                  >
                    Đặt làm mặc định
                  </button>
                )}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    if (window.confirm("Bạn có chắc chắn muốn xóa thẻ này?")) {
                      deleteCardMutation.mutate(card.id);
                    }
                  }}
                >
                  <i className="bx bx-trash"></i> Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Payments;
