import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useWebSocket } from '../providers/WebSocketContext';
import { addGood, deleteGood, setCart, updateCount } from '../store/slices/cartSlice';

/**
 * Hook для обработки событий корзины через WebSocket
 */
export const useCartHandlers = () => {
    const { addHandler, deleteHandler } = useWebSocket();
    const dispatch = useDispatch();

    useEffect(() => {
        const receiveCart = (msg) => {
            dispatch(setCart(msg.data.cartList));
        };

        addHandler("receive_cart", receiveCart);
        return () => deleteHandler('receive_cart');
    }, [addHandler, deleteHandler, dispatch]);

    useEffect(() => {
        const receiveNewGood = (msg) => {
            dispatch(addGood(msg.data));
        };

        addHandler("receive_new_cart_good", receiveNewGood);
        return () => deleteHandler('receive_new_cart_good');
    }, [addHandler, deleteHandler, dispatch]);

    useEffect(() => {
        const receiveUpdateCount = (msg) => {
            dispatch(updateCount({ cartId: msg.data.id, newCount: msg.data.count }));
        };

        addHandler("receive_update_count_cart_good", receiveUpdateCount);
        return () => deleteHandler('receive_update_count_cart_good');
    }, [addHandler, deleteHandler, dispatch]);

    useEffect(() => {
        const receiveDeleteGood = (msg) => {
            dispatch(deleteGood(msg.data.id));
        };

        addHandler("delete_good_from_cart", receiveDeleteGood);
        return () => deleteHandler('delete_good_from_cart');
    }, [addHandler, deleteHandler, dispatch]);
};
