import React, { useState, useEffect, useRef, Component } from 'react';

import ModalForm from '../components/UI/ModalForm';
import FirebaseService from '../services/firebase';
import Notif from '../components/UI/Notif';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { red,blue, green, yellow, orange, pink } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  barColorPrimary0: {
    backgroundColor: red[500],
    borderRadius: 5,
  },
  barColorPrimary1: {
    backgroundColor: blue[500],
    borderRadius: 5,
  },
  barColorPrimary2: {
    backgroundColor: green[500],
    borderRadius: 5,
  },
  barColorPrimary3: {
    backgroundColor: yellow[500],
    borderRadius: 5,
  },
  barColorPrimary4: {
    backgroundColor: orange[500],
    borderRadius: 5,
  },
  barColorPrimary5: {
    backgroundColor: pink[500],
    borderRadius: 5,
  },
  barroot: {
    borderRadius: 5
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },  
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));


export default function Mylist (props) {

  const classes = useStyles();
  const [pokemons, setPokemons] = useState([]);
  const [toggleModal, setToggle] = useState(false);
  const [toggleModalForm, setToggleModalForm] = useState(false);
  const [selectedPokemon, setSelected] = useState({});    
  const [inputUser,setInput] = useState("");
  const [errorInput,setErrorInput] = useState("");  
  const [loading, setLoading] = React.useState(false);  
  const [open, setOpen] = React.useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem('userData')) || []
  );
  const [titleForm,setTitleForm] = useState("");
  const [msgForm,setMsgForm] = useState("");
  const [labelForm,setLabelForm] = useState("");
  const [buttonLabelForm,setButtonLabelForm] = useState("");
  const [titleNotif,setTitleNotif] = useState("");
  const [msgNotif,setMsgNotif] = useState("");
  
  useEffect(() => {
      
    if(userData.data){
      setPokemons(userData.data.pokemon)
    }

    if(userData.id){
      setIsJoined(true)
    }
    
  }, [userData]);  
 
  const closeModal = () => {
    setToggle(false);
  }

  const deletePokemonHandler = async (pokemon) => {
    setSelected(pokemon);
    setTitleNotif("Delete Confirmation!")
    setMsgNotif(`Are you sure you want to delete ${pokemon.nickname.replace(/\b\w/g , function(m){ return m.toUpperCase(); } )} (${pokemon.name.replace(/\b\w/g , function(m){ return m.toUpperCase(); } )})??`) 
    setToggle(true);     
  }

  const deletePokemon = async() => {    
    setLoading(true);
    try { 
      const index = userData.data.pokemon.indexOf(selectedPokemon);
      if (index > -1) {
        userData.data.pokemon.splice(index, 1);
      }      
      let pokemons = userData.data.pokemon
      const data = {
        username:userData.data.username,
        pokemon:pokemons
      };                                                                                         
      db.collection("PokemonData")
        .doc(userData.id)
        .set(data)
        .then(() => {            
          setTitleNotif("Process Successfully")
          setMsgNotif("Pokemon succesfully deleted from your list.")
          setToggle(false)
          hanldeSetOpen(true)            
          updateUserData()                                           
          setLoading(false);       
        })
        .catch(error => {
          setTitleNotif("Error")
          setMsgNotif(error.message)
          hanldeSetOpen(true)          
        });
    } catch (error) {
      console.log(error)
    }    
  }

  const openForm = () => {
    wordingForm("username");    
    setErrorInput("");
    setToggleModalForm(true);
  }

  const wordingForm = (type) => {
    switch (type) {
      case "nickname":
        setTitleForm("Gotcha!")
        setMsgForm("Please set nickname for this pokemon.")
        setLabelForm("Nickname")
        setButtonLabelForm("Set")
        break;
      case "username":
        setTitleForm("Join The Game")
        setMsgForm("To catch the pokemon, please enter your username.")
        setLabelForm("Username")
        setButtonLabelForm("Join")
        break;
    
      default:
        break;
    }
    
  }

  const closeModalForm = () => {
    setToggleModalForm(false);    
  }

  const handleSubmit = () => {
    if(labelForm == "Username"){
      joinTheGame()
    }else{
      catchPokemon()
    }
  }
 
  const joinTheGame = async () => {
    if (!loading) {      
      setLoading(true);
    }

    if(inputUser!=''){
      try {
        const response = await FirebaseService.getByUsername(inputUser.toLowerCase().trim())
        if(!response){
          storeUserData()
        }else{                    
          setUserData(response)
          localStorage.setItem('userData', JSON.stringify(response));          
          setTitleNotif("You're In")
          setMsgNotif("Let's catch some pokemon.")    
          closeModalForm()      
          setOpen(true);
          setLoading(false);          
          setInput("")
        }
      } catch (error) {
        console.log(error)
      }
             
    }else{
      setErrorInput("Please Input Username");
      setLoading(false);
    }    
  }

  const storeUserData = async () => {       
    db.collection("PokemonData").doc().set({
        username: inputUser.toLowerCase().trim(),
        pokemon: []        
    })
    .then(function() {        
        setLoading(false);
        joinTheGame()
        closeModalForm()        
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
        setLoading(false);
    });      
  }

  const handleChange = (e) => {
    setInput(e.target.value)
    setErrorInput("")
  }

  const hanldeSetOpen = () => {
    setOpen(true)   
  }

  const updateUserData = () => {
    let newUserData = userData
    setUserData(newUserData)
    localStorage.setItem('userData', JSON.stringify(newUserData));  
  }

  const handleInfoClose = () => {
    setOpen(false);
  };

  const goToHome = () => {
    props.history.push('/')
    return
  }

  const { userInput } = props.location

  return (
    <>
      {        
        <div className="search-container"> 
          <h1 className="search-container__title">My List</h1>          
          {isJoined && pokemons.length>0 &&
              <Row className="pokemonShowcase__container-card--nomargin">
                {
                pokemons.map((dt, idx) => {           
                  if(dt){                                                        
                      return (                  
                        <Col xs={6} sm={6} md={3} key={idx}>
                          <Card 
                          className="pokemonShowcase__container-card--cards" 
                          >                            
                            <CardHeader       
                              action={
                                <IconButton onClick={() => deletePokemonHandler(dt)} aria-label="settings">
                                  <DeleteIcon fontSize="large" />
                                </IconButton>
                              }                                             
                              title={dt.nickname}
                              subheader={dt.name.replace(/\b\w/g , function(m){ return m.toUpperCase(); } )}                              
                            />
                                              
                            <CardMedia
                              className={classes.media}
                              image={dt.image}
                              title={dt.name}                              
                            />
                            <CardContent>                                                                                 
                              {dt.stats.map((stat, i) => {                                      
                                if(stat){
                                  return(
                                    <div key={i} >
                                      <Row >
                                        <Col>
                                          <Typography variant="body2" color="textSecondary" component="p">
                                            {stat.pokemon_v2_stat.name}
                                          </Typography> 
                                        </Col>
                                        <Col className="textRight">
                                          <Typography variant="body2" color="textSecondary" component="p">
                                            {stat.base_stat}
                                          </Typography> 
                                        </Col>
                                      </Row>
                                      <LinearProgress variant="determinate" 
                                        value={stat.base_stat} 
                                        className="mb-2"                                     
                                        classes={{root: classes.barroot, barColorPrimary: classes["barColorPrimary"+i]}}
                                        />
                                    </div>                                
                                  )
                                }
                              })}
                              
                            </CardContent>
                            <CardActions disableSpacing className="p-0">            
                              <div className="pokemonShowcase__container-card--cards---chip">
                                {dt.type.map((type, i) => {  
                                  return(
                                    <Chip label={type} key={i} size="small"/> 
                                  )                                   
                                  })
                                }
                              </div> 
                            </CardActions>                            
                          </Card>
                        </Col>                  
                      )
                    }          
                  })
                }                
              </Row>
          }
          {
            isJoined && pokemons.length==0 &&
              <div>
                <div className="no-results m-4">
                  <div className="no-results__text">
                    <p>Let's catch some Pokemon.</p>
                    <Button onClick={goToHome} variant="contained"
                      color="primary">
                          Go
                    </Button> 
                  </div>
                </div>               
              </div>                     
          }  

          {!isJoined &&
            <div>
              <div className="no-results m-4">
                <div className="no-results__text">
                  <p>Looks like you haven't joined the game.</p>
                  <Button onClick={openForm} variant="contained"
                    color="primary">
                        Join The Game
                  </Button> 
                </div>
              </div>               
            </div>
          }          
        </div>
        
      }

      <ModalForm 
        title={titleForm}
        desc={msgForm}
        action={buttonLabelForm}
        label={labelForm}
        closeModal={closeModalForm}
        toggleModal={toggleModalForm}
        onclick={handleSubmit}
        loading={loading}
        setLoading={setLoading}
        handleChange={handleChange}
        inputUser={inputUser}
        error={errorInput}
      />

      { 
        <Notif open={toggleModal} loading={loading} title={titleNotif} desc={msgNotif} cancel={closeModal} handleInfoClose={deletePokemon}/>
      }

      {
        <Notif open={open} title={titleNotif} desc={msgNotif} handleInfoClose={handleInfoClose}/>
      }
    </>
    
  );
  
}
