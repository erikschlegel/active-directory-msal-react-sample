import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MSAL from './Auth';

function LoginButton(props) {
  return (
    <a className="btn btn-primary" onClick={props.onClick}>
      Login
    </a>
  );
}

function LogoutButton(props) {
  return (
    <a className="btn btn-primary" onClick={props.onClick}>
      Logout {props.username}
    </a>
  );
}

class App extends Component {
  constructor(props){
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);

    this.state = {
      authProfile: new MSAL().init(),
      isLoggedIn: false
    };
  }

  handleLogoutClick(){
    this.state.authProfile.adLogout().then(()=>{
      this.setState({isLoggedIn: false});
    });
  }

  componentDidMount(){
    this.setState({isLoggedIn: this.state.authProfile.isLoggedIn()});
  }

  handleLoginClick(){
    const self = this;
    this.state.authProfile.adLogin().then(()=>{
      self.setState({isLoggedIn: true});
    });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    let button = null;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} 
                             username={this.state.authProfile.getUsername()} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div className="App">
        <header className="App-header">
        {button}
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
