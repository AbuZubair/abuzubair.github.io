import db from '../config'

const collection=db.collection('PokemonData')

const FirebaseService = {
   
    getAllData: function() {
        return new Promise((resolve) => {
            const reponse = collection
            reponse.get().then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data());                     
                if(data.length==0){
                    resolve(false)
                }else{
                    resolve(data)
                }
                
            });
        }) 
    },

    getByUsername: function(username) {   
        return new Promise((resolve) => {
            const reponse = collection.where("username", "==", username.toLowerCase().trim())
            reponse.get().then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => {
                    return {
                        id: doc.id,
                        data: doc.data()
                    }
                });  
                
                if(data.length==0){
                    resolve(false)
                }else{                    
                    resolve(data[0])
                }  
            });   
        })                                                 
    },
    
};

export default FirebaseService;