import { useState, useEffect } from 'react';

const initBeforeUnLoad = (showExitPrompt: boolean) => {
    window.onbeforeunload = (event) => {
        console.log('beforeunload', showExitPrompt)
        if (showExitPrompt) {
            const e = event || window.event;
            e.preventDefault();
            if (e) {
                e.returnValue = '';
            }
            return '';
        }
    };
};

// Hook
export function useExitPrompt(bool: any) {
    const [showExitPrompt, setShowExitPrompt] = useState(bool);

    window.onload = function () {
        initBeforeUnLoad(showExitPrompt);
    };

    useEffect(() => {
        initBeforeUnLoad(showExitPrompt);
    }, [showExitPrompt]);

    return [showExitPrompt, setShowExitPrompt];
}