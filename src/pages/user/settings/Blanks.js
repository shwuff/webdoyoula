import React, {useEffect, useState} from 'react';
import {useWebSocket} from "../../../context/WebSocketContext";
import {useAuth} from "../../../context/UserContext";
import {useTranslation} from "react-i18next";

const Blanks = () => {

    const {token} = useAuth();
    const {t} = useTranslation();
    const {sendData, addHandler, deleteHandler} = useWebSocket();

    const [blanks, setBlanks] = useState([]);

    useEffect(() => {

        if(token && blanks.length < 1) {
            sendData({action: "get_blanks", data: {jwt: token}});
        }

    }, [token, blanks, sendData]);

    useEffect(() => {

        const handleGetBlanks = (msg) => {
            setBlanks(msg.blanks);
        }

        addHandler('receive_blanks', handleGetBlanks);

        return () => deleteHandler('receive_blanks');

    }, [addHandler, deleteHandler]);

    return (
        <div className={"container"}>
            <div className="center-content-block">
                <h2 className="pageTitle">{t('settings')}</h2>
                {
                    blanks.posts !== undefined && blanks.posts.map((post, index) => {
                        return (
                            <a href={`/post/edit/${post.post_id}`}>
                                {post.post_id}
                            </a>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Blanks;