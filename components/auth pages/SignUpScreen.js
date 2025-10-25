import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Header from '../Header';

const COLORS = {
  BACKGROUND_LIGHT: '#F7F8FC',      
  BACKGROUND_DARK: '#2D4B46',
  ACCENT_GOLD: '#FFB733',
  TEXT_DARK: '#333333',
  TEXT_LIGHT: '#FFFFFF',
  INPUT_BG: 'rgba(45, 75, 70, 0.05)',
  CARD_BG: '#FFFFFF',
  SUCCESS: '#4CAF50',
  ERROR: '#FF4C4C',               
};

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalID, setNationalID] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState(''); // Add status message state

  const handleSignUp = async () => {
    // Clear previous messages
    setStatusMessage('');

    // Validation
    if (!fullName || !email || !password || !phone || !nationalID || !role) {
      setStatusMessage('❌ Please fill in all fields');
      Alert.alert('Missing Information', 'Please fill in all fields before signing up.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatusMessage('❌ Invalid email format');
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      setStatusMessage('❌ Password too short');
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setStatusMessage('🔄 Creating your account...');

    try {
      console.log('📤 Sending registration request...');
      
      const response = await fetch('https://herbackend-4.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, phone, nationalID, role }),
      });

      const data = await response.json();
      console.log('📥 Response received:', data);

      if (response.ok) {
        console.log('✅ Registration successful:', data);
        setStatusMessage('✅ Account created successfully!');
        
        // Show success alert
        Alert.alert(
          '🎉 Success!', 
          'Your account has been created successfully! Please sign in to continue.',
          [
            { 
              text: 'Sign In Now', 
              onPress: () => {
                // Clear form
                setFullName('');
                setEmail('');
                setPassword('');
                setPhone('');
                setNationalID('');
                setRole('');
                
                navigation.navigate('SignIn');
              },
            }
          ]
        );
        
      } else {
        console.error('❌ Registration failed:', data.message || data);
        
        // Specific error messages
        let errorMessage = 'Registration failed. Please try again.';
        if (data.message) {
          if (data.message.includes('Email already registered')) {
            errorMessage = 'This email is already registered. Please sign in or use a different email.';
          } else {
            errorMessage = data.message;
          }
        }
        
        setStatusMessage(`❌ ${errorMessage}`);
        Alert.alert('Registration Failed', errorMessage);
      }
    } catch (error) {
      console.error('❌ Error registering:', error);
      setStatusMessage('❌ Connection error');
      
      Alert.alert(
        'Connection Error', 
        'Could not connect to the server. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[COLORS.BACKGROUND_LIGHT, COLORS.BACKGROUND_LIGHT]} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.logo}>SwiftLink</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the SwiftLink network</Text>

            {/* Status Message Display */}
            {statusMessage ? (
              <View style={[
                styles.statusMessage,
                { 
                  backgroundColor: statusMessage.includes('✅') 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : statusMessage.includes('❌')
                    ? 'rgba(255, 76, 76, 0.1)'
                    : 'rgba(255, 183, 51, 0.1)',
                  borderLeftColor: statusMessage.includes('✅') 
                    ? COLORS.SUCCESS 
                    : statusMessage.includes('❌')
                    ? COLORS.ERROR
                    : COLORS.ACCENT_GOLD
                }
              ]}>
                <Text style={[
                  styles.statusText,
                  { 
                    color: statusMessage.includes('✅') 
                      ? COLORS.SUCCESS 
                      : statusMessage.includes('❌')
                      ? COLORS.ERROR
                      : COLORS.ACCENT_GOLD
                  }
                ]}>
                  {statusMessage}
                </Text>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999" 
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="National ID"
              placeholderTextColor="#999"
              value={nationalID}
              onChangeText={setNationalID}
            />
            
            {/* Password Input with Toggle */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.pickerContainer, styles.input]}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.picker}
                dropdownIconColor={COLORS.ACCENT_GOLD}
              >
                <Picker.Item label="Select Role" value="" color="#999" />
                <Picker.Item label="Carrier" value="carrier" color={COLORS.TEXT_DARK} />
                <Picker.Item label="Sender" value="sender" color={COLORS.TEXT_DARK} />
                <Picker.Item label="Receiver" value="receiver" color={COLORS.TEXT_DARK} />
              </Picker>
            </View>

            <TouchableOpacity
              style={[styles.signUpBtn, loading && { opacity: 0.6 }]}
              onPress={handleSignUp}
              disabled={loading} 
            >
              <Text style={styles.signUpText}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.link}> Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND_LIGHT },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  card: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 15, 
    padding: 25,
    width: '90%',
    maxWidth: 450,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    color: COLORS.ACCENT_GOLD, 
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20
  },
  title: {
    color: COLORS.TEXT_DARK, 
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5
  },
  subtitle: {
    color: '#888', 
    textAlign: 'center',
    marginBottom: 20
  },
  // Status message styles
  statusMessage: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 10,
    padding: 15,
    color: COLORS.TEXT_DARK,
    marginBottom: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(45, 75, 70, 0.1)',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(45, 75, 70, 0.1)',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: COLORS.TEXT_DARK,
  },
  eyeIcon: {
    padding: 15,
  },
  pickerContainer: {
    height: 50,
    padding: 0,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: COLORS.TEXT_DARK,
    height: 50,
  },
  signUpBtn: {
    backgroundColor: COLORS.ACCENT_GOLD,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: COLORS.ACCENT_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  signUpText: {
    color: COLORS.BACKGROUND_DARK, 
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25
  },
  footerText: {
    color: COLORS.TEXT_DARK
  },
  link: {
    color: COLORS.ACCENT_GOLD, 
    fontWeight: 'bold'
  },
});
