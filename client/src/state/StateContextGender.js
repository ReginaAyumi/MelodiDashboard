// StateContextGender.js
import React, { createContext, useContext, useReducer } from 'react';

const StateContextGender = createContext();

const initialState = {
  genderData: [],
  isLoading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_GENDER_DATA':
      return {
        ...state,
        genderData: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const StateProviderGender = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContextGender.Provider value={{ state, dispatch }}>
      {children}
    </StateContextGender.Provider>
  );
};

export const useStateContextGender = () => useContext(StateContextGender);
