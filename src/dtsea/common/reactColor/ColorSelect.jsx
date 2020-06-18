import { ChromePicker } from 'react-color';
import React from 'react';

const popover = {
  position: 'absolute',
  zIndex: '2',
}
const cover = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
}

export default class ColorSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: props.color,
      // key: props.objKey,
      displayColorPicker: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }


  handleClick = () => {
     const { displayColorPicker } = this.state;
    // let ColorPicker = 'none';
    // ColorPicker = displayColorPicker === 'none' ? 'block' : 'none';
    // this.setState({ displayColorPicker: ColorPicker })
    this.setState({ displayColorPicker: !displayColorPicker })
  }

  handleChange = (value) => {
    const color = value.hex;
    this.setState({ color })
    if (color) {
      this.props.updateColor(color)
    }
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  render() {
    const { color, displayColorPicker } = this.state;
    return (
      <div>
        <button onClick={ this.handleClick } type="button" style={{ background: color,
          border: 'none',
          lineHeight: '31px',
          height: 31,
          width: 45,
          verticalAlign: 'middle',
          cursor: 'pointer' }}/>
        {displayColorPicker ?
          <div style={ popover } >
            <div style={ cover } onClick={ this.handleClose }/>
            <ChromePicker color={this.state.color} onChange={this.handleChange}/>
          </div>
          : null
        }
      </div>
    );
  }
}
