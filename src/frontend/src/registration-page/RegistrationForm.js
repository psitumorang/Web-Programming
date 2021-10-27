import { Link } from 'react-router-dom';
import '../login-page/LoginForm.css';

function RegistrationForm(props) {
  const { changeLink } = props;
  let valid = true;
    
  const validatePassword = () => {
    if (document.getElementById('password1').value !== document.getElementById('password2').value) {
        valid = false;
        changeLink('/registration/invalid');
    } else {
        valid = true;
        changeLink('/main');
    }
  };
    
  console.log(window.location.href.split('/').pop());
  return (
    <div className="RegistrationForm">
      <h1>Welcome!</h1>
        {(window.location.href.split('/').pop() !== 'invalid') ? null : <p>Password confirmation does not match password.</p>}
        <div className="textDiv" id="usernameDiv">
          <label htmlFor="username">Username:</label>
          <input className="text" id="username" type="text" placeholder="username"/>
        </div>
        <div className="textDiv" id="passwordDiv">
          <label htmlFor="password1">Password:</label>
          <input className="text" id="password1" type="password" placeholder="password"/>
        </div>
        <div className="textDiv" id="passwordDiv">
          <label htmlFor="password2">Confirm Password:</label>
          <input className="text" id="password2" type="password" placeholder="password"/>
        </div>
        <input type="submit" value="Create Account" onClick={validatePassword}/>
    </div>
  );
}

export default RegistrationForm;