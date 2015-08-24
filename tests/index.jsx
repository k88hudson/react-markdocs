// Make console.warn throw
var warn = console.warn;
console.warn = function (warning) {
  throw new Error(warning);
  warn.apply(console, arguments);
};

describe('markdocs', function () {
  it('should be ok', function () {
  });
});
