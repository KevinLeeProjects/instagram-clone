import { getAuth } from "firebase/auth";
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA } from "../constants";

import { collection, getDoc, getDocs, getFirestore, doc } from "firebase/firestore";

export function clearData() 
{
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser() {
    return async (dispatch) => {
        try {
            const db = getFirestore();
            const userId = getAuth().currentUser.uid;
            const userDocRef = doc(db, 'users', userId);
            const docSnapshot = await getDoc(userDocRef)

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

export function fetchUserFollowing() {
    const db = getFirestore();
    return async (dispatch) => {
        const auth = getAuth();
        const snapshot = await getDocs(collection(db, "following", auth.currentUser.uid, "userFollowing"));
        const following = snapshot.docs.map((doc) => {
            if (doc.exists()) {
                const id = doc.id;
                return id;
            } else {
                console.log('does not exist');
                return null;
            }
        });
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        for(const element of following)
        {
            dispatch(fetchUsersData(element));
        }
    };
}

export function fetchUsersData(uid)
{
    return(async (dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);

        if(!found)
        {
            try {
                const db = getFirestore();
                const userDocRef = doc(db, 'users', uid);
                await getDoc(userDocRef).then((snapshot) =>
                {
                    if (snapshot.exists()) 
                    {
                        let user = snapshot.data();
                        user.uid = snapshot.id;
                        dispatch({ type: USERS_DATA_STATE_CHANGE, user });
                        dispatch(fetchUsersFollowingPosts(user.uid));
                    } 
                    else 
                    {
                        console.log('User does not exist');
                    }
                })
    
                
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    const db = getFirestore();
    return async (dispatch, getState) => {

        const querySnapshot = await getDocs(collection(db, "posts", uid, "userposts"))
        //const uid = snapshot.query.EP.path.segments[1];
        const user = getState().usersState.users.find(el => el.uid === uid);
        const posts = querySnapshot.docs.map((doc) => {
            if (doc.exists()) {
                const id = doc.id;
                const data = doc.data();
                const creation = {
                    nanoseconds: data.creation.nanoseconds,
                    seconds: data.creation.seconds
                };
                return { id, ...data, user, creation  };
            } else {
                console.log('does not exist');
                return null;
            }
        });
        dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
    };
}