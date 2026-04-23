import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExpenseContext } from '../context/ExpenseContext';
import { AuthContext } from '../context/AuthContext';
import SummaryCard from '../components/SummaryCard';
import TransactionCard from '../components/TransactionCard';
import { colors } from '../theme/colors';

export default function DashboardScreen({ navigation }) {
  const { transactions, totalIncome, totalExpense, balance, monthlyBudget } = useContext(ExpenseContext);
  const { userProfile } = useContext(AuthContext);

  const currentCurrency = userProfile?.currencySymbol || '$';

  const recentTransactions = transactions.slice(0, 3); // Show top 3 recent

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {userProfile?.firstName || 'User'}!</Text>
          <Text style={styles.subtitle}>Here is your budget overview</Text>
        </View>

        <SummaryCard title="Total Balance" amount={balance} type="balance" currencySymbol={currentCurrency} />

        <View style={styles.rowCards}>
          <View style={styles.halfCard}>
            <SummaryCard title="Income" amount={totalIncome} type="income" currencySymbol={currentCurrency} />
          </View>
          <View style={styles.halfCard}>
            <SummaryCard title="Expenses" amount={totalExpense} type="expense" currencySymbol={currentCurrency} />
          </View>
        </View>

        {monthlyBudget > 0 && (
          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetTitle}>Monthly Budget</Text>
              <Text style={styles.budgetAmount}>
                {currentCurrency}{totalExpense.toFixed(2)} / {currentCurrency}{monthlyBudget.toFixed(2)}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${Math.min((totalExpense / monthlyBudget) * 100, 100)}%` },
                  totalExpense > monthlyBudget && { backgroundColor: colors.danger }
                ]} 
              />
            </View>
            {totalExpense > monthlyBudget && (
              <Text style={styles.overBudgetText}>You have exceeded your budget!</Text>
            )}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length > 0 ? (
          recentTransactions.map(t => <TransactionCard key={t.id} transaction={t} currencySymbol={currentCurrency} />)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet.</Text>
            <Text style={styles.emptySubText}>Add one to get started!</Text>
          </View>
        )}
      </ScrollView>
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
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  rowCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  halfCard: {
    width: '48%',
  },
  budgetCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  budgetAmount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  overBudgetText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
