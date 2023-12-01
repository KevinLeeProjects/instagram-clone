import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { connect } from 'react-redux';

function Profile(props) {
  const { currentUser, posts } = props;
  console.log(`Here ${JSON.stringify({currentUser, posts})}`);
  return (
    <SafeAreaView className="w-[100vw] h-[100dvh] flex-1 flex flex-col">
        <Text className="text-2xl font-bold">{currentUser.name}</Text>
        <View className="flex flex-col bg-green-500">
          {/* PFP and followers count */}
          <View className="flex flex-row">
            <Text className="w-[25vw]">{"PFP"}</Text>
            <View className="flex-1 flex-row justify-between">
              <View className="flex flex-col items-center">
                <Text>{"0"}</Text>
                <Text>{"Post Count"}</Text>
              </View>
              <View className="flex flex-col items-center">
                <Text>{"0"}</Text>
                <Text>{"Followers Count"}</Text>
              </View>
              <View className="flex flex-col items-center">
                <Text>{"0"}</Text>
                <Text>{"Following Count"}</Text>
              </View>
            </View>
          </View>

          {/* Name and Bio */}
          <View className="flex flex-col mt-[10px]">
            <Text>{"Name"}</Text>
            <Text>{"Bio"}</Text>
            <Text>{"Website"}</Text>
          </View>
        </View>
        <View>
          <FlatList 
            className="w-[100vw]"
            numColumns={3}
            horizontal={false}
            data={posts}
            renderItem={({item}) => (
              <Image
                className="flex-1 aspect-square max-w-[33vw]"
                source={{uri: item.downloadURL}}
              />
            )}
          />
        </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts
});

export default connect(mapStateToProps, null)(Profile);