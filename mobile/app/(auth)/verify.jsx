import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import OTPVerification from '../../components/OTPVerification';
import { useAuthStore } from '../../store/authStore';

export default function Verify() {
  const { email } = useLocalSearchParams();    // ← useLocalSearchParams instead
  const router = useRouter();
  const { sendOtp, verifyOtp, loading } = useAuthStore();

  const handleVerify = async (otp) => {
    const response = await verifyOtp(otp);
    if (response.success) {
      router.replace('/home');
    } else {
      Alert.alert(
        'Verification Failed',
        response.data || 'Invalid code. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleResend = async () => {
    const response = await sendOtp(email);
    if (!response.success) {
      Alert.alert('Error', response.data || 'Could not resend code.', [
        { text: 'OK' },
      ]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <OTPVerification
        email={email}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </View>
  );
}
