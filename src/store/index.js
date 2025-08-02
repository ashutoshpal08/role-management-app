import { configureStore, combineReducers } from "@reduxjs/toolkit";
import employeeReducer from '../features/employees/employeeSlice';
import roleReducer from "../features/roles/roleSlice";
import storage from "redux-persist/lib/storage"; 
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['roles' , 'employees'] 
};

const rootReducer = combineReducers({
  employees: employeeReducer,
  roles: roleReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);
export default store;
