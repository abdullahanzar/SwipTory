import React, { useEffect, useState } from "react";
import "./AddStory.css";

export default function AddStory() {
  let [count, setCount] = useState(1);
  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(1);
  const [slideData, setSlideData] = useState({});
  const [tempState, setTempState] = useState({});
  useEffect(() => {
    setSlides([...slides, { number: count }]);
  }, [count]);
  useEffect(() => {
    setSlideData({
      ...slideData,
      [selectedSlide]: {
        ...tempState,
      },
    });
  }, [tempState]);
  useEffect(() => {
    console.log(slideData);
  }, [slideData]);
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
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="image">Image:</label>
                      <input
                        type="text"
                        name="image"
                        id="image"
                        placeholder="Add Image URL"
                        value={slideData[selectedSlide]?.image || ""}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="category">Category:</label>
                      <select
                        name="category"
                        id="category"
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
    </div>
  );
}
