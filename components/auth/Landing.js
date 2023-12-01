import React from 'react';
import { View, Pressable , Text, Image } from 'react-native';
import Login from './Login';

export default function Landing({ navigation }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Image source={require('./KLLogo.png')} className="w-[20vw] h-[20vw]"/>
      <Text className="text-3xl">{"Instagram-Clone"}</Text>
      <View className="flex flex-col justify-center items-center text-center mt-[50px]">
        <Login />
      </View>
      <Pressable className="px-20 py-5 bg-blue-200 rounded-lg w-[70vw] text-center items-center mt-[50px]" onPress={() => navigation.navigate("Register")}>
          <Text className="">
            {"Register"}
          </Text>
      </Pressable>

    </View>
  );
};
