import React, {useEffect, useState} from 'react';
import {useWebSocket} from "../../../context/WebSocketContext";
import {useAuth} from "../../../context/UserContext";
import {add} from "react-modal/lib/helpers/classList";

const Blanks = () => {

    const {token} = useAuth();
    const {sendData, addHandler, deleteHandler} = useWebSocket();

    const [blanks, setBlanks] = useState([]);

    useEffect(() => {

        if(token && blanks.length < 1) {
            sendData({action: "get_blanks", data: {jwt: token}});
        }

    }, [token, blanks]);

    useEffect(() => {

        const handleGetBlanks = (msg) => {
            setBlanks(msg.blanks);
        }

        addHandler('receive_blanks', handleGetBlanks);

        return () => deleteHandler('receive_blanks');

    }, []);

    // console.log(blanks.posts !== undefined && blanks?.posts[0].id);

    return (
        <div className={"container"}>
            <div className="center-content-block">
                <h2 className="pageTitle">Настройки</h2>
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