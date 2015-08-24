"use strict";

var React = require("react");
var Markdown = require("remarkable");
var assign = require("react/lib/Object.assign");

function renderPrismCode(langName, highlighted) {

  var linesAttr = "";

  // If the language has a line indicated, e.g. {5}, {5-10} add a
  // data-line attribute to the
  var lines = langName.match(/\{([\d|\-|\,| ]*)\}$/);
  if (lines && lines.length && lines[1]) {
    linesAttr = " data-line=\"" + lines[1] + "\"";
    langName = langName.replace(lines[0], "");
  }

  return "<pre" + linesAttr + "><code class=\"language-" + langName + "\">" + highlighted + "</code></pre>";
}

var Remarkable = React.createClass({
  displayName: "Remarkable",

  getDefaultProps: function getDefaultProps() {
    return {
      container: "div",
      options: {} };
  },

  render: function render() {
    var Container = this.props.container;
    return React.createElement(Container, null, this.content());
  },

  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
    if (nextProps.options !== this.props.options) {
      this.md = this._createMarkdownInstance();
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (this.props.prism && this.props !== prevProps) {
      this._highlight();
    }
  },

  componentDidMount: function componentDidMount() {
    if (this.props.prism) {
      this._highlight();
    }
  },

  _createMarkdownInstance: function _createMarkdownInstance() {
    var options = this.props.options;
    if (this.props.prism) {
      options = assign({}, this.props.options, {
        renderCode: renderPrismCode
      });
    }
    return new Markdown(options);
  },

  _highlight: function _highlight() {
    var elements = this.getDOMNode().querySelectorAll("code[class*=\"language-\"], [class*=\"language-\"] code, code[class*=\"lang-\"], [class*=\"lang-\"] code");

    for (var i = 0, element; element = elements[i++];) {
      Prism.highlightElement(element, this.props.async);
    }
  },

  content: function content() {
    var _this = this;

    if (this.props.source) {
      return React.createElement("span", { dangerouslySetInnerHTML: { __html: this.renderMarkdown(this.props.source) } });
    } else {
      return React.Children.map(this.props.children, function (child) {
        if (typeof child === "string") {
          return React.createElement("span", { dangerouslySetInnerHTML: { __html: _this.renderMarkdown(child) } });
        } else {
          return child;
        }
      });
    }
  },

  renderMarkdown: function renderMarkdown(source) {
    if (!this.md) {
      this.md = this._createMarkdownInstance();
    }

    return this.md.render(source);
  }

});

module.exports = Remarkable;