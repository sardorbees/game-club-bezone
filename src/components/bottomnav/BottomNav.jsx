import React, { useState, useEffect } from "react";
import API from "../api";
import "../assets/css/BottomNav.css";
import { IoCall } from "react-icons/io5";
import { FaAddressCard, FaCartPlus, FaHeart, FaHome, FaUserCircle, FaEllipsisH } from "react-icons/fa";
import { TbDeviceGamepad3Filled } from "react-icons/tb";
import { CgLogIn, CgLogOut } from "react-icons/cg";
import { FaRegistered } from "react-icons/fa6";
import TarifPlan from "../tarif-plan/TarifPlan";
import { Link } from "react-router-dom";

function BottomNav() {
    const [active, setActive] = useState("home");
    const [showMenu, setShowMenu] = useState(false);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [cartPop, setCartPop] = useState(false);
    const [wishlistPop, setWishlistPop] = useState(false);

    // Загружаем профиль
    useEffect(() => {
        API.get("api/accounts/profile/")
            .then((res) => {
                setUser(res.data);
            })
            .catch(() => {
                setUser(null);
            });
    }, []);

    useEffect(() => {
        if (cart.length === 0) return;
        setCartPop(true);
        const timer = setTimeout(() => setCartPop(false), 300); // анимация 0.3с
        return () => clearTimeout(timer);
    }, [cart.length]);

    // При обновлении wishlist
    useEffect(() => {
        if (wishlist.length === 0) return;
        setWishlistPop(true);
        const timer = setTimeout(() => setWishlistPop(false), 300);
        return () => clearTimeout(timer);
    }, [wishlist.length]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const cartRes = await API.get("api/menu/api/cart/");
                setCart(cartRes.data.map((i) => i.product.id));

                const wishlistRes = await API.get("api/menu/api/wishlist/");
                setWishlist(wishlistRes.data.map((i) => i.product.id));
            } catch (err) {
                console.error(err);
            }
        };

        fetchData(); // первый вызов сразу
        const interval = setInterval(fetchData, 1000); // каждые 1 сек

        return () => clearInterval(interval); // очистка при размонтировании
    }, [user]);

    // Клик вне меню
    useEffect(() => {
        const handleClickOutside = (event) => {
            const menu = document.querySelector(".dropdown-menu");
            const button = document.querySelector(".ellipsis");

            if (!menu || !button) return;

            if (!menu.contains(event.target) && !button.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Убираем JWT токены
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        // Обновляем состояние
        setUser(null);

        // Мгновенный редирект без задержки
        window.location.replace("/login");
    };

    const fetchCart = async () => {
        try {
            const res = await API.get("api/menu/api/cart/");
            setCart(res.data.map((i) => i.product.id));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchWishlist = async () => {
        try {
            const res = await API.get("api/menu/api/wishlist/");
            setWishlist(res.data.map((i) => i.product.id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="bottom-nav">
                <div className={`nav-item ${active === "home" ? "active" : ""}`} onClick={() => setActive("home")}>
                    <FaHome />
                    <a href="/">Главная</a>
                </div>
                <div className={`nav-item ${active === "call" ? "active" : ""}`} onClick={() => setActive("call")}>
                    <IoCall />
                    <a href="tel:+998330343496" className="brons">Забронировать</a>
                </div>
                <div className={`nav-item ${active === "card" ? "active" : ""}`} onClick={() => setActive("card")}>
                    <FaAddressCard />
                    <span>Клуб карта</span>
                </div>
                <div className={`nav-item ${active === "Tariffs" ? "active" : ""}`} onClick={() => setActive("Tariffs")}>
                    <TbDeviceGamepad3Filled />
                    <TarifPlan />
                </div>
            </div>

            <div className="side-nav">
                <div className="side-item">
                    <FaCartPlus />
                    <a
                        href="/cart"
                        className={`menu-cart ${cartPop ? "pop" : ""}`}
                    >
                        Корзина ({cart.length})
                    </a>
                </div>
                <div className="side-item">
                    <FaHeart />
                    <a
                        href="/wishlist"
                        className={`menu-cart ${wishlistPop ? "pop" : ""}`}
                    >
                        Избранное ({wishlist.length})
                    </a>
                </div>

                {user ? (
                    <div
                        className="side-item profile-menu"
                        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    >
                        <Link
                            to="/profile"
                            style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
                        >
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt="avatar"
                                    width="30"
                                    height="30"
                                    style={{
                                        borderRadius: "50%",
                                        marginRight: "8px",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <FaUserCircle style={{ fontSize: "22px", marginRight: "6px", color: "white" }} />
                            )}
                            <span style={{ color: "white", fontSize: "14px" }}>
                                {user.first_name || user.username}
                            </span>
                        </Link>
                    </div>
                ) : (
                    <div style={{ position: "relative" }}>
                        <div
                            className="side-item ellipsis"
                            onClick={() => setShowMenu(!showMenu)}
                            style={{
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                            }}
                        >
                            <FaEllipsisH style={{ marginRight: "6px" }} />
                            <span>Еще</span>
                        </div>

                        {showMenu && (
                            <div
                                className="menue"
                                style={{
                                    position: "absolute",
                                    top: "-20%",
                                    right: "50px",
                                    background: "#111",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                                    padding: "10px",
                                    zIndex: 100,
                                    animation: "fadeIn 0.3s ease-in-out",
                                }}
                            >
                                <div
                                    className="register"
                                    style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "6px 8px",
                                    }}
                                    onClick={() => setShowMenu(false)}
                                >
                                    <FaRegistered style={{ color: "white", marginRight: "6px" }} />
                                    <Link
                                        to="/register"
                                        style={{ color: "white", textDecoration: "none" }}
                                    >
                                        Регистрация
                                    </Link>
                                </div>
                                <div
                                    className="login"
                                    style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "6px 8px",
                                    }}
                                    onClick={() => setShowMenu(false)}
                                >
                                    <CgLogIn style={{ color: "white", marginRight: "6px" }} />
                                    <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
                                        Войти
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )} </div>
        </>
    );
}

export default BottomNav;