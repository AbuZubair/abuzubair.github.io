import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './store/reducers';
import promise from 'redux-promise';
import '@babel/polyfill';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

import App from './containers/App';
import 'swiper/swiper-bundle.min.css';
// import 'swiper/components/navigation/navigation.scss';
// import 'swiper/components/pagination/pagination.scss';
// import 'swiper/components/scrollbar/scrollbar.scss';
// Import main sass file to apply global styles
import './static/sass/style.scss';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
const uri = "https://beta.pokeapi.co/graphql/v1beta"
// const uri = "https://graphql-pokeapi.graphcdn.app"

const client = new ApolloClient({
  uri: uri,
  cache: new InMemoryCache()
});

const app = (
  <Provider store={createStoreWithMiddleware(reducers)}>
    <ApolloProvider client={client}>
      {/* <FirestoreProvider {...credentials} firebase={firebase}> */}
        <App />
      {/* </FirestoreProvider> */}
    </ApolloProvider>
  </Provider>
);

ReactDOM.render(app, document.getElementById('app'));
