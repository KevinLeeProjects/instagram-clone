import React, { Component } from 'react';
import { Text, View, Pressable, TextInput } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };

        this.onSignIn = this.onSignIn.bind(this);
    }

    onSignIn() {
        const auth = getAuth();
        const { email, password } = this.state;
        signInWithEmailAndPassword(auth, email, password).then((result) => {
            console.log(result);
        }).catch((result) => {
            console.log(result);
        })
    }

    render() {
        return (
            <View className="w-[90vw]">
                <TextInput 
                    className="
                        border
                        p-2
                        mb-[10px]
                        rounded-lg
                        text-2xl
                        justify-center
                    "
                    placeholder="Email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput 
                    className="
                        border
                        p-2
                        text-2xl
                        rounded-lg
                        justify-center
                    "
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />

                <Pressable 
                    className="
                        bg-blue-200
                        text-center
                        items-center
                        mt-[50px]
                        p-5
                        rounded-lg
                    "
                    onPress={() => this.onSignIn()}
                >
                    <Text>{"Log In"}</Text>
                </Pressable>
            </View>
        )
    }
}

export default Login;