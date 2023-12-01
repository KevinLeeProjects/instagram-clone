import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { connect } from 'react-redux';

function Profile(props) {
  const { currentUser, posts } = props;
  console.log(`Here ${JSON.stringify({currentUser, posts})}`);
  return (
    <SafeAreaView className="w-[100vw] h-[100dvh] items-center text-center flex-1 flex flex-col">
        <Text>{currentUser.name}</Text>
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