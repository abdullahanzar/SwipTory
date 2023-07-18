import React, { useContext, useEffect, useState } from "react";
import { SwipToryContext } from "../../../SwipToryContext";
import Avatar from "./Assets/Avatar.png";
import Hamburger from "./Assets/Hamburger.png";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar(props) {
  const { isLoggedIn, setIsLoggedIn } = useContext(SwipToryContext);
  const [showUserControls, setShowUserControls] = useState(false);
  const nav = useNavigate();
  return (
    <>
      <div className="navbar">
        <p>SwipTory</p>
        {!isLoggedIn ? (
          <div className="buttons">
            <button
              onClick={() => {
                props.setIsSignUp(true);
              }}
            >
              Register Now
            </button>
            <button
              onClick={() => {
                props.setIsLogIn(true);
              }}
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="buttons">
            <button
              onClick={() => {
                if(props.bookmarks==false)
                props.setShowBookmarks(true)
                else
                props.setShowBookmarks(false)
              }}
            >
              Bookmarks
            </button>
            <button
              className="addstory"
              onClick={() => props.setAddStory(true)}
            >
              Add Story
            </button>
            <img
              src={Avatar}
              alt="AVATAR"
              className="avatar"
              onClick={() =>
                showUserControls
                  ? setShowUserControls(false)
                  : setShowUserControls(true)
              }
            />
            <img
              src={Hamburger}
              alt="User"
              className="hamburger"
              onClick={() =>
                showUserControls
                  ? setShowUserControls(false)
                  : setShowUserControls(true)
              }
            />
          </div>
        )}
      </div>
      {showUserControls && (
        <div className="usercontrols">
          <p>{isLoggedIn}</p>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setShowUserControls(false);
              localStorage.removeItem("token");
              localStorage.removeItem('user');
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </>
  );
}
