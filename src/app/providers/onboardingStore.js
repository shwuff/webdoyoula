import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    return (
        <OnboardingContext.Provider value={{
            run,
            stepIndex,
            start: () => { setRun(true); setStepIndex(0); },
            next: () => setStepIndex(i => i + 1),
            stop: () => { setRun(false); setStepIndex(0); }
        }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export const useOnboarding = () => useContext(OnboardingContext);
