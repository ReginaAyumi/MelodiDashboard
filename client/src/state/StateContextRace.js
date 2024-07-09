// StateContextRace.js
import React, { createContext, useContext, useReducer } from 'react';

const StateContextRace = createContext();

const initialState = {
  raceData: [],
  isLoading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_RACE_DATA':
      return {
        ...state,
        raceData: action.payload,
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

export const StateProviderRace = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContextRace.Provider value={{ state, dispatch }}>
      {children}
    </StateContextRace.Provider>
  );
};

export const useStateContextRace = () => useContext(StateContextRace);
