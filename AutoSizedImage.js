import React, {PureComponent} from 'react';
import {
  Image,
  Dimensions,
} from 'react-native';

const baseStyle = {
  backgroundColor: 'transparent',
};

export default class AutoSizedImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // set width 1 is for preventing the warning
      // You must specify a width and height for the image %s
      width: this.props.style.width || 1,
      height: this.props.style.height || 1,
      dimensions: { window: Dimensions.get("window") }
    };
  }

  componentDidMount() {
    //avoid repaint if width/height is given
    if (this.props.style.width || this.props.style.height) {
      return;
    }
    Image.getSize(this.props.source.uri, (width, height) => {
      this.setState({width, height});
    });

    Dimensions.addEventListener("change", this.onChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.onChange);
  }

  onChange = ({ window }) => {
    this.setState({ dimensions: { window } });
  };

  render() {
    const finalSize = {};

    //TODO: instead of 80 percent, get actual parent view width (without padding/margin)
    const width = this.state.dimensions.window.width * 0.8;

    if (this.state.width > width) {
      finalSize.width = width;
      const ratio = width / this.state.width;
      finalSize.height = this.state.height * ratio;
    }
    const style = Object.assign(
      baseStyle,
      this.props.style,
      this.state,
      finalSize
    );
    let source = {};
    if (!finalSize.width || !finalSize.height) {
      source = Object.assign(source, this.props.source, this.state);
    } else {
      source = Object.assign(source, this.props.source, finalSize);
    }

    if (style.width == 1) {
      return null;
    }

    return <Image resizeMode="contain" style={style} source={source} />;
  }
}
