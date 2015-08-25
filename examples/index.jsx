var React = require('react/addons');
var Router = require('react-router');
var {DefaultRoute, Link, Route, RouteHandler} = Router;
var {Highlight, Markdown} = require('../src/markdocs.js');

var defaultTheme = {
  blockBackground: '#F8F5EC',
  baseColor: '#5C6E74',
  commentColor: '#93A1A1',
  punctuationColor: '#999',
  propertyColor: '#905',
  selectorColor: '#690',
  operatorColor: '#a67f59',
  operatorBg: 'hsla(0, 0%, 100%, .5)',
  variableColor: '#e90',
  functionColor: '#DD4A68',
  keywordColor: '#07a',
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
    return defaultTheme;
  },
  updateColors: function () {
    renderStyles(this.state, (css) => {
      this.setState({css});
    });
  },
  render: function () {
    return (<div className="docs">
      <style>{this.state.css}</style>

      <div className="color-hacker">
        <Markdown prism source={require('./colors-demo.md')} />
        <div className="sidebar">
          <button onClick={this.updateColors}>Update colors</button>
          {colorClasses.map(color => {
            return (<p>
              <div className="color-demo" style={{background: this.state[color]}}>
                <input type="color" valueLink={this.linkState(color)} />
              </div>
              <code>@{color}</code>

            </p>);
          })}
        </div>
      </div>
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
