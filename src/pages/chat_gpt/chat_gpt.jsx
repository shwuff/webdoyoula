import React, { useState } from "react";
import "./style.css";
import SmartDropdown from "../../components/teegee/SmartDropdown/SmartDropdown";
import {useAuth} from "../../context/UserContext";

const models = [
    {label: "gpt-4o", value: "gpt-4o"},
    {label: "gpt-4", value: "gpt-4"},
    {label: "gpt-3.5", value: "gpt-3.5"}
];

export default function ChatGPTMock() {
    const initialChats = [
        { id: 1, title: "New chat" },
        { id: 2, title: "Chat about project" },
        { id: 3, title: "Ideas" },
        { id: 4, title: "Shopping list" },
        { id: 5, title: "Work notes" },
    ];

    const {userData} = useAuth();

    const [chats, setChats] = useState(initialChats);
    const [activeId, setActiveId] = useState(1);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedModel, setSelectedModel] = useState("gpt-4o");

    function handleEdit(id) {
        alert(`Edit (mock) chat ${id}`);
        setMenuOpenId(null);
    }
    function handleArchive(id) {
        alert(`Archive (mock) chat ${id}`);
        setMenuOpenId(null);
    }
    function handleDelete(id) {
        // if (!confirm("Delete chat?")) return;
        setChats((s) => s.filter((c) => c.id !== id));
        if (activeId === id && chats.length > 1) setActiveId(chats[0].id);
        setMenuOpenId(null);
    }

    return (
        <div className="cg-wrap-full">

            <div className={`cg-wrap ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
                <aside className={`cg-sidebar ${sidebarOpen ? "open" : "closed"}`} style={sidebarOpen ? { backgroundColor: "transparent" } : {display: "none"}}>
                    <div className="sb-top">
                        <button className="new-chat">＋ New chat</button>
                        <div className="sb-model">
                            <span>GPT</span>
                            <div className="model-pill">{selectedModel}</div>
                        </div>
                    </div>

                    <nav className="chat-list">
                        {chats.map((c) => (
                            <div
                                key={c.id}
                                className={`chat-item ${c.id === activeId ? "active" : ""}`}
                                onClick={() => setActiveId(c.id)}
                            >
                                <div className="chat-left">
                                    <div className="chat-dot" />
                                    <div className="chat-title">{c.title}</div>
                                </div>

                                <div className="chat-actions">
                                    <button
                                        className="menu-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuOpenId((prev) => (prev === c.id ? null : c.id));
                                        }}
                                        aria-haspopup="true"
                                        aria-expanded={menuOpenId === c.id}
                                        title="Open menu"
                                    >
                                        ⋯
                                    </button>

                                    {menuOpenId === c.id && (
                                        <div
                                            className="context-menu"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button onClick={() => handleEdit(c.id)}>Редактировать</button>
                                            <button onClick={() => handleArchive(c.id)}>Архивировать</button>
                                            <button className="danger" onClick={() => handleDelete(c.id)}>Удалить</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </nav>

                    <div className="sb-footer">
                        <div className="account">
                            <img className={"avatar"} src={userData.photo_url} />
                            <div className="acc-info">
                                <div className="acc-name">{userData.first_name} {userData.last_name}</div>
                                <div className="acc-email">{userData.username}</div>
                            </div>
                        </div>
                        <button className="settings">⚙</button>
                    </div>
                </aside>

                <main className="cg-main">
                    <header className="main-header">
                        <div className={"d-flex"} style={{ gap: "10px" }}>
                            <button
                                className="mobile-chats-btn"
                                onClick={() => setSidebarOpen((s) => !s)}
                                aria-label="Toggle chats"
                            >
                                ☰ Чаты
                            </button>
                            <div className="title-block">
                                <SmartDropdown options={models} selected={selectedModel} setSelected={setSelectedModel} />
                            </div>
                        </div>

                        <div className="header-controls">

                        </div>
                    </header>

                    <section className="conversation">
                        <div className="conv-placeholder">
                            <div className="big-hint">Welcome to the mock ChatGPT</div>
                            <div className="small-hint">
                                This is a static mock — UI only. Use the chats button on mobile to open the list.
                            </div>
                        </div>
                    </section>

                    <footer className="main-footer">
                        <div className="footer-left">
                            {/*<button className="toolbar-btn">＋</button>*/}
                            {/*<button className="toolbar-btn">🎤</button>*/}
                        </div>
                        <div className="input-wrap">
                            <input className="message-input" placeholder="Ask anything" />
                            <button className="send-btn">Send</button>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}
