'use strict';

var React = require('react');
var Remarkable = require('remarkable');

function renderPrismCode(langPrefix, langName, highlighted) {

  var linesAttr = '';

  // If the language has a line indicated, e.g. {5}, {5-10} add a
  // data-line attribute to the
  var lines = langName.match(/\{([\d|\-|\,| ]*)\}$/);
  if (lines && lines.length && lines[1]) {
    linesAttr = ' data-line="' + lines[1] + '"';
    langName = langName.replace(lines[0], '');
  }

  // We need to add the line-numbers class to append it to the pre tag,
  // otherwise we get weird positioning problems
  // https://github.com/PrismJS/prism/blob/gh-pages/plugins/line-highlight/prism-line-highlight.js#L68
  return '<pre' + linesAttr + ' class="line-numbers"><code class="' + langPrefix + langName + '">' + highlighted + '</code></pre>';
}

var _require = require('remarkable/lib/common/utils');

var has = _require.has;
var escapeHtml = _require.escapeHtml;
var unescapeMd = _require.unescapeMd;
var replaceEntities = _require.replaceEntities;

function customFenceRule(tokens, idx, options, env, self) {
  var token = tokens[idx];
  var langClass = '';
  var langPrefix = options.langPrefix;
  var langName = '';
  var fenceName;
  var highlighted;

  if (token.params) {
    fenceName = token.params.split(/\s+/g)[0];
    langName = escapeHtml(replaceEntities(unescapeMd(fenceName)));
  }

  highlighted = escapeHtml(token.content);

  return renderPrismCode(langPrefix, langName, highlighted) + this.getBreak(tokens, idx);
};

var Markdown = React.createClass({
  displayName: 'Markdown',

  getDefaultProps: function getDefaultProps() {
    return {
      container: 'div',
      options: {},
      prism: false,
      async: false
    };
  },

  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
    if (nextProps.options !== this.props.options) {
      this.md = this.createMarkdownInstance();
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (this.props.prism && this.props !== prevProps) {
      this.highlight();
    }
  },

  componentDidMount: function componentDidMount() {
    if (this.props.prism) {
      this.highlight();
    }
  },

  createMarkdownInstance: function createMarkdownInstance() {
    var options = this.props.options;
    var md = new Remarkable(options);
    if (this.props.prism) md.renderer.rules.fence = customFenceRule;

    return md;
  },

  highlight: function highlight() {
    var elements = this.getDOMNode().querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

    for (var i = 0, element; element = elements[i++];) {
      Prism.highlightElement(element, this.props.async);
    }
  },

  getHTML: function getHTML(str) {
    if (!this.md) {
      this.md = this.createMarkdownInstance();
    }
    return React.createElement('span', { dangerouslySetInnerHTML: { __html: this.md.render(str) } });
  },

  renderContent: function renderContent() {
    var _this = this;

    if (this.props.source) {
      return this.getHTML(this.props.source);
    } else {
      return React.Children.map(this.props.children, function (child) {
        if (typeof child === 'string') {
          return _this.getHTML(child);
        } else {
          return child;
        }
      });
    }
  },

  render: function render() {
    var Container = this.props.container;
    return React.createElement(
      Container,
      null,
      this.renderContent()
    );
  }

});

module.exports = Markdown;