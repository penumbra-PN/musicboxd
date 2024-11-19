"use client";

import { useState } from "react";

import FriendsList from "@/components/FriendsList";
import { type IUser } from "@/lib/models/user";
import { type IReview } from "@/lib/models/review";
import { type IPost } from "@/lib/models/post";
import { type IComment } from "@/lib/models/comment";

enum ProfileSection {
  FRIENDS,
  FRIEND_REQUESTS,
  REVIEWS,
  POSTS,
  COMMENTS,
}

type ProfileSectionProps = {
  userId: string;
  friends: IUser[];
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
            <FriendsList userId={props.userId} friends={props.friends} />
          </div>
        );
      case ProfileSection.FRIEND_REQUESTS:
        return (
          <div className="flex flex-col">
            {props.friendRequests.map((friendRequest) => {
              return <p key={friendRequest.id}>{friendRequest.username}</p>;
            })}
          </div>
        );
      case ProfileSection.REVIEWS:
        return (
          <div className="flex flex-col">
            {props.reviews.map((review) => {
              return <p key={review.id}>{review.text}</p>;
            })}
          </div>
        );
      case ProfileSection.POSTS:
        return (
          <div className="flex flex-col">
            {props.posts.map((post) => {
              return <p key={post.id}>{post.text}</p>;
            })}
          </div>
        );
      case ProfileSection.COMMENTS:
        return (
          <div className="flex flex-col">
            {props.comments.map((comment) => {
              return <p key={comment.id}>{comment.text}</p>;
            })}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-8">
        <button
          className={`${currentSection === ProfileSection.FRIENDS ? "text-pink-400" : ""} text-2xl underline`}
          onClick={() => setCurrentSection(ProfileSection.FRIENDS)}
        >
          Friends
        </button>
        <button
          className={`${currentSection === ProfileSection.FRIEND_REQUESTS ? "text-pink-400" : ""} text-2xl underline`}
          onClick={() => setCurrentSection(ProfileSection.FRIEND_REQUESTS)}
        >
          Friend Requests
        </button>
        <button
          className={`${currentSection === ProfileSection.REVIEWS ? "text-pink-400" : ""} text-2xl underline`}
          onClick={() => setCurrentSection(ProfileSection.REVIEWS)}
        >
          Reviews
        </button>
        <button
          className={`${currentSection === ProfileSection.POSTS ? "text-pink-400" : ""} text-2xl underline`}
          onClick={() => setCurrentSection(ProfileSection.POSTS)}
        >
          Posts
        </button>
        <button
          className={`${currentSection === ProfileSection.COMMENTS ? "text-pink-400" : ""} text-2xl underline`}
          onClick={() => setCurrentSection(ProfileSection.COMMENTS)}
        >
          Comments
        </button>
      </div>
      {renderSection()}
    </div>
  );
}
