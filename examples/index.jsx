var React = require('react/addons');
var Router = require('react-router');
var {DefaultRoute, Link, Route, RouteHandler} = Router;
var {Highlight, Markdown} = require('../src/markdocs.js');

var App = React.createClass({
  render: function () {
    return (
      <div className="container">
        <header>
          <h2>Guide</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
          </ul>
        </header>
        <div className="body">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

var Home = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {
    return {
      foo: 'hi'
    };
  },
  render: function () {
    return (<div className="docs">
      <input valueLink={this.linkState('foo')} />
      <Markdown prism>
{`Test one two three

Hello world!

\`\`\`javascript
var x = ${this.state.foo};
\`\`\`

Foo bar baz`}
      </Markdown>
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
