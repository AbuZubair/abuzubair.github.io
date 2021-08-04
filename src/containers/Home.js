import React, { useState, useEffect, Component } from 'react';
import { useLocation } from "react-router-dom";
import clsx from 'clsx';

import MainContent from './MainContent';
import Modal from '../components/UI/Modal';
import PokemonDetails from '../components/PokemonDetails';
import Notif from '../components/UI/Notif';
import ModalForm from '../components/UI/ModalForm';
import FirebaseService from '../services/firebase';
import Formatter from '../services/formatter';

import db from '../config'

function Home() {

  const [toggleModal, setToggle] = useState(false);
  const [toggleModalForm, setToggleModalForm] = useState(false);
  const [pokemonOverview, setOverview] = useState({});
  const [selectedPokemon, setSelected] = useState({});  
  const [inputUser,setInput] = useState("");
  const [errorInput,setErrorInput] = useState("");
  const [errorInputForm,setErrorInputForm] = useState("");
  const [loading, setLoading] = React.useState(false);  
  const [open, setOpen] = React.useState(false);
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
  const location = useLocation();

  const selectPokemonHandler = async (pokemon) => {
    setOverview(pokemon);
    setTimeout(() => {
      setToggle(true); 
    }, 200);        
  }

  const openForm = () => {
    wordingForm("username");    
    setErrorInput("");
    setToggleModalForm(true);
  }

  const closeModal = () => {
    setToggle(false);    
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

  return (
    <>
      
      <div className="main-content">
        <MainContent 
          selectPokemonHandler={selectPokemonHandler} 
          catchHandler={catchHandler}
          catchPokemon={catchPokemon}                               
          errorInputForm={errorInputForm}
          flagAdded={flagAdded}
          setFlagAdded={setFlagAdded}
        />
      </div>

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

export default Home;