import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../lib/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  interface Expense {
    id: string;
    category: string;
    amount: number;
    description?: string;
    date: string;
  }

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not found');
      }
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.category || !newExpense.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('expenses')
        .insert([{
          user_id: user?.id ?? '',
          category: newExpense.category,
          amount: parseFloat(newExpense.amount),
          description: newExpense.description,
          date: new Date().toISOString()
        }]);

      if (error) throw error;

      await fetchExpenses();
      setNewExpense({ category: '', amount: '', description: '' });
      setShowAddForm(false);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const filterExpenses = () => {
    const now = new Date();

    switch (filter) {
      case '1day':
        return expenses.filter(e => {
          const expenseDate = new Date(e.date);
          const diff = (now.getTime() - expenseDate.getTime()) / (1000 * 60 * 60 * 24);
          return diff < 1;
        });
      case '1week':
        return expenses.filter(e => {
          const expenseDate = new Date(e.date);
          const diff = (now.getTime() - expenseDate.getTime()) / (1000 * 60 * 60 * 24);
          return diff < 7;
        });
      default:
        return expenses;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Expenses</Text>

      <Text style={styles.filterLabel}>Filter by:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={filter}
          onValueChange={(itemValue) => setFilter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All" value="all" />
          <Picker.Item label="Last 1 Day" value="1day" />
          <Picker.Item label="Last 7 Days" value="1week" />
        </Picker>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {filterExpenses().length === 0 ? (
            <Text style={styles.emptyText}>No expenses recorded yet</Text>
          ) : (
            filterExpenses().map((expense) => (
              <View key={expense.id} style={styles.expenseItem}>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseCategory}>{expense.category}</Text>
                  {expense.description && (
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                  )}
                  <Text style={styles.expenseDate}>
                    {new Date(expense.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.expenseAmount}>-${expense.amount.toFixed(2)}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Category (e.g., Food)"
            placeholderTextColor="#999"
            value={newExpense.category}
            onChangeText={(text) => setNewExpense({ ...newExpense, category: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={newExpense.amount}
            onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description (Optional)"
            placeholderTextColor="#999"
            value={newExpense.description}
            onChangeText={(text) => setNewExpense({ ...newExpense, description: text })}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddExpense}>
            <Text style={styles.buttonText}>Save Expense</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddForm(!showAddForm)}
      >
        <Ionicons
          name={showAddForm ? "close" : "add"}
          size={24}
          color="white"
        />
        <Text style={styles.buttonText}>
          {showAddForm ? 'Cancel' : 'Add Expense'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: 'lightblue', 
  },
  header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333', 
  },
  filterLabel: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 5,
      color: '#555', 
  },
  pickerContainer: {
      backgroundColor: '#fff',
      borderRadius: 8,
      marginBottom: 15,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderColor: '#ccc',
      borderWidth: 1,
  },
  picker: {
      height: 50,
      color: '#333',
  },
  listContainer: {
      flex: 1,
      marginBottom: 15,
  },
  emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: '#7f8c8d',
      fontSize: 16,
  },
  expenseItem: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
  },
  expenseInfo: {
      flex: 1,
  },
  expenseCategory: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
  },
  expenseDescription: {
      fontSize: 14,
      color: '#555',
      marginBottom: 5,
  },
  expenseDate: {
      fontSize: 12,
      color: '#777',
  },
  expenseAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#e74c3c',
  },
  addForm: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
  },
  input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 15,
      fontSize: 16,
      backgroundColor: '#fff',
  },
  addButton: {
      backgroundColor: '#007bff', 
      padding: 15,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
  },
  saveButton: {
      backgroundColor: '#007bff', 
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
  },
  buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      marginLeft: 10,
  },
});
