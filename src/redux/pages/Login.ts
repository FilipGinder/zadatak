
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Login {
  jwtLoginToken: string;
}

const initialState: Login = {
  jwtLoginToken: '',
};

const routerLogin = createSlice({
  name: 'login',
  initialState,
  reducers: {

    setJwtLoginToken: (state, action: PayloadAction<string>) => {
      state.jwtLoginToken = action.payload;
    },
  }
});

export const  { 
                setJwtLoginToken,
              } = routerLogin.actions;
export const routerLoginReducer = routerLogin.reducer;
