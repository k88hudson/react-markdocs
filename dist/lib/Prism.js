// Mostly from
// https://github.com/tomchentw/react-prism/blob/master/src/PrismCode.js
//

"use strict";

var React = require('react/addons');

var PrismCode = React.createClass({
  displayName: "PrismCode",

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    async: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      async: true
    };
  },

  componentDidMount: function componentDidMount() {
    this._hightlight();
  },

  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this._hightlight();
    }
  },

  _hightlight: function _hightlight() {
    Prism.highlightElement(this.refs.code.getDOMNode(), this.props.async);
  },

  render: function render() {
    var props = this.props;
    var state = this.state;

    return React.createElement(
      "pre",
      { "data-line": props.line },
      React.createElement(
        "code",
        { ref: "code", className: props.className },
        props.source || props.children
      )
    );
  }
});

module.exports = PrismCode;