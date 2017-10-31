import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils, Modifier} from 'draft-js';
import AppBar from 'material-ui/AppBar';
import MyInput from './MyInput';
// import ColorControls from './fontColor';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import { CirclePicker } from 'react-color';


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
  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }
  _onItalicizeClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }
  _onUnderlineClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }
  _onStrikethroughClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'STRIKETHROUGH'));
  }

  _toggleColor(toggledColor) {
    // console.log('hey');
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    // console.log(selection);
    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap)
    .reduce((contentState, color) => {
      return Modifier.removeInlineStyle(contentState, selection, color);
    }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );
    const currentStyle = editorState.getCurrentInlineStyle();
    // console.log(currentStyle);
    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }
    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      // console.log(toggledColor);
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
      // console.log(nextEditorState);
    }
    this.onChange(nextEditorState);
  }

  toggleInlineFormat(e, style) {
    e.preventDefault();
    this.setState({
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)
    });
  }
  formatButton({icon, style}) {
    return(
      <RaisedButton
        // secondary={true}
        backgroundColor={'lightgray'}
        labelColor={'rgb(255,255,255)'}
        onMouseDown={(e) => this.toggleInlineFormat(e, style)}
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

  render() {
    return (
      <div>
        <AppBar title="Toolbar" />
      <div className="toolbar">
        {this.formatButton({icon: 'format_bold', style: 'BOLD' })}
        {this.formatButton({icon: 'format_italic', style: 'ITALIC' })}
        {this.formatButton({icon: 'format_underlined', style: 'UNDERLINE' })}
        {this.colorPicker()}
        {this.increaseFontSize(false)}
        {this.increaseFontSize(true)}
        {/* {this.formatButton({icon: 'format_underlined'})} */}
      </div>
      <div
        // style={{backgroundColor: 'red'}}
        className='button'>
        {/* <button onClick={this._onBoldClick.bind(this)}>Bold</button>
        <button onClick={this._onItalicizeClick.bind(this)}>Italicize</button>
        <button onClick={this._onUnderlineClick.bind(this)}>Underline</button>
        <button onClick={this._onStrikethroughClick.bind(this)}>Strikethrough</button> */}
        {/* <ColorControls
          editorState={this.state.editorState}
          onToggle={this.toggleColor}
        /> */}
      </div>
      <div onClick={this.focus}>
        <Editor
          // customStyleMap={Object.assign({}, styleMap, colorStyleMap)}
          customStyleMap={this.state.inlineStyles}
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          ref={(ref) => this.editor = ref}
        />
      </div>
      </div>
    );
  }
}

// const styleMap = {
//   'STRIKETHROUGH': {
//     textDecoration: 'line-through',
//   },
// };

const colorStyleMap = {
  red: {
    color: 'rgba(255, 0, 0, 1.0)',
  },
  orange: {
    color: 'rgba(255, 127, 0, 1.0)',
  },
  yellow: {
    color: 'rgba(180, 180, 0, 1.0)',
  },
  green: {
    color: 'rgba(0, 180, 0, 1.0)',
  },
  blue: {
    color: 'rgba(0, 0, 255, 1.0)',
  },
  indigo: {
    color: 'rgba(75, 0, 130, 1.0)',
  },
  violet: {
    color: 'rgba(127, 0, 255, 1.0)',
  },
};

ReactDOM.render(
  <MyInput />,
  document.getElementById('root')
);

export default MyEditor;
