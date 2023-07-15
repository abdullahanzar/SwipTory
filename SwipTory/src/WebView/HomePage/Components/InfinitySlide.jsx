import React, { useEffect, useState } from "react";
import "./InfinitySlide.css";
import axios from "axios";

export default function InfinitySlide(props) {
  const [displayStory, setdisplayStory] = useState([]);
  const [currentSlide, setCurrentSlide] = useState({});
  useEffect(() => {
    (async () => setdisplayStory(await fetchStoryByID(props.storyID)))();
  }, [props.storyID]);
  useEffect(() => {
    if (displayStory.length > 1) {
      const timeouts = [];

      const renderItemsWithDelay = () => {
        setCurrentSlide({});

        displayStory.forEach((item, index) => {
          const timeout = setTimeout(() => {
            setCurrentSlide({ ...item });
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
      });
    }
  }, [displayStory]);
  useEffect(() => {
    console.log(currentSlide);
  }, [currentSlide]);
  return (
    <div className="infinitySlides">
        <div className="slider">
            <div className="sliding"></div>
          </div>
      {
        <div className="slide">
          <p>
            {currentSlide.heading}
            <br />
            <span>{currentSlide.description}</span>
          </p>
          <img src={currentSlide.imageURL} />
        </div>
      }
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
