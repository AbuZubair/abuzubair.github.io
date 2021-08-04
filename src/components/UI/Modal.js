import React from 'react';

import Aux from '../../hoc/Aux_';
import Backdrop from './Backdrop';

export default function Modal(props) {
  const backgroundStyle = {
    backgroundSize: 'contain',
    backgroundImage: `url(${props.pokemon.image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right'
  };
  
  return (
    <Aux>
      <Backdrop show={props.show} toggleBackdrop={props.modalClosed} />
      <div
        style={backgroundStyle}
        className={props.show ? 'modals show' : 'modals hide'}
      >
        {props.children}
      </div>
    </Aux>
  );
}
