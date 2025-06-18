import { TextareaAutosize } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    resize: 'none',
    fontSize: '14px',
    padding: '8px 12px',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    backgroundColor: 'var(--glass-bg)',
    color: 'var(--text-color)',
    fontFamily: 'inherit',
    lineHeight: 1.5,
    outline: 'none',
    backdropFilter: 'blur(8px)',
    '&:focus': {
        borderColor: theme.palette.primary.main,
    },
}));

export default StyledTextarea;