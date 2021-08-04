const Formatter = {
  
    formatData: function(data) { 
        const result = data.map(pokemon => {
          return {
            id: pokemon.id,
            name: pokemon.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`,
            abilities: pokemon.pokemon_v2_pokemonabilities.map((ability) => {
              return {
                name: ability.pokemon_v2_ability.name,
                effect: ability.pokemon_v2_ability.pokemon_v2_abilityeffecttexts
              }
            }),
            type: pokemon.pokemon_v2_pokemontypes.map((type) => {
              return type.pokemon_v2_type.name
            }),
            stats: pokemon.pokemon_v2_pokemonstats,
          }
        })
        return result
    },

    randomIntFromInterval: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

export default Formatter;