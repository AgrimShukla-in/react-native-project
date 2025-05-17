import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import COLORS from '../constants/colors';

export default function CustomAlert({
  visible = false,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
  showCancel = false,
  icon = null
}) {
  // Multiple animations for more polish
  const [scaleAnim] = React.useState(new Animated.Value(0));
  const [opacityAnim] = React.useState(new Animated.Value(0));
  const [backdropAnim] = React.useState(new Animated.Value(0));
  
  // Configure spring animation for more natural feel
  React.useEffect(() => {
    if (visible) {
      // Animate backdrop first
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }).start();
      
      // Then animate the alert with a slight delay for better UX
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true
          })
        ]).start();
      }, 50);
    } else {
      // Reverse animation sequence when closing
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true
        })
      ]).start();
      
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        delay: 50,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);

  // Combined animations for the alert container
  const containerStyle = {
    opacity: opacityAnim,
    transform: [
      { scale: scaleAnim },
      { translateY: scaleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })
      }
    ]
  };

  // Shadow styles for different platforms
  const shadowStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
    },
    android: {
      elevation: 8,
    }
  });

  const renderButtons = () => {
    if (showCancel) {
      return (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>{cancelText}</Text>
          </TouchableOpacity>
          <View style={styles.buttonSeparator} />
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={onConfirm}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.confirmText, 
              destructive && styles.destructiveText
            ]}>
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <TouchableOpacity
        style={styles.buttonSingle}
        onPress={onConfirm}
        activeOpacity={0.6}
      >
        <Text style={[
          styles.confirmText, 
          destructive && styles.destructiveText
        ]}>
          {confirmText}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal 
      transparent 
      visible={visible} 
      animationType="none" 
      onRequestClose={onCancel}
    >
      <Animated.View 
        style={[
          styles.backdrop,
          { opacity: backdropAnim }
        ]}
      >
        <Animated.View 
          style={[
            styles.alertBox,
            shadowStyle,
            containerStyle
          ]}
        >
          {/* Icon Section */}
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          
          {/* Content Section */}
          <View style={styles.contentContainer}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {message ? <Text style={styles.message}>{message}</Text> : null}
          </View>
          
          {/* Button Section */}
          <View style={styles.separator} />
          {renderButtons()}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');
const BOX_WIDTH = Math.min(width * 0.85, 290);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertBox: {
    width: BOX_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingTop: 20,
    overflow: 'hidden',
    // Add slight blur effect background on iOS
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(255,255,255,0.95)'
      }
    })
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 15
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.41
  },
  message: {
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: -0.08
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border
  },
  buttonSeparator: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border
  },
  buttonRow: {
    flexDirection: 'row',
    height: 44
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonSingle: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmButton: {
    backgroundColor: 'transparent'
  },
  cancelButton: {
    backgroundColor: 'transparent'
  },
  confirmText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: -0.41
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '400',
    color: COLORS.textSecondary,
    letterSpacing: -0.41
  },
  destructiveText: {
    color: '#FF3B30'
  }
});