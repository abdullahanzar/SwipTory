import React, { useContext, useEffect, useState } from "react";
import "./StoriesSection.css";
import { SwipToryContext } from "../../../SwipToryContext";
import axios from "axios";

export default function StoriesSection(props) {
  const [stories, setStories] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const { isLoggedIn } = useContext(SwipToryContext);
  useEffect(() => {
    (async () =>
      setStories(await getSelectedStories(props.selectedCategory)))();
  }, []);
  useEffect(() => {
    (async () =>
      setStories(await getSelectedStories(props.selectedCategory)))();
  }, [props.selectedCategory]);
  return (
    <div className="storiessection">
      {isLoggedIn && showUserStories()}
      {props.selectedCategory == "all" &&
        showAllStories(stories, props.categories, setShowMore, showMore)}
      {props.selectedCategory !== "all" &&
        showCategoryStories(stories, props.selectedCategory)}
    </div>
  );
}

async function getSelectedStories(category) {
  try {
    let response;
    if (category == "all")
      response = await axios.get("https://swiptory.onrender.com/story/all");
    else
      response = await axios.get(
        `https://swiptory.onrender.com/story/all?category=${category}`
      );
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

function showAllStories(stories, categories, setShowMore, showMore) {
  const uniqueStoryIDs = new Set();
  const uniqueStories = [];
  for (const obj of stories) {
    if (!uniqueStoryIDs.has(obj.storyID)) {
      uniqueStoryIDs.add(obj.storyID);
      uniqueStories.push(obj);
    }
  }
  return categories.map((item, key) => {
    if (key !== 0)
      return (
        <div className="storybycategory" key={key}>
          <p>Top stories about {item[0]}</p>
          <div
            className={
              showMore == item[0]
                ? "categorystoriesShowMore"
                : "categorystories"
            }
          >
            {uniqueStories?.map((story, key) => {
              if (story.category == item[0])
                return (
                  <div className="story" key={key}>
                    <p>
                      {story.heading}
                      <br />
                      <span className="storydescription">
                        {story.description}
                      </span>
                    </p>
                    <img src={story.imageURL} />
                  </div>
                );
            })}
          </div>
          {key > 0 && (
            <button
              onClick={() => {
                if (showMore == false) setShowMore(item[0]);
                else setShowMore(false);
              }}
            >
              See More
            </button>
          )}
        </div>
      );
  });
  return uniqueStories?.map((item, key) => {
    return (
      <div className="story">
        <p>
          {item.heading}
          <br />
          <span className="storydescription">{item.description}</span>
        </p>
      </div>
    );
  });
}

function showCategoryStories(stories, category) {
  return (
    <div className="storybycategory">
      <p>Top stories about {category}</p>
      <div className="categorystoriesShowMore">
        {stories.map((story, key) => (
          <div className="story" key={key}>
            <p>
              {story.heading}
              <br />
              <span className="storydescription">{story.description}</span>
            </p>
            <img src={story.imageURL} />
          </div>
        ))}
      </div>
    </div>
  );
}

function showUserStories() {
    let stories;
    (async()=>{stories=await getSelectedStories()})()
    return (
        <div>
            <p>Your Stories</p>
        </div>
    )
}