import React, {useEffect} from 'react';
import {Button} from "@mui/material";
import Modal from "../modal/Modal";
import styles from "../../pages/user/css/Profile.module.css";
import CloseButton from "../buttons/CloseButton";
import {useAuth} from "../../context/UserContext";
import ModelInstructionPage from "./ModelInstructionPage";
import {IoInformation} from "react-icons/io5";
import {GrCircleInformation} from "react-icons/gr";

const ModelInstructionModal = ({ description, open, setOpen }) => {

    const { userData } = useAuth();

    if(description === undefined || description === null) {
        return null;
    }

    return (
        <div>
            <Button variant={"outlined"} sx={{ marginTop: "5px" }} onClick={() => setOpen(true)}>
                <GrCircleInformation /> <span style={{ marginLeft: "4px" }}>Инструкция</span>
            </Button>
            <Modal style={{display: "block"}} isOpen={open} onClose={() => setOpen(false)}>
                <div className="p-2 w-100 d-flex justify-content-between">
                    <h2>Инструкция</h2>
                    {
                        !userData.is_telegram && (
                            <CloseButton onClick={() => setOpen(false)} />
                        )
                    }
                </div>
                <ModelInstructionPage pageSetting={description} onClick={() => setOpen(false)} />
            </Modal>
        </div>
    );
};

export default ModelInstructionModal;