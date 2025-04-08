// navigation/AuthStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../components/SignInScreen';
import SignUpScreen from '../components/SignUpScreen';
import TabNavigator from './TabNavigator'; // Add this import
import HomeScreen from '../components/HomeScreen';
import IncomeScreen from '../components/IncomeScreen';
import GraphsScreen from '../components/GraphsScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ title: 'SignIn', headerLeft: () => null }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: 'SignUp', headerLeft: () => null }}
      />
      <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Home', headerLeft: () => null }}
      />
      <Stack.Screen
      name="Income"
      component={IncomeScreen}
      options={{ title: 'Income', headerLeft: () => null }}
      />
      <Stack.Screen
        name="Graphs"
        component={GraphsScreen}
        options={{ title: 'Graphs', headerLeft: () => null }}
      />
      {/* Add TabNavigator as a screen */}
      <Stack.Screen
        name="MainApp" // Rename from "Home" to avoid confusion
        component={TabNavigator}
        options={{ headerShown: false }} // Hide header for tabs
      />
    </Stack.Navigator>
  );
}