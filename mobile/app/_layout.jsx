import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../store/authStore";
import { Slot } from "expo-router";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { user, token, checkAuth } = useAuthStore();
  const [ready, setReady] = useState(false);


  // This effect waits a short time to ensure router is ready (safe workaround)
  useEffect(() => {
    checkAuth().then(() => {
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const isAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !isAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && isAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [segments, user, token]);

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
