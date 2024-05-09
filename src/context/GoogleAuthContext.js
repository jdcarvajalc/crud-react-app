import { createContext, useContext, useEffect, useState } from "react";
import {
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";

// Create an authentication context
const GoogleAuthContext = createContext();

// Create a component that provides the authentication context to its children
export const GoogleAuthContextProvider = ({ children }) => {
    // State variables for user information
    const [googleUser, setGoogleUser] = useState({});
    const [isLoggedInWithGoogle, setIsLoggedInWithGoogle] = useState(false);

    // Create a function to sign in with Google
    const googleSignIn = async () => {
        try {
            // Create a Google provider
            const provider = new GoogleAuthProvider();
            // Sign in with Google and wait for the response
            await signInWithPopup(auth, provider);
            setIsLoggedInWithGoogle(true);
        } catch (error) {
            console.log("Error signing in with Google", error);
        }
    };

    // Create a function to sign out
    const googleLogOut = async () => {
        try {
            // Sign out with Firebase
            await signOut(auth);
            // Set the user state with init values
            setGoogleUser(null);
            setIsLoggedInWithGoogle(false);
        } catch (error) {
            console.log(error);
        }
    };

    // Use useEffect to listen for changes in the authentication state
    useEffect(() => {
        // Create a function to listen for changes in the authentication state
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setGoogleUser(currentUser);
            setIsLoggedInWithGoogle(true);
        });
        // Return a function to unsubscribe when the component is unmounted
        return () => {
            unsubscribe();
        };
    }, []);

    // Provide the authentication context to the children
    return (
        <GoogleAuthContext.Provider
            value={{
                googleUser,
                googleSignIn,
                googleLogOut,
                isLoggedInWithGoogle,
            }}
        >
            {children}
        </GoogleAuthContext.Provider>
    );
};

// Create a hook to consume the authentication context
export const useGoogleAuth = () => useContext(GoogleAuthContext);
