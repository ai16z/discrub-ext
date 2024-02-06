import { createSlice } from "@reduxjs/toolkit";
import { sendChromeMessage } from "../../services/chrome-service";
import { fetchUserData } from "../../services/discord-service";
import { UserState } from "./user-types";
import { AppThunk } from "../../app/store";
import { User } from "../../classes/user";

const initialState: UserState = {
  currentUser: null,
  token: null,
  isLoading: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setIsLoading: (state, { payload }: { payload: boolean }): void => {
      state.isLoading = payload;
    },
    setToken: (state, { payload }: { payload: string | Maybe }): void => {
      state.token = payload;
    },
    setCurrentUser: (state, { payload }: { payload: User }): void => {
      state.currentUser = payload;
    },
  },
});

export const { setIsLoading, setToken, setCurrentUser } = userSlice.actions;

export const getUserData = (): AppThunk => async (dispatch) => {
  dispatch(setIsLoading(true));
  const chromeCallback = async (userToken: string) => {
    if (userToken) {
      const { success, data } = await fetchUserData(userToken);
      if (success && data) {
        dispatch(setCurrentUser(data));
        dispatch(setToken(userToken));
      }
    }
    dispatch(setIsLoading(false));
  };
  return sendChromeMessage("GET_TOKEN", chromeCallback);
};

export const getUserDataManaully =
  (userToken: string): AppThunk<Promise<boolean>> =>
  async (dispatch) => {
    if (userToken) {
      const { data, success } = await fetchUserData(userToken);

      if (success && data) {
        dispatch(setToken(userToken));
        dispatch(setCurrentUser(data));
        return true;
      } else {
        dispatch(setToken(undefined));
        dispatch(setIsLoading(false));
        return false;
      }
    }
    return false;
  };

export default userSlice.reducer;
