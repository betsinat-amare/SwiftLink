import React, { useState, useContext } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import Header from '../Header';
import { AuthContext } from '../context/AuthContext';

const COLORS = {
  BACKGROUND_LIGHT: '#F7F8FC',
  BACKGROUND_DARK: '#2D4B46',
  ACCENT_GOLD: '#FFB733',
  TEXT_DARK: '#333333',
  TEXT_LIGHT: '#FFFFFF',
  INPUT_BG: 'rgba(45, 75, 70, 0.05)',
  CARD_BG: '#FFFFFF',
  STATUS_GREEN: '#4CAF50',
  STATUS_RED: '#FF4C4C',
};

export default function SignInScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('sender');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    // Clear previous messages
    setMessage('');

    // Validation
    if (!email || !password) {
      setMessage('❌ Please fill all fields');
      Alert.alert('Missing Information', 'Please enter both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('❌ Invalid email format');
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setMessage('🔄 Signing in...');

    try {
      console.log('📤 Attempting login...');
      
      const data = await login(email, password, role);

      if (!data) {
        // Login failed - error already shown by AuthContext
        setMessage('❌ Login failed - Invalid credentials');
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
        return;
      }

      const { token, user } = data;
      console.log('✅ Login successful:', user);

      // Success!
      setMessage('✅ Login successful!');
      
      Alert.alert(
        '🎉 Welcome Back!',
        `You're now signed in as ${role}.`,
        [{ 
          text: 'Continue', 
          style: 'default',
          onPress: () => {
            // Navigate based on role
            if (role === 'agent') {
              navigation.navigate('AgentChat', {
                agentId: user.id,
                token,
              });
            } else {
              navigation.navigate('Dashboard', { role });
            }
          }
        }]
      );

    } catch (error) {
      console.error('❌ Login error:', error);
      setMessage('❌ Connection error');
      Alert.alert(
        'Connection Error',
        'Could not connect to the server. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.BACKGROUND_LIGHT, COLORS.BACKGROUND_LIGHT]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.logo}>SwiftLink</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>

            {/* Role Selection */}
            <View style={styles.roleContainer}>
              {['sender', 'carrier', 'agent', 'receiver'].map(r => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  style={[
                    styles.roleButton,
                    { backgroundColor: role === r ? COLORS.ACCENT_GOLD : '#eee' },
                  ]}
                >
                  <Text
                    style={{
                      color: role === r ? COLORS.BACKGROUND_DARK : '#333',
                      fontWeight: 'bold',
                      fontSize: 13,
                    }}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Status Message Display - Enhanced */}
            {message ? (
              <View style={[
                styles.statusMessage,
                { 
                  backgroundColor: message.includes('✅') 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : message.includes('❌')
                    ? 'rgba(255, 76, 76, 0.1)'
                    : 'rgba(255, 183, 51, 0.1)',
                  borderLeftColor: message.includes('✅') 
                    ? COLORS.STATUS_GREEN 
                    : message.includes('❌')
                    ? COLORS.STATUS_RED
                    : COLORS.ACCENT_GOLD
                }
              ]}>
                <Text style={[
                  styles.statusText,
                  { 
                    color: message.includes('✅') 
                      ? COLORS.STATUS_GREEN 
                      : message.includes('❌')
                      ? COLORS.STATUS_RED
                      : COLORS.ACCENT_GOLD
                  }
                ]}>
                  {message}
                </Text>
              </View>
            ) : null}

            {/* Email Input */}
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

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInBtn, loading && { opacity: 0.6 }]}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text style={styles.signInText}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.link}> Sign Up</Text>
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
    marginBottom: 20, 
    fontSize: 14 
  },
  roleContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 20, 
    flexWrap: 'wrap' 
  },
  roleButton: {
    margin: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  // Enhanced status message styles
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
    fontSize: 16,
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
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  signInBtn: {
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
  signInText: { 
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
    color: COLORS.TEXT_DARK, 
    fontSize: 14 
  },
  link: { 
    color: COLORS.ACCENT_GOLD, 
    fontWeight: 'bold', 
    fontSize: 14 
  },
});
