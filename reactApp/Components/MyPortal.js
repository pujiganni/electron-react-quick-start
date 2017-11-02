import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { HashRouter, Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';


class MyPortal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      title:'',
      sharedDoc:'',
      open: false,
      open2: false,
      open3: false,
      password: '',
      docId: '',
      docs: [],
    };
  }

  componentDidMount() {
    axios.get("http://localhost:3000/getAllDocuments")
     .then(documents => {
       this.setState({ docs: documents.data });
     })
     .catch(err => console.log(err));
  }

  handleClick(event) {
    event.preventDefault();
    axios.post("http://localhost:3000/MyPortal", {
      title: this.state.title,
      docId: this.state.docId,
      password: this.state.password,
    }, {
      withCredentials: true
    })
    .then((resp) => {
      if(resp.data.success) {
        this.props.history.push('/MyEditor');
      } else {
        console.log(resp.data);
      }
    })
    .catch((err) => console.log(err));
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  handleOpen2() {
    this.setState({open2: true});
  }

  handleClose2() {
    this.setState({open2: false});
  }

  handleOpen3() {
    this.setState({open3: true});
  }

  handleClose3() {
    this.setState({open3: false});
  }


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={false}
        onClick={this.handleClick.bind(this)}
      />,
    ];

    const actions2 = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose2.bind(this)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={true}
        onClick={this.handleClose}
      />,
    ];

    const actions3 = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose3.bind(this)}
      />,
    ];

    return (
      <HashRouter>
      <div>
        <MuiThemeProvider>

          <div>
            <AppBar
              title="Documents Portal"
            />
            {/* <TextField
              hintText="New Document Title"
              floatingLabelText="Title"
              onChange = {(event,newValue) => this.setState({title:newValue})}
            /> */}
            <br/>
            <RaisedButton label="Create Document" primary={true} style={style} onClick={this.handleOpen.bind(this)}/>
            <Dialog
              title="Create Document"
              actions={actions}
              modal={true}
              open={this.state.open}
              >
              <TextField hintText="Title"
              onChange = {(event,newValue) => this.setState({title:newValue})} />
              <TextField hintText="Document ID"
              onChange = {(event,newValue) => this.setState({docId:newValue})} />
              <TextField hintText="Password"
              onChange = {(event,newValue) => this.setState({password:newValue})} />
            </Dialog>


            <br/>
            <RaisedButton label="Shared Document" primary={true} style={style} onClick={this.handleOpen2.bind(this)}
            />
            <Dialog
              title="Enter Shared Document ID"
              actions={actions2}
              modal={true}
              open={this.state.open2}
              >
              <TextField hintText="Document ID"
              // onChange = {(event,newValue) => this.setState({docId:newValue})}
            />
            </Dialog>
            <br/>
            <div className="mydocs">
              <RaisedButton label="My Documents" primary={true} style={style} onClick={this.handleOpen3.bind(this)} />
              <Dialog
                title="My Documents"
                actions={actions3}
                modal={false}
                open={this.state.open3}
                onRequestClose={this.handleClose3.bind(this)}
                autoScrollBodyContent={true}
              >
                <ul>
                  {this.state.docs.map(doc => (
                    <div>
                      <Link to='/MyEditor'>{doc.title}</Link>
                    </div>))}
                  </ul>
              </Dialog>
            </div>
      </div>
        </MuiThemeProvider>
          <br/>
          <Link className="editbutt" to='/MyEditor'>To myEditor</Link>
      </div>
      </HashRouter>
    );
  }
}
const style = {
  margin: 15,
};


export default MyPortal;
