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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Call backend login endpoint
        await api.post('/auth/login/email', { email, password });
        
        // Store the token in localStorage
        const idToken = await userCredential.user.getIdToken();
        localStorage.setItem('authToken', idToken);
        
        return userCredential.user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const register = async (email: string, password: string, displayName: string): Promise<User> => {
    try {
        // Register with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update profile with display name
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName });
        }

        // Register with backend
        await api.post('/auth/register', {
            email,
            password,
            displayName,
            photoURL: auth.currentUser?.photoURL || ''
        });

        // Store the token in localStorage
        const idToken = await userCredential.user.getIdToken();
        localStorage.setItem('authToken', idToken);
        
        return userCredential.user;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

// Social Authentication
export const loginWithGoogle = async (): Promise<User> => {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        
        // Get the ID token
        const idToken = await userCredential.user.getIdToken();
        localStorage.setItem('authToken', idToken);
        
        // Call backend to register/login the user
        await api.post('/auth/login/social');
        
        return userCredential.user;
    } catch (error) {
        console.error('Google login error:', error);
        throw error;
    }
};

export const loginWithFacebook = async (): Promise<User> => {
    try {
        const userCredential = await signInWithPopup(auth, facebookProvider);
        
        // Get the ID token
        const idToken = await userCredential.user.getIdToken();
        localStorage.setItem('authToken', idToken);
        
        // Call backend to register/login the user
        await api.post('/auth/login/social');
        
        return userCredential.user;
    } catch (error) {
        console.error('Facebook login error:', error);
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    try {
        // Call backend logout endpoint
        await api.post('/auth/logout');
        
        // Sign out from Firebase
        await signOut(auth);
        
        // Clear the token from localStorage
        localStorage.removeItem('authToken');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};
