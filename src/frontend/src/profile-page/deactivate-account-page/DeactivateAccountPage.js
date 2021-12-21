import React, { useState } from 'react';

const { deactivateAccount } = require('./DeactivateModule');

const DeactivateAccountPage = (props) => {
  const { state, changeState } = props;
  const { userId } = state;
  const [message, mutateMessage] = useState('Are you sure you want to deactivate your account? This pretty much deletes everything');

  const updateMessage = (newMessage) => {
    mutateMessage(newMessage);
  };

  return (
    <div>
      <div>
        <p />
        {message}
        <p />
      </div>
      <input id="deactivateAccountButton" type="submit" value="Deactivate Account" onClick={() => deactivateAccount(userId, updateMessage, changeState)} />
    </div>
  );
};

export default DeactivateAccountPage;
