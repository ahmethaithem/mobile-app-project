import 'react-native-gesture-handler'; // required if we use stack in the future, safe to add
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { ExpenseProvider } from './src/context/ExpenseContext';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ExpenseProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
            <RootNavigator />
          </NavigationContainer>
        </ExpenseProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
