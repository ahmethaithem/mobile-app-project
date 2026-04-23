import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShoppingBag, Bus, BookOpen, Coffee, CreditCard, DollarSign } from 'lucide-react-native';
import { colors } from '../theme/colors';

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'food': return <Coffee size={24} color={colors.primary} />;
    case 'transport': return <Bus size={24} color={colors.primary} />;
    case 'studies': return <BookOpen size={24} color={colors.primary} />;
    case 'shopping': return <ShoppingBag size={24} color={colors.primary} />;
    default: return <CreditCard size={24} color={colors.primary} />;
  }
};

export default function TransactionCard({ transaction, currencySymbol = '$' }) {
  const isIncome = transaction.type === 'income';

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        {isIncome ? <DollarSign size={24} color={colors.success} /> : getCategoryIcon(transaction.category)}
      </View>
      <View style={styles.details}>
        <Text style={styles.category}>{transaction.category}</Text>
        <Text style={styles.date}>{new Date(transaction.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: isIncome ? colors.success : colors.danger }]}>
          {isIncome ? '+' : '-'}{currencySymbol}{parseFloat(transaction.amount).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
