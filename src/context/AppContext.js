import React, { createContext, useState, useEffect } from "react";

const DEFAULT_VALUE = {
  store: {
    username: "",
  },
};

export const AppContext = createContext(DEFAULT_VALUE);

export const AppContextProvider = (props) => {
  const [state, setState] = useState(
    JSON.parse(window.localStorage.getItem("STORES")) || DEFAULT_VALUE.store
  );
  const action = {
    changeUser: (username) => {
      setState(username);
    },
  };
  useEffect(() => {
    window.localStorage.setItem("STORES", JSON.stringify(state));
  }, [state]);
  return (
    <AppContext.Provider value={{ store: state, action }}>
      {props.children}
    </AppContext.Provider>
  );
};
