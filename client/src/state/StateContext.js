import React, { createContext, useContext, useReducer } from "react";

const initialState = {
  ageData: [],
  genderData: [],
  isLoading: true,
  error: null,
};

const StateContext = createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_AGE_DATA":
      return { ...state, ageData: action.payload, isLoading: false, error: null };
    case "SET_GENDER_DATA":
      return { ...state, genderData: action.payload, isLoading: false, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
