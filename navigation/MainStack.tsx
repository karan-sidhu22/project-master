// navigation/MainStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/HomeScreen';
import IncomeScreen from '../components/IncomeScreen'; // Create this screen
import GraphsScreen from '../components/GraphsScreen'; // Create this screen
import AccountScreen from '../components/AccountScreen'; // Create this screen

const Stack = createStackNavigator();

export default function MainStack() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Income"
                component={IncomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Graphs"
                component={GraphsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Account"
                component={AccountScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}