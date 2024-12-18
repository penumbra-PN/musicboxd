"use client";

import { useState } from "react";

import Link from "next/link";

import FriendRequestsList from "@/components/FriendRequestsList";
import FriendsList from "@/components/FriendsList";

import { type IComment } from "@/lib/models/comment";
import { type IPost } from "@/lib/models/post";
import { type IReview } from "@/lib/models/review";
import { type IUser } from "@/lib/models/user";

enum ProfileSection {
  FRIENDS,
  FRIEND_REQUESTS,
  REVIEWS,
  POSTS,
  COMMENTS,
}

type ProfileSectionProps = {
  friends: {
    friend: IUser;
    channelId: string;
  }[];
  friendRequests: IUser[];
  reviews: IReview[];
  posts: IPost[];
  comments: IComment[];
};

export default function ProfileSections(props: ProfileSectionProps) {
  const [currentSection, setCurrentSection] = useState<ProfileSection>(ProfileSection.FRIENDS);

  const renderSection = () => {
    switch (currentSection) {
      case ProfileSection.FRIENDS:
        return (
          <div className="flex flex-col">
            <FriendsList friends={props.friends} />
          </div>
        );
      case ProfileSection.FRIEND_REQUESTS:
        return (
          <div className="flex flex-col">
            <FriendRequestsList friendRequests={props.friendRequests} />
          </div>
        );
      case ProfileSection.REVIEWS:
        return (
          <div className="flex flex-col">
            {props.reviews.map((review) => {
              return (
                <Link key={review.id} href={`/songs/${review.song_id}`}>
                  {review.text}
                </Link>
              );
            })}
          </div>
        );
      case ProfileSection.POSTS:
        return (
          <div className="flex flex-col inset-0 items-center justify-center relative p-10">
            <Link className="relative w-fit self-center rounded-3xl border border-solid border-black p-2 bg-spotify-green text-spotify-black" href="/posts/create">
              Create A Post
            </Link>
            <br></br>
            <h2 className="text-spotify-green text-3xl font-bold underline">Posts</h2>
            {props.posts.map((post) => {
              return (
                <>
                  <br></br>
                  <Link className="hover:text-spotify-green hover:underline" key={post.id} href={`/posts/${post._id}`}>
                    {post.title}
                  </Link>
                </>
              );
            })}
          </div>
        );
      case ProfileSection.COMMENTS:
        return (
          <div className="flex flex-col inset-0 items-center justify-center relative p-10">
            {props.comments.map((comment) => {
              return (
                <>
                  <br></br>
                  <Link className="hover:text-spotify-green hover:underline" key={comment.id} href={`/posts/${comment.post_id}`}>
                    {comment.text}
                  </Link>
                </>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-8">
        <button
          className={`${currentSection === ProfileSection.FRIENDS ? "text-spotify-green" : ""} text-2xl underline`}
          onClick={() => setCurrentSection(ProfileSection.FRIENDS)}
        >
          Friends
        </button>
        <button
          className={`${currentSection === ProfileSection.FRIEND_REQUESTS ? "text-spotify-green" : ""} text-2xl underline`}
          onClick={() => setCurrentSection(ProfileSection.FRIEND_REQUESTS)}
        >
          Friend Requests
        </button>
        <button
          className={`${currentSection === ProfileSection.REVIEWS ? "text-spotify-green" : ""} text-2xl underline`}
          onClick={() => setCurrentSection(ProfileSection.REVIEWS)}
        >
          Reviews
        </button>
        <button
          className={`${currentSection === ProfileSection.POSTS ? "text-spotify-green" : ""} text-2xl underline`}
          onClick={() => setCurrentSection(ProfileSection.POSTS)}
        >
          Posts
        </button>
        <button
          className={`${currentSection === ProfileSection.COMMENTS ? "text-spotify-green" : ""} text-2xl underline`}
          onClick={() => setCurrentSection(ProfileSection.COMMENTS)}
        >
          Comments
        </button>
      </div>
      {renderSection()}
    </div>
  );
}
