import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClickAwayListener } from "@mui/material";
import "./css/SettingsHamburger.css";
import {useAuth} from "../../context/UserContext";
import {Link} from "react-router-dom";

export default function SettingsHamburger({ style }) {

    const { userData } = useAuth();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <div className="hamburger-container" style={style}>
                <div
                    className={`hamburger ${isOpen ? "open" : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="dropdown-menu"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ul>
                                <Link to={`/profile/${userData.id}`} onClick={() => setIsOpen(false)}>
                                    <li className={"d-flex align-items-center"}><img src={userData.photo_url} style={{width: 22, height: 22, borderRadius: "50%", marginRight: 6}} />{userData.first_name} {userData.last_name}</li>
                                </Link>
                                <Link to={`/user/settings`} onClick={() => setIsOpen(false)}>
                                    <li className={"d-flex align-items-center"}>Настройки</li>
                                </Link>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ClickAwayListener>
    );
}
