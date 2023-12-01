import { getAuth } from "firebase/auth";
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from "../constants";

import { collection, getDoc, getDocs, getFirestore, doc } from "firebase/firestore";

export function fetchUser() {
    return async (dispatch) => {
        try {
            const db = getFirestore();
            const userId = getAuth().currentUser.uid;
            const userDocRef = doc(db, 'users', userId);
            const docSnapshot = await getDoc(userDocRef);

            if (docSnapshot.exists()) 
            {
                dispatch({ type: USER_STATE_CHANGE, currentUser: docSnapshot.data() });
            } 
            else 
            {
                console.log('User does not exist');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };
}

export function fetchUserPosts() {
    const db = getFirestore();
    return async (dispatch) => {
        const auth = getAuth();
        const querySnapshot = await getDocs(collection(db, "posts", auth.currentUser.uid, "userposts"));
        const posts = querySnapshot.docs.map((doc) => {
            if (doc.exists()) {
                const id = doc.id;
                const data = doc.data();
                const creation = data.creation.toMillis();
                return { id, ...data, creation };
            } else {
                console.log('does not exist');
                return null;
            }
        });

        // Sort posts by creation date in descending order (most recent first)
        const sortedPosts = posts.sort((a, b) => b.creation - a.creation);
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts: sortedPosts });
    };
}