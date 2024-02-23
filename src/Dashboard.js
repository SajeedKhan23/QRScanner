import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { request, PERMISSIONS, openSettings, RESULTS } from "react-native-permissions";
import { ReactNativeScannerView } from "@pushpendersingh/react-native-scanner";
import WebView from "react-native-webview";

export default function Dashboard() {
  const navigation = useNavigation();
  const [isCameraPermissionGranted, setIsCameraPermissionGranted] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Error during logout: ", error);
    }
  };

  const checkCameraPermission = async () => {
    request(PERMISSIONS.IOS.CAMERA)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            Alert.alert("Permission Denied", "You need to grant camera permission first", [
              { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
              { text: "Open Settings", onPress: () => openSettings() }
            ]);
            break;
          case RESULTS.GRANTED:
            setIsCameraPermissionGranted(true);
            break;
          case RESULTS.BLOCKED:
            Alert.alert("Permission Blocked", "You need to grant camera permission first", [
              { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
              { text: "Open Settings", onPress: () => openSettings() }
            ]);
            break;
        }
      })
  };

  const handleQrScanned = (value) => {
    setScannedData(value);
  };

  return (
    <View style={styles.container}>
      {isCameraPermissionGranted ? (
        <View style={{ flex: 1 }}>
          <ReactNativeScannerView
            style={{ flex: 1 }}
            onQrScanned={(value) => handleQrScanned(value)}
          />
        </View>
      ) : (
        <Text style={styles.permissionText}>
          You need to grant camera permission first
        </Text>
      )}
      {scannedData && (
        <View style={{ flex: 1 }}>
          <WebView source={{ uri: scannedData }} style={{ flex: 1 }} />
        </View>
      )}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#BEBDB8",
  },
  permissionText: {
    fontSize: 30,
    color: 'red',
    textAlign: 'center',
    marginTop: '50%',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    backgroundColor: "#841584",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});
