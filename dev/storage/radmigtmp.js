/*
    This file was not modified. for license see https://github.com/amark/gun/blob/master/LICENSE.md
*/
module.exports = function (r) {
  const Radix = require('./radix')
  r.find('a', function () {
    const l = []
    Radix.map(r.list, function (v, f) {
      if (!(f.indexOf('%1B') + 1)) { return }
      if (!v) { return }
      l.push([f, v])
    })
    if (l.length) {
      console.log('\n! ! ! WARNING ! ! !\nRAD v0.2020.x has detected OLD v0.2019.x data & automatically migrating. Automatic migration will be turned OFF in future versions! If you are just developing/testing, we recommend you reset your data. Please contact us if you have any concerns.\nThis message should only log once.')
    }
    let f, v
    l.forEach(function (a) {
      f = a[0]; v = a[1]
      r.list(decodeURIComponent(f), v)
      r.list(f, 0)
    })
    if (!f) { return }
    r.find.bad(f)
  })
}
