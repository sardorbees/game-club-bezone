import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../authсontext/AuthContext";
import { FaHeart, FaTrash, FaCartPlus } from "react-icons/fa";
import "../assets/css/GameClub.css";
import "../assets/css/Cart.css";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/api/menu/api/wishlist/");
      setWishlist(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке wishlist:", err);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await API.delete(`/api/menu/api/wishlist/${id}/`);
      setWishlist(wishlist.filter(item => item.id !== id));
    } catch (err) {
      console.error("Ошибка при удалении из wishlist:", err);
    }
  };

  const addToCart = async (productId) => {
    try {
      await API.post("/api/menu/api/cart/", {
        product_id: productId,
        quantity: 1
      });
      alert("Товар добавлен в корзину ✅");
    } catch (err) {
      console.error("Ошибка при добавлении в корзину:", err);
      alert("Ошибка при добавлении в корзину ❌");
    }
  };

  if (!user) return <p>Для просмотра списка желаний нужно авторизоваться</p>;

  return (
    <div>
      <div
        className="breadcumb-wrapper"
        data-bg-src="assets/img/bg/breadcumb-bg.jpg"
      >
        <div className="container">
          <div className="breadcumb-content">
            <br />
            <h1 className="breadcumb-title">Список желаний</h1>
          </div>
        </div>
      </div>

      <div className="wishlist">
        <h2>Список желаний</h2>
        {wishlist.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "25px" }}>
            Список желаний пуст <FaHeart />
          </p>
        )}
        <br /><br />

        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={item.product?.image || "/assets/img/default.png"}
                  alt={item.product?.title || "Без названия"}
                  className="img-tag"
                />
              </div>

              <div className="product-details">
                <h3 className="product-name">{item.product?.title}</h3>
                <p className="product-description">
                  {item.product?.description}
                </p>

                <div className="price-section">
                  <span className="price">{item.product?.price} so'm</span>
                  <div className="goid">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="remove-btn"
                    >
                      <FaTrash /> Удалить
                    </button>
                  </div>
                </div>

                <br />
                <button
                  onClick={() => addToCart(item.product?.id)}
                  className="add-to-cart-buttone"
                >
                  <FaCartPlus /> В корзину
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}