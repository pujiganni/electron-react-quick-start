var React = require('react');
var ReactDOM = require('react-dom');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyRegister from './Components/MyRegister';
import MyLogin from './Components/MyLogin';
import MyEditor from './Components/MyEditor';
import MyPortal from './Components/MyPortal';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import injectTapEventPlugin from 'react-tap-event-plugin';

/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})
// injectTapEventPlugin();

class Root extends React.Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path='/' exact component={MyRegister} ></Route>
          <Route path='/MyLogin' component={MyLogin} ></Route>
          <Route path='/MyPortal' component={MyPortal} ></Route>
          <Route path='/MyEditor' component={MyEditor} ></Route>
          <Route path='/edit/:docId' component={MyEditor} ></Route>
        </Switch>
      </HashRouter>
    );
  }
}

ReactDOM.render(
  <MuiThemeProvider >
    {/* <Root /> */}
    <Root />
  </MuiThemeProvider>,
   document.getElementById('root'));
