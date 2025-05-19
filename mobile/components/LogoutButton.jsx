import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore';
import styles from '../assets/styles/profile.styles';
import CustomAlert from '../utils/CustomAlert';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';



export default function LogoutButton() {

  const { logout } = useAuthStore();

  const [showAlert, setShowAlert] = useState(false);
  const logoutButton = () => {
    logout();
    setShowAlert(false);
  };
  const confirmLogout = () => {

    setShowAlert(true);
  };

  return (
    <View>
      <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
       <Ionicons
        name="log-out-outline"
        size={20}
        color={COLORS.white}
       />
       <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <CustomAlert
        visible={showAlert}
        title="Logout"
        message="Are you sure you want to logout?"
        showCancel={true}
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={logoutButton}
        onCancel={() => setShowAlert(false)}
        destructive={true}
      />
    </View>
  )
} 