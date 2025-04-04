import { createSlice } from "@reduxjs/toolkit";

export const foodSlice = createSlice({
    name: 'food',
    initialState: {
        foodImg: null,
        food: null,
    },
    reducers: {
        setFood: (state, action) => {
            state.food = action.payload
        },
        setFoodImg: (state, action) => {
            state.foodImg = action.payload
        }
    }
})

export const { setFood, setFoodImg } = foodSlice.actions

export default foodSlice.reducer