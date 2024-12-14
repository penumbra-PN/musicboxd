"use client";

import React, { useState } from "react";

import Link from "next/link";

import { type IPost } from "@/lib/models/post";
import { toast } from "react-toastify";

type PostProps = {
  posts: IPost[];
  usernames: string[];
};

export default function Posts(props: PostProps) {
  const [posts, setPosts] = useState<IPost[]>(props.posts);
  const [usernames] = useState<string[]>(props.usernames);

  const handleLikes = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          liked: true,
          postId: postId,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error);
      } else {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === data.post._id) {
              return data.post;
            } else {
              return post;
            }
          }),
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  const handleDislikes = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disliked: true,
          postId: postId,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return data.error;
      } else {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === data.post._id) {
              return data.post;
            } else {
              return post;
            }
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="space-y-6">
        <ul>
          {posts &&
            posts.map((post, index) => (
              <li key={index} className="mb-10">
                <Link href={`/posts/${post._id}`}>
                  <h3 className="text-2xl font-semibold text-pink-400">{post.title}</h3>
                </Link>
                <p className="text-gray mt-2">{post.text}</p>
                <div className="mt-3 flex gap-x-8 text-sm">
                  <Link href={`/profile/${post.user_id}`}>
                    <p>@{usernames[index]}</p>
                  </Link>
                  <button onClick={() => handleLikes(post._id as string)}>&#x25B2; {post.likes.length}</button>
                  <button onClick={() => handleDislikes(post._id as string)}>&#x25BC; {post.dislikes.length}</button>
                  <p>Comments: {post.comments.length}</p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
