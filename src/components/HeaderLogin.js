import React,{useContext} from 'react'
import {Link,withRouter} from 'react-router-dom'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
 function HeaderLogin({history}) {
  const appDispatch=useContext(DispatchContext)
  const appState=useContext(StateContext)

    const handleLogout=()=>{
        appDispatch({type:'logout'})
        history.push('/')
        // localStorage.removeItem('complexAppToken')
        // localStorage.removeItem('complexAppUsername')
        // localStorage.removeItem('complexAppavatar')


    }
    function handleSearch(e){
           e.preventDefault()
           appDispatch({type:'openSearch'})
    }
    function openChat(e){
      e.preventDefault()
      console.log("kksj")
      appDispatch({type:'toggleChat'})
    }
    return (
        <div className="flex-row my-3 my-md-0">
          <a  onClick={handleSearch} href="#" className="text-white mr-2 header-search-icon">
            <i className="fas fa-search"></i>
          </a>
          <span onClick={openChat} className={"mr-2 header-chat-icon " + (appState.unreadChatCount? "text-danger":"text-white")}>
            <i className="fas fa-comment"></i>
    {appState.unreadChatCount ? <span className="chat-count-badge text-white"> {appState.unreadChatCount<10?appState.unreadChatCount:"9+" }</span>:null
}
          </span>
          <Link to={`/profile/${appState.user.username}`} className="mr-2">
            <img className="small-header-avatar" src={appState.user.avatar} />
          </Link>
          <Link to='/create-post' className="btn btn-sm btn-success mr-2" >
            Create Post
          </Link>
          <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
    )
}

export default withRouter(HeaderLogin)