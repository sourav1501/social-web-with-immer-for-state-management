import React,{useState,useContext} from 'react'
import HeaderLogout from './HeaderLogout'
import HeaderLogin from './HeaderLogin'
import StateContext from '../StateContext'
export default function Header({loggedin,setLoggedin}) {

    const appState=useContext(StateContext)
    return (
        <div>
              <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <a href="/" className="text-white">
            ComplexApp
          </a>
        </h4>
        {
                appState.loggedin?<HeaderLogin />: <HeaderLogout />
        }
       
        
      </div>
    </header>
        </div>
    )
}
