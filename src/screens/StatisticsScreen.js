import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { ExpenseContext } from '../context/ExpenseContext';
import { colors } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

const chartColors = {
  food: '#FF6384',
  transport: '#36A2EB',
  studies: '#FFCE56',
  shopping: '#4BC0C0',
  other: '#9966FF'
};

export default function StatisticsScreen() {
  const { transactions } = useContext(ExpenseContext);

  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const categoryTotals = expenseTransactions.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    population: categoryTotals[key],
    color: chartColors[key] || chartColors.other,
    legendFontColor: colors.textSecondary,
    legendFontSize: 14
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Spending Statistics</Text>

        {chartData.length > 0 ? (
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No expenses yet to show statistics.</Text>
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
  content: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  chartContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
