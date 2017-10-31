import React from 'react';
// import ReactDOM from 'react-dom';

class MyInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.onChange = (evt) => this.setState({value: evt.target.value});
  }
  render() {
    return (
    <div className='input'>
      <input value={this.state.value} onChange={this.onChange} />
    </div>
    );
  }
}

export default MyInput;
