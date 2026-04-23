import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, List, PlusCircle, PieChart, User } from 'lucide-react-native';

import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Dashboard') {
            return <LayoutDashboard color={color} size={size} />;
          } else if (route.name === 'Transactions') {
            return <List color={color} size={size} />;
          } else if (route.name === 'Add') {
            return <PlusCircle color={color} size={size} />;
          } else if (route.name === 'Stats') {
            return <PieChart color={color} size={size} />;
          } else if (route.name === 'Profile') {
            return <User color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Stats" component={StatisticsScreen} options={{ title: 'Stats' }} />
      <Tab.Screen name="Add" component={AddTransactionScreen} options={{ title: 'Add' }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
