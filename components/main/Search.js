import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';

export default function Search(props) {
    const [users, setUsers] = useState([]);

    const db = getFirestore();
    const fetchUsers = async (search) => {
        if(search == "")
        {
            setUsers([]);
            return;
        }
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
            className="
                flex-1
                items-center
            ">
                <TextInput className="text-2xl border rounded-lg w-[95vw] mt-[10px] px-[2.5vw] py-1" placeholder="Search" onChangeText={(search) => fetchUsers(search)} />
                <FlatList
                    className="w-[95vw] mt-[20px]"
                    numColumns={1}
                    horizontal={false}
                    data={users}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            className="mb-[10px] "
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