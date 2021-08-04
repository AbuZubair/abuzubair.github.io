import React, { useState, useEffect, useRef, Component } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Modal from '../components/UI/Modal';
import ModalForm from '../components/UI/ModalForm';
import PokemonDetails from '../components/PokemonDetails';
import FirebaseService from '../services/firebase';
import Formatter from '../services/formatter';
import Notif from '../components/UI/Notif';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import { red,blue, green, yellow, orange, pink } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Skeleton from '@material-ui/lab/Skeleton';

import { fetchAllData } from '../store/actions/index'
import db from '../config'

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


export default function Search (props) {

  const classes = useStyles();
  const reducer = useSelector(state => state.reducer);
  const dispatch = useDispatch();
  const [pokemons, setPokemons] = useState([]);
  const [toggleModal, setToggle] = useState(false);
  const [toggleModalForm, setToggleModalForm] = useState(false);
  const [pokemonOverview, setOverview] = useState({});
  const [selectedPokemon, setSelected] = useState({});  
  const [ownedInfo, setOwnedInfo] = useState([]);
  const [loadingOwned, setLoadingOwned] = useState(false);
  const [inputUser,setInput] = useState("");
  const [errorInput,setErrorInput] = useState("");
  const [errorInputForm,setErrorInputForm] = useState("");
  const [loading, setLoading] = React.useState(false);  
  const [open, setOpen] = React.useState(false);
  const prevOwned = useRef();
  const prevProps = useRef();
  const location = useLocation();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem('userData')) || []
  );
  const [titleForm,setTitleForm] = useState("");
  const [msgForm,setMsgForm] = useState("");
  const [labelForm,setLabelForm] = useState("");
  const [buttonLabelForm,setButtonLabelForm] = useState("");
  const [titleNotif,setTitleNotif] = useState("");
  const [msgNotif,setMsgNotif] = useState("");
  const [flagAdded,setFlagAdded] = useState(false);

  useEffect(() => {
    prevProps.current = [];
    let isCancelled = false;
    if (!isCancelled) {
      const { pokemonRows } = props.history.location;      
      if (pokemonRows && !isCancelled)
        setPokemons( pokemonRows);  
      prevProps.current = props.location.pokemonRows
    } 
    if (
      prevProps?.location?.pokemonRows?.length !==
      props?.location?.pokemonRows?.length
    ) {         
      dispatch(fetchAllData());            
      let arrOwned = [] 
      arrOwned = props.location.pokemonRows.map(item => {
        return {
          name: item.name,
          count: 0
        }
      });            
      setOwnedInfo(arrOwned)
      setPokemons(props.location.pokemonRows);
      prevOwned.current = arrOwned
    }       
    return () => { 
      prevOwned.current = [];
      prevProps.current = [];
      isCancelled = true;      
    };
  }, [location]);  

  useEffect(() => {
   
    if(reducer.data){
      setLoadingOwned(false)
      let wait = true      
      let newOwnedInfo = ownedInfo.map((item,idx) => {
        for (let i = 0; i < reducer.data.length; i++) {          
          reducer.data[i].pokemon.map(list => {
            if(list.name==item.name)item.count++            
          })
        }
        if(idx==ownedInfo.length-1)wait = false
        return item
      }) 
      if(prevOwned.current != ownedInfo){
        // setOwnedInfo(newOwnedInfo);
        // console.log(prevOwned.current)
        prevOwned.current = newOwnedInfo
      }        
      if(!wait)setLoadingOwned(true);
    }

  },[reducer,ownedInfo,pokemons]) 

  useEffect(() => {
    if (flagAdded) {
      let resetInfoOwned =  ownedInfo.map(item => {
        item.count = 0
        return item
      })   
      // setOwnedInfo(resetInfoOwned)   
      if(prevOwned.current != ownedInfo){        
        prevOwned.current = resetInfoOwned
      }     
      dispatch(fetchAllData());            
    }
    setFlagAdded(false)
  }, [flagAdded]);


  const closeModal = () => {
    setToggle(false);
  }

  const selectPokemonHandler = async (pokemon) => {
    setOverview(pokemon);
    setToggle(true);     
  }

  const catchHandler = async (pokemon) => {
    if(userData.length == 0){
      openForm()
    }else{
      const prob = Formatter.randomIntFromInterval(0, 1)  
      if(prob == 1){
        setErrorInput("")
        wordingForm("nickname");        
        setToggleModalForm(true);
        setSelected(pokemon)
      }else{
        setTitleNotif("Oops!")
        setMsgNotif("Sorry you failed to catch this pokemon. Try again later.")       
        hanldeSetOpen(true)
      }
      
    }
  }

  const catchPokemon = async() => {
    if (!loading) {      
      setLoading(true);
    }

    if(inputUser!=''){
      try {        
        
        if(userData.data.pokemon.length && 
          userData.data.pokemon.some(i => i.nickname.includes(inputUser.trim()))){
          setErrorInput("Nickname already used"); 
          setLoading(false);          
          return
        }
                
        let pokemonData = selectedPokemon
        pokemonData.nickname = inputUser.trim()
        let pokemons = userData.data.pokemon
        pokemons.push(pokemonData)
        const data = {
          username:userData.data.username,
          pokemon:pokemons
        };      
                                                        
        db.collection("PokemonData")
          .doc(userData.id)
          .set(data)
          .then(() => {            
            setTitleNotif("You did it!")
            setMsgNotif("Pokemon succesfully added to your list.")
            setToggleModalForm(false)
            hanldeSetOpen(true)            
            updateUserData()                            
            setLoading(false);    
            setInput("")   
            setFlagAdded(true)         
          })
          .catch(error => {
            setTitleNotif("Error")
            setMsgNotif(error.message)
            hanldeSetOpen(true)
            setLoading(false);
          });
      } catch (error) {
        console.log(error)
      }
    }else{
      setErrorInput("Please Input Nickname");
      setLoading(false);
    }
  }

  const openForm = () => {
    wordingForm("username");    
    setErrorInput("");
    setToggleModalForm(true);
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


  const { userInput } = props.location

  return (
    <>
      {
        pokemons.length > 0 ? (
          <div className="search-container">   
            <h1 className="search-container__title">Search result for "{userInput}"</h1>
            <Row className="pokemonShowcase__container-card--nomargin">
                {
                pokemons.map((dt, idx) => {           
                  if(dt){                                                        
                      return (                  
                        <Col xs={6} sm={6} md={3} key={dt.id}>
                          <Card 
                          className="pokemonShowcase__container-card--cards" 
                          onClick={() => selectPokemonHandler(dt)}>                            
                            {
                                ownedInfo.length==0 || !loadingOwned? (
                                  <CardHeader                                                    
                                    title={dt.name}
                                    subheader={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}                              
                                  />
                                ) : (
                                  <CardHeader                                                    
                                    title={dt.name}
                                    subheader={'Owned by ' + ownedInfo[idx].count}                              
                                  />
                                )
                            }
                                              
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
          </div>
        ) : (
            <div className="no-results m-4">
              <div className="no-results__text">
                <p>Your search for "{userInput}" did not have any matches.</p>
                <p>Suggestions:</p>
                <ul>
                  <li>Try different keywords</li>
                </ul>
              </div>
            </div>
          )
      }

      <Modal show={toggleModal}
        modalClosed={closeModal}
        pokemon={pokemonOverview}>
        <PokemonDetails 
          pokemon={pokemonOverview} 
          catchHandler={catchHandler}
          catchPokemon={catchPokemon}                     
          toggleModal={toggleModal}
          closeModal={closeModal}
        />
      </Modal>

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

      <Notif open={open} title={titleNotif} desc={msgNotif} handleInfoClose={handleInfoClose}/>

      }
    </>
    
  );
  
}
