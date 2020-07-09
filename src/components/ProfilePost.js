import React,{useState, useEffect} from 'react'
import Axios from 'axios'
import {useParams,Link} from 'react-router-dom'
import LoadingDots from './LoadingDots'
export default function ProfilePost() {
    const {username}=useParams()
    const [isLoading,setisLoading]=useState(true)
     const [posts,setPosts]=useState([])

     useEffect(()=>{
        async function fetchPost(){
           try{
                 const response= await Axios.get(`/profile/${username}/posts`,)
                 console.log(response.data)
                 setisLoading(false)
                 if(response.data){
                 setPosts(response.data)
                 }
           }catch(e){

           }
        }
        fetchPost()
     },[])
    if(isLoading) return <LoadingDots/>
    return (
        
        <div className="list-group">
       {posts.map(post=>{
           const date=new Date(post.createdDate)
           const dateformat=`${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
           return (
            <Link  key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{" "}
            <span className="text-muted small">{dateformat} </span>
        </Link>
           )
       })}

    </div>
    )
}
