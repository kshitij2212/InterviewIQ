import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: localStorage.getItem('token') || null,
            isAuthenticated: !!localStorage.getItem('token'),

            setAuth: (user, token) => {
                localStorage.setItem('token', token);
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false });
            },

            fetchUser: async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) return;

                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        set({ user: data.data.user, isAuthenticated: true });
                    } else {
                        localStorage.removeItem('token');
                        set({ user: null, token: null, isAuthenticated: false });
                    }
                } catch (error) {
                    console.error('Failed to sync user profile:', error);
                }
            },

            updateName: async (newName) => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) return;

                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'}/auth/me`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: newName })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        set({ user: data.data.user });
                        return true;
                    }
                } catch (error) {
                    console.error('Failed to update name:', error);
                }
                return false;
            }
        }),
        {
            name: 'auth-storage',
        }
    )
);
