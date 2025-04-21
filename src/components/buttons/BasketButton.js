import React from 'react';
import {useSelector} from "react-redux";
import marketStyles from "../modals/css/PhotoMarketModule.module.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {useWebSocket} from "../../context/WebSocketContext";
import {useAuth} from "../../context/UserContext";
import {FaMinus, FaPlus} from "react-icons/fa";
import styles from './css/BasketButton.module.css';

const BasketButton = ({ photo_id, addToCart, deleteFromCart, selectedSize }) => {

    const cart = useSelector(state => state.cart.cartList);
    const good = Array.isArray(cart) ? cart.find(item => item.photo_id === photo_id && item.size === selectedSize) : null;

    console.log(selectedSize, cart, good, photo_id);

    return (
        <>
            {
                good ? (
                    <div className={`w-100 d-flex ${styles.countButtonsContainer}`}>
                        <button className={styles.countButton} onClick={addToCart}>
                            <FaPlus />
                        </button>
                        <span className={styles.countSpan}>{good.count}</span>
                        <button className={styles.countButton} onClick={deleteFromCart}>
                            <FaMinus />
                        </button>
                    </div>
                ) : (
                    <div className={`w-100 d-flex ${styles.countButtonsContainer}`}>
                        <button className={styles.countButton} onClick={addToCart}>
                            <ShoppingCartIcon sx={{ fontSize: 20, marginRight: 1, fill: 'white'}} />
                            Добавить
                        </button>
                    </div>
                )
            }
        </>
    );
};

export default BasketButton;