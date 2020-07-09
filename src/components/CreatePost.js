import React,{useState,useContext,useEffect} from 'react'
import Axios from 'axios'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

import {withRouter } from 'react-router-dom'
 function CreatePost({history}) {
// let token=JSON.parse(localStorage.getItem('complexAppToken'))
const initialValues={
    title:'',
    body:'',
}

const [values,setValues]=useState(initialValues)
const {title,body}=values
const appDispatch=useContext(DispatchContext)
const appState=useContext(StateContext)

const handleChange=name=>e=>{
    setValues({...values,[name]:e.target.value})
}
async function handleSubmit(e){
    e.preventDefault()
    try{
    const response=await Axios.post(`/create-post`,{
        title,
        body,
        token:appState.user.token
    })

     history.push(`/post/${response.data}`)
         appDispatch({type:"flashMessage",value:'Congrats You succesfully Created a post'})

    console.log(response)
    }catch(e){
        console.log("e.response.data.error")

    }
}

    return (
        <React.Fragment>
            <form style={{width:'50%',margin:'100px auto'}} onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off"  onChange={handleChange('title')} value={title}/>
                </div>

                <div className="form-group" >
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea name="body" id="post-body" className="body-content tall-textarea form-control" type="text" style={{height:'350px'}} onChange={handleChange('body')} value={body}></textarea>
                </div>

                <button className="btn btn-primary">Save New Post</button>
            </form>
        </React.Fragment>
    )
}
export default withRouter(CreatePost)