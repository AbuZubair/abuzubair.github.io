import React from 'react';

import Aux from '../hoc/Aux_';

export default function PokemonDetails(props) {  
  let idx = 0
  return (
    <Aux>
      <div className="modals__container">
        <h1 className="modals__title">
          {props.pokemon.name}
        </h1>
        <h3 className="mb-4">Type: {props.pokemon.type && props.pokemon.type.join(", ")}</h3>
        {props.pokemon.abilities && props.pokemon.abilities.map((ablts, i) => {           
            for (let index = 0; index < ablts.effect.length; index++) {    
              idx++          
              return(
                <p className="modals__desc" key={idx}>
                  {ablts.effect[index].effect}
                </p>
              )              
            }                        
          })
        }
        <button 
          className="modals__btn"
          onClick={() => props.catchHandler(props.pokemon)}
        >
          Catch
        </button>
      </div>
    </Aux>
  );
}
