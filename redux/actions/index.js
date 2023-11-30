import { USER_STATE_CHANGE } from "../constants";

import { collection, getDocs, getFirestore } from "firebase/firestore";

export function fetchUser() {
    const db = getFirestore();
    return(async (dispatch) => {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        if(doc.exists) {
            dispatch({type: USER_STATE_CHANGE, currentUser: doc.data()});
        }
        else
        {
            console.log('does not exist');
        }
        });
    })
}