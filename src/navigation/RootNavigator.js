import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

export default function RootNavigator() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
}
