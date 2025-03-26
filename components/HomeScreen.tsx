// components/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container}>
            {/* Employee Income Section */}
            <Text style={styles.sectionTitle}>Employee Income</Text>
            <View style={styles.expenseContainer}>
                <ExpenseItem category="Food" amount="$100" />
                <ExpenseItem category="Rent" amount="$550" />
                <ExpenseItem category="Utilities" amount="$65" />
                <ExpenseItem category="Transport" amount="$90" />
                <ExpenseItem category="Miscellaneous" amount="$120" />
            </View>

            {/* Add Expense Section */}
            <Text style={styles.sectionTitle}>Add Expense</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Settle</Text>
                </TouchableOpacity>
            </View>

            {/* View Transaction History Section */}
            <Text style={styles.sectionTitle}>View Transaction History</Text>
            <View style={styles.navigationContainer}>
                <NavigationItem title="Home" />
                <NavigationItem title="Income" />
                <NavigationItem title="Graphs" />
                <NavigationItem title="Account" />
            </View>
        </ScrollView>
    );
}

// Expense Item Component
const ExpenseItem = ({ category, amount }: { category: string; amount: string }) => (
    <View style={styles.expenseItem}>
        <Text style={styles.expenseCategory}>{category}</Text>
        <Text style={styles.expenseAmount}>{amount}</Text>
    </View>
);

// Navigation Item Component
const NavigationItem = ({ title }: { title: string }) => (
    <TouchableOpacity style={styles.navigationItem}>
        <Text style={styles.navigationText}>{title}</Text>
    </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    expenseContainer: {
        marginBottom: 20,
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    expenseCategory: {
        fontSize: 16,
        color: '#555',
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    navigationItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        width: '23%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    navigationText: {
        fontSize: 14,
        color: '#333',
    },
});