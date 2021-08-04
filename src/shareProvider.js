import React, { useState } from "react";

export const Context = React.createContext();

const Provider = props => {
  const aCallback = (pokemon) => {
      console.log(pokemon)
    setSelectedPokemon(pokemon);
  };

  const [selectedPokemon, setSelectedPokemon] = useState({});

  return (
    <Context.Provider
      value={{
        selectedPokemon,     
        aCallback: aCallback
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Provider;