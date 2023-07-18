import React, { useEffect, useState } from 'react'
import './Slider.css'

export default function Slider(props) {
    /* const [animateNo, setAnimateNo] = useState(0);
    useEffect(()=>{
        const intervalID = setInterval(()=>{
            setAnimateNo(prev=>prev+1)
        }, 3000)
        console.log(props.slides)
        return () => {
            clearInterval(intervalID); // Clear the interval on component unmount
          };
    }, [])
    useEffect(()=>{
        console.log("animate no  +" + animateNo) 
    }, [animateNo])
    useEffect(()=>{
        console.log(props.iteration)
    }, [props.iteration]) */
    const [width, setWidth] = useState(100)
    useEffect(()=>{
        if(props.slides==1) 
        setWidth(100)
        else if(props.slides>1)
        setWidth(width/props.slides)
    }, [props.slides])
  return (
    <div className='mainSlider'>
            {Array.from({ length: props.slides }, (_, index) => (
              <div key={index} className='mainSliders' style={{width: `${width}%`}}>
                <div className={(index == props.iteration) ? 'mainSlides' : 'mainSlidesNA'} ></div>
              </div>
            ))}
    </div>
  )
}
