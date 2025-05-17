import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, { useState } from 'react'
import styles from '../../assets/styles/login.styles'
import { Image } from 'expo-image'
import COLORS from '../../constants/colors'
import { TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router'
import { useAuthStore } from '../../store/authStore';
import CustomAlert from '../../utils/CustomAlert';


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { user, loading, login } = useAuthStore()
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleLogin = async () => {
    const response = await login(email, password)
    if (!response.success) {
      setAlertMessage(response.data || 'Something went wrong');
      setAlertVisible(true);
    }
  }


  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.topIllustration}>
          <Image
            source={require('../../assets/images/i.png')}
            style={styles.illustrationImage} />
        </View>
        <View style={styles.card}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                />

              </View>


            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCompleteType="password"
                  textContentType="password"

                />
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                  onPress={() => setShowPassword(!showPassword)}
                />

              </View>


            </View>

            <TouchableOpacity style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {
                loading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )
              }
            </TouchableOpacity>

            <View style={styles.footer}>
              <CustomAlert
                visible={alertVisible}
                title="Error"
                message={alertMessage}
                type="error"                // uses your error styling
                cancelText="OK"             // you can omit cancel if you only want one button
                onCancel={() => setAlertVisible(false)}
                onConfirm={() => setAlertVisible(false)}
              />
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link href="/(auth)/signup" style={styles.link}>Sign up</Link>
            </View>

          </View>

        </View>
        <Text>Login Screen</Text>
      </View>
    </KeyboardAvoidingView>
  )
}