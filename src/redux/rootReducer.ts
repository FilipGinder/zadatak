import { combineReducers } from '@reduxjs/toolkit';
import { routerLoginReducer } from './pages/Login';

const rootReducer = combineReducers({
    routerLogin:routerLoginReducer
});

export default rootReducer;