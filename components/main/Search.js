import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';

export default function Search(props) {
    const [users, setUsers] = useState([]);

    const db = getFirestore();
    const fetchUsers = async (search) => {
        const q = query(collection(db, "users"), where('name', '>=', search));
        const querySnapshot = await getDocs(q);
        let users = querySnapshot.docs.map((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const id = doc.id;
            const data = doc.data();
            return { id, ...data };
        });
        setUsers(users);
    }
    return (
        <SafeAreaView
            className="flex-1"
        >
                <TextInput placeholder="Type Here" onChangeText={(search) => fetchUsers(search)} />
                <FlatList
                    className="w-[100vw]"
                    numColumns={1}
                    horizontal={false}
                    data={users}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate("Profile", {uid: item.id})}
                            }
                        >
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
        </SafeAreaView>
    )
}