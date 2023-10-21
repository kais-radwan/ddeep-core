/*
    This file was modified, for license see https://github.com/amark/gun/blob/master/LICENSE.md
*/
function Dup() {
  const dup = { s: {} }; const opt = { max: 1000, age: 1000 * 9 };
  let cache = {};
  let tracked = new Set();

  dup.check = function(id) {
    if (cache[id]) {
      return cache[id];
    }

    const result = dup.s[id];
    cache[id] = result;
    return result;
  };

  dup.track = function(id) {
    if (tracked.has(id)) {
      return id;
    }

    tracked.add(id);
    dup.s[id] = (+new Date());

    if (!dup.to) {
      dup.to = setTimeout(function() {
        for (const [id, time] of Object.entries(dup.s)) {
          if (opt.age > ((+new Date()) - Number(time))) {
            continue;
          }

          tracked.delete(id);
          delete dup.s[id];
        }

        dup.to = null;
      }, opt.age);
    }

    return id;
  };

  dup.destroy = function() {
    clearTimeout(dup.to);
    cache = {};
    tracked.clear();
  };

  return dup;
}

Dup.random = function() { return Math.random().toString(36).slice(-6) };

try {
  module.exports = Dup;
} catch (e) { };
