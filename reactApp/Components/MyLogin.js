import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { HashRouter, Link } from 'react-router-dom';
import axios from 'axios';

const styles = {
  underlineStyle: {
    borderColor: '#4D90FE'
  }
};

class MyLogin extends React.Component {
  constructor(props){
    super(props);
    this.state={
      username:'',
      password:'',
    };
  }

  handleClick(event) {
    event.preventDefault();
    axios.post("http://localhost:3000/MyLogin", {
      username: this.state.username,
      password: this.state.password,
    }, {
      withCredentials: true
    })
    .then((resp) => {
      if(resp.data.success) {
        this.props.history.push('/MyPortal');
      } else {
        console.log("err", resp);
      }
    })
    .catch((err) => console.log(err));
  }

  render() {
    return (
      <HashRouter>
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar
              title="Login"
              style={{backgroundColor:'#2196f3'}}
            />
            <TextField
              hintText="Enter your Username"
              floatingLabelText="Username"
              floatingLabelFocusStyle={{color: '#4D90FE'}}
              underlineFocusStyle={styles.underlineStyle}
              onChange = {(event,newValue) => this.setState({username:newValue})}
            />
            <br/>
            <TextField
              type="password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              floatingLabelFocusStyle={{color: '#4D90FE'}}
              underlineFocusStyle={styles.underlineStyle}
              onChange = {(event,newValue) => this.setState({password:newValue})}
            />
            <br/>
            <RaisedButton label="Submit" backgroundColor={'rgb(67,133,244)'} labelColor={'rgb(255,255,255)'} style={style} onClick={(event) => this.handleClick(event)}/>
            <br/>
            <Link className="registerbutt" to='/'>Not Registered? Sign up here</Link>
          </div>
        </MuiThemeProvider>
      </div>
      </HashRouter>
    );
  }
}
const style = {
  margin: 15,
};


export default MyLogin;
