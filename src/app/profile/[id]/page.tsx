import React from 'react'
type UserProfileProps={
    params: {
        id: string
    }
}
const UserProfile = ({params}:UserProfileProps) => {
  return (
    <div>UserProfile {params.id}</div>
  )
}

export default UserProfile