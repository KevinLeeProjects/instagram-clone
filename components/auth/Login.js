import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';

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
            <View>
                <TextInput 
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput 
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />

                <Button 
                    onPress={() => this.onSignIn()}
                    title="Sign In"
                />
            </View>
        )
    }
}

export default Login;