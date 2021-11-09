import './ProfilePage.css';
import React from 'react';

function ProfilePage() {
  return (
    <div className="App">
      <header className="App-header" />
      <body>
        <div id="cover_space">
          <img id="user_profile_pic" src="Stacy meditating.jpg" alt="" />
          <div id="main_title">Stacy Shapiro&apos;s FaceTok Page</div>
        </div>
        <div id="nav_button_container">
          <div className="nav_button">Friends</div>
          <div className="nav_button">Photos</div>
          <div className="nav_button">Groups</div>
          <div className="nav_button">Update bio</div>
          <div className="nav_button">Settings</div>
        </div>
        <div id="main_content_container">
          <div id="key_bio_info">
            <b> Stacy&apos;s bio </b>
            <p>
              I&apos;m just a wild eat pray love gal who also enjoys a
              bit of nuclear physics on the side!
            </p>
            <p> Penn: Class of 2019 </p>
            <p> NASA: 2020 - 2021 </p>
            <p> Chardy&apos;s with the gals: FOREVER!! </p>
          </div>
          <div id="post_container">
            <div className="wall_post">
              <div className="post_content_container">
                <b className="post_content_name"> Yide Zhao </b>
                <p className="post_content_message">OMG Stacy I can&apos;t believe you did that! You&apos;re so out there! #girlboss</p>
                <div className="reply_container">
                  <div className="post_reply_textbox"> Type your reply here...</div>
                  <div className="post_reply_button">Reply!</div>
                </div>
              </div>
            </div>
            <div className="wall_post">
              <div className="post_content_container">
                <b className="post_content_name"> Charlotte Dagabond </b>
                <p className="post_content_message">Stacy I hope you survived last night! </p>
                <div className="reply_container">
                  <div className="post_reply_textbox"> Type your reply here...</div>
                  <div className="post_reply_button">Reply!</div>
                </div>
              </div>
            </div>
            <div className="wall_post">
              <div className="post_content_container">
                <b className="post_content_name"> Bruce Yang </b>
                <p className="post_content_message">I&apos;m still cleaning up those vomit stains. I&apos;ll venmo you when I know the damage. </p>
                <div className="reply_container">
                  <div className="post_reply_textbox"> Type your reply here...</div>
                  <div className="post_reply_button">Reply!</div>
                </div>
              </div>
            </div>
            <div className="wall_post">
              <div className="post_content_container">
                <b className="post_content_name"> Professor Eric </b>
                <p className="post_content_message">Have you seen D&apos;Amelio&apos;s latest OOTD?</p>
                <div className="reply_container">
                  <div className="post_reply_textbox"> Type your reply here...</div>
                  <div className="post_reply_button">Reply!</div>
                </div>
              </div>
            </div>
            <div className="wall_post">
              <div className="post_content_container">
                <b className="post_content_name"> Turing Von Neumann </b>
                <p className="post_content_message">I&apos;m still shocked that you managed to prove Goldbach&apos;s conjecture on a napkin 8 margs in!</p>
                <div className="reply_container">
                  <div className="post_reply_textbox"> Type your reply here...</div>
                  <div className="post_reply_button">Reply!</div>
                </div>
              </div>
              <p />
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}

export default ProfilePage;
