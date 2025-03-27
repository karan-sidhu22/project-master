// navigation/AuthStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../components/SignInScreen';
import SignUpScreen from '../components/SignUpScreen';
import HomeScreen from '../components/HomeScreen';
import AccountScreen from '../components/AccountScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator initialRouteName="SignIn">
            <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{ title: 'SignIn', headerLeft: ()=> null }}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ title: 'SignUp', headerLeft: ()=> null }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Expense', headerShown:true,headerLeft: ()=> null }}
            />
            <Stack.Screen
                name="Account"
                component={AccountScreen}
                options={{ title: 'Account', headerShown:true ,headerLeft: ()=> null }}
            />

        </Stack.Navigator>
    );
}