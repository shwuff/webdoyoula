import { useRef } from 'react';
import {
    Box,
    TextField
} from '@mui/material';
import "./SnakeBorder.css";
import LucideIcon from "../../../../assets/icons/LucideIcon";
import MediaList from "../mediaList";
import {useTranslation} from "react-i18next";

const IdeaInputField = ({ setStartMessage, startMessage, handleNewChat, loading, uploadedMedia, handleFileSelect }) => {

    const {t} = useTranslation();

    const fileInputRef = useRef(null);

    return (
        <Box className="animated-gradient-border duration-200" sx={{ maxWidth: '800px', width: "100%", mx: 'auto', borderRadius: '18px', padding: '3px' }}>
            <Box sx={{ bgcolor: 'var(--bg-color)', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
                <MediaList mediaList={uploadedMedia} />
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    InputProps={{ sx: { color: 'var(--text-color)', background: "var(--bg-color)", fontSize: '1rem', border: 'none', padding: '16px', '&::placeholder': { color: 'var(--text-secondary-color)', opacity: 0.7 } } }}
                    sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }, '& textarea': { resize: 'none', background: "var(--bg-color)", overflowY: 'auto', scrollbarWidth: 'thin', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: 'transparent', borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(0, 153, 255, 0.3)', borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(0, 153, 255, 0.5)' } } }}
                    placeholder={t('Ask Anything...')}
                    value={startMessage}
                    onChange={(e) => setStartMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleNewChat();
                        }
                    }}
                />

                <div className={"d-flex justify-content-between"} style={{ marginTop: 4, padding: "8px" }}>
                    <span
                        className={"d-flex align-items-center justify-content-center"}
                        style={{ borderRadius: "50%", width: 32, height: 32, cursor: 'pointer' }}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <LucideIcon name={"Plus"} color={"var(--text-color)"} />
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />

                    <span
                        onClick={handleNewChat}
                        className={"d-flex align-items-center justify-content-center"}
                        style={{
                            backgroundColor: (loading || startMessage.length < 1) ? 'var(--hover-bg-color)' : 'var(--text-color)',
                            borderRadius: "50%",
                            width: 32,
                            height: 32,
                            cursor: (loading) ? 'wait' : startMessage.length < 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <LucideIcon name={"ArrowUp"} color={"var(--bg-color)"} />
                    </span>
                </div>
            </Box>
        </Box>
    );
};

export default IdeaInputField;
