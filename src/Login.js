import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore"
import { useNavigation } from "@react-navigation/native";

export default function Login() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [code, setCode] = useState("");
    const [confirm, setConfirm] = useState(null);
    const navigation = useNavigation();

    const signInWithPhoneNumber = async () => {
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
        } catch (error) {
            console.log("Error sending code: ", error);
        }
    };

    const confirmCode = async () => {
        try {
            const userCredentials = await confirm.confirm(code);
            const user = userCredentials.user;

            const userDocument = await firestore()
                .collection("users")
                .doc(user.uid)
                .get();

            if (userDocument.exists) {
                navigation.navigate("Dashboard");
            } else {
                navigation.navigate("Details", { uid: user.uid });
            }
        } catch (error) {
            console.log("Invalid Code: ", error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: "#BEBDB78" }}>
            <Text style={{
                fontSize: 32,
                fontWeight: "bold",
                marginTop: 150,
                marginBottom: 40,
            }}>
                Phone Number Authentication using Firebase
            </Text>
            {!confirm ? (
                <>
                    <Text style={{
                        marginBottom: 20,
                        fontSize: 18,
                    }}
                    >
                        Enter your phone number :
                    </Text>
                    <TextInput style={{
                        height: 50,
                        width: "100%",
                        borderColor: "black",
                        borderWidth: 1,
                        marginBottom: 30,
                        paddingHorizontal: 10,
                    }}
                    placeholder="+91 98765-43210"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    />
                    <TouchableOpacity
                    onPress={signInWithPhoneNumber}
                    style={{
                        backgroundColor: "#841584",
                        padding: 10,
                        borderRadius: 5,
                        marginBottom: 20,
                        alignItems: "center",
                    }}>
                        <Text style={{
                            color: "white",
                            fontSize: 22,
                            fontWeight: "bold",
                        }}>
                            Send Code
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                <Text 
                style={{
                    marginBottom : 20,
                    fontSize: 18,
                }}
                >
                    Enter the code sent to your phone:
                </Text>
                <TextInput style={{
                        height: 50,
                        width: "100%",
                        borderColor: "black",
                        borderWidth: 1,
                        marginBottom: 30,
                        paddingHorizontal: 10,
                    }}
                    placeholder="Enter Code"
                    value={code}
                    onChangeText={setCode}
                    />
                    <TouchableOpacity
                    onPress={confirmCode}
                    style={{
                        backgroundColor: "#841584",
                        padding: 10,
                        borderRadius: 5,
                        marginBottom: 20,
                        alignItems: "center",
                    }}>
                        <Text style={{
                            color: "white",
                            fontSize: 22,
                            fontWeight: "bold",
                        }}>
                            Confirm Code
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}