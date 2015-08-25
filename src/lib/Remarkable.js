'use strict';

var React = require('react');
var Remarkable = require('remarkable');

function renderPrismCode(langPrefix, langName, highlighted) {

  var linesAttr = '';

  // If the language has a line indicated, e.g. {5}, {5-10} add a
  // data-line attribute to the
  var lines = langName.match(/\{([\d|\-|\,| ]*)\}$/);
  if (lines && lines.length && lines[1]) {
    linesAttr = ' data-line="' + lines[1] +'"';
    langName = langName.replace(lines[0], '');
  }

  // We need to add the line-numbers class to append it to the pre tag,
  // otherwise we get weird positioning problems
  // https://github.com/PrismJS/prism/blob/gh-pages/plugins/line-highlight/prism-line-highlight.js#L68
  return `<pre${linesAttr} class="line-numbers"><code class="${langPrefix}${langName}">`
    + highlighted
    + '</code></pre>';
}

var {has,escapeHtml,unescapeMd,replaceEntities} = require('remarkable/lib/common/utils');

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

  getDefaultProps() {
    return {
      container: 'div',
      options: {},
      prism: false,
      async: false
    };
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.options !== this.props.options) {
      this.md = this.createMarkdownInstance();
    }
  },

  componentDidUpdate (prevProps) {
    if (this.props.prism && this.props !== prevProps) {
      this.highlight();
    }
  },

  componentDidMount() {
    if (this.props.prism) {
      this.highlight();
    }
  },

  createMarkdownInstance () {
    var options = this.props.options;
    var md = new Remarkable(options);
    if (this.props.prism) md.renderer.rules.fence = customFenceRule;

    return md;
  },

  highlight() {
    var elements = this.getDOMNode().querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

    for (var i=0, element; element = elements[i++];) {
      Prism.highlightElement(element, this.props.async);
    }
  },

  getHTML(str) {
    if (!this.md) {
      this.md = this.createMarkdownInstance();
    }
    return <span dangerouslySetInnerHTML={{__html: this.md.render(str)}} />;
  },

  renderContent() {
    if (this.props.source) {
      return this.getHTML(this.props.source);
    }
    else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return this.getHTML(child);
        }
        else {
          return child;
        }
      });
    }
  },

  render() {
    var Container = this.props.container;
    return <Container>{this.renderContent()}</Container>;
  }

});

module.exports = Markdown;
