import React, { useState } from "react";
import ReactDOM from "react-dom";

function homePage() {
  const [userName, setUserName] = useState("");
 

  return (
    <div class="container">
  
      <!-- header -->
      <div class="header">
        <div class="social-media-title">Social Media</div>
        <div class="profile-picture">
          <div class="img"></div>
        </div>
        <div class="username">Hi, username!</div>
      </div>

      <!-- top navbar -->
      <div class="top-navbar">
        <div class="home-link">Home</div>
        <div class="profile-link">Profile</div>
      </div>

      <!-- main container -->
      <div class="main-container">

      <!-- side navbar -->
      <div class="side-navbar">
        <button class="updates">Updates</button>
        <button class="events">Events</button>
        <button class="groups">Groups</button>
        <button class="videos">Videos</button>
        <button class="photos">Photos</button>
      </div>

      <!-- main area -->
      <div class="main-area">

        <!-- post-area -->
        <div class="post-area">
          User can input status update here
          <div class="text-area"></div>
          <div class="post-button"></div>
        </div>

        <!-- updates-area -->
        <div class="updates-area">
          Status updates will be located here
          <div class="box-1">
            <div class="poster-picture"></div>
            <div class="update-text"></div>
            <div class="reply-button"></div>
          </div>

          <div class="box-2">
            <div class="poster-picture"></div>
            <div class="update-text"></div>
            <div class="reply-button"></div>
          </div>
        </div>
      </div>

      <!-- live news box -->
      <div class="live-updates">
        Live updates
      </div>

      <!-- closing tag for main container -->
      </div>
   </div>
  )
}
