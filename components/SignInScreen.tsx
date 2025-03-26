import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabaseClient'; // Adjust the import path as needed
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the type for the navigation stack parameters
type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    Home: undefined;
};

// Define the navigation prop type for the SignInScreen
type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for the Sign In button
    const navigation = useNavigation<SignInScreenNavigationProp>();

    const handleSignIn = async () => {
        setLoading(true); // Start loading

        // Validate inputs
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            setLoading(false);
            return;
        }
        navigation.navigate('Home');

        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Error', error.message); // Show error message
        } else {
            Alert.alert('Success', 'Signed in successfully!');
            navigation.navigate('Home'); // Navigate to the Home screen
        }

        setLoading(false); // Stop loading
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Spend Smart</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleSignIn}
                disabled={loading} // Disable button when loading
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Signing In...' : 'SIGN IN'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.linkText}>Don’t have an account? <Text style={styles.boldText}>Sign up</Text></Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkText: {
        marginTop: 15,
        color: '#007bff',
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold',
    },
});