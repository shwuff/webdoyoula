import React from 'react';
import {useSelector} from "react-redux";
import TShirtMask from './../../assets/images/t_shirt_mask.webp';
import {useWebSocket} from "../../context/WebSocketContext";
import {useAuth} from "../../context/UserContext";
import BasketButton from "../buttons/BasketButton";

const Cart = () => {

    const cartSelector = useSelector(state => state.cart.cartList);
    const imageSelector = useSelector(state => state.image.images);

    const {addHandler, deleteHandler, sendData} = useWebSocket();
    const {token} = useAuth();

    const addToCart = (photoId, selectedSize) => {
        sendData({
            action: "add_to_cart",
            data: { jwt: token, photoId, size: selectedSize }
        });
    };

    const deleteFromCart = (photoId, selectedSize) => {

        sendData({
            action: "delete_from_cart",
            data: { jwt: token, photoId, size: selectedSize }
        });
    }

    return (
        <div style={{padding: 4}}>
            <h3>Корзина</h3>

            {
                cartSelector && cartSelector.length > 0 ? (
                    <>
                        {
                            cartSelector.map((cart) => {
                                return (
                                    <div key={cart.id} className={"d-flex align-items-center"}>
                                        <div>
                                            <img src={TShirtMask} width={100} style={{ position: "absolute" }} />
                                            <img src={imageSelector[cart.photo_id].blob_url} width={100} height={100} style={{ objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ height: "100px", width: "150px", display: "block" }}>
                                            <b>Футболка</b>
                                            <p>Размер: <b>{cart.size}</b></p>
                                            <p>1 р</p>

                                            <BasketButton selectedSize={cart.size} photo_id={cart.photo_id} addToCart={() => addToCart(cart.photo_id, cart.size)} deleteFromCart={() => deleteFromCart(cart.photo_id, cart.size)} />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </>
                ) : null
            }

        </div>
    );
}

export default Cart;