import {  Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../store/authStore";
import { Slot } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';



SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { user, token, checkAuth } = useAuthStore();
  const [ready, setReady] = useState(false);


  // This effect waits a short time to ensure router is ready (safe workaround)
  useEffect(() => {
    checkAuth().then(() => {
      setReady(true);
      SplashScreen.hideAsync();   // ← hide the native splash
    });
  }, []);
  // …

  const [fontsLoaded] = useFonts({
    // ← pick a family name you’ll reference in styles
    IBMPlexSans: require('../assets/fonts/IBMPlexSans-VariableFont_wdth,wght.ttf'),
  });
useEffect(() => {
  if (!fontsLoaded) {
    return;
  }

} , [fontsLoaded]);

  useEffect(() => {
    if (!ready) return;
    const isAuthScreen = segments[0] === "(auth)/login" || segments[0] === "(auth)/register";
    const isSignedIn = token;



    if (!isSignedIn && !isAuthScreen) {
      console.log("not signed in");
      router.replace("/(auth)");
    } else if (isSignedIn && isAuthScreen) {
      console.log("signed in");
      router.replace("/(tabs)");
    }
  }, [ready, segments, token]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
