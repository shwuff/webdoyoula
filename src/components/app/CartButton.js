import React from 'react';
import { useAuth } from '../../app/providers/UserContext';

/**
 * Компонент кнопки корзины
 */
const CartButton = ({ onClick }) => {
    const { userData } = useAuth();

    if (!userData?.count_goods_in_cart || userData.count_goods_in_cart === 0) {
        return null;
    }

    return (
        <div className='cartButton' onClick={onClick}>
            <span className={"cart-count"}>{userData.count_goods_in_cart}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" fill="none">
                <path fill="var(--text-color)" fillRule="evenodd" d="M9.522 14.866a1 1 0 0 0 1.1.653l12.766-2.036a1 1 0 0 0 .823-.792l1.355-6.792a1 1 0 0 0-.964-1.196l-17.36-.28a1 1 0 0 0-.958 1.335l3.238 9.108ZM10.326 23.052a2.326 2.326 0 1 0 0-4.652 2.326 2.326 0 0 0 0 4.652ZM21.957 23.052a2.326 2.326 0 1 0 0-4.652 2.326 2.326 0 0 0 0 4.652Z" clipRule="evenodd"></path>
                <path fill="var(--text-color)" d="M6.169.9h-4.71a1.31 1.31 0 1 0 0 2.618h3.337a1 1 0 0 1 .945.672l.942 2.71L9.35 5.6 8.035 2.182A2 2 0 0 0 6.17.9Z"></path>
            </svg>
        </div>
    );
};

export default CartButton;
