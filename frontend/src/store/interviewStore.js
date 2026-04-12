import { create } from 'zustand';

export const useInterviewStore = create((set) => ({
    interviewId: null,
    currentQuestion: null,
    index: 0,
    totalQuestions: 0,
    status: 'idle',
    results: null,

    setInterview: (interviewId, totalQuestions) => 
        set({ interviewId, totalQuestions, status: 'active', index: 0 }),
    
    setQuestion: (question, index) => 
        set({ currentQuestion: question, index }),

    setStatus: (status) => set({ status }),

    setResults: (results) => set({ results, status: 'completed' }),

    resetInterview: () => set({
        interviewId: null,
        currentQuestion: null,
        index: 0,
        totalQuestions: 0,
        status: 'idle',
        results: null
    })
}));
