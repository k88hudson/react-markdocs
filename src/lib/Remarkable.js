'use strict';

var React = require('react');
var Markdown = require('remarkable');
var assign = require('react/lib/Object.assign');

function renderPrismCode(langName, highlighted) {

  var linesAttr = '';

  // If the language has a line indicated, e.g. {5}, {5-10} add a
  // data-line attribute to the
  var lines = langName.match(/\{([\d|\-|\,| ]*)\}$/);
  if (lines && lines.length && lines[1]) {
    linesAttr = ' data-line="' + lines[1] +'"';
    langName = langName.replace(lines[0], '');
  }

  return `<pre${linesAttr}><code class="language-${langName}">`
    + highlighted
    + '</code></pre>';
}

var Remarkable = React.createClass({

  getDefaultProps() {
    return {
      container: 'div',
      options: {},
    };
  },

  render() {
    var Container = this.props.container;
    return React.createElement(Container, null, this.content());
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.options !== this.props.options) {
      this.md = this._createMarkdownInstance();
    }
  },

  componentDidUpdate (prevProps) {
    if (this.props.prism && this.props !== prevProps) {
      this._highlight();
    }
  },

  componentDidMount() {
    if (this.props.prism) {
      this._highlight();
    }
  },

  _createMarkdownInstance () {
    var options = this.props.options;
    if (this.props.prism) {
      options = assign({}, this.props.options, {
        renderCode: renderPrismCode
      });
    }
    return new Markdown(options);
  },

  _highlight () {
    var elements = this.getDOMNode().querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

    for (var i=0, element; element = elements[i++];) {
      Prism.highlightElement(element, this.props.async);
    }
  },

  content() {
    if (this.props.source) {
      return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.source) }} />;
    }
    else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(child) }} />;
        }
        else {
          return child;
        }
      });
    }
  },

  renderMarkdown(source) {
    if (!this.md) {
      this.md = this._createMarkdownInstance();
    }

    return this.md.render(source);
  }

});

module.exports = Remarkable;
