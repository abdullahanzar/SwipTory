import {lazy, Suspense, useEffect, useState} from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import {SwipToryContext} from "./SwipToryContext";
import axios from "axios";
const WebHomePage = lazy(()=>import("./WebView/HomePage/WebHomePage"));
const MobileHomePage = lazy(()=>import("./MobileView/HomePage/MobileHomePage"));
const WebBookmarks = lazy(()=>import("./WebView/BookmarkPage/WebBookmarks"));
const MobBookmarks = lazy(()=>import("./MobileView/BookmarkPage/MobBookmarks"));

import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(true);
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  }
  const [isMobile, setIsMobile] = useState(checkMobile(windowWidth));
  useEffect(() => {
    if (localStorage.getItem("token") == null) return setIsLoggedIn(false);
    const check = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          "https://swiptory.onrender.com/verify-token",
          {},
          {
            headers: {
              "content-type": "application/x-www-form-urlencoded",
              token: token,
            },
          }
        );
        if (!response.data.error) setIsLoggedIn(localStorage.getItem('user'));
      } catch (e) {
        console.log(e);
      }
    };
    check();
  }, []);
  useEffect(()=>{
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [])
  useEffect(()=>{
    setIsMobile(checkMobile(windowWidth));
  }, [windowWidth])
  useEffect(()=>{
    (async () => {
      const response = await axios.get("https://swiptory.onrender.com/");
      if(response?.data)
      setIsLoading(false);
      else 
      setIsLoading(true);
    })();
  }, [])
  return (
    <SwipToryContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {isLoading && <div className="initial-load">
        <span className="Mloader"></span>
        <span>Fetching Stories, please wait.</span>
        </div>}
      {isMobile ? (
        <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MobileHomePage />} />
            <Route path="/bookmarks" element={<MobBookmarks/>} />
          </Routes>
        </BrowserRouter>
        </Suspense>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<WebHomePage />} />
              <Route path="/bookmarks" element={<WebBookmarks />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      )}
    </SwipToryContext.Provider>
  );
}

function checkMobile(windowWidth) {
  if (windowWidth>=768) //rest is handled by media queries
    return false;
  else return true;
}

export default App
