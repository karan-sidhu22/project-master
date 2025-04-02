// navigation/AuthStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../components/SignInScreen';
import SignUpScreen from '../components/SignUpScreen';
import TabNavigator from './TabNavigator'; // Add this import

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
      {/* Add TabNavigator as a screen */}
      <Stack.Screen
        name="MainApp" // Rename from "Home" to avoid confusion
        component={TabNavigator}
        options={{ headerShown: false }} // Hide header for tabs
      />
    </Stack.Navigator>
  );
}