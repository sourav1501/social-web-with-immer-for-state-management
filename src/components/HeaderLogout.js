import React,{useEffect,useState,useContext} from 'react'
import Axios from 'axios'
import DispatchContext from '../DispatchContext'

export default function HeaderLogout({setLoggedin}) {
  const appDispatch=useContext(DispatchContext)
  const initialValues={
    username:'',
    password:''
  }
   const[values,setValues]=useState(initialValues)
   const{username,password}=values
    const handleChange=name=>(e)=>{
      setValues({
        ...values,[name]:e.target.value
      })
    }
  async function handleSubmit(e){
     e.preventDefault()
     console.log(username)
     try{
           const response=await Axios.post('/login',{
             username,
             password
           })
         if(response.data){
            // localStorage.setItem("complexAppToken",JSON.stringify(response.data.token))
            // localStorage.setItem("complexAppUsername",JSON.stringify(response.data.username))
            // localStorage.setItem("complexAppavatar",JSON.stringify(response.data.avatar))
           

            appDispatch({type:'login',data:response.data})

             
         }else{
           console.log("incorrect user")
         }
     }
     catch(e){

      console.log(e.response.data.error)
     }

   }
   
  return (

    <div>
      <form className="mb-0 pt-2 pt-md-0" onSubmit={handleSubmit}>
        <div className="row align-items-center">
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" onChange={handleChange('username')}/>
          </div>
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password"  onChange={handleChange('password')}/>
          </div>
          <div className="col-md-auto">
            <button className="btn btn-success btn-sm">Sign In</button>
          </div>
        </div>
      </form>
    </div>
  )
}
