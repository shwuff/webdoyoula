import React from 'react';
import {Button} from "@mui/material";
import Modal from "../modal/Modal";
import styles from "../../pages/user/css/Profile.module.css";
import CloseButton from "../buttons/CloseButton";
import {useAuth} from "../../context/UserContext";
import ModelInstructionPage from "./ModelInstructionPage";

const ModelInstructionModal = ({ description }) => {

    const { userData } = useAuth();

    const [open, setOpen] = React.useState(false);

    if(description === undefined || description === null) {
        return null;
    }

    return (
        <div>
            <Button variant={"action"} onClick={() => setOpen(true)}>
                Узнать подробнее
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