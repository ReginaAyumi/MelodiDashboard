// StateContextAge.js
import React, { createContext, useContext, useReducer } from 'react';

const StateContextAge = createContext();

const initialState = {
  ageData: [],
  isLoading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_AGE_DATA':
      return {
        ...state,
        ageData: action.payload,
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

export const StateProviderAge = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContextAge.Provider value={{ state, dispatch }}>
      {children}
    </StateContextAge.Provider>
  );
};

export const useStateContextAge = () => useContext(StateContextAge);
