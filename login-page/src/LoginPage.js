import logo from './logo.svg';
import './LoginPage.css';
import LoginForm from './LoginForm.js';

function LoginPage() {
  return (
    <div className="LoginPage">
      <div id="artSide"></div>
      <div id="loginFormContainer">
        <LoginForm id="loginForm"/>
      </div>
    </div>
  );
}

export default LoginPage;
