import React, { useEffect, useState } from "react";
import "./InfinitySlide.css";
import axios from "axios";

export default function InfinitySlide(props) {
  const [displayStory, setdisplayStory] = useState([]);
  useEffect(() => {
    (async () => setdisplayStory(await fetchStoryByID(props.storyID)))();
  }, [props.storyID]);
  useEffect(() => {
    console.log(displayStory);
  }, [displayStory]);
  fetchStoryByID(props.storyID);
  return (
    <div className="infinitySlides">
      {displayStory.map((story, key) => {
        return (
          <div className="slide">
            <p>
              {story.heading}
              <br />
              <span>{story.description}</span>
            </p>
            <img src={story.imageURL} />
          </div>
        );
      })}
    </div>
  );
}

async function fetchStoryByID(storyID) {
  try {
    const response = await axios.get(
      `https://swiptory.onrender.com/story/${storyID}`
    );
    if (!response.data.Error) return response.data;
  } catch (e) {
    console.log(e);
  }
}
