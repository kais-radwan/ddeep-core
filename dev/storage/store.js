/*
    This file was modified. for license see https://github.com/amark/gun/blob/master/LICENSE.md
*/
const Radix = require('./radix')
const Radisk = require('./radisk')
const fs = require('fs')

function Store (opt) {
  opt = opt || {}
  opt.file = String(opt.file || 'ddeep_data')

  const store = function Store () { }

  store.put = function (file, data, cb) {
    const random = Math.random().toString(36).slice(-3)
    fs.writeFile(opt.file + '-' + random + '.tmp', data, function (err, ok) {
      if (err) { return cb(err) }
      fs.rename(opt.file + '-' + random + '.tmp', opt.file + '/' + file, cb)
    })
  }

  store.get = function (file, cb) {
    fs.readFile(opt.file + '/' + file, (err, data) => {
      if (err) {
        if ((err.code || '').toUpperCase() === 'ENOENT') {
          return cb()
        }
        console.log('ERROR:', err)
      }
      if (data) { data = data.toString() }
      cb(err, data)
    })
  }

  store.list = function (cb, match) {
    fs.readdir(opt.file, function (err, dir) {
      dir.forEach(cb)
      cb() // Stream interface requires a final call to know when to be done.
    })
  }

  if (!fs.existsSync(opt.file)) { fs.mkdirSync(opt.file) }
  return store
}

const rad = Radisk({ store: Store() })

const API = {}

API.put = function (graph, cb) {
  if (!graph) { return }
  let c = 0
  Object.keys(graph).forEach(function (soul) {
    const node = graph[soul]
    Object.keys(node).forEach(function (key) {
      if (key == '_') { return }
      c++
      const val = node[key]; const state = node._['>'][key]
      rad(soul + '.' + key, JSON.stringify([val, state]), ack)
    })
  })
  function ack (err, ok) {
    c--
    if (ack.err) { return }
    if (ack.err = err) {
      cb(err || 'ERROR!')
      return
    }
    if (c > 0) { return }
    cb(ack.err, 1)
  }
}

API.get = function (lex, cb) {
  if (!lex) { return }
  const soul = lex['#']
  const key = lex['.'] || ''
  const tmp = soul + '.' + key
  let node
  rad(tmp, function (err, val) {
    let graph
    if (val) {
      Radix.map(val, each)
      if (!node) { each(val, key) }
      graph = {}
      graph[soul] = node
    }
    cb(err, graph)
  })
  function each (val, key) {
    const data = JSON.parse(val)
    node = node || { _: { '#': soul, '>': {} } }
    node[key] = data[0]
    node._['>'][key] = data[1]
  }
}

module.exports = API
