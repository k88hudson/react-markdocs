# React Markdocs (WIP)

Waning: Still experimental, not yet released.

Yet another Markdown component, this time with easy syntax and line highlighting via Prism.

```
npm install https://github.com/k88hudson/react-markdocs.git
```

Make sure you include [Prism](https://github.com/k88hudson/react-markdocs/blob/master/examples/static/vendor/prism.js) in your page (you have to include it as an external script).

## Usage

```jsx
var Markdown = require('react-markdocs').Markdown;

<Markdown source={someSourceString} prism />

<Markdown prism>
{`Test one two three
Hello world!
\`\`\`javascript
var x = ${this.state.foo};
\`\`\`
Foo bar baz`}
</Markdown>
```
