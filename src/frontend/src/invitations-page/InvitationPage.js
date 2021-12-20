import { useState, useEffect, React } from 'react';
import './InvitationPage.css';

const lib = require('./InvitationModule');

function InvitationPage(props) {
  const { changeState, state } = props;
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [invitationsToReview, setInvitationsToReview] = useState([]);
  const [message, setMessage] = useState('test');

  const updatePendingInvitations = async () => {
    let i = await lib.getPendingInvitations(state.userId);
    i = await lib.getGroupNames(i);

    // setInvitations([{ id: 1, groupName: 'testGroup!' }]);
    setPendingInvitations(i);
  };

  const updateInvitationsToReview = async () => {
    console.log('sending invitation to review from invpage with userid of: ', state.userId);
    const fetchedInvitationsToReview = await lib.getInvitationsToReview(state.userId);
    setInvitationsToReview(fetchedInvitationsToReview);
  };

  const updateMessage = (newMessage) => {
    setMessage(newMessage);
  };

  // eslint-disable-next-line
  // console.log('invitations now at: ', invitations);

  useEffect(() => {
    updatePendingInvitations();
    updateInvitationsToReview();
  }, []);

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
          <button type="submit" className="photos">Photos</button>
        </div>

        <div className="main-area">
          <div id="message">
            {message}
          </div>
          <div>
            Invitations to review for groups for which you&apos;re an admin:
          </div>
          {invitationsToReview.map((invReview) => (
            <div className="notification" key={invReview.invitation_id}>
              <div className="title">
                Review accepted invitation
              </div>
              <div className="info">
                <div className="invite-message">
                  { `${invReview.user_name} has accepted an invitation to join ${invReview.group_name}. Do you approve their membership?  ` }
                </div>
                <button className="approve-invitation" type="button" onClick={() => lib.approveInvite(invReview, updateInvitationsToReview, updateMessage)}> Accept </button>
                <button className="decline-invitation" type="button" onClick={() => lib.notApproveInvite(invReview, updateInvitationsToReview, updateMessage)}> Decline </button>
              </div>
            </div>
          ))}
          <div>
            Group invitations extended to you:
          </div>
          {pendingInvitations.map((inv) => (
            <div className="notification" key={inv.invitation_id}>
              <div className="title">
                Invitation
              </div>
              <div className="info">
                <div className="invite-message">
                  { `You have been invited to join group ${inv.groupName}. Do you accept?  ` }
                </div>
                <button className="accept-invitation" type="button" onClick={() => lib.acceptInvite(inv, updatePendingInvitations, updateMessage, state.userId)}> Accept </button>
                <button className="decline-invitation" type="button" onClick={() => lib.declineInvite(inv.invitation_id, inv.groupName, updatePendingInvitations, updateMessage)}> Decline </button>
              </div>
            </div>
          ))}

        </div>

        <div className="side-navbar" id="forMessages">
          <button type="submit" className="messages" onClick={() => changeState({ link: '/messages' })}>Messages</button>
        </div>

      </div>
    </div>
  );
}

export default InvitationPage;
