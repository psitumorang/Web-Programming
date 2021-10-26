import './LoginForm.css';

function LoginForm() {
  return (
    <div className="LoginForm">
      <h1>Welcome!</h1>
      <form>
        <div className="textDiv" id="usernameDiv">
          <label htmlFor="username">Username:</label>
          <input className="text" id="username" type="text" placeholder="username"/>
        </div>
        <div className="textDiv" id="passwordDiv">
          <label htmlFor="password">Password:</label>
          <input className="text" id="password" type="password" placeholder="password"/>
        </div>
        <input type="submit" value="Login"/>
      </form>
    </div>
  );
}

export default LoginForm;
