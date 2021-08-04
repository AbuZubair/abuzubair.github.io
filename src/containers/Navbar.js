import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import SearchLogo from '../static/images/search-icon.svg';
import Logo from '../static/images/pokemon-logo-png-1444.png';
import ListIcon from '@material-ui/icons/List';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { gql, useQuery, useLazyQuery  } from '@apollo/client';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import useDidMountEffect from '../components/useDidMountEffect';
import Formatter from '../services/formatter';

import Notif from '../components/UI/Notif';

const ITEM_HEIGHT = 48;

const GET_POKEMONS_SEACRH = gql`
  query pokemons($name: String) {
    pokemon_v2_pokemon(where: {name: {_like: $name}}) {
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
        }
        base_stat
      }
    }
  }`; 
  
function Navbar (props) {
  const [scrolling, setScroll] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [resultSearch, setResultSearch] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openNotif, setOpenNotif] = React.useState(false);
  const [titleNotif,setTitleNotif] = useState("");
  const [msgNotif,setMsgNotif] = useState("");
  const open = Boolean(anchorEl);
  const prevData = useRef();

  const [
    getData, 
    { data }
  ] = useLazyQuery(GET_POKEMONS_SEACRH);
 

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolling]);

  useEffect(() => {    
    if(resultSearch){
      props.history.push({
        pathname: '/search',
        pokemonRows: resultSearch,
        userInput: userInput
      });
    }      
  }, [resultSearch]); 
  

  /** changes the scrolling state depending on the Y-position */
  const handleScroll = () => {
    if (window.scrollY === 0) {
      setScroll(false);
    }
    else if (window.scrollY > 50) {
      setScroll(true);
    }
  }

  const onChange = async (event) => {    
    await setUserInput(event.target.value)
  }

  const search = (e) => {    
    var key=e.keyCode || e.which;
    if (key==13){
      if(userInput?.length > 0){
        makeAipCall();
      }else{
        props.history.push('/')
        return
      }              
    }    
  }

  /** Make API call as soon as the user starts typing.  */
  const makeAipCall = async () => {   
    if(userInput){      
      getData({ variables: {name: `%${userInput}%`}})                       
    }      
  }

  
  if(data){               
    if(prevData.current != data){      
      prevData.current = data   
      let res = Formatter.formatData(data.pokemon_v2_pokemon)               
      setResultSearch(res)         
    }
  }


  const onLogoClick = () => {
    // reset input state
    setUserInput('')
  }
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExit = () => {        
    localStorage.clear();
    setTitleNotif("Exit!")
    setMsgNotif("Goodbye my friend")
    setOpenNotif(true)
    handleClose()
    setTimeout(() => {
      window.location.reload(false)  
    }, 500);       
  }

  const handleInfoClose = () => {
    setOpenNotif(false);
  };

  return (
    <nav className={"navigation " + (scrolling ? "black" : "")} >
      <ul className="navigation__container">
        <NavLink to="/" onClick={() => onLogoClick()}>
          <img className="navigation__container--logo" src={Logo} alt="" />
        </NavLink>
                
        <div className="navigation__container--left">
          <SearchLogo className="logo" />
          <input
            value={userInput}
            onChange={e => onChange(e)}
            onKeyPress={e => search(e)}
            className="navigation__container--left__input"
            type="text"
            placeholder="Name" />
        </div>

        <div className="navigation__container--right">
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                marginTop: '1.5rem',
                marginRight: '1.5rem',
                padding: '.8em'
              },
            }}
          >
            {
              <NavLink to="/mylist" onClick={handleClose}>                
                <div className="navigation__container-link pseudo-link">
                  <ListIcon /> 
                  <span>My List</span>
                </div>
              </NavLink>
            }           
            {localStorage.getItem("userData") !== null &&
              <NavLink to="#" onClick={handleExit}>                               
                <div className="navigation__container-link pseudo-link">
                  <ExitToAppIcon /> 
                  <span>Quit</span>
                </div>         
              </NavLink>
            }                             
          </Menu>
        </div>
        
      </ul>

      {
      <Notif open={openNotif} title={titleNotif} desc={msgNotif} handleInfoClose={handleInfoClose}/>
      }
    </nav>        
  )

}

export default withRouter(Navbar); 
