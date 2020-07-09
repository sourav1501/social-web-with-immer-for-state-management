import React, { useState, useReducer, useEffect,Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Footer from './components/Footer'
import Terms from './components/Terms'
import About from './components/About'
import Home from './components/Home'
// import CreatePost from './components/CreatePost'
import Axios from 'axios'
import './main.css'
import { CSSTransition } from 'react-transition-group'
import EditPost from './components/EditPost'
import { useImmerReducer } from 'use-immer'
import Profile from './components/Profile'
import StateContext from './StateContext'
import Search from './components/Search'
import DispatchContext from './DispatchContext'
import FlashMessages from './FlashMessages'
import NotFound from './components/NotFound'
import Chat from './components/Chat'
import ViewSinglePost from './components/ViewSinglePost'
import LoadingDots from './components/LoadingDots';
const CreatePost=React.lazy(()=>import('./components/CreatePost'))

Axios.defaults.baseURL = process.env.BACKENDURL || ""
function App() {

  const initialState = {
    loggedin: Boolean(localStorage.getItem('complexAppToken')),
    flashMessages: [],
    user: {
      token: JSON.parse(localStorage.getItem('complexAppToken')),
      username: JSON.parse(localStorage.getItem('complexAppUsername')),
      avatar: JSON.parse(localStorage.getItem('complexAppavatar'))
    },

    isSearchOpen: false,
    unreadChatCount:0,
    isChatOpen: false,


  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case 'login':
        // return {loggedin:true,flashMessages:state.flashMessages}
        draft.loggedin = true
        draft.user = action.data
        return
      case 'logout':
        // return {loggedin:false,flashMessages:state.flashMessages}
        draft.loggedin = false
        return

      case 'flashMessage':
        // return {loggedin:state.loggedin,flashMessages:state.flashMessages.concat(action.value)}
        draft.flashMessages.push(action.value)
        return

      case 'openSearch':
        draft.isSearchOpen = true
        return
      case 'closeSearch':
        draft.isSearchOpen = false
        return

      case 'toggleChat':
        draft.isChatOpen = !draft.isChatOpen
        return
      case 'closechat':
        draft.isChatOpen = false
        return
         case 'incrementunread':
           draft.unreadChatCount++
           return
           case 'unreadchat':
             draft.unreadChatCount=0
             return
    }
  }


  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  // const [loggedin,setLoggedin]=useState(Boolean(localStorage.getItem('complexAppToken')))
  // const [flashMessages,setFlash]=useState([])

  // function addFlashMessage(msg){
  //   setFlash(prev=>prev.concat(msg))
  // }
  useEffect(() => {
    if (state.loggedin) {
      localStorage.setItem("complexAppToken", JSON.stringify(state.user.token))
      localStorage.setItem("complexAppUsername", JSON.stringify(state.user.username))
      localStorage.setItem("complexAppavatar", JSON.stringify(state.user.avatar))
    } else {
      localStorage.removeItem("complexAppToken")
      localStorage.removeItem("complexAppUsername")
      localStorage.removeItem("complexAppavatar")
    }
  }, [state.loggedin])

  useEffect(() => {
    if (state.loggedin) {
        const ourRequest = Axios.CancelToken.source()
        async function fetchResults() {
            try {
                const response = await Axios.post('/checkToken', { token: state.user.token }, { cancelToken: ourRequest.token })
              if(!response.data){
                dispatch({type:'logout'})
                dispatch({type:'flashMessage',value:"Your session has been expired please login"})
              }
            } catch (e) {
                console.log("there was a problem")
            }
        }
        fetchResults()
        return () => ourRequest.cancel()

    }
}, [])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <FlashMessages flashMessages={state.flashMessages} />
          <Suspense fallback={<LoadingDots/>}>
          <Switch>
            <Route path="/" exact >
              {state.loggedin ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/create-post" exact >
              <CreatePost />
            </Route>
            <Route path="/post/:id" exact component={ViewSinglePost}></Route>
            {state.loggedin ? <Route path="/profile/:username" exact component={Profile}></Route>:""}

            <Route path="/about" exact component={About}></Route>
            <Route path="/terms" exact component={Terms}></Route>
            <Route path="/post/:id/edit" exact component={EditPost}></Route>
            <Route exact component={NotFound}></Route>

          </Switch>
         </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames='search-overlay' unmountOnExit>
            <Search />

          </CSSTransition>
          <Chat />
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>


  );
}

export default App;
