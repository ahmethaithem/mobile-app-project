import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExpenseContext } from '../context/ExpenseContext';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

const CATEGORIES = ['food', 'transport', 'studies', 'shopping', 'car loan', 'other'];

export default function AddTransactionScreen({ navigation }) {
  const { addTransaction } = useContext(ExpenseContext);
  const { userProfile } = useContext(AuthContext);

  const currentCurrency = userProfile?.currencySymbol || '$';

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [customCategory, setCustomCategory] = useState('');
  const [type, setType] = useState('expense');

  const handleSave = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid number.');
      return;
    }

    try {
      let finalCategory = category;
      if (type === 'income') {
        finalCategory = 'income';
      } else if (category === 'other') {
        finalCategory = customCategory.trim() || 'other';
      }

      await addTransaction({
        amount: parseFloat(amount),
        category: finalCategory,
        type,
        date: new Date().toISOString(),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Add Transaction</Text>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'expense' && styles.typeExpenseActive]}
              onPress={() => setType('expense')}
            >
              <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === 'income' && styles.typeIncomeActive]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>Income</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount ({currentCurrency})</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {type === 'expense' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryBadge, category === cat && styles.categoryBadgeActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {category === 'other' && (
                <View style={[styles.inputGroup, { marginTop: 16 }]}>
                  <Text style={styles.label}>Custom Category</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter category name"
                    value={customCategory}
                    onChangeText={setCustomCategory}
                  />
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Transaction</Text>
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
  scrollContent: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeExpenseActive: {
    backgroundColor: colors.danger,
  },
  typeIncomeActive: {
    backgroundColor: colors.success,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeTextActive: {
    color: colors.textInverse,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    color: colors.text,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryBadgeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    textTransform: 'capitalize',
  },
  categoryTextActive: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
