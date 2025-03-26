import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; // Import an icon library

// Define the type for the navigation stack parameters
type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
};

// Define the navigation prop type for the SignUpScreen
type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation<SignUpScreenNavigationProp>();

    const handleSignUp = async () => {
        // Validate password match
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        // Sign up with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            // Insert user into the users table
            const { error: insertError } = await supabase
                .from('users')
                .insert([{ email, password_hash: password, mobile_number: mobileNumber, name }]);

            if (insertError) {
                Alert.alert('Error', insertError.message);
            } else {
                Alert.alert('Success', 'Account created successfully! Please check your email to verify your account.');
                navigation.navigate('SignIn'); // Navigate back to the Sign In page
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Custom Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#007bff" />
            </TouchableOpacity>

            <Text style={styles.title}>Sign up</Text>
            <Text style={styles.subtitle}>Already Have an Account? <Text style={styles.linkText} onPress={() => navigation.navigate('SignIn')}>Sign In</Text></Text>
            <TextInput
                placeholder="Mobile Number"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                style={styles.input}
                placeholderTextColor="#999"
                keyboardType="phone-pad"
            />
            <TextInput
                placeholder="First and Last Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor="#999"
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#999"
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#999"
            />
            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.linkText}>Go Back</Text>
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
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        marginBottom: 20,
        color: '#666',
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
        color: '#007bff',
        fontWeight: 'bold',
    },
    goBackButton: {
        marginTop: 20,
        alignItems: 'center',
    },
});