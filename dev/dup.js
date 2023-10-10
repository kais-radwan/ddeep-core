/*
    This file was not modified, for license see https://github.com/amark/gun/blob/master/LICENSE.md
*/
function Dup () {
  const dup = { s: {} }; const opt = { max: 1000, age: 1000 * 9 }
  dup.check = function (id) {
    return dup.s[id] ? dup.track(id) : false
  }
  dup.track = function (id) {
    dup.s[id] = (+new Date())
    if (!dup.to) {
      dup.to = setTimeout(function () {
        Object.keys(dup.s).forEach(function (time, id) {
          if (opt.age > ((+new Date()) - Number(time))) {
            return
          }
          delete dup.s[id]
        })
        dup.to = null
      }, opt.age)
    }
    return id
  }
  return dup
}
Dup.random = function () { return Math.random().toString(36).slice(-6) }
try {
  module.exports = Dup
} catch (e) { };
