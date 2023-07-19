import React, { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import ReactModal from "react-modal";
import "./WebHomePage.css";
import Form from "./Components/Form";
import AddStory from "./Components/AddStory";
import Categories from "./Components/Categories";
ReactModal.setAppElement("#root");

export default function WebHomePage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLogIn, setIsLogIn] = useState(false);
  const [modal, setModal] = useState(false);
  const [addStory, setAddStory] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  useEffect(()=>{
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const notification = new Notification('Hello!', {
            body: "It can take upto a minute to connect to our servers. Please hang on tight."
          });
        } else {
          console.log('Permission for notifications denied');
        }
      });
    }
  }, [])
  useEffect(() => {
    setModal(isSignUp);
  }, [isSignUp]);
  useEffect(() => {
    setModal(isLogIn);
  }, [isLogIn]);

  return (
    <div className="homepage">
      <Navbar
        setIsSignUp={setIsSignUp}
        setIsLogIn={setIsLogIn}
        setAddStory={setAddStory}
        setShowBookmarks={setShowBookmarks}
        bookmarks={showBookmarks}
      />
      <ReactModal
        isOpen={modal}
        onRequestClose={() => {
          setModal(false);
          setIsLogIn(false);
          setIsSignUp(false);
        }}
        className="modal"
        overlayClassName={"modalOverlay"}
      >
        <Form
          isSignUp={isSignUp}
          isLogIn={isLogIn}
          setIsLogIn={setIsLogIn}
        ></Form>
      </ReactModal>
      <ReactModal
        isOpen={addStory}
        onRequestClose={() => setAddStory(false)}
        overlayClassName={"modalOverlay"}
        className={"addstorymodal"}
      >
        <AddStory closeStory={setAddStory}/>
      </ReactModal>
      <Categories showBookmarks={showBookmarks} />
    </div>
  );
}
