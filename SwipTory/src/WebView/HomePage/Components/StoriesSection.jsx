import React, { useEffect, useState } from "react";
import "./StoriesSection.css";
import axios from "axios";

export default function StoriesSection(props) {
  const [stories, setStories] = useState([]);
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    (async () =>
      setStories(await getSelectedStories(props.selectedCategory)))();
  }, []);
  useEffect(() => {
    console.log(showMore);
  }, [showMore]);
  return (
    <div className="storiessection">
      {props.selectedCategory == "all" &&
        showAllStories(stories, props.categories, setShowMore, showMore)}
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
  console.log(uniqueStories);
  return categories.map((item, key) => {
    if (key !== 0)
      return (
        <div className="storybycategory" key={key}>
          <p>Top stories about {item[0]}</p>
          <div
            className={(showMore==item[0]) ? "categorystoriesShowMore" : "categorystories"}
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
