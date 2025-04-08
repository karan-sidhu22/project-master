import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabaseClient'; // Adjust the import path as needed
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the type for the navigation stack parameters
type AuthStackParamList = {
    SignIn: { email?: string; password?: string; firstname?: string; lastname?: string } | undefined;
    SignUp: undefined;
    MainApp: undefined; // Add this line to define the MainApp screen
};

// Define the navigation prop type for the SignInScreen
type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;
type SignInScreenRouteProp = RouteProp<AuthStackParamList, 'SignIn'>;

export default function SignInScreen({ route }: { route: SignInScreenRouteProp }) {
    const navigation = useNavigation<SignInScreenNavigationProp>();
    const [email, setEmail] = useState(route.params?.email || '');
    const [password, setPassword] = useState(route.params?.password || '');
    const [firstname, setFirstname] = useState(route.params?.firstname || '');
    const [lastname, setLastname] = useState(route.params?.lastname || '');

    const handleSignIn = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            Alert.alert('Error', error.message);
            return;
        }
        // Validate inputs
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            //setLoading(false);
            return;
        }
        

        const user = data.user;
        if (!user) {
            Alert.alert('Error', 'Sign-in failed.');
            return;
        }
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('email')
            .eq('email', email.toLocaleLowerCase()) 
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no data found
            Alert.alert('Error', fetchError.message);
            return;
        }

        // If user does NOT exist in 'users' table, insert details
        if (!existingUser) {
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        uuid: user.id, // Supabase Auth User ID
                        email: user.email,
                        firstname: firstname,
                        lastname: lastname,
                        password: password, // Storing plain text password (not recommended)
                    },
                ]);

            if (insertError) {
                Alert.alert('Error', insertError.message);
                return;
            }
        }

        Alert.alert('Success', `Welcome, ${user.email}!`);
        setEmail('');
        setPassword('');
        navigation.navigate('MainApp');;

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
                //disabled={loading} // Disable button when loading
            >
                <Text style={styles.buttonText}>
                    {'SIGN IN'}
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