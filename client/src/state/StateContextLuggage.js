// StateContextLuggage.js
import React, { createContext, useContext, useReducer } from 'react';

const StateContextLuggage = createContext();

const initialState = {
  luggageData: [],
  isLoading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LUGGAGE_DATA':
      return {
        ...state,
        luggageData: action.payload,
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

export const StateProviderLuggage = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContextLuggage.Provider value={{ state, dispatch }}>
      {children}
    </StateContextLuggage.Provider>
  );
};

export const useStateContextLuggage = () => useContext(StateContextLuggage);
