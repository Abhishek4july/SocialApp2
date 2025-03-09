import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'

function PostCard({$id, text, featuredImage}) {
    
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4'>
                <img src={appwriteService.getFilePreview(featuredImage)} alt={text}
                className='rounded-xl' />

            </div>
            <p
            className=' font-bold text-sm'
            >{text}</p>
        </div>
    </Link>
  )
}


export default PostCard