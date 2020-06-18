const moment = require('moment');
const hbs = require('hbs');

hbs.registerHelper('if_eq', function(a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});
hbs.registerHelper('formatTime', function(date, format) {
  const mmnt = moment(date);
  return mmnt.format(format);
});
hbs.registerHelper('iteration', function(n, block) {
  let accum = '';
  for (let i = 1; i <= n; i++) {
    accum += block.fn(i);
  }
  return accum;
});
hbs.registerHelper('cond', function(expression, options) {
  let fn = function() {}; let result;
  try {
    fn = Function.apply(this, ['return ' + expression + ' ;']);
  } catch (e) {}
  try {
    result = fn.bind(this)();
  } catch (e) {}

  return result ? options.fn(this) : options.inverse(this);
});
