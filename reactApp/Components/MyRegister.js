import React, { Component } from 'react';
var ReactDOM = require('react-dom');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { HashRouter, Link } from 'react-router-dom';
import axios from 'axios';
// import axios from 'axios';


//react player for video on login screen

const styles = {
  underlineStyle: {
    borderColor: '#4D90FE'
  }
};

class MyRegister extends Component {
  constructor(props){
    super(props);
    this.state={
      firstname:'',
      lastname:'',
      email:'',
      password:'',
      username: '',
    };
  }

  handleClick(event) {
    event.preventDefault();
    axios.post("http://localhost:3000/MyRegister", {
      email: this.state.email,
      password: this.state.password,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      username: this.state.username,
    }, {
      withCredentials: true
    })
    .then((resp) => {
      if(resp.data.success) {
        this.props.history.push('/MyLogin');
      } else {
        console.log(resp.data);
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
            <div>
              <AppBar
                title="Register"
                style={{backgroundColor:'#2196f3'}}
              />
            </div>
           <TextField
             hintText="Enter your First Name"
             floatingLabelText="First Name"
             floatingLabelFocusStyle={{color: '#4D90FE'}}
             underlineFocusStyle={styles.underlineStyle}
             onChange = {(event,newValue) => this.setState({firstname:newValue})}
             />
           <br/>
           <TextField
             hintText="Enter your Last Name"
             floatingLabelText="Last Name"
             floatingLabelFocusStyle={{color: '#4D90FE'}}
             underlineFocusStyle={styles.underlineStyle}
             onChange = {(event,newValue) => this.setState({lastname:newValue})}
             />
           <br/>
           <TextField
             hintText="Enter your Email"
             type="email"
             floatingLabelText="Email"
             floatingLabelFocusStyle={{color: '#4D90FE'}}
             underlineFocusStyle={styles.underlineStyle}
             onChange = {(event,newValue) => this.setState({email:newValue})}
             />
           <br/>
           <TextField
             type = "username"
             hintText="Enter your Username"
             floatingLabelText="Username"
             floatingLabelFocusStyle={{color: '#4D90FE'}}
             underlineFocusStyle={styles.underlineStyle}
             onChange = {(event,newValue) => this.setState({username:newValue})}
             />
             <br/>
           <TextField
             type = "password"
             hintText="Enter your Password"
             floatingLabelText="Password"
             floatingLabelFocusStyle={{color: '#4D90FE'}}
             underlineFocusStyle={styles.underlineStyle}
             onChange = {(event,newValue) => this.setState({password:newValue})}
             />
           <br/>
           <RaisedButton label="Submit" backgroundColor={'rgb(67,133,244)'} labelColor={'rgb(255,255,255)'} style={style} onClick={(event) => this.handleClick(event)}/>
           <br />
           <Link className="LoginButt" to='/MyLogin'>Already Registered? Login here</Link>
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

ReactDOM.render(
  <MyRegister />,
  document.getElementById('root')
);

export default MyRegister;
