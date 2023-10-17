module.exports = function (r) {
  const Radix = require('./radix')
  r.find('a', function () {
    const l = []
    Radix.map(r.list, function (v, f) {
      if (!(f.indexOf('%1B') + 1)) { return }
      if (!v) { return }
      l.push([f, v])
    })
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