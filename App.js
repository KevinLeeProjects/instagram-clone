import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { Text, View } from 'react-native';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './redux/reducers';
const store = configureStore({reducer: rootReducer} );


// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyAnW7Oq4f705jxGvYMBbsFchqEYFPcT2DE",
  authDomain: "instagram-clone-d2fd1.firebaseapp.com",
  projectId: "instagram-clone-d2fd1",
  storageBucket: "instagram-clone-d2fd1.appspot.com",
  messagingSenderId: "875429250613",
  appId: "1:875429250613:web:ea5046f2caecb0d285537c",
  measurementId: "G-E5VLR51LN9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Main from './components/Main';
import AddScreen from './components/main/Add';
import Save from './components/main/Save';


const Stack = createStackNavigator();


export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,

    }
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if(!user) {
        this.setState({
          loggedIn: false,
          loaded: true
        })
      }
      else
      {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>{"Loading"}</Text>
        </View>
      )
    }
    if(!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="Login" component={Login} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    }
    return (
      <Provider store={store} >
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Main" component={Main} options={{ headerShown: false }}/>
              <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
              <Stack.Screen name="Save" component={Save} navigation={this.props.navigation}/>

          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
        
    )
  }
}

export default App;
