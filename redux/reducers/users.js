import { USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA } from "../constants";

const initialState = {
    users: [],
    usersLoaded: 0
};

export const users = (state = initialState, action) => {
    switch(action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users, action.user]
            }
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                users: state.users.map(user => user.uid === action.uid ?
                    { ...user, ...action.posts } : 
                    user
                ),
                usersLoaded: state.usersLoaded + 1
            }
        case CLEAR_DATA:
            return {
                users: [],
                usersLoaded: 0
            }
        default:
            return state;
    }
    
}