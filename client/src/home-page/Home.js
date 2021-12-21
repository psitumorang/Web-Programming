import { React, useState, useEffect } from 'react';
import './Home.css';

const lib = require('./HomeModule');

const clickProfile = (props) => {
  const url = '/profile';
  props.changeState({ link: url });
};

function Home(props) {
  const { changeState, state } = props;
  const [filters, setFilters] = useState([]);
  const [selectedFilter, updateSelectedFilter] = useState('');
  const [selectedSort, updateSelectedSort] = useState('none');

  const update = async () => {
    await lib.getFilterOptions(setFilters);
    const groups = await lib.getFilteredGroups(selectedFilter, selectedSort);
    lib.parseFilteredGroups(groups, changeState, selectedFilter);
  };
  useEffect(() => { update(); }, [selectedFilter, selectedSort]);

  return (
    <div className="container">

      <div className="header">
        <div className="social-media-title">Social Media</div>
        <div className="profile-picture">
          <div className="img" />
        </div>
        <div className="username">{`Hi, ${state.username}!`}</div>
      </div>

      <div className="top-navbar">
        <div className="home-link" onClick={() => changeState({ link: '/main' })} onKeyDown={() => changeState({ link: '/main' })} role="link" tabIndex={0}>Home</div>
        <div className="profile-link" onClick={() => changeState({ link: '/profile' })} onKeyDown={() => changeState({ link: '/profile' })} role="link" tabIndex={0}>Profile</div>
      </div>

      <div className="main-container">

        <div className="side-navbar">
          <button type="submit" className="notifications" onClick={() => changeState({ link: '/notifications' })}>Notifications</button>
          <button type="submit" className="events" onClick={() => changeState({ link: '/analytics' })}>Analytics</button>
          <button type="submit" className="groups" onClick={() => changeState({ link: '/groups' })}>Groups</button>
          <button type="submit" className="invitations" onClick={() => changeState({ link: '/invitations' })}>Group Invitations and Requests </button>
          <button type="submit" className="photos" onClick={() => changeState({ link: '/flaggedposts' })}>Flagged posts</button>
        </div>

        <div className="main-area">

          <div className="post-create-area">
            <div id="filterForm">
              Filter group list by topic:
              <div id="filterInput">
                <select id="topics" name="topics">
                  {filters.map((filter) => (
                    <option key={`topics-${filter}`} value={filter} name={filter}>{filter}</option>
                  ))}
                </select>
                <div id="buttons">
                  <input type="submit" onClick={() => lib.changeSelectedFilter(updateSelectedFilter)} value="Submit filters" />
                  <input type="submit" onClick={() => lib.resetSelected(updateSelectedFilter)} value="Reset filters" />
                </div>
              </div>
            </div>
            <div id="sortForm">
              Sort groups:
              <div id="filterInput">
                <select id="sorts" name="sorts">
                  <option value="new" name="Newest post">Newest post</option>
                  <option value="posts" name="Number of posts">Number of posts</option>
                  <option value="members" name="Number of members">Number of members</option>
                </select>
                <div id="buttons">
                  <input type="submit" onClick={() => lib.changeSelectedSort(updateSelectedSort)} value="Submit sort" />
                  <input type="submit" onClick={() => lib.resetSelectedSort(updateSelectedSort)} value="Reset sort" />
                </div>
              </div>
            </div>
          </div>

          <div className="groups-area" id="groups-area">
            No groups meet the criteria chosen!
          </div>
        </div>

        <div className="side-navbar" id="forMessages">
          <button type="submit" className="messages" onClick={() => changeState({ link: '/messages' })}>Messages</button>
          <button type="submit" className="logout" onClick={() => changeState({ link: '/' })}>Log out</button>
        </div>

      </div>
    </div>
  );
}

export default Home;
export { clickProfile };
