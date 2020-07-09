import React, { useContext, useEffect, useRef } from 'react'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import { useImmer } from 'use-immer'
import '../main.css'
import {Link} from 'react-router-dom'
import io from 'socket.io-client'
export default function Chat() {
    const socket=useRef(null)
    const chatfield = useRef(null)
    const chatLog=useRef(null)
    const appState = useContext(StateContext)
    const dispatchState = useContext(DispatchContext)
    const [state, setState] = useImmer({
        fieldValue: '',
        chatMessages: [],
       
    })
    const handleChange = (e) => {
        const value = e.target.value
        setState((draft) => {
            draft.fieldValue = value
        })
    }
    function handleSubmit(e) {
        e.preventDefault()
        //send msg to server
socket.current.emit("chatFromBrowser",{message:state.fieldValue,token:appState.user.token})
        setState((draft) => {
            //add msg to state collection
            draft.chatMessages.push({ message: draft.fieldValue, username: appState.user.username, avatar: appState.user.avatar })
            draft.fieldValue = ''
        })
    }
    useEffect(() => {
        if (appState.isChatOpen) {
            chatfield.current.focus()
            dispatchState({type:'unreadchat'})
        }
    }, [appState.isChatOpen])

    useEffect(()=>{
        socket.current=io("http://localhost:8080")

        socket.current.on('chatFromServer',message=>{
            setState(draft=>{
                draft.chatMessages.push(message)})
        })
    },[])
    useEffect(() => {
        // chatLog.current.scrollTop=chatLog.current.scrollHeight
         if(state.chatMessages.length && !appState.isChatOpen){
             dispatchState({type:'incrementunread'})
         }
    }, [state.chatMessages])
    return (
        <React.Fragment>
            {appState.isChatOpen ?
                <div id="chat-wrapper" className={'chat-wrapper chat-wrapper--is-visible shadow border-top border-left border-right'}>
                    <div className="chat-title-bar bg-primary">
                        Chat
          <span onClick={() => dispatchState({ type: 'closechat' })} className="chat-title-bar-close">
                            <i className="fas fa-times-circle"></i>
                        </span>
                    </div>
                    <div id="chat" className="chat-log" ref={chatLog}>

                        {state.chatMessages.map((message, index) => {
                            if (message.username == appState.user.username) {
                                return (
                                    <div key={index} className="chat-self">
                                        <div className="chat-message">
                                            <div className="chat-message-inner">{message.message}</div>
                                        </div>
                                        <img className="chat-avatar avatar-tiny" src={message.avatar} />
                                    </div>
                                )
                            }else{
                            return (
                                <div  key={index} className="chat-other">
                                    <Link to={`/profile/${message.username}`}>
                                        <img className="avatar-tiny" src={message.avatar} />
                                    </Link>
                                    <div className="chat-message">
                                        <div className="chat-message-inner">
                                        <Link to={`/profile/${message.username}`}>
                                                <strong>{message.username}:</strong>
                                            </Link>
                {message.message}
              </div>
                                    </div>
                                </div>
                            )}
                        })}




                    </div>
                    <form id="chatForm" className="chat-form border-top" onSubmit={handleSubmit}>
                        <input value={state.fieldValue} onChange={handleChange} ref={chatfield} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
                    </form>
                </div>
                :
                <div>
                </div>}
        </React.Fragment>
    )
}
