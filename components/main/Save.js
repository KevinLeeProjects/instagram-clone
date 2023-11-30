import React, { useState } from 'react';
import { View, TextInput, Image, Button } from 'react-native';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getFirestore, serverTimestamp, doc  } from 'firebase/firestore';
require("firebase/firestore");
require("firebase/storage");

export default function Save(props, {navigation}) {
    const [caption, setCaption] = useState("");
    const storage = getStorage();

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `post/${getAuth().currentUser.uid}/${Math.random().toString(36)}`;

        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(storage, childPath);
        const task = uploadBytes(storageRef, blob).then((snapshot) => {
            console.log(`Uploaded blob: ${JSON.stringify(snapshot)}`);
            taskComplete();
        });

        const taskComplete = () => {
            getDownloadURL(storageRef).then((downloadURL) => {
                savePostData(downloadURL);
                console.log(`File available at ${downloadURL}`)
            })
        };

        const taskError = snapshot => {
            console.log(snapshot);
        };

        
    }

    const savePostData = (downloadURL) => {
        const db = getFirestore();
        const auth = getAuth();
        const userPostsCollectionRef = collection(db, "posts", auth.currentUser.uid, "userposts");
        const docRef = addDoc(userPostsCollectionRef, {
            downloadURL: downloadURL,
            caption: caption,
            creation: serverTimestamp()
        }).then((function () {
            props.navigation.popToTop();
        }))
    }

    return (
        <View style={{flex: 1}}>
            <Image source={{uri: props.route.params.image}} />
            <TextInput 
                placeholder="Write a caption . . ."
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title="Save" onPress={() => uploadImage()}/>
        </View>
    )
}
