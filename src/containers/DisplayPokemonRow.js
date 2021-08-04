import React, {useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import { red,blue, green, yellow, orange, pink } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Skeleton from '@material-ui/lab/Skeleton';

import { gql, useQuery, useLazyQuery  } from '@apollo/client';

import Formatter from '../services/formatter';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { fetchAllData } from '../store/actions/index'

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


export default function DisplayPokemonRow(props) {

  const reducer = useSelector(state => state.reducer);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [expanded, setExpanded] = useState([]);
  const [ownedInfo, setOwnedInfo] = useState([]);
  const [loadingOwned, setLoadingOwned] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [scrolling, setScroll] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const [dataPokemons, setDataPokemons] = useState([]);
  const [isFetchScroll, setIsFetchScroll] = useState(false);
  const [offset, setOffset] = useState(1)
  const [limit, setLimit] = useState(20)
  const prevOwned = useRef();
  
  const GET_POKEMONS = gql`
  query pokemons($limit: Int, $offset: Int) {
    pokemon_v2_pokemon(limit: $limit, offset: $offset) {
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


  const [
    getData, 
    { loading, data }
  ] = useLazyQuery(GET_POKEMONS);

  const { refetch } = useQuery(GET_POKEMONS,
    { variables: {offset: offset, limit: limit}}
  )   

  useEffect(() => {
    if(!data){     
      dispatch(fetchAllData());
      getData({ variables: {offset: offset, limit: limit}}) 
    }   
        
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.addEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);
  

  useEffect(() => {
    if (isBottom) {
      // addItems();             
    }
  }, [isBottom]);
    
  useEffect(() => {
    let arrExpand = []
    let arrOwned = []
    if(dataPokemons){
      // arrExpand = dataPokemons.map(item => {
      //   return false
      // });
      arrOwned = dataPokemons.map(item => {
        return {
          name: item.name,
          count: 0
        }
      });
    }    
    setExpanded(arrExpand)
    setOwnedInfo(arrOwned)
    prevOwned.current = arrOwned

  },[dataPokemons])

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
      // setOwnedInfo(newOwnedInfo)     
      if(prevOwned.current != ownedInfo){        
        prevOwned.current = newOwnedInfo
      }        
      if(!wait)setLoadingOwned(true)      
    }

  },[reducer,dataPokemons])

  useEffect(() => {
    if (props.flagAdded) {
      let resetInfoOwned =  ownedInfo.map(item => {
        item.count = 0
        return item
      })   
      // setOwnedInfo(resetInfoOwned)   
      if(prevOwned.current != ownedInfo){        
        prevOwned.current = newOwnedInfo
      }     
      dispatch(fetchAllData());            
    }
    props.setFlagAdded(false)
  }, [props.flagAdded]);

  const handleExpandClick = (idx) => {    
    let newExpanded = expanded.map((item,i) => {
      if(idx == i)item = !item
      return item
    })
    setExpanded(newExpanded);
  };

  const handleResize = (e) => {
    setWidth(window.innerWidth);
  };

  const handleScroll = () => {
    const scrollTop = (document.documentElement
      && document.documentElement.scrollTop)
      || document.body.scrollTop;
      const scrollHeight = (document.documentElement
      && document.documentElement.scrollHeight)
      || document.body.scrollHeight;   
    if (scrollTop + window.innerHeight + 50 >= scrollHeight){
      setIsBottom(true);
    }
  }

  const addItems = async () => {
    setIsFetchScroll(true)
    let offset_
    const scrollTop = (document.documentElement
      && document.documentElement.scrollTop)
      || document.body.scrollTop;
      const scrollHeight = (document.documentElement
      && document.documentElement.scrollHeight)
      || document.body.scrollHeight;
                  
    if (dataPokemons.length !== 0) {          
      offset_ = offset+20
      handleRefetch(offset_)                      
      setIsBottom(false);
    }
  };

  const handleRefetch = async (offset_) => { 
    const res = await refetch({ offset: offset_})  
    let res_ = Formatter.formatData(res.data.pokemon_v2_pokemon)   
      
    if(res.data.pokemon_v2_pokemon.length == 0){
      //empty
    }
    
    if(res_ != dataPokemons){
      setOffset(offset_)        
      setDataPokemons([...dataPokemons, ...res_]);      
      setIsFetchScroll(false)
    }
  }  

  if(data){           
    if(dataPokemons.length == 0){          
      let res = Formatter.formatData(data.pokemon_v2_pokemon)   
      setDataPokemons(res)             
    }         
  }

  const {selectPokemonHandler} = props; 
      
  return (
      <>                 
        <div className="pokemonShowcase__container-card">  
            <Row className="pokemonShowcase__container-card--nomargin">
                {dataPokemons.length > 0 &&
                dataPokemons.map((dt, idx) => {           
                  if(dt){                        
                    let exp = expanded[idx];               
                      return (                  
                        <Col xs={6} sm={6} md={3} key={dt.id}>
                          <Card 
                          className="pokemonShowcase__container-card--cards" 
                          onClick={() => props.selectPokemonHandler(dt)}>  
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

                {dataPokemons.length == 0 &&
                  <div className="pokemonShowcase__container-card--nomargin---loadingContainer">
                    <CircularProgress className="pokemonShowcase__container-card--nomargin---loadingContainer----bar"/>
                  </div>
                }       
              </Row>                                
        </div>      
        {
          <div className="pokemonShowcase__container-moreButton">            
            <div className={classes.wrapper}>
              <Button 
              onClick={addItems} 
              variant="outlined"
              disabled={props.loading}
              >
                More
              </Button>
              {isFetchScroll && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </div>
        }
        
        
      </>
    );

}
