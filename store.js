import { createStore, combineReducers, applyMiddleware } from "redux";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
    user: {},
    appointData: {},
    isCustomerCenter: false
}

const changeState = (state = initialState, { type, ...rest }) => {
    switch (type) {
        case 'set':
            return { ...state, ...rest }
        case 'clear_all':
            return initialState;
        default:
            return state
    }
}

const persistConfig = {
    key: "root_fuze",
    storage,
};

const persistedReducer = persistReducer(persistConfig, changeState);

const Store = () => {
    let store = createStore(persistedReducer);
    let persistor = persistStore(store);
    return { store, persistor };
};

export default Store;

