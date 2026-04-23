import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeProfile = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserProfile(docSnapshot.data());
          }
          setIsLoading(false);
        });
      } else {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, firstName, lastName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: email,
      firstName: firstName,
      lastName: lastName,
      createdAt: new Date().toISOString(),
      monthlyBudget: 0,
      currencySymbol: '$'
    });
    return userCredential;
  };

  const updateCurrency = async (symbol) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { currencySymbol: symbol });
  };

  const logout = async () => {
    return await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, isLoading, login, register, updateCurrency, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


