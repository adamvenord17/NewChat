import React from 'react';
import './index.css';
import Home from './components/dashboard/home';
import Signin from './components/auth/signin';
import SignUp from './components/auth/signup';
import GroupHome from './components/chatHome/Groups/Main';
import { Route, Switch } from 'react-router-dom';
import ChatHome from './components/chatHome/ChatHome';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import M from 'materialize-css';
import { motion } from 'framer-motion'



// setting up an apollo client
const client = new ApolloClient({
  uri: 'http://localhost:1000/graphql',
  onError:({ response, operation,graphQLErrors,networkError }) => {
    if (operation.operationName === "IgnoreErrorsQuery") {
      response.errors = null;
    }
    if(graphQLErrors[0] && graphQLErrors[0].message){
      M.toast({ html: graphQLErrors[0].message })
    }
    if(networkError){
      M.toast({ html: "There seems to be an internet issue!"})
    }
    if(response?.errors){
      response.errors = null;
    }

  }
})

function App() {
  return (
    <ApolloProvider client={client}>
      {/* <Navbar /> */}
      <motion.div drag 
        dragConstraints={{ right:0, left: -80 ,top: 80, bottom: 300}}
      className="floating">
        R
      </motion.div>
      <Switch>
        <Route exact path='/' component={ Home } />
        <Route path='/logout' component={ Home } />
        <Route path='/login' component={ Signin } />
        <Route path='/sign-up' component={ SignUp } />
        <Route path='/chat/groups' component={ ChatHome } />
        <Route path='/chat/:id' component={ ChatHome } />
        <Route path='/chat' component={ ChatHome } />
      </Switch>
    </ApolloProvider>
  );
}

export default App;