import styles from './css/KeyHintSearch.module.css';
import {usePlatformKeyHint} from "../../utils/usePlatformKeyHint";

const KeyHint = () => {
    const platform = usePlatformKeyHint();

    if (platform === 'none') return null;

    return (
        <div className={styles.keyHint}>
            <span className={styles.keyBox} style={{ fontSize: "14px" }}>{platform === 'mac' ? '⌘' : 'Ctrl'}</span>
            <span className={styles.keyBox}>+</span>
            <span className={styles.keyBox}>K</span>
        </div>
    );
};

export default KeyHint;