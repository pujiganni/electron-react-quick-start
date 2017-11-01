import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { HashRouter } from 'react-router-dom';

class MyPortal extends React.Component {
  constructor(props){
    super(props);
    this.state={
      title:'',
      sharedDoc:''
    };
  }

  handleClick(event) {
    event.preventDefault();
    this.props.history.push('/MyEditor');
  }

  render() {
    return (
      <HashRouter>
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar
              title="Documents Portal"
            />
            <TextField
              hintText="New Document Title"
              floatingLabelText="Title"
              onChange = {(event,newValue) => this.setState({title:newValue})}
            />
            <br/>
            <RaisedButton label="Create Document" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
            <br/>
            <TextField
              type="password"
              hintText="Enter Shared Document ID"
              floatingLabelText="Document ID"
              onChange = {(event,newValue) => this.setState({sharedDoc:newValue})}
            />
            <br/>
            <RaisedButton label="Add Shared Document" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
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


export default MyPortal;
