import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { ExpenseContext } from '../context/ExpenseContext';
import { colors } from '../theme/colors';

const CURRENCIES = [
  { label: 'USD', symbol: '$' },
  { label: 'EUR', symbol: '€' },
  { label: 'TRY', symbol: '₺' },
  { label: 'IQD', symbol: 'د.ع' },
  { label: 'GBP', symbol: '£' },
  { label: 'EGP', symbol: 'ج.م' },
];

export default function ProfileScreen() {
  const { user, userProfile, updateCurrency, logout } = useContext(AuthContext);
  const { monthlyBudget, updateBudget } = useContext(ExpenseContext);
  const [budgetInput, setBudgetInput] = useState('');

  const currentCurrency = userProfile?.currencySymbol || '$';

  useEffect(() => {
    if (monthlyBudget !== undefined) {
      setBudgetInput(monthlyBudget.toString());
    }
  }, [monthlyBudget]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const handleSaveBudget = async () => {
    const budgetValue = parseFloat(budgetInput);
    if (isNaN(budgetValue) || budgetValue < 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid positive number.');
      return;
    }
    await updateBudget(budgetValue);
    Alert.alert('Success', 'Budget updated successfully!');
  };

  const handleCurrencySelect = async (symbol) => {
    try {
      await updateCurrency(symbol);
    } catch (error) {
      Alert.alert('Error', 'Failed to update currency');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Profile</Text>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Logged in as:</Text>
            <Text style={styles.emailText}>{user?.email}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Currency Selection</Text>
            <View style={styles.currencyGrid}>
              {CURRENCIES.map((cur) => (
                <TouchableOpacity
                  key={cur.symbol}
                  style={[
                    styles.currencyBadge,
                    currentCurrency === cur.symbol && styles.currencyBadgeActive
                  ]}
                  onPress={() => handleCurrencySelect(cur.symbol)}
                >
                  <Text style={[
                    styles.currencyText,
                    currentCurrency === cur.symbol && styles.currencyTextActive
                  ]}>
                    {cur.label} ({cur.symbol})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Budget</Text>
            <View style={styles.budgetInputContainer}>
              <Text style={styles.currencySymbol}>{currentCurrency}</Text>
              <TextInput
                style={styles.budgetInput}
                keyboardType="decimal-pad"
                value={budgetInput}
                onChangeText={setBudgetInput}
                placeholder="0.00"
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveBudget}>
              <Text style={styles.saveButtonText}>Save Budget</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  currencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  currencyBadgeActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  currencyText: {
    fontSize: 14,
    color: colors.text,
  },
  currencyTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 18,
    color: colors.textSecondary,
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 18,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
