import React, { useContext, useEffect, useState } from "react";
import { SwipToryContext } from "../../../SwipToryContext";
import Avatar from "./Assets/Avatar.png";
import Hamburger from "./Assets/Hamburger.png";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar(props) {
  const { isLoggedIn, setIsLoggedIn } = useContext(SwipToryContext);
  const [showUserControls, setShowUserControls] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const nav = useNavigate();
  return (
    <>
      <div className="navbar">
        <p>SwipTory</p>
        <img
          src={Hamburger}
          onClick={() => (showMore ? setShowMore(false) : setShowMore(true))}
        />
      </div>
      {showMore && (
        <div className="showmore">
          {!isLoggedIn ? (
            <div className="buttons">
              <button
                onClick={() => {
                  props.setIsSignUp(true);
                  setShowMore(false);
                }}
              >
                Register Now
              </button>
              <button
                onClick={() => {
                  props.setIsLogIn(true);
                  setShowMore(false);
                }}
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="buttonsLI">
              <div>
                <img src={Avatar} alt="AVATAR" className="avatar" />
                <p>{isLoggedIn}</p>
              </div>
              <button
                onClick={() => {
                  props.yourStory
                    ? props.setYourStory(false)
                    : props.setYourStory(true);
                  setShowMore(false);
                }}
              >
                Your Stories
              </button>
              <button
                onClick={() => {
                  if(props.yourStory)
                  props.setYourStory(false);
                  if (props.bookmarks == false) props.setShowBookmarks(true);
                  else props.setShowBookmarks(false);
                  setShowMore(false);
                }}
              >
                Bookmarks
              </button>
              <button
                onClick={() => {
                  props.setAddStory(true);
                  setShowMore(false);
                }}
              >
                Add Story
              </button>
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setShowUserControls(false);
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
