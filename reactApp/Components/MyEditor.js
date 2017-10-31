import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils, Modifier} from 'draft-js';
import AppBar from 'material-ui/AppBar';
import MyInput from './MyInput';
import ColorControls from './fontColor';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';


class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.focus = () => this.editor.focus();
    this.state = {editorState: EditorState.createEmpty()};
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

  formatButton({icon}) {
    return(
      <RaisedButton
        secondary={true}
        icon={<FontIcon className="material-icons">{icon}</FontIcon>}
      />
    );
  }

  render() {
    return (
      <div>
        <AppBar title="Toolbar" />
      <div className="toolbar">
        {this.formatButton({icon: 'format_bold'})}
        {this.formatButton({icon: 'format_italic'})}
        {this.formatButton({icon: 'format_underlined'})}
        {/* {this.formatButton({icon: 'format_underlined'})} */}
      </div>
      <div
        // style={{backgroundColor: 'red'}}
        className='button'>
        <button onClick={this._onBoldClick.bind(this)}>Bold</button>
        <button onClick={this._onItalicizeClick.bind(this)}>Italicize</button>
        <button onClick={this._onUnderlineClick.bind(this)}>Underline</button>
        <button onClick={this._onStrikethroughClick.bind(this)}>Strikethrough</button>
        <ColorControls
          editorState={this.state.editorState}
          onToggle={this.toggleColor}
        />
      </div>
      <div onClick={this.focus}>
        <Editor
          customStyleMap={Object.assign({}, styleMap, colorStyleMap)}
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

const styleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through',
  },
};

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
