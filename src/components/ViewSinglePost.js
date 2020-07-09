import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link ,withRouter} from 'react-router-dom'
import Axios from 'axios'
import ReactToolTip from 'react-tooltip'
import LoadingDots from './LoadingDots'
import NotFound from '../components/NotFound'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

 function ViewSinglePost({history}) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [isLoading, setisLoading] = useState(true)
  const [post, setPost] = useState([])
  const { id } = useParams()
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { CancelToken: ourRequest.token })
        console.log(response.data)
        setisLoading(false)
        setPost(response.data)
      } catch (e) {
        console.log("error")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [id])
 async function deleteHandler(){
    const sure=window.confirm("Do you really want to delete")
    if(sure){
      try{
         const response=await Axios.delete(`/post/${id}`,{data:{token:appState.user.token}})
         if(response.data=="Success"){
             appDispatch({type:'flashMessage',value:"post was successfully updated"})
             history.push(`/profile/${appState.user.username}`)
         }
      }catch(e){
         console.log("error ")
      }
    }
  }
  const date = new Date(post.createdDate)
  const dateformat = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  if (!isLoading && !post) {
    return <NotFound />
  }
  if (isLoading) return <LoadingDots />
  // function isOwner() {
  //   if (appState.loggedIn) {
  //     return appState.user.username === post.username
  //   }
  //   return false
  // }
  return (
    <div style={{ width: '50%', margin: '100px auto' }} >
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {/* {isOwner() && ( */}
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2" ><i className="fas fa-edit"></i></Link>
            <ReactToolTip id="edit" className="custom-tooltip" />
            {"  "}
            <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger"><i className="fas fa-trash"></i></a>
            <ReactToolTip id="delete" className="custom-tooltip" />

          </span>
        {/* // )} */}

      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.username}`} >
          <img className="avatar-tiny" src={post.avatar} style={{ borderRadius: '50%', width: '30px' }} />{" "}
        </Link>
    Posted by <Link to={`/profile/${post.username}`}>{post.username}</Link> on {dateformat}
      </p>

      <div className="body-content">
        {post.body}
      </div>
    </div>

  )
}
export default withRouter(ViewSinglePost)