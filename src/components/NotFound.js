import React from 'react'
import {Link } from 'react-router-dom'
export default function NotFound() {
    return (
        <div>
            
            <div className='text-center'>
                Whoops we cannot find the <Link to="/">homepage</Link> to get a fresh satrt
            </div>
        
        </div>
    )
}
