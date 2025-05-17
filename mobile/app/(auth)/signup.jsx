import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native'
import styles from '../../assets/styles/signup.styles'
import COLORS from '../../constants/colors'
import { TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Link } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import CustomAlert from '../../utils/CustomAlert';

export default function Signup() {
   const router = useRouter();
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { user, loading, register } = useAuthStore()
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSignup = async () => {
    const response = await register(username, email, password)
    if (!response.success) {
      setAlertMessage(response.data || 'Something went wrong');
      setAlertVisible(true);

    } else {
      router.push({
        pathname: '(auth)/verify',
        params:    { email }
      });
    }
  };


  



  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              BOOKSFAV📙
            </Text>
            <Text style={styles.subtitle}>
              YOU GET EVERYTHING BY REDING
            </Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>UserName</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Agrim Shukla"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize='none'
                  placeholderTextColor={COLORS.placeholderText}
                  style={styles.input}
                />
              </View>
            </View>

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
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize='none'
                  placeholderTextColor={COLORS.placeholderText}
                  style={styles.input}
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
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize='none'
                  placeholderTextColor={COLORS.placeholderText}
                  style={styles.input}
                />
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                  onPress={() => setShowPassword(!showPassword)}
                />
              </View>

            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/(auth)" style={styles.link}>Login</Link>
            <CustomAlert
              visible={alertVisible}
              title="Error"
              message={alertMessage}
              type="error"                // uses your error styling
              cancelText="OK"             // you can omit cancel if you only want one button
              onCancel={() => setAlertVisible(false)}
              onConfirm={() => setAlertVisible(false)}
            />
          </View>
        </View>

      </View>


    </KeyboardAvoidingView>
  )
}