import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../providers/UserContext';
import { getOnboardingSteps } from '../config/constants/onboardingSteps';
import { useTranslation } from 'react-i18next';

/**
 * Hook для управления онбордингом
 */
export const useOnboarding = () => {
    const { userData } = useAuth();
    const { t } = useTranslation();
    const joyrideRef = useRef();
    const [skipAvailable, setSkipAvailable] = useState(true);

    const onboardingSteps = getOnboardingSteps(t);

    useEffect(() => {
        if (userData && userData.view_instruction === false) {
            setSkipAvailable(false);
            joyrideRef.current?.start();
        }
    }, [userData]);

    return { joyrideRef, skipAvailable, onboardingSteps };
};
