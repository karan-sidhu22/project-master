import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    MainApp: undefined  
};

type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'MainApp'>;

export default function AccountScreen() {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get current authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        // Get user data from your users table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('uuid', authUser.id)
          .single();

        if (error) throw error;
        setUser(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle" size={80} color="#007bff" />
        <Text style={styles.userName}>
          {user?.firstname} {user?.lastname}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Account Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.detailItem}>
          <Ionicons name="mail" size={20} color="#666" />
          <Text style={styles.detailText}>{user?.email}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="key" size={20} color="#666" />
          <Text style={styles.detailText}>••••••••</Text>
        </View>
      </View>

      {/* Reports Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reports and Expenses</Text>
        {['Income', 'Amount', 'Graphs', 'Transport', 'Date', 'Balance'].map((item) => (
          <TouchableOpacity key={item} style={styles.menuItem}>
            <Text style={styles.menuText}>{item}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {['Help', 'Invite Friends', 'About'].map((item) => (
          <TouchableOpacity key={item} style={styles.menuItem}>
            <Text style={styles.menuText}>{item}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    marginTop: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  detailText: {
    marginLeft: 15,
    fontSize: 16,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuText: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});