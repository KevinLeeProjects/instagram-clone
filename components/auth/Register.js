import React, { Component } from 'react';
import { View, Pressable, TextInput, Text } from 'react-native';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

export class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: ''
        };

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp() {
        const auth = getAuth();
        const db = getFirestore();
        const { email, password, name } = this.state;
        createUserWithEmailAndPassword(auth, email, password).then((result) => {
            setDoc(doc(db, "users", auth.currentUser.uid), {
                name: name,
                email: email
            })
            console.log(result);
        }).catch((result) => {
            console.log(result);
        });
    }

    render() {
        return (
            <View className="items-center justify-center bg-white">
                <View className="w-[90vw]">
                    <TextInput 
                        className="
                            border
                            mb-[10px]
                            h-fit
                            p-2
                            mt-[50px]
                            rounded-lg
                            text-2xl
                        "
                        placeholder="Username"
                        onChangeText={(name) => this.setState({ name })}
                    />
                    <TextInput 
                        className="
                            border
                            p-2
                            mb-[10px]
                            rounded-lg
                            text-lg
                            justify-center
                            text-2xl
                        "
                        placeholder="Email"
                        onChangeText={(email) => this.setState({ email })}
                    />
                    <TextInput 
                        className="
                            border
                            p-2
                            mb-[10px]
                            rounded-lg
                            text-lg
                            justify-center
                            text-2xl
                        "
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })}
                    />

                    <Pressable 
                        className="items-center mt-[50px] py-3 bg-blue-200 rounded-lg"
                        onPress={() => this.onSignUp()}
                    >
                        <Text className="text-xl">{"Sign Up"}</Text>
                    </Pressable>
                </View>
            </View>
        )
    }
}

export default Register;