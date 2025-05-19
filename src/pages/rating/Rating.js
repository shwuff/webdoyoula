import React, {useEffect, useState} from 'react';
import {Avatar, List, ListItem, ListItemAvatar, ListItemText, Tabs, Tab, Box, Button} from '@mui/material';
import { styled } from '@mui/system';
import {useWebSocket} from "../../context/WebSocketContext";
import {useAuth} from "../../context/UserContext";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const TopUser = styled(ListItem)(({ theme, position }) => ({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    fontWeight: 'bold',
    padding: "10px",
    borderRadius: '50%',
    width: "30vw",
    height: "30vw",
    maxWidth: "250px",
    maxHeight: "250px",
    ...(position === 'gold' && {
        // background: 'linear-gradient(90deg, rgba(254,219,55,1) 0%, rgba(190,166,54,1) 76%)',
        marginBottom: '0px',
    }),
    ...(position === 'silver' && {
        marginTop: "25px",
        // background: 'linear-gradient(90deg, rgba(237,237,237,1) 0%, rgba(189,189,189,1) 50%)'
    }),
    ...(position === 'bronze' && {
        marginTop: "25px",
        // background: 'linear-gradient(90deg, rgba(219,108,43,1) 0%, rgba(103,50,8,1) 76%)',
    }),
}));

const TopUsers = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
}));

const MiddleUsers = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '20px',
}));

const numParseWord = (num) => {
    if (num < 1000) return num;
    if (num >= 1000 && num < 1000000) return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
}

const Rating = () => {
    const [filter, setFilter] = useState('repeats');

    const [users, setUsers] = useState([]);

    const {sendData, addHandler, deleteHandler} = useWebSocket();
    const {token, userData} = useAuth();
    const navigate = useNavigate();

    const {t} = useTranslation();

    useEffect(() => {
        if(token) {
            setUsers([]);
            sendData({
                action: "get_rating",
                data: {
                    jwt: token,
                    sort: filter
                }
            });
        }
    }, [filter, token]);

    useEffect(() => {

        const handleReceiveRating = (msg) => {
            setUsers(msg.rating);
        }

        addHandler('receive_rating', handleReceiveRating);

        return () => deleteHandler('receive_rating');

    }, [addHandler, deleteHandler, setUsers]);

    const sortUsers = (filter) => {
        switch (filter) {
            case 'repeats':
                return [...users].sort((a, b) => b.repeats_count - a.repeats_count);
            case 'refs':
                return [...users].sort((a, b) => b.ref_payments - a.ref_payments);
            case 'creationCount':
                return [...users].sort((a, b) => b.creationCount - a.creationCount);
            default:
                return users;
        }
    };

    // if(users.length < 1) {
    //
    //     return (
    //         <div className="globalBlock" style={{ position: 'relative' }}>
    //             <div className="center-content-block">
    //                 loading...
    //             </div>
    //         </div>
    //     );
    // }

    const topUsers = sortUsers(filter).slice(0, 3);

    const formatFullName = (firstName, lastName) => {
        return `${firstName || ''} ${lastName || ''}`.trim();
    };

    return (
        <div className="globalProfileBlock" style={{ position: 'relative' }}>
            <div className="center-content-block">
                <div style={{ minHeight: "var(--safeAreaInset-top)", width: "100%", paddingBottom: "5px", background: userData.profile_color.second_color_full, paddingTop: "var(--safeAreaInset-top" }}>
                    <Tabs value={filter} sx={{ overflowX: "auto", height: "16px",  "& .MuiTabs-indicator": {
                            backgroundColor: "white",
                        } }} onChange={(event, newValue) => setFilter(newValue)} centered>
                        <Tab sx={{fontSize: 12, height: "16px", fontWeight: "800", color: "white", "&.Mui-selected": {
                                color: "white",
                            }}}  label={t("sort_by_repeats")} value="repeats" />
                        <Tab sx={{fontSize: 12, height: "16px", fontWeight: "800", color: "white", "&.Mui-selected": {
                                color: "white",
                            }}} label={t("refs")} value="refs" />
                        {/*<Tab sx={{fontSize: 12, height: "16px", fontWeight: "800", color: "white", "&.Mui-selected": {*/}
                        {/*        color: "white",*/}
                        {/*    }}} label="Создания" value="creationCount" />*/}
                    </Tabs>
                </div>

                <TopUsers>

                </TopUsers>

                <MiddleUsers>
                    {topUsers[1] && (
                        <TopUser position="silver">
                            <ListItemAvatar sx={{ display: "flex", justifyContent: "center", position: "relative" }}>
                                <Avatar src={topUsers[1].photo_url} sx={{width: {
                                        xs: '5rem',
                                        sm: '5rem',
                                        md: '9rem',
                                    }, height: {
                                        xs: '5rem',
                                        sm: '5rem',
                                        md: '9rem',
                                    }}} />
                                <span style={{ position: "absolute", top: '90%', fontSize: "12px", background: "rgba(189,189,189,1)", color: "white", padding: 2, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    2
                                </span>
                            </ListItemAvatar>
                            <div>
                                <ListItemText
                                    onClick={() => navigate(`/profile/${topUsers[1].id}`)}
                                    primary={`${topUsers[1].first_name || ''} ${topUsers[1].last_name || ''}`.trim()}
                                    // secondary={topUsers[1].username !== null && topUsers[1].username.length > 0 && "@" + topUsers[1].username}
                                    // secondary={filter === 'repeats' ? `Повторы: ${topUsers[1].repeats}` :
                                    //     filter === 'refs' ? `Рефы: ${topUsers[1].refs}` :
                                    //         `Количество созданных: ${topUsers[1].creationCount}`}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: {
                                                xs: '0.75rem',
                                                sm: '0.8rem',
                                                md: '0.8rem',
                                            },
                                            display: "flex",
                                            justifyContent: "center"
                                        }
                                    }}
                                />
                                <p style={{ display: "flex", justifyContent: "center", marginTop: "-8px" }}>
                                    {
                                        filter === 'repeats' ? `${numParseWord(topUsers[1].repeats_count)}` :
                                            filter === 'refs' ? `${numParseWord(topUsers[1].ref_payments)}  / ${numParseWord(topUsers[1].refs)}` :
                                                `${numParseWord(topUsers[1].creationCount)}`
                                    }
                                </p>
                            </div>
                        </TopUser>
                    )}
                    {topUsers[0] && (
                        <TopUser position="gold">
                            <ListItemAvatar sx={{ display: "flex", justifyContent: "center", position: "relative" }}>
                                <Avatar src={topUsers[0].photo_url} sx={{width: {
                                        xs: '6rem',
                                        sm: '6rem',
                                        md: '11rem',
                                    }, height: {
                                        xs: '6rem',
                                        sm: '6rem',
                                        md: '11rem',
                                    }}} />
                                <span style={{ position: "absolute", top: '90%', fontSize: "12px", background: "rgb(224,193,49)", color: "white", padding: 2, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    1
                                </span>
                            </ListItemAvatar>
                            <div>
                                <ListItemText
                                    onClick={() => navigate(`/profile/${topUsers[0].id}`)}
                                    primary={`${topUsers[0].first_name || ''} ${topUsers[0].last_name || ''}`.trim()}
                                    // secondary={topUsers[0].username !== null && topUsers[0].username.length > 0 && "@" + topUsers[0].username}
                                    // secondary={filter === 'repeats' ? `Повторы: ${topUsers[0].repeats}` :
                                    //     filter === 'refs' ? `Рефы: ${topUsers[0].refs}` :
                                    //         `Количество созданных: ${topUsers[0].creationCount}`}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: {
                                                xs: '0.75rem',
                                                sm: '0.8rem',
                                                md: '0.8rem',
                                            },
                                            cursor: "pointer",
                                            display: "flex",
                                            justifyContent: "center",
                                        },
                                    }}
                                />
                                <p style={{ display: "flex", justifyContent: "center", marginTop: "-8px" }}>
                                    {
                                        filter === 'repeats' ? `${numParseWord(topUsers[0].repeats_count)}` :
                                            filter === 'refs' ? `${numParseWord(topUsers[0].ref_payments)}  / ${numParseWord(topUsers[0].refs)}` :
                                                `${numParseWord(topUsers[0].creationCount)}`
                                    }
                                </p>
                            </div>
                        </TopUser>
                    )}
                    {topUsers[2] && (
                        <TopUser position="bronze">
                            <ListItemAvatar sx={{ display: "flex", justifyContent: "center", position: "relative" }}>
                                <Avatar src={topUsers[2].photo_url} sx={{width: {
                                        xs: '5rem',
                                        sm: '5rem',
                                        md: '11rem',
                                    }, height: {
                                        xs: '5rem',
                                        sm: '5rem',
                                        md: '11rem',
                                    }}} />
                                    <span style={{ position: "absolute", top: '90%', fontSize: "12px", background: "rgba(219,108,43,1)", color: "white", padding: 2, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        3
                                    </span>
                            </ListItemAvatar>
                            <div>
                                <ListItemText
                                    onClick={() => navigate(`/profile/${topUsers[2].id}`)}
                                    primary={`${topUsers[2].first_name || ''} ${topUsers[2].last_name || ''}`.trim()}
                                    // secondary={topUsers[2].username !== null && topUsers[2].username.length > 0 && "@" + topUsers[2].username}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: {
                                                xs: '0.75rem',
                                                sm: '0.8rem',
                                                md: '0.8rem',
                                            },
                                            display: "flex",
                                            justifyContent: "center"
                                        }
                                    }}
                                />
                                <p style={{ display: "flex", justifyContent: "center", marginTop: "-8px" }}>
                                    {
                                        filter === 'repeats' ? `${numParseWord(topUsers[2].repeats_count)}` :
                                            filter === 'refs' ? `${numParseWord(topUsers[2].ref_payments)} / ${numParseWord(topUsers[2].refs)}` :
                                                `${numParseWord(topUsers[2].creationCount)}`
                                    }
                                </p>
                            </div>
                        </TopUser>
                    )}
                </MiddleUsers>

                {/* Остальные пользователи */}
                <List>
                    {sortUsers(filter).slice(3).map((user, index) => (
                        <ListItem key={index} sx={{ padding: "0 5px" }} onClick={() => navigate(`/profile/${user.id}`)}>
                            <ListItemAvatar>
                                <Avatar src={user.photo_url} />
                            </ListItemAvatar>
                            <div style={{ borderBottom: "1px solid #edeef0", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <ListItemText
                                    primary={`${user.first_name || ''} ${user.last_name || ''}`}
                                    // secondary={user.username !== null && user.username.length > 0 && "@" + user.username}
                                    secondary={
                                        <p className={"text-muted"}>
                                            {
                                                filter === 'repeats' ? `${numParseWord(user.repeats_count)}` :
                                                    filter === 'refs' ? `${numParseWord(user.ref_payments)} / ${numParseWord(user.refs)}` :
                                                        `${numParseWord(user.creationCount)}`
                                            }
                                        </p>
                                    }
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: {
                                                xs: '0.75rem',
                                                sm: '0.8rem',
                                                md: '0.8rem',
                                            }
                                        }
                                    }}
                                />
                                <span className={"text-muted"}>
                                    {index + 4}
                                </span>
                            </div>
                        </ListItem>
                    ))}
                </List>
            </div>
        </div>
    );
};

export default Rating;
