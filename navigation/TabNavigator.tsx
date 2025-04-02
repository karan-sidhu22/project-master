import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../components/HomeScreen';
import IncomeScreen from '../components/IncomeScreen';
import GraphsScreen from '../components/GraphsScreen';
import AccountScreen from '../components/AccountScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap | undefined; // Explicitly type iconName
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Income') iconName = focused ? 'cash' : 'cash-outline';
          else if (route.name === 'Graphs') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'Account') iconName = focused ? 'person' : 'person-outline';
          return iconName ? <Ionicons name={iconName} size={size} color={color} /> : null;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Income" component={IncomeScreen} />
      <Tab.Screen name="Graphs" component={GraphsScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}