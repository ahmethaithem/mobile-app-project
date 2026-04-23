import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function SummaryCard({ title, amount, type, currencySymbol = '$' }) {
  const isBalance = type === 'balance';
  const isIncome = type === 'income';
  const isExpense = type === 'expense';

  return (
    <View style={[
      styles.card,
      isBalance && styles.balanceCard,
      isIncome && styles.incomeCard,
      isExpense && styles.expenseCard,
    ]}>
      <Text style={[
        styles.title,
        isBalance && styles.balanceText
      ]}>{title}</Text>
      <Text style={[
        styles.amount,
        isBalance && styles.balanceText,
        isIncome && styles.incomeText,
        isExpense && styles.expenseText,
      ]}>
        {currencySymbol}{parseFloat(amount).toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  incomeCard: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  expenseCard: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  balanceText: {
    color: colors.textInverse,
  },
  incomeText: {
    color: colors.success,
  },
  expenseText: {
    color: colors.danger,
  },
});
