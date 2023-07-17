import React, { useEffect, useState } from "react";
import "./AddStory.css";
import axios from "axios";

export default function AddStory(props) {
  let [count, setCount] = useState(1);
  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(1);
  const [slideData, setSlideData] = useState({});
  const [tempState, setTempState] = useState({});
  const [status, setStatus] = useState([]);
  const doClose = (key) => {
    if (key + 1 === count) {
      props.closeStory(false);
      location.reload();
    }
  };
  useEffect(() => {
    setSlides([...slides, { number: count }]);
  }, [count]);
  useEffect(() => {
    if (tempState.slide == selectedSlide)
      setSlideData({
        ...slideData,
        [selectedSlide]: {
          ...tempState,
        },
      });
  }, [tempState]);
  const handleFormSubmit = async () => {
    const storyID = await getStoryID();
    setStatus(["true"]);
    if(Object.values(slideData).length<3) {
      setStatus(["minbreach"]);
      return
    } 
    if (Object.keys(slideData).length === 0) {
      setStatus(["error"]);
      return
    } 
    Object.values(slideData).map(async (item, key) => {
      item["storyID"] = storyID;
      item["createdByUser"] = localStorage.getItem("user");
      try {
        setTimeout(async () => {
          const response = await axios.post(
            "https://swiptory.onrender.com/story",
            item,
            {
              headers: {
                "content-type": "application/x-www-form-urlencoded",
                token: localStorage.getItem("token"),
              },
            }
          );
          if (response.data.error) {
            setStatus(["error"]);
            console.log(response.data.error);
          } else doClose(key);
        }, 700 * key);
      } catch (e) {
        console.log(e);
      }
    });
  };
  return (
    <div className="addstory">
      <div className="header">
        {slides.map((item, key) => {
          return (
            <div
              onClick={() => setSelectedSlide(item.number)}
              className={selectedSlide == item.number ? "selectedslide" : ""}
              key={key}
            >
              Slide {item.number}
            </div>
          );
        })}
        {
          <div
            onClick={() => {
              if (count < 6) setCount(count + 1);
            }}
          >
            Add More
          </div>
        }
      </div>
      <div className="storyform">
        {slides.map((item, key) => {
          if (selectedSlide == item.number)
            return (
              <div className="mainform" key={key}>
                {selectedSlide == item.number && (
                  <form
                    action=""
                    onChange={(e) => {
                      setTempState({
                        ...tempState,
                        slide: item.number,
                        [e.target.name]: e.target.value,
                      });
                    }}
                  >
                    <div>
                      <label htmlFor="heading">Heading:</label>
                      <input
                        type="text"
                        name="heading"
                        id="heading"
                        placeholder="Your Heading"
                        value={slideData[selectedSlide]?.heading || ""}
                        onChange={() => {}}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="description">Description:</label>
                      <textarea
                        name="description"
                        id="description"
                        placeholder="Story Description"
                        value={slideData[selectedSlide]?.description || ""}
                        onChange={() => {}}
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="imageURL">imageURL:</label>
                      <input
                        type="text"
                        name="imageURL"
                        id="imageURL"
                        placeholder="Add image URL"
                        value={slideData[selectedSlide]?.imageURL || ""}
                        onChange={() => {}}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="category">Category:</label>
                      <select
                        name="category"
                        id="category"
                        onChange={() => {}}
                        required
                        value={slideData[selectedSlide]?.category || ""}
                      >
                        <option value="select">Select</option>
                        <option value="food">Food</option>
                        <option value="health and fitness">
                          Health and Fitness
                        </option>
                        <option value="travel">Travel</option>
                        <option value="movies">Movies</option>
                        <option value="education">Education</option>
                      </select>
                    </div>
                  </form>
                )}
              </div>
            );
        })}
      </div>
      <div className="changeslidesection">
        <button
          onClick={() => {
            if (selectedSlide != 1) setSelectedSlide(selectedSlide - 1);
          }}
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (selectedSlide < count) setSelectedSlide(selectedSlide + 1);
          }}
        >
          Next
        </button>
        {status[0] === "true" && <div className="loader"></div>}
        {status[0] === "error" && (
          <div className="error">Your form is incomplete.</div>
        )}
        {status[0] === "minbreach" && (
          <div className="error">Min 3 slides required.</div>
        )}
        <button onClick={handleFormSubmit}>Post</button>
      </div>
    </div>
  );
}

async function getStoryID() {
  try {
    let id = await axios.get("https://swiptory.onrender.com/storyid");
    return id.data.storyID;
  } catch (e) {
    console.log(e);
  }
}
