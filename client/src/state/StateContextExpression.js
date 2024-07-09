// StateContextExpression.js
import React, { createContext, useContext, useReducer } from 'react';

const StateContextExpression = createContext();

const initialState = {
  expressionData: [],
  isLoading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_EXPRESSION_DATA':
      return {
        ...state,
        expressionData: action.payload,
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

export const StateProviderExpression = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContextExpression.Provider value={{ state, dispatch }}>
      {children}
    </StateContextExpression.Provider>
  );
};

export const useStateContextExpression = () => useContext(StateContextExpression);
