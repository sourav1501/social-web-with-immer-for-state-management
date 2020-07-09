import React, { useContext, useEffect, useState } from 'react'
import StateContext from '../StateContext'
import { useParams } from 'react-router-dom'
import Axios from 'axios'
import ProfilePost from './ProfilePost'
export default function Profile() {
    const { username } = useParams()
    const appState = useContext(StateContext)
    const [profileData, setProfileData] = useState({
        profileUsername: "",
        profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
        isFollowing: false,
        counts: { postCount: "", followerCount: "", followingCount: '' }
    })
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await Axios.post(`/profile/${username}`, { token: appState.user.token })
                console.log(response.data)
                
                setProfileData(response.data)
                
            } catch (e) {
                console.log("there was a problem")

            }
        }
        fetchData()

    }, [])



    return (
        <div style={{ width: '50%', margin: '100px auto' }}>
            <h2>
                <img className="avatar-small" src={profileData.profileAvatar} /> {profileData.profileUsername}
                <button className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>
            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <a href="#" className="active nav-item nav-link">
                    Posts: {profileData.counts.postCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Followers: {profileData.counts.followerCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Following: {profileData.counts.followingCount}
                </a>
            </div>

            <ProfilePost />
        </div>
    )
}
