import './LoginPage.css';
import LoginForm from './LoginForm.js';

function LoginPage() {
  return (
    <div className="LoginPage">
      <div id="artSide">
        <div className="rectWrapper"> 
            <div className="rect" id="rect1"></div>
            <div className="rect" id="rect2"></div>
            <div className="rect" id="rect3"></div>
            <div className="rect" id="rect4"></div>
        </div>
      </div>
      <div id="loginFormContainer">
        <LoginForm id="loginForm"/>
      </div>
    </div>
  );
}

export default LoginPage;
