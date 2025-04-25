import api from './apiService';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    signOut,
    UserCredential,
    User
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../config/firebase';

// Email/Password Authentication
export const login = async (email: string, password: string): Promise<User> => {
    try {
        // First authenticate with Firebase (client-side)
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Get the ID token from Firebase
        const idToken = await user.getIdToken();
        
        // Store the Firebase token immediately to ensure we have authentication
        localStorage.setItem('authToken', idToken);
        
        try {
            // Try to call backend login endpoint
            const response = await api.post('/auth/login/email', { email, password });
            
            // If successful, update tokens from backend response
            if (response.data && response.data.idToken) {
                localStorage.setItem('authToken', response.data.idToken);
                localStorage.setItem('refreshToken', response.data.refreshToken || '');
                localStorage.setItem('tokenExpiry', (Date.now() + (parseInt(response.data.expiresIn) * 1000)).toString());
            }
        } catch (backendError) {
            // Log but continue with Firebase token if backend is unreachable
            console.warn('Backend authentication failed, using Firebase token instead:', backendError);
        }
        
        // Store basic user info
        localStorage.setItem('user_info', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || email.split('@')[0],
            photoURL: user.photoURL || 'https://res.cloudinary.com/dhatjk5lm/image/upload/v1744169461/profile-placeholder.jpg'
        }));
        
        return user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const register = async (email: string, password: string, displayName: string) => {
    try {
        // Register through your backend without capturing the response
        await api.post('/auth/register', {
            email,
            password,
            displayName
        });
        
        // After successful backend registration, sign in with Firebase client
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

// Social Authentication
export const loginWithGoogle = async (): Promise<User> => {
    try {
        // Authenticate with Google via Firebase
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;
        
        // Get the ID token from Firebase
        const idToken = await user.getIdToken();
        
        // Store the Firebase token immediately to ensure we have authentication
        localStorage.setItem('authToken', idToken);
        
        // Store basic user info immediately
        const userInfo = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        
        try {
            // Try to call backend to register/login the user
            const response = await api.post('/auth/login/social', {}, {
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            });
            
            // If successful, update user info from backend response
            if (response.data && response.data.uid) {
                const updatedUserInfo = {
                    uid: response.data.uid,
                    email: response.data.email || user.email,
                    displayName: response.data.displayName || user.displayName,
                    photoURL: response.data.photoURL || user.photoURL
                };
                localStorage.setItem('user_info', JSON.stringify(updatedUserInfo));
            }
        } catch (backendError) {
            // Log but continue with Firebase authentication if backend is unreachable
            console.warn('Backend social authentication failed, using Firebase authentication instead:', backendError);
        }
        
        return user;
    } catch (error) {
        console.error('Google login error:', error);
        throw error;
    }
};

export const loginWithFacebook = async (): Promise<User> => {
    try {
        const userCredential = await signInWithPopup(auth, facebookProvider);
        
        // Get the ID token from Firebase
        const idToken = await userCredential.user.getIdToken();
        
        // Call backend to register/login the user with the token in Authorization header
        const response = await api.post('/auth/login/social', {}, {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });
        
        // Store the token in localStorage
        localStorage.setItem('authToken', idToken);
        
        // Store additional user info from backend response
        if (response.data && response.data.uid) {
            localStorage.setItem('user_info', JSON.stringify({
                uid: response.data.uid,
                email: response.data.email || userCredential.user.email,
                displayName: response.data.displayName || userCredential.user.displayName,
                photoURL: response.data.photoURL || userCredential.user.photoURL
            }));
        }
        
        return userCredential.user;
    } catch (error) {
        console.error('Facebook login error:', error);
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    try {
        // Sign out from Firebase first (this doesn't require network)
        await signOut(auth);
        
        try {
            // Call backend logout endpoint (may fail if network is down)
            await api.post('/auth/logout');
        } catch (networkError) {
            // Log but don't throw - we still want to clear local storage
            console.warn('Backend logout failed, but continuing with local logout:', networkError);
        }
        
        // Clear all auth-related items from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('user_info');
        
        console.log('Logout successful - all tokens cleared');
    } catch (error) {
        console.error('Logout error:', error);
        
        // Even if there's an error, try to clear localStorage
        try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('user_info');
        } catch (localStorageError) {
            console.error('Failed to clear localStorage during logout:', localStorageError);
        }
        
        throw error;
    }
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};
