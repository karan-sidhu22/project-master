import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useIsFocused } from '@react-navigation/native';

export default function GraphsScreen() {
  const [assets, setAssets] = useState<number>(0);
  const [liabilities, setLiabilities] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const screenWidth = Dimensions.get('window').width - 40;

  useEffect(() => {
    if (isFocused) {
      fetchFinancialData();
    }
  }, [isFocused]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // Get current month
      const now = new Date();
      setCurrentMonth(now.toLocaleString('default', { month: 'long', year: 'numeric' }));
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      // Fetch monthly income (which becomes our assets)
      const { data: incomeData } = await supabase
        .from('income')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', firstDay)
        .lte('date', lastDay);

      const totalIncome = incomeData?.reduce((sum, item) => sum + item.amount, 0) || 0;
      setMonthlyIncome(totalIncome);
      setAssets(totalIncome); // ASSETS = TOTAL INCOME

      // Fetch monthly expenses (treated as liabilities)
      const { data: expenseData } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', firstDay)
        .lte('date', lastDay);

      const totalExpenses = expenseData?.reduce((sum, item) => sum + item.amount, 0) || 0;
      setMonthlyExpenses(totalExpenses);
      setLiabilities(totalExpenses);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFinancialData();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading financial data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>Financial Overview - {currentMonth}</Text>

      {/* Net Worth Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Net Worth</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Assets (Income):</Text>
          <Text style={[styles.value, styles.positive]}>${assets.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Liabilities (Expenses):</Text>
          <Text style={[styles.value, styles.negative]}>-${liabilities.toFixed(2)}</Text>
        </View>
        <View style={[styles.row, styles.netWorthRow]}>
          <Text style={[styles.label, styles.boldText]}>Net Worth:</Text>
          <Text style={[
            styles.value, 
            styles.boldText,
            (assets - liabilities) >= 0 ? styles.positive : styles.negative
          ]}>
            ${(assets - liabilities).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Assets vs Liabilities Pie Chart */}
<View style={styles.card}>
  <Text style={styles.sectionTitle}>Assets vs Liabilities</Text>
  <View style={styles.chartWrapper}>
    <PieChart
      data={[
        { 
          name: `Income`, 
          value: Math.max(assets, 0.1),
          color: '#4CAF50',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12 
        },
        { 
          name: `Expenses`, 
          value: Math.max(liabilities, 0.1),
          color: '#F44336',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12 
        }
      ]}
      width={screenWidth} // Dynamically calculated width
      height={220}
      chartConfig={{
        backgroundColor: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      }}
      accessor="value"
      backgroundColor="transparent"
      paddingLeft="15"
      absolute
    />
  </View>
</View>

      {/* Monthly Cash Flow */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Monthly Cash Flow</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Income:</Text>
          <Text style={[styles.value, styles.positive]}>+${monthlyIncome.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Expenses:</Text>
          <Text style={[styles.value, styles.negative]}>-${monthlyExpenses.toFixed(2)}</Text>
        </View>
        <View style={[styles.row, styles.netWorthRow]}>
          <Text style={[styles.label, styles.boldText]}>Balance:</Text>
          <Text style={[
            styles.value, 
            styles.boldText,
            (monthlyIncome - monthlyExpenses) >= 0 ? styles.positive : styles.negative
          ]}>
            ${(monthlyIncome - monthlyExpenses).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Income vs Expenses Bar Chart */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Income vs Expenses</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels: ['Income', 'Expenses'],
              datasets: [{
                data: [
                  Math.max(monthlyIncome, 0.1), 
                  Math.max(monthlyExpenses, 0.1)
                ]
              }]
            }}
            width={screenWidth}
            height={220}
            yAxisLabel="$"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.5,
              propsForLabels: {
                fontSize: 12
              },
              propsForBackgroundLines: {
                strokeWidth: 0.5
              },
              fillShadowGradient: '#007bff',
              fillShadowGradientOpacity: 1
            }}
            style={{
              marginVertical: 8,
              borderRadius: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2
            }}
            fromZero
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'lightblue',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
    textAlign: 'center', // Center-align section titles
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 10, // Added padding to prevent chart and text from touching edges
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  netWorthRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 10, // Added padding to prevent chart from touching edges
  },
});