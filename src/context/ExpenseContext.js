import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setMonthlyBudget(0);
      setIsLoading(false);
      return;
    }

    // Listen to transactions
    const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubscribeTransactions = onSnapshot(q, (querySnapshot) => {
      const transArray = [];
      querySnapshot.forEach((doc) => {
        transArray.push({ id: doc.id, ...doc.data() });
      });
      // Sort by date descending
      transArray.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(transArray);
      setIsLoading(false);
    });

    // Listen to user budget
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setMonthlyBudget(docSnapshot.data().monthlyBudget || 0);
      }
    });

    return () => {
      unsubscribeTransactions();
      unsubscribeUser();
    };
  }, [user]);

  const addTransaction = async (transaction) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        userId: user.uid,
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
  };

  const removeTransaction = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Error removing document: ', error);
      throw error;
    }
  };

  const updateBudget = async (newBudget) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        monthlyBudget: newBudget,
      });
    } catch (error) {
      console.error('Error updating budget: ', error);
      throw error;
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <ExpenseContext.Provider value={{
      transactions,
      addTransaction,
      removeTransaction,
      updateBudget,
      totalIncome,
      totalExpense,
      balance,
      monthlyBudget,
      isLoading
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
