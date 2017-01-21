'use strict'

var debug = require('debug')('monster-drift')
delete process.env.DEBUG // hackrf doesn't like this flag

var devices = require('hackrf')()
var ook = require('./lib/ook')
var commands = require('./lib/commands')

module.exports = MonsterDrift

function MonsterDrift (opts) {
  if (!(this instanceof MonsterDrift)) return new MonsterDrift()
  if (!opts) opts = {}

  this._freq = opts.freq || 27143550
  this._index = 0
  this._stream = null
  this._stopIn = opts.stop || null
  this._stopTimer = null

  var encode = ook({
    freq: this._freq,
    gain: 32,
    symbolPeriod: 0.463753
  })

  var self = this
  this._signal = {}
  Object.keys(commands).forEach(function (key) {
    var cmd = commands[key]
    self._signal[key] = encode(Array(100).join(cmd[0]))
    self._signal[key].name = cmd[1]
  })

  this._device = devices.open(opts.id || 0)
  this._device.setTxGain(opts.gain || 30) // TX VGA (IF) gain, 0-47 dB in 1 dB steps
  this._device.setFrequency(this._freq)
}

MonsterDrift.prototype.turn180 = function (cb) {
  this.batch([
    [this.forward, 1000],
    [this.right, 125],
    [this.backwardLeft, 100],
    [this.backward, 1000]
  ], cb)
}

MonsterDrift.prototype._start = function () {
  var self = this
  debug('starting')
  this._device.startTx(function (buf, cb) {
    var i
    if (self._stream) {
      for (i = 0; i < buf.length; i++) {
        buf[i] = self._stream[self._index++]
        if (self._index === self._stream.length) self._index = 0
      }
    } else {
      for (i = 0; i < buf.length; i++) buf[i] = 0
    }
    cb()
  })
}

MonsterDrift.prototype.stop = function (cb) {
  if (!this._stream) return cb()
  debug('stopping')
  this._stream = null
  this._device.stopTx(function () {
    debug('stopped!')
    if (cb) cb()
  })
}

MonsterDrift.prototype.close = function (cb) {
  var self = this
  this.stop(function () {
    self._device.close(cb)
  })
}

MonsterDrift.prototype.left = function () {
  this._drive(this._signal.l)
}

MonsterDrift.prototype.right = function () {
  this._drive(this._signal.r)
}

MonsterDrift.prototype.forward = function () {
  this._drive(this._signal.f)
}

MonsterDrift.prototype.forwardRight = function () {
  this._drive(this._signal.fr)
}

MonsterDrift.prototype.forwardLeft = function () {
  this._drive(this._signal.fl)
}

MonsterDrift.prototype.backward = function () {
  this._drive(this._signal.b)
}

MonsterDrift.prototype.backwardRight = function () {
  this._drive(this._signal.br)
}

MonsterDrift.prototype.backwardLeft = function () {
  this._drive(this._signal.bl)
}

MonsterDrift.prototype.batch = function (commands, cb) {
  var self = this
  next()

  function next (i) {
    var command = commands[i || 0]
    if (!command) return self.stop(cb)
    var fn = commands[0]
    var ms = commands[1]
    fn.call(self)
    if (ms) {
      setTimeout(function () {
        next(++i)
      }, ms)
    } else if (cb) {
      cb()
    }
  }
}

MonsterDrift.prototype._drive = function (s) {
  debug(s.name)
  if (this._stopTimer) clearTimeout(this._stopTimer)
  if (this._stream === s) return
  else if (!this._stream) this._start()

  debug('new direction')
  this._index = 0
  this._stream = s

  if (this._stopIn) {
    var self = this
    this._stopTimer = setTimeout(function () {
      self.stop()
    }, this._stopIn)
  }
}
