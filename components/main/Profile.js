import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { connect } from 'react-redux';

import { getAuth } from 'firebase/auth';
import { collection, getDoc, getDocs, doc, getFirestore, setDoc, updateDoc, deleteField, deleteDoc } from "firebase/firestore";

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [following, setFollowing] = useState(false);

  const db = getFirestore();
  
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
  
    if(props.following.indexOf(props.route.params.uid) > -1)
    {
      setFollowing(true);
    }
    else
    {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]);

  const onFollow = () => {
    const userDocRef = doc(db, "following", getAuth().currentUser.uid, "userFollowing", props.route.params.uid);
    setDoc(userDocRef, {
    });
    setFollowing(true);
  }


  const onUnfollow = async () => {
    const userDocRef = doc(collection(db, "following", getAuth().currentUser.uid, "userFollowing"), props.route.params.uid);
  
    try {
      await deleteDoc(userDocRef).then(() => {
        console.log("Document deleted successfully!")
        setFollowing(false);
      })
      
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  if(user == null)
  {
    return <View><Text>{"Loading"}</Text></View>
  }

  return (
    <SafeAreaView className="h-[100dvh] flex-1 flex flex-col items-center mt-[10px]">
        <View className="w-[92vw]">
          <Text className="text-2xl font-bold">{user.name}</Text>
          <View className="flex flex-col ">
            {/* PFP and followers count */}
            <View className="flex flex-row mr-[5px] items-center mt-[10px]">
              <Image source={require('./Default_pfp.png')} className="w-[15vw] h-[15vw] rounded-full"/>
              <View className="flex-1 flex-row justify-around ml-[20vw] max-w-[60vw]">
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
            
              {props.route.params.uid !== getAuth().currentUser.uid ? (
                <View >
                    {following ? (
                      <Pressable
                        onPress={() => onUnfollow()}
                        className="items-center bg-blue-500 rounded-lg justify-center p-3 mt-[20px]"
                      >
                        <Text className="text-white">{"Unfollow"}</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => onFollow()}  
                        className="items-center bg-blue-500 rounded-lg justify-center p-3 mt-[20px]"
                      >
                        <Text className="text-white">{"Follow"}</Text>
                      </Pressable>
                    )}
                </View>
              ) : (
                null
              )}
            
          </View>
        </View>
        <View>
          <FlatList 
            className="w-[100vw] mt-[10px]"
            numColumns={3}
            horizontal={false}
            data={userPosts}
            renderItem={({item}) => (
              <Pressable
                className="flex-1 aspect-square max-w-[33.33vw]"
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
  posts: store.userState.posts,
  following: store.userState.following
});

export default connect(mapStateToProps, null)(Profile);