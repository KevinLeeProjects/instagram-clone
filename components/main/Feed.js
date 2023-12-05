import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { connect } from 'react-redux';

import { getAuth } from 'firebase/auth';
import { collection, getDoc, getDocs, doc, getFirestore, setDoc, updateDoc, deleteField, deleteDoc } from "firebase/firestore";

function Feed(props) {
  const [posts, setPosts] = useState([]);
  const db = getFirestore();
  
  useEffect(() => {
    let postsUsers = [];
    if (props.usersLoaded === props.following.length) {
      for (const element of props.following) {
        const user = props.users.find((user) => user.uid === element);
        
        if (user !== undefined) {
          
          for (const [key, post] of Object.entries(user)) 
          {
            const keyInt = parseInt(key);
            if (!isNaN(keyInt))
            {
              postsUsers = [...postsUsers, { id: keyInt, data: post }];
            }
          }
          
          
        }
      }
      postsUsers.sort(function (x, y) {
        return x.creation - y.creation;
      });

      setPosts(postsUsers);

      console.log(`posts ${JSON.stringify(posts)}`);
    }
  }, [props.usersLoaded, props.users, props.following]);

  if (props.usersLoaded !== props.following.length) {
    // Data is still loading, you can return a loading indicator or null
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="h-[100dvh] flex-1 flex flex-col items-center">
    <ScrollView>
      <View>
        {posts.map((postDetails) => (
          <View className="flex-1 mt-[50px]" key={postDetails.id}>
            <Text className="ml-3">{postDetails.data.user.name}</Text>
            <Pressable
              className="flex-1 w-[100vw] h-[100vw] mt-[10px]"
              onPress={() => console.log(`click: ${postDetails.data.downloadURL}`)}
            >
              <Image className="flex-1" source={{ uri: postDetails.data.downloadURL }} />
              {/* <Text className="flex-1 bg-gray-100">{JSON.stringify(postDetails)}</Text> */}
            </Pressable>
            <View className="flex-1 flex-row mt-2 ml-3">
              <Text className="">{postDetails.data.user.name}</Text>
              <Text className="ml-2">{postDetails.data.caption}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  </SafeAreaView>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded
});

export default connect(mapStateToProps, null)(Feed);