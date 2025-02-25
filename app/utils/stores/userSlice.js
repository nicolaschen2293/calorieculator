import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "../supabase";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            console.log('User Set!')
        },
        logOutUser: (state) => {
            state.user = null
            console.log('User logged out!')
        }
    }
})

export const { setUser, logOutUser } = userSlice.actions

export default userSlice.reducer

// Async function to check login status
export const checkUserSession = () => async (dispatch) => {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      dispatch(setUser(data.user));
    }
};