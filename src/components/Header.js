import React from 'react';

import AddLogo from '../static/images/add.svg';

export default function Header(props) { 
  const backgroundStyle = {
    backgroundSize: 'contain',   
    backgroundImage: `url(${props.pokemon.image})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }; 

  return (
    <header style={backgroundStyle} className="header">
      <div className="header__container">
        <h1 className="header__container-heading">{props.pokemon.name}</h1>
        <button 
        className="header__container-btnMyList"
        onClick={() => props.catchHandler(props.pokemon)}
        >
          <AddLogo className="header__container-btnMyList-add" />
          Catch
        </button>
        <h1 className="header__container-overview">{props.pokemon.type && props.pokemon.type.join(" | ")}</h1>
      </div>
      <div className="header--fadeBottom"></div>
    </header>
  );
}
