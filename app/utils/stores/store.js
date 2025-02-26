import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import foodReducer from "./foodSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    food: foodReducer,
  },
});

export default store;