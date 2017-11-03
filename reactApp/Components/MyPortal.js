import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { HashRouter, Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import {List, ListItem} from 'material-ui/List';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import {blue500} from 'material-ui/styles/colors';

const styles = {
  underlineStyle: {
    borderColor: '#4D90FE'
  }
};


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

  newDocument() {
    axios.post('http://localhost:3000/newDocument', {
      title: this.refs.newdocument.value
    })
      .then((resp) => {
        console.log(resp);
        this.setState({
          docs: this.state.docs.concat(resp.data.doc)
        });
      });
  }

  componentDidMount() {
    axios.get("http://localhost:3000/getAllDocuments")
     .then((resp) => {
       this.setState({
         docs: this.state.docs.concat(resp.data.docs)
       });
     })
     .catch((err) => console.log('error getting all docs', err));
  }

  handleClick(event) {
    event.preventDefault();
    axios.post("http://localhost:3000/newDocument", {
      title: this.state.title,
      docId: this.state.docId,
      password: this.state.password,
      // content: this.state.content,
    }, {
      withCredentials: true
    })
    .then((resp) => {
      if(resp.data.success) {
        this.props.history.push(`/edit/${resp.data.doc._id}`);
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

  // handleOpen3() {
  //   this.setState({open3: true});
  // }
  //
  // handleClose3() {
  //   this.setState({open3: false});
  // }


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        default={true}
        onClick={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="Submit"
        default={true}
        disabled={false}
        onClick={this.handleClick.bind(this)}
      />,
    ];

    const actions2 = [
      <FlatButton
        label="Cancel"
        default={true}
        onClick={this.handleClose2.bind(this)}
      />,
      <FlatButton
        label="Submit"
        default={true}
        disabled={true}
        onClick={this.handleClose}
      />,
    ];

    // const actions3 = [
    //   <FlatButton
    //     label="Cancel"
    //     primary={true}
    //     onClick={this.handleClose3.bind(this)}
    //   />,
    // ];

    return (
      <div>
        <MuiThemeProvider>

          <div>
            <AppBar
              title="Documents Portal"
              style={{backgroundColor:'#4D90FE'}}
            />
            <br/>
            <RaisedButton label="New Document" backgroundColor={'#4D90FE'} labelColor={'rgb(255,255,255)'} style={style} onClick={this.handleOpen.bind(this)}/>
            <Dialog
              title="Create Document"
              actions={actions}
              modal={true}
              open={this.state.open}
              >
              <TextField hintText="Title"
              onChange = {(event,newValue) => this.setState({title:newValue})} underlineFocusStyle={styles.underlineStyle}
              />
              <TextField hintText="Document ID"
              onChange = {(event,newValue) => this.setState({docId:newValue})} underlineFocusStyle={styles.underlineStyle}
              />
              <TextField hintText="Password"
              onChange = {(event,newValue) => this.setState({password:newValue})} underlineFocusStyle={styles.underlineStyle}
              />
            </Dialog>



            <RaisedButton label="Enter Document ID" backgroundColor={'#4D90FE'} labelColor={'rgb(255,255,255)'} style={style} onClick={this.handleOpen2.bind(this)}
            />
            <Dialog
              title="Enter Shared Document ID"
              actions={actions2}
              modal={true}
              open={this.state.open2}
              >
              <TextField hintText="Document ID" underlineFocusStyle={styles.underlineStyle}
              // onChange = {(event,newValue) => this.setState({docId:newValue})}
            />
            </Dialog>
            <br/>
            <div className="mydocs">
              <FlatButton label="My Documents" labelColor={'#4D90FE'} backgroundColor={'rgb(255,255,255)'} fullWidth={true} style={style}
              />
              {/* <Dialog
                title="My Documents"
                actions={actions3}
                modal={false}
                open={this.state.open3}
                onRequestClose={this.handleClose3.bind(this)}
                autoScrollBodyContent={true}
              >
                <ul>
                  {this.state.docs.map(doc => (
                    <div key={document._id}>
                      <Link to={`/edit/${document._id}`}>{document.title}</Link>
                    </div>))}
                  </ul>
              </Dialog> */}
            </div>
            <Divider />
               <List>
                 {this.state.docs.map(doc => (
                   <ListItem
                     primaryText={doc.title}
                     containerElement={<Link className='allDocs' to={`/edit/${doc._id}`}/>}
                     leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
                   />
                 ))}
               </List>
             <Divider />
      </div>
        </MuiThemeProvider>
          <br/>
          <Link className="editLog" to='/MyLogin'>Logout</Link>
      </div>
    );
  }
}

const style = {
  margin: 15
};


export default MyPortal;
