import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { connect } from 'react-redux';

import { getAuth } from 'firebase/auth';
import { collection, getDoc, getDocs, doc, getFirestore } from "firebase/firestore";

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [postCount, setPostCount] = useState(0);
  
  useEffect(() => {
    const { currentUser, posts } = props;
    setPostCount(posts.length);

    if(props.route.params.uid == getAuth().currentUser.uid)
    {
      setUser(currentUser);
      setUserPosts(posts);
    }
    else
    {
      const db = getFirestore();
      const userId = props.route.params.uid;
      const userDocRef = doc(db, 'users', userId);
      
      getDoc(userDocRef).then((docSnapshot) => {
        if (docSnapshot.exists()) 
        {
          setUser(docSnapshot.data());
        } 
        else 
        {
          console.log('User does not exist');
        }
      }).catch((error) => 
      {
        console.error('Error fetching user document:', error);
      });

      const queryPostSnapshot = getDocs(collection(db, "posts", props.route.params.uid, "userposts"));
      queryPostSnapshot.then((snapshot) => {
        if (snapshot.docs) 
        {
          const unsortedPosts = snapshot.docs.map((doc) => 
          {
            if (doc.exists()) 
            {
              const id = doc.id;
              const data = doc.data();
              const creation = data.creation.toMillis();
              return { id, ...data, creation };
            } 
            else 
            {
              console.log('does not exist');
              return null;
            } 
        });

        const sortedPosts = unsortedPosts.sort((a, b) => b.creation - a.creation);
        setUserPosts(sortedPosts);
      } 
      else 
      {
        console.error("snapshot.docs is undefined or null");
      }}).catch((error) => {
      console.error("Error fetching posts:", error);
    });
  }
    
    console.log(currentUser);
  }, [props.route.params.uid]);

  if(user == null)
  {
    return <View><Text>{"Loading"}</Text></View>
  }

  return (
    <SafeAreaView className="w-[100vw] h-[100dvh] flex-1 flex flex-col">
        <Text className="text-2xl font-bold">{user.name}</Text>
        <View className="flex flex-col ">
          {/* PFP and followers count */}
          <View className="flex flex-row mr-[5px]">
            <Text className="w-[25vw]">{"PFP"}</Text>
            <View className="flex-1 flex-row justify-between">
              <View className="flex flex-col items-center">
                <Text>{postCount}</Text>
                <Text>{"Posts"}</Text>
              </View>
              <View className="flex flex-col items-center">
                <Text>{"0"}</Text>
                <Text>{"Followers"}</Text>
              </View>
              <View className="flex flex-col items-center">
                <Text>{"0"}</Text>
                <Text>{"Following"}</Text>
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
            data={userPosts}
            renderItem={({item}) => (
              <Pressable
                className="flex-1 aspect-square max-w-[33vw]"
                onPress={() => console.log("click")}
              >
                <Image className="flex-1"
                  source={{uri: item.downloadURL}}
                />
              </Pressable>
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