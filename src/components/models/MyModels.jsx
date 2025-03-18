import React, { memo } from 'react';
import styles from "../../pages/user/css/Profile.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

const MyModelCard = ({ model, index }) => {
    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

    const style = useSpring({
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0px)' : 'translateY(40px)',
        config: { tension: 120, friction: 18 },
        delay: inView ? Math.min(index * 50, 300) : 0,
    });

    return (
        <animated.div ref={ref} style={style} className={styles.modelCard}>
            <div className={styles.modelInfo}>
                <h4 className={styles.modelName}>{model.name}</h4>
                <p><strong>Пол: </strong> {model.gender || 'Не указан'}</p>
                <p>
                    <strong>Статус: </strong>
                    <span
                        style={model.status === 'ready' ? { color: 'green' } : model.status === 'training' ? { color: "darkgreen" } : { color: "red" }}
                    >
                        {model.status || 'Не указан'}
                    </span>
                </p>
            </div>
            <div className={styles.linkModel}>
                <FontAwesomeIcon icon={faArrowRight} />
            </div>
        </animated.div>
    );
};

const areEqual = (prevProps, nextProps) => prevProps.model === nextProps.model && prevProps.index === nextProps.index;

const MemoizedModelCard = memo(MyModelCard, areEqual);

const MyModels = ({ myModels }) => {
    return (
        <div>
            {myModels && myModels.length > 0 ? (
                myModels.map((model, index) => (
                    <MemoizedModelCard key={model.id} model={model} index={index} />
                ))
            ) : (
                <p>Моделей нет</p>
            )}
        </div>
    );
};

export default MyModels;
