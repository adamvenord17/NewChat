import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import './App.scss';
import '../../index.css';

import {
  staggerText,
  staggerReveal,
  fadeInUp,
  handleHover,
  handleHoverExit,
  staggerRevealClose
} from "./Animations";

const Hamburger = ({ state, props }) => {
  // Create varibles of our dom nodes
  let menuLayer = useRef(null);
  let reveal1 = useRef(null);
  let reveal2 = useRef(null);
  let cityBackground = useRef(null);
  let line1 = useRef(null);
  let line2 = useRef(null);
  let line3 = useRef(null);
  let info = useRef(null);

  useEffect(() => {
    // If the menu is open and we click the menu button to close it.
    if (state.clicked === false) {
      // If menu is closed and we want to open it.

      staggerRevealClose(reveal2, reveal1);
      // Set menu to display none
      gsap.to(menuLayer, { duration: 1, css: { display: "none" } });
    } else if (
      state.clicked === true ||
      (state.clicked === true && state.initial === null)
    ) {
      // Set menu to display block
      gsap.to(menuLayer, { duration: 0, css: { display: "block" } });
      //Allow menu to have height of 100%
      gsap.to([reveal1, reveal2], {
        duration: 0,
        opacity: 1,
        height: "100%"
      });
      staggerReveal(reveal1, reveal2);
      fadeInUp(info);
      staggerText(line1, line2, line3);
    }
  }, [state]);

  return (
    <div ref={el => (menuLayer = el)} className='headerC hamburger-menu'>
      <div
        ref={el => (reveal1 = el)}
        className='headerC menu-secondary-background-color'></div>
      <div ref={el => (reveal2 = el)} className='headerC menu-layer'>
        <div
          ref={el => (cityBackground = el)}
          className='headerC menu-city-background'></div>
        <div className='headerC container'>
          <div className='headerC wrapper'>
            <div className='headerC menu-links'>
              <nav>
                <ul>
                  <li className="options">
                    <Link
                      onMouseEnter={e => handleHover(e)}
                      onMouseOut={e => handleHoverExit(e)}
                      ref={el => (line1 = el)}
                      to='/'>
                      Home Page
                    </Link>
                  </li>
                  {
                    localStorage.getItem('token') ? (
                      <>
                        <li className="options">
                        <Link
                          onMouseEnter={e => handleHover(e)}
                          onMouseOut={e => handleHoverExit(e)}
                          ref={el => (line2 = el)}
                          to='/'>
                          Arena
                        </Link>
                      </li>
                      <li className="options">
                        <Link
                          onMouseEnter={e => handleHover(e)}
                          onMouseOut={e => handleHoverExit(e)}
                          ref={el => (line3 = el)}
                          onClick={()=>{
                            localStorage.clear();
                            props.history.push('/');
                            window.location.reload();
                          }}
                          to='/'>
                          Log Out
                        </Link>
                      </li>
                      </>
                    ) : (
                      <>
                        <li className="options">
                        <Link
                          onMouseEnter={e => handleHover(e)}
                          onMouseOut={e => handleHoverExit(e)}
                          ref={el => (line2 = el)}
                          to='/login'>
                          Log In
                        </Link>
                      </li>
                      <li className="options">
                        <Link
                          onMouseEnter={e => handleHover(e)}
                          onMouseOut={e => handleHoverExit(e)}
                          ref={el => (line3 = el)}
                          to='/sign-up'>
                          Sign Up
                        </Link>
                      </li>
                      </>
                    )
                  }
                  
                </ul>
              </nav>
              <div ref={el => (info = el)} className='headerC info .hide-on-med-and-down'>
                <h3>newchat</h3>
                <p>
                  A project by <a href="https://github.com/adamvenord17" target="__blank" className="attribute" id="hoverBoi" style={{color:"yellow"}}>
                       adamvenord17
                  </a>                
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hamburger;
