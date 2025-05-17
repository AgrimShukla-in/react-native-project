import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const numInputs = 6;
const { width } = Dimensions.get('window');
const BOX_WIDTH = Math.min(width * 0.85, 320);
const inputWidth = BOX_WIDTH / numInputs - 10;

export default function OTPVerification({ onVerify, onResend, email }) {
  const [code, setCode] = useState(Array(numInputs).fill(''));
  const inputs = useRef([]);

  useEffect(() => {
    if (inputs.current[0]) inputs.current[0].focus();
  }, []);

  const handleChange = (text, idx) => {
    if (/^[0-9]?$/.test(text)) {
      const newCode = [...code];
      newCode[idx] = text;
      setCode(newCode);
      if (text && idx < numInputs - 1) inputs.current[idx + 1].focus();
      if (!text && idx > 0) inputs.current[idx - 1].focus();
    }
  };

  const handleVerify = () => {
    const otp = code.join('');
    onVerify(otp);
  };

  const handleResend = () => {
    onResend();
    setCode(Array(numInputs).fill(''));
    if (inputs.current[0]) inputs.current[0].focus();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.heading}>Verify Email Address</Text>
        <Text style={styles.subheading}>Enter the 6‑digit code sent to {email}</Text>
        <Text style={styles.infoText}>We have sent an OTP to your email. Please enter the code below to verify.</Text>

        <View style={styles.otpContainer}>
          {code.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={el => (inputs.current[idx] = el)}
              style={[styles.otpInput, { width: inputWidth }]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, idx)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, code.includes('') && { opacity: 0.6 }]}
          onPress={handleVerify}
          disabled={code.includes('')}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't receive a code?</Text>
          <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
            <Ionicons name="refresh" size={16} color={COLORS.primary} />
            <Text style={[styles.resendText, { marginLeft: 6 }]}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 20
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: BOX_WIDTH,
    alignSelf: 'center'
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8
  },
  subheading: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24
  },
  otpInput: {
    height: 50,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlign: 'center',
    fontSize: 18,
    color: COLORS.textDark
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 16
  },
  verifyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600'
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8
  },
  resendText: {
    color: COLORS.textSecondary,
    fontSize: 14
  }
});
