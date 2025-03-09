import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "./index";
import authService from "../appwrite/auth";
import appwriteService from "../appwrite/config";
import { Navigate, useNavigate } from 'react-router-dom';
function PostForm({ post }) { 
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate=useNavigate()
    useEffect(() => {
        authService.getCurrentUser().then((user) => {
            setUserData(user);
        });

        if (post) {
            setValue("text", post.text);
        }
    }, [post, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (!userData) {
                console.error("User not authenticated");
                setLoading(false);
                return;
            }

            console.log(post ? "Updating post with:" : "Creating post with:", data);

            let featuredImageId = post?.featuredImage; 

            if (data.image?.length > 0) {
                const file = data.image[0];
                const uploadedFile = await appwriteService.uploadFile(file);
                console.log("File uploaded:", uploadedFile);
                featuredImageId = uploadedFile.$id;
            }

            if (post) {
                const updatedPost = await appwriteService.updatePost(post.$id, {
                    text: data.text,
                    featuredImage: featuredImageId,
                    userId: userData.$id
                });
                console.log("Post updated:", updatedPost);
            } else {
                const newPost = await appwriteService.createPost({
                    text: data.text,
                    featuredImage: featuredImageId,
                    userId: userData.$id
                });
                console.log("Post created:", newPost);
            }
        } catch (error) {
            console.error("Error creating/updating post:", error);
        }
        setLoading(false);
        navigate('/')
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow-md">
            <div>
                <label className="block mb-1 font-medium">Caption:</label>
                <input
                    type="text"
                    {...register("text", { required: "Caption is required" })}
                    className="border p-2 rounded w-full"
                />
                {errors.text && <p className="text-red-500">{errors.text.message}</p>}
            </div>

            <div className="mt-4">
                <label className="block mb-1 font-medium">Upload Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="border p-2 rounded w-full"
                />
                {post?.featuredImage && (
                    <p className="text-gray-500">Current image will be kept unless a new one is uploaded.</p>
                )}
            </div>

            <Button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
                {loading ? "Processing..." : post ? "Update" : "Post"}
            </Button>
        </form>
    );
}

export default PostForm;
