import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  MainApp: undefined;
  Home: undefined;
  Income: undefined;
  Graphs: undefined;
};

type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'MainApp'>;

export default function AccountScreen() {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('uuid', authUser.id)
          .single();
        if (error) throw error;
        setUser(data);
        setFirstName(data.firstname);
        setLastName(data.lastname);
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
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

  const handleNameUpdate = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ firstname: firstName, lastname: lastName })
        .eq('uuid', user.uuid);

      if (error) throw error;

      Alert.alert('Success', 'Name updated successfully!');
      fetchUserData();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update name');
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (!newPassword.trim()) {
        Alert.alert('Error', 'Password cannot be empty.');
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword.trim(),
      });

      if (error) throw error;

      Alert.alert('Success', 'Password updated successfully!');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update password');
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

        {/* Editable Name Fields */}
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleNameUpdate}>
          <Text style={styles.saveButtonText}>Change Name</Text>
        </TouchableOpacity>

        {/* Password Change */}
        <TextInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#ffa500' }]} onPress={handlePasswordUpdate}>
          <Text style={styles.saveButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Reports Section */}
      <View style={styles.section}>
  <Text style={styles.sectionTitle}>Reports and Expenses</Text>
  {['Home', 'Income', 'Graphs'].map((item) => (
    <TouchableOpacity
      key={item}
      style={styles.menuItem}
      onPress={() => navigation.navigate(item as keyof AuthStackParamList)}
    >
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
    backgroundColor: 'lightblue', 
    paddingHorizontal: 20, 
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff', 
    borderRadius: 10, 
    
    marginBottom: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, 
    
  },
  userName: {
    fontSize: 24, 
    
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2c3e50', 
    
  },
  userEmail: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#ffffff', 
    
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, 
    
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    color: '#2c3e50', 
    
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
    color: '#555', 
    
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
    color: '#2c3e50', 
    
  },
  logoutButton: {
    backgroundColor: '#ff3b30', 
    
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, 
    
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f9f9f9', 
    
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd', 
    
  },
  saveButton: {
    backgroundColor: '#007bff', 
    
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, 
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
