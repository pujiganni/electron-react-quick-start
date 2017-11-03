import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap, convertToRaw, convertFromRaw } from 'draft-js';
import AppBar from 'material-ui/AppBar';
import { Map } from 'immutable';
import MyInput from './MyInput';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import { CirclePicker } from 'react-color';
import { Link } from 'react-router-dom';
import axios from 'axios';


const myBlockTypes = DefaultDraftBlockRenderMap.merge(new Map({
  center: {
    element: 'div'
  },
  right: {
    element: 'div'
  }
}));

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.focus = () => this.editor.focus();
    this.state = {
      editorState: EditorState.createEmpty(),
      currentFontSize: 12,
      inlineStyles: {}
    };
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.toggleColor = (toggledColor) => this._toggleColor(toggledColor);
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  toggleFormat(e, style, block) {
    e.preventDefault();
    if (block) {
      this.setState({
        editorState: RichUtils.toggleBlockType(this.state.editorState, style)
      });
    } else {
      this.setState({
        editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)
      });
    }
  }

  formatButton({icon, style, block}) {
    return(
      <RaisedButton
        backgroundColor={'lightgray'}
        labelColor={'rgb(255,255,255)'}
        onMouseDown={(e) => this.toggleFormat(e, style, block)}
        icon={<FontIcon className="material-icons">{icon}</FontIcon>}
      />
    );
  }

  formatColor(color) {
    var newInlineStyles = Object.assign(
      {},
    this.state.inlineStyles,
      {
        [color.hex]: {
          color: color.hex
        }
      }
    );
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, color.hex)
    });
  }


  openColorPicker(e) {
    this.setState({
      colorPickerOpen: true,
      colorPickerButton: e.target
    });
  }

  closeColorPicker() {
    this.setState({
      colorPickerOpen: false
    });
  }

  colorPicker() {
    return(
      <div style = {{display: 'inline-block'}}>
        <RaisedButton
          backgroundColor={'lightgray'}
          labelColor={'rgb(255,255,255)'}
          icon={<FontIcon className="material-icons">format_paint</FontIcon>}
          onClick={this.openColorPicker.bind(this)}
        />
        <Popover
          open={this.state.colorPickerOpen}
          anchorEl={this.state.colorPickerButton}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
          onRequestClose={this.closeColorPicker.bind(this)}
          >
          <CirclePicker onChangeComplete={this.formatColor.bind(this)}/>
        </Popover>
      </div>
    );
  }

  applyIncreaseFontSize(shrink) {
    var newFontSize = this.state.currentFontSize + (shrink ? -4 : 4);
    var newInlineStyles = Object.assign(
      {},
      this.state.inlineStyles,
      {
        [newFontSize]: {
          fontSize: `${newFontSize}px`
        }
      }
    );

    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, String(newFontSize)),
      currentFontSize: newFontSize
    });
  }

  increaseFontSize(shrink) {
    return (
      <RaisedButton
        backgroundColor={'lightgray'}
        labelColor={'rgb(255,255,255)'}
        onMouseDown={() => this.applyIncreaseFontSize(shrink)}
        icon={<FontIcon className="material-icons">{shrink ? 'zoom_out' : 'zoom_in'}</FontIcon>}
      />
    );
  }

  componentDidMount() {
    axios.get(`http://localhost:3000/getAllDocuments/${this.props.match.params.docId}`)
     .then((resp) => {
       console.log(resp.data.doc);
       const doc = resp.data.doc;
       console.log('docdocdocdoc: ', doc);
       if (doc.content === '') {
         this.setState({
           title: doc.title
         });
         return;
       }
       const rawContentState = JSON.parse(doc.content);
       const contentState = convertFromRaw(rawContentState);
       const newEditorState = EditorState.createWithContent(contentState);

       this.setState({
         title: doc.title,
         editorState: newEditorState,
         inlineStyles: doc.styles,
       });
     })
     .catch(err => console.log(err));
  }

  updateDoc() {
    console.log('beginning');
    const contentState = this.state.editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const stringContent = JSON.stringify(rawContentState);
    axios.post(`http://localhost:3000/updateDoc/${this.props.match.params.docId}`, {
      content: stringContent,
      styles: this.state.inlineStyles
    })
   .then((resp) => {
     console.log('yo', resp.data, this.props.match.params.docId);
   });
  // console.log('saved!');
  }

  myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'center') {
      return 'center-align';
    } else if (type === 'right') {
      return 'right-align';
    } else {
      return '';
    }
  }


  render() {
    console.log('WELCOME');
    return (
      <div>
        <AppBar title={this.state.title} style={{backgroundColor:'#2196f3'}} />
      <div className="toolbar">
        {this.formatButton({icon: 'format_bold', style: 'BOLD' })}
        {this.formatButton({icon: 'format_italic', style: 'ITALIC' })}
        {this.formatButton({icon: 'format_underlined', style: 'UNDERLINE' })}
        {this.formatButton({icon: 'format_list_bulleted', style: 'unordered-list-item', block: true })}
        {this.formatButton({icon: 'format_list_numbered', style: 'ordered-list-item', block: true })}
        {this.formatButton({icon: 'format_align_left', style: 'unstyled', block: true })}
        {this.formatButton({icon: 'format_align_center', style: 'center', block: true })}
        {this.formatButton({icon: 'format_align_right', style: 'right', block: true })}
        {this.colorPicker()}
        {this.increaseFontSize(false)}
        {this.increaseFontSize(true)}
        <RaisedButton
          onMouseDown={() => this.updateDoc()}
          backgroundColor={'lightgray'}
          labelColor={'rgb(255,255,255)'}
          // onMouseDown={(e) => this.toggleFormat(e, style, block)}
          icon={<FontIcon className="material-icons">{'save'}</FontIcon>}
        />

      </div>
        <p style={{color:'#2196f3'}} >Document ID: {this.props.match.params.docId}</p>
      <div className="editor" onClick={this.focus}>
        <Editor
          blockRenderMap={myBlockTypes}
          customStyleMap={this.state.inlineStyles}
          blockStyleFn={this.myBlockStyleFn}
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          ref={(ref) => this.editor = ref}
        />
      </div>
      <Link className="portalbutt" to='/MyPortal'>Back to My Documents</Link>
      </div>
    );
  }
}


ReactDOM.render(
  <MyInput />,
  document.getElementById('root')
);

export default MyEditor;
