import { Link } from 'react-router-dom';
import './LoginForm.css';

function LoginForm(props) {
  const { changeLink } = props;
    
  return (
    <div className="LoginForm">
      <h1>Welcome!</h1>
        <div className="textDiv" id="usernameDiv">
          <label htmlFor="username">Username:</label>
          <input className="text" id="username" type="text" placeholder="username"/>
        </div>
        <div className="textDiv" id="passwordDiv">
          <label htmlFor="password">Password:</label>
          <input className="text" id="password" type="password" placeholder="password"/>
        </div>
        <p>Not a user? <Link to="/registration" onClick={() => changeLink("/registration")}> Create an account. </Link></p>
        <input type="submit" value="Login"/>
    </div>
  );
}

export default LoginForm;
