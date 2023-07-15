import React, { useEffect, useState } from "react";
import "./InfinitySlide.css";
import axios from "axios";
import leftSlide from "./assets/leftSlide.png";
import rightSlide from "./assets/rightSlide.png";
import saveSlide from "./Assets/saveSlide.png";
import savedSlide from "./Assets/savedSlide.png";
import shareSlide from "./Assets/shareSlide.png";
import exitSlide from "./Assets/existSlide.png";
import SignUpForm from "./SignUpForm";
import ReactModal from "react-modal";

export default function InfinitySlide(props) {
  const [displayStory, setdisplayStory] = useState([]);
  const [currentSlide, setCurrentSlide] = useState({});
  const [iteration, setIteration] = useState(props.storyID);
  const [lastSlide, setLastSlide] = useState(0);
  const [intervalID, setIntervalID] = useState(-1);
  const [bookmarkChng, setBookmarkChng] = useState("");
  useEffect(() => {
    (async () => setdisplayStory(await fetchStoryByID(iteration)))();
    clearInterval(intervalID);
    isBookmarked(iteration, setBookmarkChng)
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
            if(bookmarkChng!=='Bookmarked')
            setBookmark(iteration, setBookmarkChng);
          }}
        >
          <img src={saveSlide} alt="Save" />
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
    if (response.data?.username == localStorage.getItem("user"))
      setBookmarkChng("Bookmarked");
    if (response.data?.error == "Bookmark already exists. Try delete request.")
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
    else 
      setBookmarkChng("")
  } catch (e) {
    console.log(e);
  }
}
