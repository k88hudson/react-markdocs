var React = require('react/addons');
var Router = require('react-router');
var {DefaultRoute, Link, Route, RouteHandler} = Router;
var {Highlight, Markdown} = require('../src/markdocs.js');
var throttle = require('lodash.throttle');

var defaultTheme = {
  blockBackground: '#F8F5EC',
  baseColor: '#5C6E74',
  commentColor: '#93A1A1',
  punctuationColor: '#999999',
  propertyColor: '#990055',
  selectorColor: '#669900',
  operatorColor: '#a67f59',
  operatorBg: '#FFFFFF',
  variableColor: '#ee9900',
  functionColor: '#DD4A68',
  keywordColor: '#0077aa',
  selectedColor: '#b3d4fc',
  inlineCodeColor: '#DB4C69',
  inlineCodeBackground: '#F9F2F4',
  highlightBackground: '#F7EBC6',
  highlightAccent: '#F7D87C'
};

var colorClasses = Object.keys(defaultTheme);

var lessString = require('raw!../src/markdocs.less');

function createColorVariableString(colors) {
  return colorClasses.map(color => {
    return `@${color}: ${colors[color]};`;
  }).join('\n');
}

function renderStyles(colors, callback) {
  var str = lessString;
  str = str + '\n\n' + createColorVariableString(colors);
  less.render(str)
    .then(function (output) {
      callback(output.css);
    }, function (err) {
      console.log(err);
    });
}

var App = React.createClass({
  render: function () {
    return (
      <div className="container">
        <RouteHandler/>
      </div>
    );
  }
});

var Home = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {
    return {
      colors: defaultTheme,
      css: ''
    };
  },
  componentDidMount: function () {

    this.updateColors = throttle(() => {
      renderStyles(this.state.colors, (css) => {
        this.setState({css});
      });
    }, 500);

    // this.updateColors();

  },
  updateSwatch: function (color) {
    return (e) => {
      var colors = this.state.colors;
      colors[color] = e.target.value;
      this.setState({colors});
      this.updateColors();
    };
  },
  render: function () {
    return (<div className="docs">
      <style>{this.state.css}</style>

      <div className="color-hacker">
        <div className="sidebar">
          <h2 className="download">
            <span><a href="http://prismjs.com" target="_blank">Prism.js</a> Theme Generator</span>
            <a hidden={!this.state.css}  className="btn" href={'data:application/octet-stream;charset=utf-8,' + encodeURI(this.state.css)}>Download CSS</a>
          </h2>
          <div className="color-wrapper">{colorClasses.map(color => {
            return (<div className="color">
              <div className="color-demo" style={{background: this.state.colors[color]}}>
                 <input type="color" value={this.state.colors[color]} onChange={this.updateSwatch(color)} />
              </div>
              <code>@{color}</code>
              <input type="type" value={this.state.colors[color]} onChange={throttle(this.updateSwatch(color), 100)} />
            </div>);
          })}</div>
        </div>
        <div className="sample">
          <Markdown prism source={require('./colors-demo.md')} />
        </div>
      </div>
    </div>);
  }
});

var Tests = React.createClass({
  getInitialState: function () {
    return {
      foo: 'abc'
    };
  },
  render: function () {
    return (<div>
      <input valueLink={this.linkState('foo')} />

      <Highlight className="language-jsx">
      {`<foo>${this.state.foo}</foo>`}
      </Highlight>
      <pre className="language-jsx">
      {`<foo />`}
      </pre>
    </div>);
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Home}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});
