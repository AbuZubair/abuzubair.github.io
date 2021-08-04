import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Formatter from '../services/formatter';

import DisplayPokemonRow from './DisplayPokemonRow';
import { gql, useQuery, useLazyQuery  } from '@apollo/client';
import db from '../config'


function MainContent(props) {

  const [headerPokemon, setHeaderPokemon] = useState({});
  
  const GET_POKEMONS_HEADER = gql`
  query pokemons($id: Int) {
    pokemon_v2_pokemon(where: {id: {_eq: $id}}) {
      id
      name
      pokemon_v2_pokemonabilities {
        pokemon_v2_ability {
          name
          pokemon_v2_abilityeffecttexts(where: {language_id: {_eq: 9}}) {
            effect            
          }
        }
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonstats {
        pokemon_v2_stat {
          name
          game_index
          move_damage_class_id
        }
        base_stat
      }
    }
  }`; 
  

  const [
    getData, 
    { data }
  ] = useLazyQuery(GET_POKEMONS_HEADER);

  useEffect(() => {            
    
    const rndInt = Formatter.randomIntFromInterval(1, 100)  
    const pokeID = rndInt;
    
    if(!data){     
      getData({ variables: {id: pokeID}})         
    }  

  }, []);

  if(data){           
    if(headerPokemon && Object.keys(headerPokemon).length === 0 && headerPokemon.constructor === Object){         
      let res = Formatter.formatData(data.pokemon_v2_pokemon)     
      setHeaderPokemon(res[0])         
    }
  }
            
  const {selectPokemonHandler} = props;
  
  return (
    <div className="container_">
      <Header pokemon={headerPokemon} catchHandler={props.catchHandler}/>
      <div className="pokemonShowcase">       
        <DisplayPokemonRow
          catchHandler={props.catchHandler}
          selectPokemonHandler={selectPokemonHandler}
          flagAdded={props.flagAdded}
          setFlagAdded={props.setFlagAdded}
        />                
      </div>       
      {data &&
       <Footer />}      
    </div>
  );
}

export default MainContent; 