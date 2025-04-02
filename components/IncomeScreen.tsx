import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

export default function IncomeScreen() {
  const [income, setIncome] = useState<{ id: number; source: string; amount: number; description?: string; date: string }[]>([]);
  const [newIncome, setNewIncome] = useState({
    source: '',
    amount: '',
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not found');
      }
      const { data, error } = await supabase
        .from('income')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setIncome(data);
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof Error) {
          Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
        } else {
          Alert.alert('Error', 'An unknown error occurred');
        }
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async () => {
    if (!newIncome.source || !newIncome.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('income')
        .insert([{
          user_id: user?.id ?? '',
          source: newIncome.source,
          amount: parseFloat(newIncome.amount),
          description: newIncome.description,
          date: new Date().toISOString()
        }]);

      if (error) throw error;
      
      await fetchIncome();
      setNewIncome({ source: '', amount: '', description: '' });
      setShowAddForm(false);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Income</Text>
      
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {income.length === 0 ? (
            <Text style={styles.emptyText}>No income recorded yet</Text>
          ) : (
            income.map((item) => (
              <View key={item.id} style={styles.incomeItem}>
                <View style={styles.incomeInfo}>
                  <Text style={styles.incomeSource}>{item.source}</Text>
                  {item.description && (
                    <Text style={styles.incomeDescription}>{item.description}</Text>
                  )}
                  <Text style={styles.incomeDate}>
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.incomeAmount}>+${item.amount.toFixed(2)}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Source (e.g., Salary)"
            placeholderTextColor="#999"
            value={newIncome.source}
            onChangeText={(text) => setNewIncome({...newIncome, source: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={newIncome.amount}
            onChangeText={(text) => setNewIncome({...newIncome, amount: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Description (Optional)"
            placeholderTextColor="#999"
            value={newIncome.description}
            onChangeText={(text) => setNewIncome({...newIncome, description: text})}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddIncome}>
            <Text style={styles.buttonText}>Save Income</Text>
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
          {showAddForm ? 'Cancel' : 'Add Income'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
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
  incomeItem: {
    backgroundColor: 'white',
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
  incomeInfo: {
    flex: 1,
  },
  incomeSource: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  incomeDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  incomeDate: {
    fontSize: 12,
    color: '#95a5a6',
  },
  incomeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  addForm: {
    backgroundColor: 'white',
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
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});