import React, { useContext, useEffect, useState } from "react";
import { SwipToryContext } from "../../../SwipToryContext";
import axios from "axios";
import Edit from "./Assets/Edit.png";
import ReactModal from "react-modal";
import EditStory from "./EditStory";
import Form from "./Form";
import InfinitySlide from "./InfinitySlide";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import "./StoriesSection.css";

export default function StoriesSection(props) {
  const [stories, setStories] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const [editStory, setEditStory] = useState(false);
  const [editStoryID, setEditStoryID] = useState("");
  const [infinitySlide, setInfinitySlide] = useState(false);
  const [toLogIn, setToLogIn] = useState(false);
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const { isLoggedIn } = useContext(SwipToryContext);

  useEffect(() => {
    const params = queryString.parse(location.search);

    if (params.infinitySlide) {
      params["infinitySlide"] = true;
      setInfinitySlide(params.infinitySlide);
    }
    if (params.storyID) {
      params["storyID"] = parseInt(params.storyID);
      setEditStoryID(params.storyID);
    }
  }, [useLocation]);
  useEffect(() => {
    (async () =>
      setStories(await getSelectedStories(props.selectedCategory)))();
  }, []);
  useEffect(() => {
    (async () =>
      setStories(await getSelectedStories(props.selectedCategory)))();
  }, [props.selectedCategory]);
  useEffect(() => {
    (async () => {
      const user = localStorage.getItem("user");
      let stories = await axios.get(
        `https://swiptory.onrender.com/user/story/${user}`
      );
      stories = stories.data;
      setUserStories(stories);
      if (isLoggedIn) setBookmarkedStories(await getBookMarkedStories());
    })();
  }, [isLoggedIn]);
  useEffect(() => {
    if (editStory == true) setInfinitySlide(false);
  }, [editStory]);
  useEffect(() => {
    if (isLoggedIn && props.showBookmarks) {
      (async () => setBookmarkedStories(await getBookMarkedStories()))();
    }
  }, [props.showBookmarks]);
  return (
    <div className="storiessection">
      {isLoggedIn && props.yourStory &&
        showUserStories(
          userStories,
          setEditStory,
          setEditStoryID,
          setInfinitySlide,
          showMore,
          setShowMore
        )}
      {props.selectedCategory == "all" &&
        showAllStories(
          stories,
          props.categories,
          setShowMore,
          showMore,
          setInfinitySlide,
          setEditStoryID
        )}
      {props.selectedCategory !== "all" &&
        props.selectedCategory !== "bookmarks" &&
        showCategoryStories(
          stories,
          props.selectedCategory,
          setInfinitySlide,
          setEditStoryID
        )}
      {props.selectedCategory == "bookmarks" &&
        showBookmarkedStories(
          bookmarkedStories,
          setInfinitySlide,
          setEditStoryID
        )}
      <ReactModal
        isOpen={editStory}
        onRequestClose={() => setEditStory(false)}
        overlayClassName={"modalOverlay"}
        className={"addstorymodal"}
      >
        <EditStory closeStory={setEditStory} storyID={editStoryID} />
      </ReactModal>
      <ReactModal
        isOpen={infinitySlide}
        overlayClassName={"overlayInfinity"}
        onRequestClose={() => setInfinitySlide(false)}
        className={"infinitySlide"}
      >
        <InfinitySlide
          storyID={editStoryID}
          setClose={setInfinitySlide}
          setToLogIn={setToLogIn}
        />
      </ReactModal>
      <ReactModal
        isOpen={toLogIn}
        onRequestClose={() => setToLogIn(false)}
        className="modal"
        overlayClassName={"modalOverlay"}
      >
        <Form isSignUp={false} isLogIn={true} setIsLogIn={setToLogIn}></Form>
      </ReactModal>
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

function showAllStories(
  stories,
  categories,
  setShowMore,
  showMore,
  setInfinitySlide,
  setEditStoryID
) {
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
          <div>
            {uniqueStories?.map((story, key) => {
              if (story.category == item[0])
                return (
                  <div
                    className="story"
                    key={key}
                    onClick={() => {
                      setInfinitySlide(true);
                      setEditStoryID(story.storyID);
                    }}
                  >
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

function showCategoryStories(
  stories,
  category,
  setInfinitySlide,
  setEditStoryID
) {
  const uniqueStoryIDs = new Set();
  const uniqueStories = [];
  for (const obj of stories) {
    if (!uniqueStoryIDs.has(obj.storyID)) {
      uniqueStoryIDs.add(obj.storyID);
      uniqueStories.push(obj);
    }
  }
  return (
    <div className="storybycategory">
      <p>Top stories about {category}</p>
      <div>
        {uniqueStories.map((story, key) => (
          <div
            className="story"
            key={key}
            onClick={() => {
              setInfinitySlide(true);
              setEditStoryID(story.storyID);
            }}
          >
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

function showUserStories(
  stories,
  setEditStory,
  setEditStoryID,
  setInfinitySlide,
  showMore,
  setShowMore
) {
  const uniqueStoryIDs = new Set();
  const uniqueStories = [];
  if (!stories.error) {
    for (const obj of stories) {
      if (!uniqueStoryIDs.has(obj.storyID)) {
        uniqueStoryIDs.add(obj.storyID);
        uniqueStories.push(obj);
      }
    }
  }
  if (!stories.error)
    return (
      <div className="storybycategory">
        <p>Your Stories</p>
        <div>
          {uniqueStories.map((story, key) => (
            <div
              className="story"
              key={key}
              onClick={() => {
                setInfinitySlide(true);
                setEditStoryID(story.storyID);
              }}
            >
              <p>
                {story.heading}
                <br />
                <span className="storydescription">{story.description}</span>
                <button
                onClick={() => {
                  setEditStory(true);
                  setEditStoryID(story.storyID);
                }}
              >
                <img src={Edit} alt="" />
                <p>Edit</p>
              </button>
              </p>
              <img src={story.imageURL} />
              
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className="storybycategory">
      <p>Please create stories to view your stories.</p>
    </div>
  );
}

function showBookmarkedStories(
  bookmarkedStories,
  setInfinitySlide,
  setEditStoryID
) {
  return (
    <div className="storybycategory">
      <p>Your Bookmarks</p>
      <div className="categorystoriesShowMore">
        {bookmarkedStories.map((story, key) => (
          <div
            className="story"
            key={key}
            onClick={() => {
              setInfinitySlide(true);
              setEditStoryID(story.storyID);
            }}
          >
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

async function getBookMarkedStories() {
  const user = localStorage.getItem("user");
  try {
    let bookmarks = await axios.get(
      `https://swiptory.onrender.com/user/bookmarks/${user}`,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          token: localStorage.getItem("token"),
        },
      }
    );
    bookmarks = bookmarks.data;
    let stories = [];

    for (const item of bookmarks) {
      const storyID = Number(item);
      try {
        const response = await axios.get(
          `https://swiptory.onrender.com/story/${storyID}`
        );
        stories.push(...response.data);
      } catch (e) {
        console.log(e);
      }
    }
    stories = stories.reverse();
    const uniqueStoryIDs = new Set();
    const uniqueStories = [];
    for (const obj of stories) {
      if (!uniqueStoryIDs.has(obj.storyID)) {
        uniqueStoryIDs.add(obj.storyID);
        uniqueStories.push(obj);
      }
    }

    return uniqueStories;
  } catch (e) {
    console.log(e);
  }
}
