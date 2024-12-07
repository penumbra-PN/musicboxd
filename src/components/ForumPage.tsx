"use client";

import React, { useState } from "react";

import Link from "next/link";

import { type IPost } from "@/lib/models/post";

type PostProps = {
  posts: IPost[];
  usernames: string[];
};

export default function Posts(props: PostProps) {
  const [posts] = useState<IPost[]>(props.posts);
  const [usernames] = useState<string[]>(props.usernames);
  return (
    <div className="flex flex-col gap-y-4">
      <div className="space-y-6">
        <ul>
          {posts &&
            posts.map((post, index) => (
              <li key={index}>
                <Link href={`/posts/${post._id}`}>
                  <h3 className="text-2xl font-semibold text-pink-400">{post.title}</h3>
                </Link>
                <p className="text-gray mt-2">{post.text}</p>
                <div className="mt-3 flex gap-x-8 text-sm">
                  <Link href={`/user/${post.user_id}`}>
                    <p>@{usernames[index]}</p>
                  </Link>
                  <p>&#x25B2; {post.likes}</p>
                  <p>&#x25BC; {post.dislikes}</p>
                  <p>Comments: {post.comments.length}</p>
                  <br></br>
                  <br></br>
                  <br></br>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
