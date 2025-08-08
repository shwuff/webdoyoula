import React, { useState } from 'react'
import {
    Card,
    CardHeader,
    CardActions,
    IconButton,
    Button,
    Chip,
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { motion } from 'framer-motion'
import {useTranslation} from "react-i18next";
import {useWebSocket} from "../../../context/WebSocketContext";
import {useAuth} from "../../../context/UserContext";
import StyledTextarea from "../../../components/input/StyledTextarea";

export default function MyLorasList({ myLoras }) {
    const [editId, setEditId] = useState(null);
    const [newName, setNewName] = useState('');
    const {t} = useTranslation();
    const {sendData} = useWebSocket();
    const {token} = useAuth();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedLora, setSelectedLora] = useState(null)
    const [confirmInput, setConfirmInput] = useState('')

    const onRename = (lora_id, lora_name) => {
        sendData({
            action: "lora/rename",
            data: {
                jwt: token,
                lora_id: lora_id,
                lora_name: lora_name,
            }
        });
    }

    const onDelete = (lora_id) => {
        sendData({
            action: 'lora/delete',
            data: { jwt: token, lora_id }
        });
        setDeleteDialogOpen(false);
        setConfirmInput('');
    }

    const startEdit = (lora) => {
        setEditId(lora.id)
        setNewName(lora.name)
    }

    const confirmRename = () => {
        if (editId !== null) {
            onRename(editId, newName.trim() || newName)
            setEditId(null)
        }
    }

    const cancelRename = () => {
        setEditId(null)
    }

    const handleDeleteClick = (lora) => {
        setSelectedLora(lora)
        setConfirmInput('')
        setDeleteDialogOpen(true)
    }

    const handleDialogCancel = () => {
        setDeleteDialogOpen(false)
        setConfirmInput('')
    }

    return (
        <Box display="grid" gap={2}>
            {myLoras.map((lora) => (
                <motion.div
                    key={lora.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Card variant="outlined">
                        <CardHeader
                            sx={{
                                paddingBottom: 0
                            }}
                            title={
                                editId === lora.id ? (
                                    <StyledTextarea
                                        minRows={1}
                                        maxRows={1}
                                        fullWidth
                                        variant="standard"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                ) : (
                                    <div className={"d-flex align-items-center"} style={{ gap: "10px" }}>
                                        <Typography variant="h6">{lora.name}</Typography>
                                        {
                                            editId === lora.id ? null : (
                                                <Chip
                                                    label={t('lora_status_' + lora.status)}
                                                    size="small"
                                                    color={lora.status === 'ready' ? 'success' : 'warning'}
                                                />
                                            )
                                        }
                                    </div>
                                )
                            }
                        />
                        <CardActions sx={{ paddingTop: "4px" }}>
                            {editId === lora.id ? (
                                <>
                                    <Button
                                        startIcon={<SaveIcon />}
                                        size="small"
                                        onClick={confirmRename}
                                    >
                                        {t('Save')}
                                    </Button>
                                    <Button
                                        startIcon={<CancelIcon />}
                                        size="small"
                                        onClick={cancelRename}
                                    >
                                        {t('Cancel')}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <IconButton
                                        size="small"
                                        onClick={() => startEdit(lora)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteClick(lora)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            )}
                        </CardActions>
                    </Card>
                </motion.div>
            ))}

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDialogCancel}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(2px)',
                    }
                }}
                PaperProps={{
                    sx: {
                        background: 'var(--glass-bg)',
                        boxShadow: 'none',
                        borderRadius: 2,
                        p: 2,
                        backdropFilter: 'blur(8px)'
                    }
                }}
            >
                <DialogTitle>{t('Confirm Deletion')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('To delete the model, please type its name:')}
                        <br />
                        <strong>{selectedLora?.name}</strong>
                    </DialogContentText>
                    <StyledTextarea
                        autoFocus
                        margin="dense"
                        label={t('Model Name')}
                        fullWidth
                        variant="standard"
                        value={confirmInput}
                        onChange={(e) => setConfirmInput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogCancel}>{t('Cancel')}</Button>
                    <Button
                        color="error"
                        onClick={() => onDelete(selectedLora.id)}
                        disabled={confirmInput !== selectedLora?.name}
                    >
                        {t('Delete')}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    )
}
