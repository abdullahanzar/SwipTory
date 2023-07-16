import React, { useContext, useEffect, useState } from "react";
import "./StoriesSection.css";
import { SwipToryContext } from "../../../SwipToryContext";
import axios from "axios";
import Edit from "./Assets/Edit.png";
import ReactModal from "react-modal";
import EditStory from "./EditStory";
import Form from "./Form";
import InfinitySlide from "./InfinitySlide";

export default function StoriesSection(props) {
  const [stories, setStories] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const [editStory, setEditStory] = useState(false);
  const [editStoryID, setEditStoryID] = useState("");
  const [infinitySlide, setInfinitySlide] = useState(false);
  const [toLogIn, setToLogIn] = useState(false);
  const { isLoggedIn } = useContext(SwipToryContext);
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
    })();
  }, [isLoggedIn]);
  return (
    <div className="storiessection">
      {isLoggedIn &&
        showUserStories(
          userStories,
          setEditStory,
          setEditStoryID,
          setInfinitySlide
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
        showCategoryStories(
          stories,
          props.selectedCategory,
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

function showCategoryStories(
  stories,
  category,
  setInfinitySlide,
  setEditStoryID
) {
  return (
    <div className="storybycategory">
      <p>Top stories about {category}</p>
      <div className="categorystoriesShowMore">
        {stories.map((story, key) => (
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
  setInfinitySlide
) {
  if (!stories.error)
    return (
      <div className="storybycategory">
        <p>Your Stories</p>
        <div className="categorystoriesShowMore">
          {stories.map((story, key) => (
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
              <button
                onClick={() => {
                  setEditStory(true);
                  setEditStoryID(story.storyID);
                }}
              >
                <img src={Edit} alt="" />
                <p>Edit</p>
              </button>
            </div>
          ))}
        </div>
        {stories?.length > 6 && (
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
  return (
    <div className="storybycategory">
      <p>Please create stories to view your stories.</p>
    </div>
  );
}
