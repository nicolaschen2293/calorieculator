import { createSlice } from "@reduxjs/toolkit";

export const foodSlice = createSlice({
    name: 'food',
    initialState: {
        foodImg: null,
        food: null,
        // foodName: null,
        // servingSize: null,
        // calories: null,
        // carbohydrate: null,
        // protein: null,
        // fat: null,
        // fiber: null,
        // sugar: null,
        // sodium: null,
        // cholesterol: null,
        // saturated_fat: null
    },
    reducers: {
        setFood: (state, action) => {
            // state.foodName = action.payload['Food Name']
            // state.servingSize = action.payload['Serving Size']
            // state.calories = action.payload['Calories']
            // state.carbohydrate = action.payload['Total Carbohydrates']
            // state.protein = action.payload['Protein']
            // state.fat = action.payload['Total Fat']
            // state.fiber = action.payload['Dietary Fiber']
            // state.sugar = action.payload['Sugars']
            // state.sodium = action.payload['Sodium']
            // state.cholesterol = action.payload['Cholesterol']
            // state.saturated_fat = action.payload['Saturated Fat']
            state.food = action.payload
        },
        setFoodImg: (state, action) => {
            state.foodImg = action.payload
        }
    }
})

export const { setFood, setFoodImg } = foodSlice.actions

export default foodSlice.reducer