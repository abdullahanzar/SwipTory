import React, { useEffect, useState } from "react";
import "./InfinitySlide.css";
import axios from "axios";
import leftSlide from "../Components/Assets/leftSlide.png";
import rightSlide from "../Components/Assets/rightSlide.png";
import saveSlide from "../Components/Assets/saveSlide.png";
import savedSlide from "../Components/Assets/savedSlide.png";
import shareSlide from "../Components/Assets/shareSlide.png";
import exitSlide from "../Components/Assets/shareSlide.png";
import likeSlide from "../Components/Assets/likeSlide.png";
import likedSlide from "../Components/Assets/likedSlide.png";

import SignUpForm from "./SignUpForm";
import ReactModal from "react-modal";

export default function InfinitySlide(props) {
  const [displayStory, setdisplayStory] = useState([]);
  const [currentSlide, setCurrentSlide] = useState({});
  const [iteration, setIteration] = useState(props.storyID);
  const [lastSlide, setLastSlide] = useState(0);
  const [intervalID, setIntervalID] = useState(-1);
  const [bookmarkChng, setBookmarkChng] = useState("");
  const [likeChng, setLikeChng] = useState(-1);
  useEffect(() => {
    (async () => setdisplayStory(await fetchStoryByID(iteration)))();
    clearInterval(intervalID);
    isBookmarked(iteration, setBookmarkChng);
  }, [iteration]);
  useEffect(() => {
    const interval = [];
    if (displayStory.length > 1) {
      const timeouts = [];

      const renderItemsWithDelay = () => {
        setCurrentSlide({});

        displayStory.forEach((item, index) => {
          const timeout = setTimeout(() => {
            setCurrentSlide({ ...item });
            if (index + 1 == displayStory.length) setLastSlide(index);
          }, index * 3000);
          timeouts.push(timeout);
        });
      };

      renderItemsWithDelay();

      return () => {
        timeouts.forEach((timeout) => clearTimeout(timeout));
      };
    } else {
      displayStory.map((item, index) => {
        setCurrentSlide(item);
        const intervalID = setInterval(() => {
          setIteration((prev) => prev + 1);
        }, 3000);
        interval.push(intervalID);
        setIntervalID(intervalID);
        return () => clearInterval(interval[0]);
      });
    }
    return () => clearInterval(interval[0]);
  }, [displayStory]);
  useEffect(() => {
    const interval = [];
    if (lastSlide != 0) {
      const intervalID = setInterval(() => {
        setIteration((prev) => prev + 1);
      }, 3000);
      interval.push(intervalID);
      setIntervalID(intervalID);
    }
    return () => clearInterval(interval[0]);
  }, [lastSlide]);
  useEffect(() => {
    if (bookmarkChng == "Not logged in") {
      props.setToLogIn(true);
      props.setClose(false);
    }
    console.log(bookmarkChng);
  }, [bookmarkChng]);
  useEffect(() => {
    if (likeChng == -404) {
      props.setToLogIn(true);
      props.setClose(false);
    }
  }, [likeChng]);
  useEffect(() => {
    isLiked(currentSlide.storyID, currentSlide.iteration, setLikeChng);
  }, [currentSlide]);
  return (
    <div className="infinitySlides">
      {intervalID !== -1 && (
        <div className="slider">
          <div className="sliding"></div>
        </div>
      )}
      {
        <div
          className="slide"
          onClick={() => {
            clearInterval(intervalID);
            setIntervalID(-1);
          }}
        >
          <p>
            {currentSlide.heading}
            <br />
            <span>{currentSlide.description}</span>
          </p>
          <img src={currentSlide.imageURL} />
        </div>
      }
      <div className="leftslider">
        <img
          src={leftSlide}
          alt="LEFT"
          onClick={() => {
            setIteration((prev) => prev - 1);
          }}
        />
      </div>
      <div className="rightslider">
        <img
          src={rightSlide}
          alt="RIGHT"
          onClick={() => {
            setIteration((prev) => prev + 1);
          }}
        />
      </div>
      {bookmarkChng == "Bookmarked" ? (
        <div className="bookmark">
          <img src={savedSlide} alt="Saved" />
        </div>
      ) : (
        <div
          className="bookmark"
          onClick={() => {
            if (bookmarkChng !== "Bookmarked")
              setBookmark(currentSlide.storyID, setBookmarkChng);
          }}
        >
          <img src={saveSlide} alt="Save" />
        </div>
      )}
      {likeChng == -1 || likeChng <= -1 ? (
        <div
          className="likes"
          onClick={() => {
            setLike(currentSlide.storyID, currentSlide.iteration, setLikeChng);
          }}
        >
          <img src={likeSlide} alt="" />
          <p>{currentSlide.likes?.length}</p>
        </div>
      ) : (
        <div
          className="likes"
          onClick={() => {
            removeLike(
              currentSlide.storyID,
              currentSlide.iteration,
              setLikeChng
            );
          }}
        >
          <img src={likedSlide} alt="" />
          <p>{likeChng}</p>
        </div>
      )}
    </div>
  );
}

async function fetchStoryByID(storyID) {
  try {
    const response = await axios.get(
      `https://swiptory.onrender.com/story/${storyID}`
    );
    if (!response.data.Error) return response.data.reverse();
  } catch (e) {
    console.log(e);
  }
}

async function setBookmark(storyID, setBookmarkChng) {
  console.log(storyID);
  try {
    const payload = {
      username: localStorage.getItem("user"),
      storyID: storyID,
    };
    const response = await axios.post(
      "https://swiptory.onrender.com/bookmark",
      payload,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          token: localStorage.getItem("token"),
        },
      }
    );
    console.log(response);
    if (response.data?.error == "Sign In First")
      setBookmarkChng("Not logged in");
    else if (response.data?.username == localStorage.getItem("user"))
      setBookmarkChng("Bookmarked");
    else if (
      response.data?.error == "Bookmark already exists. Try delete request."
    )
      setBookmarkChng("Bookmarked");
  } catch (e) {
    console.log(e);
  }
}

async function isBookmarked(storyID, setBookmarkChng) {
  try {
    const payload = {
      username: localStorage.getItem("user"),
      storyID: storyID,
    };
    const response = await axios.post(
      "https://swiptory.onrender.com/bookmark",
      payload,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          token: localStorage.getItem("token"),
        },
      }
    );
    if (response.data?.error == "Bookmark already exists. Try delete request.")
      setBookmarkChng("Bookmarked");
    else setBookmarkChng("");
  } catch (e) {
    console.log(e);
  }
}

async function setLike(storyID, iteration, setLikeChng) {
  try {
    const payload = {
      storyID,
      username: localStorage.getItem("user"),
      iteration,
    };
    const response = await axios.post(
      "https://swiptory.onrender.com/like",
      payload,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          token: localStorage.getItem("token"),
        },
      }
    );
    //console.log(response);
    if (response.data?.includes?.(localStorage.getItem("user")))
      setLikeChng(response.data.length);
    else if (response.data?.error == "Sign In First") setLikeChng(-404);
    else if (response.data?.error == "User has already liked the story.")
      setLikeChng("Click me again.");
  } catch (e) {
    console.log(e);
  }
}

async function isLiked(storyID, iteration, setLikeChng) {
  try {
    const user = localStorage.getItem("user");
    const response = await axios.get(
      `https://swiptory.onrender.com/like/${storyID}?iteration=${iteration}&username=${user}`,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          token: localStorage.getItem("token"),
        },
      }
    );
    console.log(response);
    if (response.data.userLiked) setLikeChng(response.data.likes.length);
    else setLikeChng(-1);
  } catch (e) {
    console.log(e);
  }
}

async function removeLike(storyID, iteration, setLikeChng) {
  try {
    const response = await axios.put(
      "https://swiptory.onrender.com/like",
      {
        storyID,
        iteration,
        username: localStorage.getItem("user"),
      },
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          token: localStorage.getItem("token"),
        },
      }
    );
    if (!response.data.likes?.includes(localStorage.getItem("user"))) {
      setLikeChng(-response.data.likes.length);
    }
  } catch (e) {
    console.log(e);
  }
}
