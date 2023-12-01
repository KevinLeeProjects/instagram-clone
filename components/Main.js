import React, { Component } from 'react'
import { View, Text } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserPosts } from '../redux/actions';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import Search from './main/Search';

import { getAuth } from 'firebase/auth';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return(null);
}

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
        this.props.fetchUserPosts();
    }
    render() {
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen name="Feed" component={FeedScreen} 
                    options={{ 
                        headerShown: false, 
                        tabBarIcon: ({ color, size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                        ), 
                }} /> 
                <Tab.Screen name="Search" component={Search}  navigation={this.props.navigation}
                    options={{ 
                        headerShown: false, 
                        tabBarIcon: ({ color, size}) => (
                        <MaterialCommunityIcons name="magnify" color={color} size={26} />
                        ), 
                }} /> 
                <Tab.Screen name="AddContainer" labeled={false} component={EmptyScreen} 
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add")
                        }
                    })}
                    options={{ 
                        headerShown: false, 
                        tabBarIcon: ({ color, size}) => (
                        <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                        ), 
                }} /> 
                <Tab.Screen name="Profile" labeled={false} component={ProfileScreen} 
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile", {uid: getAuth().currentUser.uid})
                        }
                    })}
                    options={{ 
                        headerShown: false, 
                        tabBarIcon: ({ color, size}) => (
                        <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                        ), 
                }} /> 
            </Tab.Navigator>
        )
    } 
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts}, dispatch);


export default connect(mapStateToProps, mapDispatchProps)(Main);