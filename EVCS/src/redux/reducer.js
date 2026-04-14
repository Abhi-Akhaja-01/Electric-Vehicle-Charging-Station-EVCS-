import * as actionTypes from "./actionTypes";

import AuthService from "../services/auth.service";

const INITIAL_STATE = {
  isLoading: false,
  isLogin: AuthService.checkLogin(),
  adminData: {},
  ownerData: {},
  isAdmin: AuthService.checkIsAdmin(),
};

const reducer = (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case actionTypes.START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.FINISH_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLogin: true,
        isAdmin: action.payload,
      };
    case actionTypes.LOG_OUT_SUCCESS:
      AuthService.removeAuthData();
      return {
        ...state,
        isLogin: false,
      };
    case actionTypes.SET_ADMIN_DATA:
      return {
        ...state,
        adminData: action.payload,
      };
    case actionTypes.REMOVE_ADMIN_DATA:
      return {
        ...state,
        adminData: {},
      };
    case actionTypes.SET_OWNER_DATA:
      return {
        ...state,
        ownerData: action.payload,
      };
    case actionTypes.RESET_OWNER_DATA:
      return {
        ...state,
        ownerData: {},
      };
    default:
      return state;
  }
};

export default reducer;
