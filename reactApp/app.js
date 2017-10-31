var React = require('react');
var ReactDOM = require('react-dom');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyEditor from './Components/MyEditor';
// import MyInput from './Components/MyInput';

/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})


ReactDOM.render(
  <MuiThemeProvider>
    <MyEditor />
  </MuiThemeProvider>,
   document.getElementById('root'));
