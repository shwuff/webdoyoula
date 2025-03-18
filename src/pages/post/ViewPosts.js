import React, { useState, useRef, useEffect } from 'react';
import styles from './css/ViewPosts.module.css';
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane, FaBookmark, FaRetweet } from 'react-icons/fa';
import {useWebSocket} from "../../context/WebSocketContext";
import {useAuth} from "../../context/UserContext";
import Modal from 'react-modal';

const ViewPosts = ({ posts, images, user, setPosts }) => {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedPost, setSelectedPost] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
    const [carouselStates, setCarouselStates] = useState({});
    const postRefs = useRef([]);
    const postKeys = useRef(new Map());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [caption, setCaption] = useState('');
    const [comments, setComments] = useState([]);
    const [text,setText] = useState("");
    const [selectedPostForComment, setSelectedPostForComment] = useState(null);

    const {addHandler, deleteHandler, sendData} = useWebSocket();
    const {userData, token} = useAuth();

    const openModal = (post) => {
        if (!post) return;
        setSelectedPostForComment(post);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPostForComment(null);
    };

    useEffect(() => {
        const newKeys = new Map();
        posts.forEach((post, index) => {
            newKeys.set(post, `post-${index}-${performance.now()}`);
        });
        postKeys.current = newKeys;
    }, [posts]);

    useEffect(() => {
        const BackButton = window.Telegram.WebApp.BackButton;
        if (viewMode === 'list') {
            BackButton.show();
            BackButton.onClick(() => setViewMode('grid'));
        }
        return () => {
            BackButton.hide();
            BackButton.offClick();
        };
    }, [viewMode]);

    useEffect(() => {
        if (viewMode === 'list' && selectedPost) {
            const postIndex = posts.findIndex(p => p === selectedPost);
            postRefs.current[postIndex]?.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    }, [viewMode, selectedPost, posts]);

    const getAllPosts = (posts) => {
        const allPosts = [];
        const processPost = (post) => {
            allPosts.push(post);
            if (post.reposted_post) processPost(post.reposted_post);
        }
        posts.forEach(processPost);
        return allPosts;
    };

    useEffect(() => {
        const allPosts = getAllPosts(posts);
        const newKeys = new Map();
        allPosts.forEach((post, index) => {
            newKeys.set(post, `post-${index}-${performance.now()}`);
        });
        postKeys.current = newKeys;
    }, [posts]);

    const handleImageClick = post => {
        setSelectedPost(post);
        setViewMode('list');
    };

    useEffect(() => {
        localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    }, [likedPosts]);

    useEffect(() => {
        const handleLikes = (msg) => {
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.post_id === msg.postId
                        ? {
                            ...post,
                            liked: msg.result === 'create',
                            likesCount: msg.result === 'create' ? post.likesCount + 1 : post.likesCount - 1
                        }
                        : post
                )
            );

            setLikedPosts(prev => ({
                ...prev,
                [msg.postId]: msg.result === 'create'
            }));
        };

        addHandler('handle_update_like', handleLikes);
        return () => deleteHandler('handle_update_like');
    }, [userData]);

    const handleLike = (postId, userId) => {
        setLikedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));

        sendData({
            action: "handle_like_post",
            data: { jwt: token, userId: userId, postId: postId }
        });
    };

    // useEffect(() => {
    //     const handleReceiveNewComment = (msg) => {
    //         setComments((prev) => [...prev, {postId: msg.postId, userId: msg.userId, text: text, commentUser: msg.comment_user}]);
    //     }
    //
    //     addHandler('receive_new_comment', handleReceiveNewComment);
    //
    //     return () => deleteHandler('receive_new_comment');
    //
    // }, [userData]);
    //
    const handleCreateComment = (postId, userId) => {
        sendData({
            action: "create_comment",
            data: { jwt: token, userId: userId, postId: postId, text: text}
        });
    };
    //
    // useEffect(() => {
    //     const handleComments = (msg) => {
    //         console.log(msg);
    //         setComments(msg.comments);
    //     }
    //
    //     addHandler('receive_post_comments', handleComments);
    //
    //     return () => deleteHandler('receive_post_comments');
    //
    // }, [userData]);
    //
    // const handleGetComments = (postId, userId) => {
    //     sendData({
    //         action: "get_comments",
    //         data: { jwt: token, userId: userId, postId: postId}
    //     });
    // };

    const handleImageNavigation = (postKey, direction) => {
        setCarouselStates(prev => {
            const currentState = prev[postKey] || { index: 0 };
            const post = [...postKeys.current.entries()]
                .find(([, key]) => key === postKey)?.[0];

            if (!post) return prev;

            const postImages = images.filter(img => img.media_group_id === post.media_group_id);
            const newIndex = direction === 'prev'
                ? (currentState.index - 1 + postImages.length) % postImages.length
                : (currentState.index + 1) % postImages.length;

            return {
                ...prev,
                [postKey]: { index: newIndex }
            };
        });
    };

    const renderPostContent = (post, isRepost = false, repostAuthor = null) => {
        const postKey = postKeys.current.get(post);
        const postImages = images.filter(img => img.media_group_id === post.media_group_id);
        const currentIndex = carouselStates[postKey]?.index || 0;
        const author = repostAuthor || user;

        return (
            <div className={`${styles.postContent} ${isRepost ? styles.repostContent : ''}`}>
                <div className={styles.postHeader}>
                    <div className={styles.userInfo}>
                        <img
                            src={author.photo_url}
                            className={styles.avatar}
                            alt="User avatar"
                        />
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>
                                {author.first_name} {author.last_name}
                            </span>
                            <br/>
                            <span className={'text-muted'}>@{author.username}</span>
                        </div>
                    </div>
                    {isRepost && (
                        <div className={styles.repostBadge}>
                            <FaRetweet className={styles.repostIcon}/>
                            <span>Репост</span>
                        </div>
                    )}
                    <button className={styles.menuButton}>•••</button>
                </div>

                {/* Images */}
                <div className={styles.carouselContainer}>
                    {postImages.length > 1 && (
                        <>
                            <button
                                className={`${styles.carouselArrow} ${styles.left}`}
                                onClick={() => handleImageNavigation(postKey, 'prev')}
                            >
                                ‹
                            </button>
                            <button
                                className={`${styles.carouselArrow} ${styles.right}`}
                                onClick={() => handleImageNavigation(postKey, 'next')}
                            >
                                ›
                            </button>
                        </>
                    )}
                    <img
                        src={postImages[currentIndex]?.blob_url}
                        alt={post.caption}
                        className={styles.postImage}
                    />
                </div>

                <div key={post.post_id} className={styles.actionBar}>
                    <button
                        className={styles.actionButton}
                        onClick={() => handleLike(post.post_id, post.user_id)}
                    >
                        {post.liked ? (
                            <FaHeart className={styles.likedIcon}/>
                            ) : (
                            <FaRegHeart className={styles.icon} />
                            )
                        }
                </button>
                <button className={styles.actionButton}>
                    <FaComment className={styles.icon} onClick={() => {
                        // openModal(post);
                        // handleGetComments(post.post_id, post.user_id);

                    }}/>
                </button>
                <button className={styles.actionButton}>
                    <FaPaperPlane className={styles.icon}/>
                </button>
                <button className={styles.saveButton}>
                    <FaBookmark className={styles.icon}/>
                </button>
            </div>
        <div className={styles.postInfo}>
            <div className={styles.likesCounter}>
                {post.likesCount} отметок "Нравится"
            </div>
            <div className={styles.caption}>
                <span className={styles.username}>@{author.username}</span>
                        {post.caption}
                    </div>
                    {post.reposted_post && (
                        <div className={styles.repostWrapper}>
                            {renderPostContent(
                                post.reposted_post,
                                true,
                                post.reposted_post.user
                            )}
                        </div>
                    )}
                    {/*<div className={styles.commentsSection}>*/}
                    {/*    {post.comments?.slice(0, 2).map(comment => (*/}
                    {/*        <div key={comment.id} className={styles.comment}>*/}
                    {/*            <span className={styles.commentAuthor}>@{comment.username}</span>*/}
                    {/*            <span className={styles.commentText}>{comment.text}</span>*/}
                    {/*        </div>*/}
                    {/*    ))}*/}
                    {/*    <button className={styles.viewComments}>*/}
                    {/*        Показать все комментарии ({post.comments_count})*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                    {/*<div className={styles.timeAgo}>{post.time_ago}</div>*/}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {viewMode === 'grid' ? (
                <div className={styles.gridContainer}>
                    {posts.map((post, index) => {
                        const postImages = images.filter(
                            img => img.media_group_id === post.media_group_id
                        );

                        return (
                            <div
                                key={postKeys.current.get(post)}
                                ref={el => (postRefs.current[index] = el)}
                                onClick={() => handleImageClick(post)}
                                className={styles.postCard}
                            >
                                <img
                                    src={postImages[0]?.blob_url}
                                    alt={post.caption}
                                    className={styles.postImage}
                                />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.listContainer}>
                    {posts.map((post, index) => (
                        <div
                            key={postKeys.current.get(post)}
                            className={styles.listItem}
                            ref={el => (postRefs.current[index] = el)}
                            style={{
                                borderBottom: index === posts.length - 1 ? '1px solid #dbdbdb' : 'none'
                            }}
                        >
                            {renderPostContent(post)}
                        </div>
                    ))}
                </div>
            )}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel=""
                className={'modalContent'}
                overlayClassName={'modalOverlay'}
            >
                <h2 className={styles.modalTitle}>Comment</h2>
                <button onClick={closeModal} className={'btn btn-primary'}>Закрыть</button>
                <h3 className={styles.pageTitle}>Напишите свой комментарий</h3>

                <div className={styles.editBlock}>
                    <label className={styles.label}>Подпись к посту</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Напишите что-нибудь интересное..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <button
                        className={styles.saveButtoni}
                        onClick={() => {
                            if (selectedPostForComment) {
                                handleCreateComment(selectedPostForComment.post_id, selectedPostForComment.user_id);
                            }
                        }}
                    >
                        Опубликовать
                    </button>
                </div>


            </Modal>
        </div>
    );
};

export default ViewPosts;