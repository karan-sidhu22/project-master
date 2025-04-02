// // components/HomeScreen.tsx
// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';

// type AuthStackParamList = {
//     SignIn: undefined;
//     SignUp: undefined;
//     Home: undefined;
//     Account: undefined;
// };

// type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Home'>;


// export default function HomeScreen() {
//     const navigation = useNavigation<SignInScreenNavigationProp>();
//     return (
//         <ScrollView style={styles.container}>
//             {/* Employee Income Section */}
//             <Text style={styles.sectionTitle}>Employee Income</Text>
//             <View style={styles.expenseContainer}>
//                 <ExpenseItem category="Food" amount="$100" />
//                 <ExpenseItem category="Rent" amount="$550" />
//                 <ExpenseItem category="Utilities" amount="$65" />
//                 <ExpenseItem category="Transport" amount="$90" />
//                 <ExpenseItem category="Miscellaneous" amount="$120" />
//             </View>

//             {/* Add Expense Section */}
//             <Text style={styles.sectionTitle}>Add Expense</Text>
//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.button}>
//                     <Text style={styles.buttonText}>Save</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.button}>
//                     <Text style={styles.buttonText}>Settle</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* View Transaction History Section */}
//             <Text style={styles.sectionTitle}>View Transaction History</Text>
//             <View style={styles.navigationContainer}>
//                 <NavigationItem title="Home" />
//                 <NavigationItem title="Income" />
//                 <NavigationItem title="Graphs" />
//                 <TouchableOpacity style={styles.navigationItem} onPress={() => navigation.navigate('Account')}>
//                     <Text style={styles.navigationText}>Account</Text>
//                 </TouchableOpacity>
//             </View>
//         </ScrollView>
//     );
// }

// // Expense Item Component
// const ExpenseItem = ({ category, amount }: { category: string; amount: string }) => (
//     <View style={styles.expenseItem}>
//         <Text style={styles.expenseCategory}>{category}</Text>
//         <Text style={styles.expenseAmount}>{amount}</Text>
//     </View>
// );

// // Navigation Item Component
// const NavigationItem = ({ title }: { title: string }) => (
//     <TouchableOpacity style={styles.navigationItem}>
//         <Text style={styles.navigationText}>{title}</Text>
//     </TouchableOpacity>
// );

// // Styles
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#f5f5f5',
//     },
//     sectionTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 15,
//         color: '#333',
//     },
//     expenseContainer: {
//         marginBottom: 20,
//     },
//     expenseItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//     },
//     expenseCategory: {
//         fontSize: 16,
//         color: '#555',
//     },
//     expenseAmount: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 20,
//     },
//     button: {
//         backgroundColor: '#007bff',
//         padding: 15,
//         borderRadius: 8,
//         width: '48%',
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     navigationContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 20,
//     },
//     navigationItem: {
//         backgroundColor: '#fff',
//         padding: 10,
//         borderRadius: 8,
//         width: '23%',
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     navigationText: {
//         fontSize: 14,
//         color: '#333',
//     },
// });
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Expenses</Text>
      
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {expenses.length === 0 ? (
            <Text style={styles.emptyText}>No expenses recorded yet</Text>
          ) : (
            expenses.map((expense) => (
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
            onChangeText={(text) => setNewExpense({...newExpense, category: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={newExpense.amount}
            onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Description (Optional)"
            placeholderTextColor="#999"
            value={newExpense.description}
            onChangeText={(text) => setNewExpense({...newExpense, description: text})}
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
  expenseItem: {
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
  expenseInfo: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  expenseDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  expenseDate: {
    fontSize: 12,
    color: '#95a5a6',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
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