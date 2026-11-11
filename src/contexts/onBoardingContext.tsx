import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingContextType {
  isOnboarding: boolean;
  currentStep: number;
  totalSteps: number;
  startOnboarding: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);
const totalSteps = 5;

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const interacted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const completed = await AsyncStorage.getItem('hasCompletedOnboarding');
          const newUser = await AsyncStorage.getItem('isNewUser');
          if (!cancelled && !interacted.current && !completed && newUser === 'true') {
            setCurrentStep(0);
            setIsOnboarding(true);
          }
        } catch (error) {
          console.warn('No se pudo leer el estado del tutorial.', error);
        }
      })();
    }, 500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  function startOnboarding() {
    interacted.current = true;
    setCurrentStep(0);
    setIsOnboarding(true);
  }

  function finishOnboarding() {
    interacted.current = true;
    setIsOnboarding(false);
    setCurrentStep(0);
    void (async () => {
      try {
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        await AsyncStorage.removeItem('isNewUser');
      } catch (error) {
        console.warn('No se pudo guardar el estado del tutorial.', error);
      }
    })();
  }

  function nextStep() {
    if (!isOnboarding) return;
    if (currentStep >= totalSteps - 1) finishOnboarding();
    else setCurrentStep(step => Math.min(step + 1, totalSteps - 1));
  }

  function previousStep() {
    if (isOnboarding) setCurrentStep(step => Math.max(step - 1, 0));
  }

  return <OnboardingContext.Provider value={{
    isOnboarding, currentStep, totalSteps, startOnboarding, nextStep, previousStep,
    skipOnboarding: finishOnboarding, completeOnboarding: finishOnboarding,
  }}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used within OnboardingProvider');
  return context;
}
