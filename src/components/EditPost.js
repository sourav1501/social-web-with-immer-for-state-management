import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link,withRouter } from 'react-router-dom'
import Axios from 'axios'
import { useImmerReducer } from 'use-immer'
import ReactToolTip from 'react-tooltip'
import NotFound from '../components/NotFound'

import LoadingDots from './LoadingDots'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
 function EditPost({history}) {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)

    const originalState = {
        title: {
            value: '',
            hasErrors: false,
            message: ''
        },
        body: {
            value: '',
            hasErrors: false,
            message: ''
        },
        loading: true,
        saveIsLoading: false,
        id: useParams().id,
        sendCount: 0,
        notFound: false
    }
    function ourReducer(draft, action) {
        switch (action.type) {
            case 'fetchComplete':
                draft.title.value = action.value.title
                draft.body.value = action.value.body
                draft.loading = false
                return

            case "titleChange":
                draft.title.hasErrors = false
                draft.title.value = action.value
                return

            case "bodyChange":
                draft.body.hasErrors = false

                draft.body.value = action.value
                return

            case 'submitrequest':
                if (!draft.title.hasErrors && !draft.body.hasErrors) {
                    draft.sendCount++
                }
                return

            case 'saveRequestStared':
                draft.saveIsLoading = true
                return
            case 'saveRequestFinished':
                draft.saveIsLoading = false
                return

            case 'titleRules':
                if (!action.value.trim()) {
                    draft.title.hasErrors = true
                    draft.title.message = "You must provide a title"
                }
                return


            case 'bodyRules':
                if (!action.value.trim()) {
                    draft.body.hasErrors = true
                    draft.body.message = "You must provide a body message"
                }
                return

            case 'notFound':
                draft.notFound = true
        }


    }
    const [state, dispatch] = useImmerReducer(ourReducer, originalState)
    useEffect(() => {

        const ourRequest = Axios.CancelToken.source()
        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${state.id}`, { CancelToken: ourRequest.token })
                if (response.data) {
                    dispatch({ type: 'fetchComplete', value: response.data })

                    if(appState.user.username!==response.data.author.username){
                        appDispatch({type:'flashMesage',value:"You dont have permissions"})
                        history.push('/')

                    }

                } else {
                    dispatch({ type: 'notFound', value: response.data })

                }
            } catch (e) {
                console.log("error")
            }
        }
        fetchPost()
        return () => {
            ourRequest.cancel()
        }

    }, [])
    useEffect(() => {
        if (state.sendCount) {
            dispatch({ type: 'saveRequestStarted' })
            const ourRequest = Axios.CancelToken.source()
            async function fetchPost() {
                try {
                    const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { CancelToken: ourRequest.token })
                    dispatch({ type: 'saveRequestFinished' })
                    appDispatch({ type: 'flashMessage', value: "post was updated" })
                } catch (e) {
                    console.log("error")
                }
            }
            fetchPost()
            return () => {
                ourRequest.cancel()
            }
        }
    }, [state.sendCount])

    //   const date = new Date(post.createdDate)
    //   const dateformat = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch({ type: 'titleRules', value: state.title.value })
        dispatch({ type: 'bodyRules', value: state.body.value })

        dispatch({ type: 'submitrequest' })

    }
    if (state.notFound) {
return       <NotFound/>
    }
    if (state.Loading) return <LoadingDots />
    return (
        <div style={{ width: '50%', margin: '100px auto' }}>
            <Link to={`/post/${state.id}`} className="small font-weight-bold">&laquo; Back to post</Link>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input onBlur={e => dispatch({ type: 'titleRules', value: e.target.value })} onChange={(e) => dispatch({ type: 'titleChange', value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
                    {state.title.hasErrors &&
                        <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
                </div>

                <div className="form-group" >
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea onBlur={e => dispatch({ type: 'bodyRules', value: e.target.value })} onChange={(e) => dispatch({ type: 'bodyChange', value: e.target.value })} value={state.body.value} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" style={{ height: '350px' }} ></textarea>
                    {state.body.hasErrors &&
                        <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
                </div>

                <button className="btn btn-primary" disabled={state.saveIsLoading}>Save Updates</button>
            </form>
        </div>
    )
}
export default withRouter(EditPost)