import React from 'react'

export default function FlashMessages(props) {
    
    return (
        <div className="floating-alerts" style={{ width: '50%', margin: '0 auto' }}>
          {props.flashMessages.map((msg,index)=>{
             return(
                <div key={index} className="alert alert-success text-center floating-alert shadow-sm">
                {msg}
            </div>
             )
          })}

        </div>
    )
}
