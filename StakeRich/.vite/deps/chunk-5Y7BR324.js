import {
  require_events
} from "./chunk-UWELQ4IB.js";
import {
  C,
  concat,
  detect,
  fromString,
  init_tslib_es6,
  require_binary,
  require_chacha20poly1305,
  require_cjs,
  require_cjs2,
  require_cjs3,
  require_hkdf,
  require_query_string,
  require_random,
  require_sha256,
  require_wipe,
  require_x25519,
  toString,
  tslib_es6_exports
} from "./chunk-YJGNAP7T.js";
import {
  A,
  E,
  import_pino,
  k,
  safeJsonParse,
  safeJsonStringify,
  y
} from "./chunk-A3MKZKSE.js";
import {
  __commonJS,
  __esm,
  __export,
  __reExport,
  __toCommonJS,
  __toESM
} from "./chunk-MSFXBLHD.js";

// node_modules/@stablelib/sha512/lib/sha512.js
var require_sha512 = __commonJS({
  "node_modules/@stablelib/sha512/lib/sha512.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var binary_1 = require_binary();
    var wipe_1 = require_wipe();
    exports.DIGEST_LENGTH = 64;
    exports.BLOCK_SIZE = 128;
    var SHA512 = (
      /** @class */
      function() {
        function SHA5122() {
          this.digestLength = exports.DIGEST_LENGTH;
          this.blockSize = exports.BLOCK_SIZE;
          this._stateHi = new Int32Array(8);
          this._stateLo = new Int32Array(8);
          this._tempHi = new Int32Array(16);
          this._tempLo = new Int32Array(16);
          this._buffer = new Uint8Array(256);
          this._bufferLength = 0;
          this._bytesHashed = 0;
          this._finished = false;
          this.reset();
        }
        SHA5122.prototype._initState = function() {
          this._stateHi[0] = 1779033703;
          this._stateHi[1] = 3144134277;
          this._stateHi[2] = 1013904242;
          this._stateHi[3] = 2773480762;
          this._stateHi[4] = 1359893119;
          this._stateHi[5] = 2600822924;
          this._stateHi[6] = 528734635;
          this._stateHi[7] = 1541459225;
          this._stateLo[0] = 4089235720;
          this._stateLo[1] = 2227873595;
          this._stateLo[2] = 4271175723;
          this._stateLo[3] = 1595750129;
          this._stateLo[4] = 2917565137;
          this._stateLo[5] = 725511199;
          this._stateLo[6] = 4215389547;
          this._stateLo[7] = 327033209;
        };
        SHA5122.prototype.reset = function() {
          this._initState();
          this._bufferLength = 0;
          this._bytesHashed = 0;
          this._finished = false;
          return this;
        };
        SHA5122.prototype.clean = function() {
          wipe_1.wipe(this._buffer);
          wipe_1.wipe(this._tempHi);
          wipe_1.wipe(this._tempLo);
          this.reset();
        };
        SHA5122.prototype.update = function(data, dataLength) {
          if (dataLength === void 0) {
            dataLength = data.length;
          }
          if (this._finished) {
            throw new Error("SHA512: can't update because hash was finished.");
          }
          var dataPos = 0;
          this._bytesHashed += dataLength;
          if (this._bufferLength > 0) {
            while (this._bufferLength < exports.BLOCK_SIZE && dataLength > 0) {
              this._buffer[this._bufferLength++] = data[dataPos++];
              dataLength--;
            }
            if (this._bufferLength === this.blockSize) {
              hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, this.blockSize);
              this._bufferLength = 0;
            }
          }
          if (dataLength >= this.blockSize) {
            dataPos = hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, data, dataPos, dataLength);
            dataLength %= this.blockSize;
          }
          while (dataLength > 0) {
            this._buffer[this._bufferLength++] = data[dataPos++];
            dataLength--;
          }
          return this;
        };
        SHA5122.prototype.finish = function(out) {
          if (!this._finished) {
            var bytesHashed = this._bytesHashed;
            var left = this._bufferLength;
            var bitLenHi = bytesHashed / 536870912 | 0;
            var bitLenLo = bytesHashed << 3;
            var padLength = bytesHashed % 128 < 112 ? 128 : 256;
            this._buffer[left] = 128;
            for (var i3 = left + 1; i3 < padLength - 8; i3++) {
              this._buffer[i3] = 0;
            }
            binary_1.writeUint32BE(bitLenHi, this._buffer, padLength - 8);
            binary_1.writeUint32BE(bitLenLo, this._buffer, padLength - 4);
            hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, padLength);
            this._finished = true;
          }
          for (var i3 = 0; i3 < this.digestLength / 8; i3++) {
            binary_1.writeUint32BE(this._stateHi[i3], out, i3 * 8);
            binary_1.writeUint32BE(this._stateLo[i3], out, i3 * 8 + 4);
          }
          return this;
        };
        SHA5122.prototype.digest = function() {
          var out = new Uint8Array(this.digestLength);
          this.finish(out);
          return out;
        };
        SHA5122.prototype.saveState = function() {
          if (this._finished) {
            throw new Error("SHA256: cannot save finished state");
          }
          return {
            stateHi: new Int32Array(this._stateHi),
            stateLo: new Int32Array(this._stateLo),
            buffer: this._bufferLength > 0 ? new Uint8Array(this._buffer) : void 0,
            bufferLength: this._bufferLength,
            bytesHashed: this._bytesHashed
          };
        };
        SHA5122.prototype.restoreState = function(savedState) {
          this._stateHi.set(savedState.stateHi);
          this._stateLo.set(savedState.stateLo);
          this._bufferLength = savedState.bufferLength;
          if (savedState.buffer) {
            this._buffer.set(savedState.buffer);
          }
          this._bytesHashed = savedState.bytesHashed;
          this._finished = false;
          return this;
        };
        SHA5122.prototype.cleanSavedState = function(savedState) {
          wipe_1.wipe(savedState.stateHi);
          wipe_1.wipe(savedState.stateLo);
          if (savedState.buffer) {
            wipe_1.wipe(savedState.buffer);
          }
          savedState.bufferLength = 0;
          savedState.bytesHashed = 0;
        };
        return SHA5122;
      }()
    );
    exports.SHA512 = SHA512;
    var K3 = new Int32Array([
      1116352408,
      3609767458,
      1899447441,
      602891725,
      3049323471,
      3964484399,
      3921009573,
      2173295548,
      961987163,
      4081628472,
      1508970993,
      3053834265,
      2453635748,
      2937671579,
      2870763221,
      3664609560,
      3624381080,
      2734883394,
      310598401,
      1164996542,
      607225278,
      1323610764,
      1426881987,
      3590304994,
      1925078388,
      4068182383,
      2162078206,
      991336113,
      2614888103,
      633803317,
      3248222580,
      3479774868,
      3835390401,
      2666613458,
      4022224774,
      944711139,
      264347078,
      2341262773,
      604807628,
      2007800933,
      770255983,
      1495990901,
      1249150122,
      1856431235,
      1555081692,
      3175218132,
      1996064986,
      2198950837,
      2554220882,
      3999719339,
      2821834349,
      766784016,
      2952996808,
      2566594879,
      3210313671,
      3203337956,
      3336571891,
      1034457026,
      3584528711,
      2466948901,
      113926993,
      3758326383,
      338241895,
      168717936,
      666307205,
      1188179964,
      773529912,
      1546045734,
      1294757372,
      1522805485,
      1396182291,
      2643833823,
      1695183700,
      2343527390,
      1986661051,
      1014477480,
      2177026350,
      1206759142,
      2456956037,
      344077627,
      2730485921,
      1290863460,
      2820302411,
      3158454273,
      3259730800,
      3505952657,
      3345764771,
      106217008,
      3516065817,
      3606008344,
      3600352804,
      1432725776,
      4094571909,
      1467031594,
      275423344,
      851169720,
      430227734,
      3100823752,
      506948616,
      1363258195,
      659060556,
      3750685593,
      883997877,
      3785050280,
      958139571,
      3318307427,
      1322822218,
      3812723403,
      1537002063,
      2003034995,
      1747873779,
      3602036899,
      1955562222,
      1575990012,
      2024104815,
      1125592928,
      2227730452,
      2716904306,
      2361852424,
      442776044,
      2428436474,
      593698344,
      2756734187,
      3733110249,
      3204031479,
      2999351573,
      3329325298,
      3815920427,
      3391569614,
      3928383900,
      3515267271,
      566280711,
      3940187606,
      3454069534,
      4118630271,
      4000239992,
      116418474,
      1914138554,
      174292421,
      2731055270,
      289380356,
      3203993006,
      460393269,
      320620315,
      685471733,
      587496836,
      852142971,
      1086792851,
      1017036298,
      365543100,
      1126000580,
      2618297676,
      1288033470,
      3409855158,
      1501505948,
      4234509866,
      1607167915,
      987167468,
      1816402316,
      1246189591
    ]);
    function hashBlocks(wh, wl, hh2, hl, m3, pos, len) {
      var ah0 = hh2[0], ah1 = hh2[1], ah2 = hh2[2], ah3 = hh2[3], ah4 = hh2[4], ah5 = hh2[5], ah6 = hh2[6], ah7 = hh2[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
      var h4, l4;
      var th2, tl;
      var a4, b4, c5, d3;
      while (len >= 128) {
        for (var i3 = 0; i3 < 16; i3++) {
          var j6 = 8 * i3 + pos;
          wh[i3] = binary_1.readUint32BE(m3, j6);
          wl[i3] = binary_1.readUint32BE(m3, j6 + 4);
        }
        for (var i3 = 0; i3 < 80; i3++) {
          var bh0 = ah0;
          var bh1 = ah1;
          var bh2 = ah2;
          var bh3 = ah3;
          var bh4 = ah4;
          var bh5 = ah5;
          var bh6 = ah6;
          var bh7 = ah7;
          var bl0 = al0;
          var bl1 = al1;
          var bl2 = al2;
          var bl3 = al3;
          var bl4 = al4;
          var bl5 = al5;
          var bl6 = al6;
          var bl7 = al7;
          h4 = ah7;
          l4 = al7;
          a4 = l4 & 65535;
          b4 = l4 >>> 16;
          c5 = h4 & 65535;
          d3 = h4 >>> 16;
          h4 = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
          l4 = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
          a4 += l4 & 65535;
          b4 += l4 >>> 16;
          c5 += h4 & 65535;
          d3 += h4 >>> 16;
          h4 = ah4 & ah5 ^ ~ah4 & ah6;
          l4 = al4 & al5 ^ ~al4 & al6;
          a4 += l4 & 65535;
          b4 += l4 >>> 16;
          c5 += h4 & 65535;
          d3 += h4 >>> 16;
          h4 = K3[i3 * 2];
          l4 = K3[i3 * 2 + 1];
          a4 += l4 & 65535;
          b4 += l4 >>> 16;
          c5 += h4 & 65535;
          d3 += h4 >>> 16;
          h4 = wh[i3 % 16];
          l4 = wl[i3 % 16];
          a4 += l4 & 65535;
          b4 += l4 >>> 16;
          c5 += h4 & 65535;
          d3 += h4 >>> 16;
          b4 += a4 >>> 16;
          c5 += b4 >>> 16;
          d3 += c5 >>> 16;
          th2 = c5 & 65535 | d3 << 16;
          tl = a4 & 65535 | b4 << 16;
          h4 = th2;
          l4 = tl;
          a4 = l4 & 65535;
          b4 = l4 >>> 16;
          c5 = h4 & 65535;
          d3 = h4 >>> 16;
          h4 = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
          l4 = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
          a4 += l4 & 65535;
          b4 += l4 >>> 16;
          c5 += h4 & 65535;
          d3 += h4 >>> 16;
          h4 = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
          l4 = al0 & al1 ^ al0 & al2 ^ al1 & al2;
          a4 += l4 & 65535;
          b4 += l4 >>> 16;
          c5 += h4 & 65535;
          d3 += h4 >>> 16;
          b4 += a4 >>> 16;
          c5 += b4 >>> 16;
          d3 += c5 >>> 16;
          bh7 = c5 & 65535 | d3 << 16;
          bl7 = a4 & 65535 | b4 << 16;
          h4 = bh3;
          l4 = bl3;
          a4 = l4 & 65535;
          b4 = l4 >>> 16;
          c5 = h4 & 65535;
          d3 = h4 >>> 16;
          h4 = th2;
          l4 = tl;
          a4 += l4 & 65535;
          b4 += l4 >>> 16;
          c5 += h4 & 65535;
          d3 += h4 >>> 16;
          b4 += a4 >>> 16;
          c5 += b4 >>> 16;
          d3 += c5 >>> 16;
          bh3 = c5 & 65535 | d3 << 16;
          bl3 = a4 & 65535 | b4 << 16;
          ah1 = bh0;
          ah2 = bh1;
          ah3 = bh2;
          ah4 = bh3;
          ah5 = bh4;
          ah6 = bh5;
          ah7 = bh6;
          ah0 = bh7;
          al1 = bl0;
          al2 = bl1;
          al3 = bl2;
          al4 = bl3;
          al5 = bl4;
          al6 = bl5;
          al7 = bl6;
          al0 = bl7;
          if (i3 % 16 === 15) {
            for (var j6 = 0; j6 < 16; j6++) {
              h4 = wh[j6];
              l4 = wl[j6];
              a4 = l4 & 65535;
              b4 = l4 >>> 16;
              c5 = h4 & 65535;
              d3 = h4 >>> 16;
              h4 = wh[(j6 + 9) % 16];
              l4 = wl[(j6 + 9) % 16];
              a4 += l4 & 65535;
              b4 += l4 >>> 16;
              c5 += h4 & 65535;
              d3 += h4 >>> 16;
              th2 = wh[(j6 + 1) % 16];
              tl = wl[(j6 + 1) % 16];
              h4 = (th2 >>> 1 | tl << 32 - 1) ^ (th2 >>> 8 | tl << 32 - 8) ^ th2 >>> 7;
              l4 = (tl >>> 1 | th2 << 32 - 1) ^ (tl >>> 8 | th2 << 32 - 8) ^ (tl >>> 7 | th2 << 32 - 7);
              a4 += l4 & 65535;
              b4 += l4 >>> 16;
              c5 += h4 & 65535;
              d3 += h4 >>> 16;
              th2 = wh[(j6 + 14) % 16];
              tl = wl[(j6 + 14) % 16];
              h4 = (th2 >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th2 << 32 - (61 - 32)) ^ th2 >>> 6;
              l4 = (tl >>> 19 | th2 << 32 - 19) ^ (th2 >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th2 << 32 - 6);
              a4 += l4 & 65535;
              b4 += l4 >>> 16;
              c5 += h4 & 65535;
              d3 += h4 >>> 16;
              b4 += a4 >>> 16;
              c5 += b4 >>> 16;
              d3 += c5 >>> 16;
              wh[j6] = c5 & 65535 | d3 << 16;
              wl[j6] = a4 & 65535 | b4 << 16;
            }
          }
        }
        h4 = ah0;
        l4 = al0;
        a4 = l4 & 65535;
        b4 = l4 >>> 16;
        c5 = h4 & 65535;
        d3 = h4 >>> 16;
        h4 = hh2[0];
        l4 = hl[0];
        a4 += l4 & 65535;
        b4 += l4 >>> 16;
        c5 += h4 & 65535;
        d3 += h4 >>> 16;
        b4 += a4 >>> 16;
        c5 += b4 >>> 16;
        d3 += c5 >>> 16;
        hh2[0] = ah0 = c5 & 65535 | d3 << 16;
        hl[0] = al0 = a4 & 65535 | b4 << 16;
        h4 = ah1;
        l4 = al1;
        a4 = l4 & 65535;
        b4 = l4 >>> 16;
        c5 = h4 & 65535;
        d3 = h4 >>> 16;
        h4 = hh2[1];
        l4 = hl[1];
        a4 += l4 & 65535;
        b4 += l4 >>> 16;
        c5 += h4 & 65535;
        d3 += h4 >>> 16;
        b4 += a4 >>> 16;
        c5 += b4 >>> 16;
        d3 += c5 >>> 16;
        hh2[1] = ah1 = c5 & 65535 | d3 << 16;
        hl[1] = al1 = a4 & 65535 | b4 << 16;
        h4 = ah2;
        l4 = al2;
        a4 = l4 & 65535;
        b4 = l4 >>> 16;
        c5 = h4 & 65535;
        d3 = h4 >>> 16;
        h4 = hh2[2];
        l4 = hl[2];
        a4 += l4 & 65535;
        b4 += l4 >>> 16;
        c5 += h4 & 65535;
        d3 += h4 >>> 16;
        b4 += a4 >>> 16;
        c5 += b4 >>> 16;
        d3 += c5 >>> 16;
        hh2[2] = ah2 = c5 & 65535 | d3 << 16;
        hl[2] = al2 = a4 & 65535 | b4 << 16;
        h4 = ah3;
        l4 = al3;
        a4 = l4 & 65535;
        b4 = l4 >>> 16;
        c5 = h4 & 65535;
        d3 = h4 >>> 16;
        h4 = hh2[3];
        l4 = hl[3];
        a4 += l4 & 65535;
        b4 += l4 >>> 16;
        c5 += h4 & 65535;
        d3 += h4 >>> 16;
        b4 += a4 >>> 16;
        c5 += b4 >>> 16;
        d3 += c5 >>> 16;
        hh2[3] = ah3 = c5 & 65535 | d3 << 16;
        hl[3] = al3 = a4 & 65535 | b4 << 16;
        h4 = ah4;
        l4 = al4;
        a4 = l4 & 65535;
        b4 = l4 >>> 16;
        c5 = h4 & 65535;
        d3 = h4 >>> 16;
        h4 = hh2[4];
        l4 = hl[4];
        a4 += l4 & 65535;
        b4 += l4 >>> 16;
        c5 += h4 & 65535;
        d3 += h4 >>> 16;
        b4 += a4 >>> 16;
        c5 += b4 >>> 16;
        d3 += c5 >>> 16;
        hh2[4] = ah4 = c5 & 65535 | d3 << 16;
        hl[4] = al4 = a4 & 65535 | b4 << 16;
        h4 = ah5;
        l4 = al5;
        a4 = l4 & 65535;
        b4 = l4 >>> 16;
        c5 = h4 & 65535;
        d3 = h4 >>> 16;
        h4 = hh2[5];
        l4 = hl[5];
        a4 += l4 & 65535;
        b4 += l4 >>> 16;
        c5 += h4 & 65535;
        d3 += h4 >>> 16;
        b4 += a4 >>> 16;
        c5 += b4 >>> 16;
        d3 += c5 >>> 16;
        hh2[5] = ah5 = c5 & 65535 | d3 << 16;
        hl[5] = al5 = a4 & 65535 | b4 << 16;
        h4 = ah6;
        l4 = al6;
        a4 = l4 & 65535;
        b4 = l4 >>> 16;
        c5 = h4 & 65535;
        d3 = h4 >>> 16;
        h4 = hh2[6];
        l4 = hl[6];
        a4 += l4 & 65535;
        b4 += l4 >>> 16;
        c5 += h4 & 65535;
        d3 += h4 >>> 16;
        b4 += a4 >>> 16;
        c5 += b4 >>> 16;
        d3 += c5 >>> 16;
        hh2[6] = ah6 = c5 & 65535 | d3 << 16;
        hl[6] = al6 = a4 & 65535 | b4 << 16;
        h4 = ah7;
        l4 = al7;
        a4 = l4 & 65535;
        b4 = l4 >>> 16;
        c5 = h4 & 65535;
        d3 = h4 >>> 16;
        h4 = hh2[7];
        l4 = hl[7];
        a4 += l4 & 65535;
        b4 += l4 >>> 16;
        c5 += h4 & 65535;
        d3 += h4 >>> 16;
        b4 += a4 >>> 16;
        c5 += b4 >>> 16;
        d3 += c5 >>> 16;
        hh2[7] = ah7 = c5 & 65535 | d3 << 16;
        hl[7] = al7 = a4 & 65535 | b4 << 16;
        pos += 128;
        len -= 128;
      }
      return pos;
    }
    function hash(data) {
      var h4 = new SHA512();
      h4.update(data);
      var digest = h4.digest();
      h4.clean();
      return digest;
    }
    exports.hash = hash;
  }
});

// node_modules/@stablelib/ed25519/lib/ed25519.js
var require_ed25519 = __commonJS({
  "node_modules/@stablelib/ed25519/lib/ed25519.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertSecretKeyToX25519 = exports.convertPublicKeyToX25519 = exports.verify = exports.sign = exports.extractPublicKeyFromSecretKey = exports.generateKeyPair = exports.generateKeyPairFromSeed = exports.SEED_LENGTH = exports.SECRET_KEY_LENGTH = exports.PUBLIC_KEY_LENGTH = exports.SIGNATURE_LENGTH = void 0;
    var random_1 = require_random();
    var sha512_1 = require_sha512();
    var wipe_1 = require_wipe();
    exports.SIGNATURE_LENGTH = 64;
    exports.PUBLIC_KEY_LENGTH = 32;
    exports.SECRET_KEY_LENGTH = 64;
    exports.SEED_LENGTH = 32;
    function gf2(init) {
      const r3 = new Float64Array(16);
      if (init) {
        for (let i3 = 0; i3 < init.length; i3++) {
          r3[i3] = init[i3];
        }
      }
      return r3;
    }
    var _9 = new Uint8Array(32);
    _9[0] = 9;
    var gf0 = gf2();
    var gf1 = gf2([1]);
    var D4 = gf2([
      30883,
      4953,
      19914,
      30187,
      55467,
      16705,
      2637,
      112,
      59544,
      30585,
      16505,
      36039,
      65139,
      11119,
      27886,
      20995
    ]);
    var D22 = gf2([
      61785,
      9906,
      39828,
      60374,
      45398,
      33411,
      5274,
      224,
      53552,
      61171,
      33010,
      6542,
      64743,
      22239,
      55772,
      9222
    ]);
    var X3 = gf2([
      54554,
      36645,
      11616,
      51542,
      42930,
      38181,
      51040,
      26924,
      56412,
      64982,
      57905,
      49316,
      21502,
      52590,
      14035,
      8553
    ]);
    var Y = gf2([
      26200,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214
    ]);
    var I2 = gf2([
      41136,
      18958,
      6951,
      50414,
      58488,
      44335,
      6150,
      12099,
      55207,
      15867,
      153,
      11085,
      57099,
      20417,
      9344,
      11139
    ]);
    function set25519(r3, a4) {
      for (let i3 = 0; i3 < 16; i3++) {
        r3[i3] = a4[i3] | 0;
      }
    }
    function car25519(o5) {
      let c5 = 1;
      for (let i3 = 0; i3 < 16; i3++) {
        let v4 = o5[i3] + c5 + 65535;
        c5 = Math.floor(v4 / 65536);
        o5[i3] = v4 - c5 * 65536;
      }
      o5[0] += c5 - 1 + 37 * (c5 - 1);
    }
    function sel25519(p4, q3, b4) {
      const c5 = ~(b4 - 1);
      for (let i3 = 0; i3 < 16; i3++) {
        const t = c5 & (p4[i3] ^ q3[i3]);
        p4[i3] ^= t;
        q3[i3] ^= t;
      }
    }
    function pack25519(o5, n4) {
      const m3 = gf2();
      const t = gf2();
      for (let i3 = 0; i3 < 16; i3++) {
        t[i3] = n4[i3];
      }
      car25519(t);
      car25519(t);
      car25519(t);
      for (let j6 = 0; j6 < 2; j6++) {
        m3[0] = t[0] - 65517;
        for (let i3 = 1; i3 < 15; i3++) {
          m3[i3] = t[i3] - 65535 - (m3[i3 - 1] >> 16 & 1);
          m3[i3 - 1] &= 65535;
        }
        m3[15] = t[15] - 32767 - (m3[14] >> 16 & 1);
        const b4 = m3[15] >> 16 & 1;
        m3[14] &= 65535;
        sel25519(t, m3, 1 - b4);
      }
      for (let i3 = 0; i3 < 16; i3++) {
        o5[2 * i3] = t[i3] & 255;
        o5[2 * i3 + 1] = t[i3] >> 8;
      }
    }
    function verify32(x2, y8) {
      let d3 = 0;
      for (let i3 = 0; i3 < 32; i3++) {
        d3 |= x2[i3] ^ y8[i3];
      }
      return (1 & d3 - 1 >>> 8) - 1;
    }
    function neq25519(a4, b4) {
      const c5 = new Uint8Array(32);
      const d3 = new Uint8Array(32);
      pack25519(c5, a4);
      pack25519(d3, b4);
      return verify32(c5, d3);
    }
    function par25519(a4) {
      const d3 = new Uint8Array(32);
      pack25519(d3, a4);
      return d3[0] & 1;
    }
    function unpack25519(o5, n4) {
      for (let i3 = 0; i3 < 16; i3++) {
        o5[i3] = n4[2 * i3] + (n4[2 * i3 + 1] << 8);
      }
      o5[15] &= 32767;
    }
    function add(o5, a4, b4) {
      for (let i3 = 0; i3 < 16; i3++) {
        o5[i3] = a4[i3] + b4[i3];
      }
    }
    function sub(o5, a4, b4) {
      for (let i3 = 0; i3 < 16; i3++) {
        o5[i3] = a4[i3] - b4[i3];
      }
    }
    function mul(o5, a4, b4) {
      let v4, c5, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b02 = b4[0], b1 = b4[1], b22 = b4[2], b32 = b4[3], b42 = b4[4], b5 = b4[5], b6 = b4[6], b7 = b4[7], b8 = b4[8], b9 = b4[9], b10 = b4[10], b11 = b4[11], b12 = b4[12], b13 = b4[13], b14 = b4[14], b15 = b4[15];
      v4 = a4[0];
      t0 += v4 * b02;
      t1 += v4 * b1;
      t2 += v4 * b22;
      t3 += v4 * b32;
      t4 += v4 * b42;
      t5 += v4 * b5;
      t6 += v4 * b6;
      t7 += v4 * b7;
      t8 += v4 * b8;
      t9 += v4 * b9;
      t10 += v4 * b10;
      t11 += v4 * b11;
      t12 += v4 * b12;
      t13 += v4 * b13;
      t14 += v4 * b14;
      t15 += v4 * b15;
      v4 = a4[1];
      t1 += v4 * b02;
      t2 += v4 * b1;
      t3 += v4 * b22;
      t4 += v4 * b32;
      t5 += v4 * b42;
      t6 += v4 * b5;
      t7 += v4 * b6;
      t8 += v4 * b7;
      t9 += v4 * b8;
      t10 += v4 * b9;
      t11 += v4 * b10;
      t12 += v4 * b11;
      t13 += v4 * b12;
      t14 += v4 * b13;
      t15 += v4 * b14;
      t16 += v4 * b15;
      v4 = a4[2];
      t2 += v4 * b02;
      t3 += v4 * b1;
      t4 += v4 * b22;
      t5 += v4 * b32;
      t6 += v4 * b42;
      t7 += v4 * b5;
      t8 += v4 * b6;
      t9 += v4 * b7;
      t10 += v4 * b8;
      t11 += v4 * b9;
      t12 += v4 * b10;
      t13 += v4 * b11;
      t14 += v4 * b12;
      t15 += v4 * b13;
      t16 += v4 * b14;
      t17 += v4 * b15;
      v4 = a4[3];
      t3 += v4 * b02;
      t4 += v4 * b1;
      t5 += v4 * b22;
      t6 += v4 * b32;
      t7 += v4 * b42;
      t8 += v4 * b5;
      t9 += v4 * b6;
      t10 += v4 * b7;
      t11 += v4 * b8;
      t12 += v4 * b9;
      t13 += v4 * b10;
      t14 += v4 * b11;
      t15 += v4 * b12;
      t16 += v4 * b13;
      t17 += v4 * b14;
      t18 += v4 * b15;
      v4 = a4[4];
      t4 += v4 * b02;
      t5 += v4 * b1;
      t6 += v4 * b22;
      t7 += v4 * b32;
      t8 += v4 * b42;
      t9 += v4 * b5;
      t10 += v4 * b6;
      t11 += v4 * b7;
      t12 += v4 * b8;
      t13 += v4 * b9;
      t14 += v4 * b10;
      t15 += v4 * b11;
      t16 += v4 * b12;
      t17 += v4 * b13;
      t18 += v4 * b14;
      t19 += v4 * b15;
      v4 = a4[5];
      t5 += v4 * b02;
      t6 += v4 * b1;
      t7 += v4 * b22;
      t8 += v4 * b32;
      t9 += v4 * b42;
      t10 += v4 * b5;
      t11 += v4 * b6;
      t12 += v4 * b7;
      t13 += v4 * b8;
      t14 += v4 * b9;
      t15 += v4 * b10;
      t16 += v4 * b11;
      t17 += v4 * b12;
      t18 += v4 * b13;
      t19 += v4 * b14;
      t20 += v4 * b15;
      v4 = a4[6];
      t6 += v4 * b02;
      t7 += v4 * b1;
      t8 += v4 * b22;
      t9 += v4 * b32;
      t10 += v4 * b42;
      t11 += v4 * b5;
      t12 += v4 * b6;
      t13 += v4 * b7;
      t14 += v4 * b8;
      t15 += v4 * b9;
      t16 += v4 * b10;
      t17 += v4 * b11;
      t18 += v4 * b12;
      t19 += v4 * b13;
      t20 += v4 * b14;
      t21 += v4 * b15;
      v4 = a4[7];
      t7 += v4 * b02;
      t8 += v4 * b1;
      t9 += v4 * b22;
      t10 += v4 * b32;
      t11 += v4 * b42;
      t12 += v4 * b5;
      t13 += v4 * b6;
      t14 += v4 * b7;
      t15 += v4 * b8;
      t16 += v4 * b9;
      t17 += v4 * b10;
      t18 += v4 * b11;
      t19 += v4 * b12;
      t20 += v4 * b13;
      t21 += v4 * b14;
      t22 += v4 * b15;
      v4 = a4[8];
      t8 += v4 * b02;
      t9 += v4 * b1;
      t10 += v4 * b22;
      t11 += v4 * b32;
      t12 += v4 * b42;
      t13 += v4 * b5;
      t14 += v4 * b6;
      t15 += v4 * b7;
      t16 += v4 * b8;
      t17 += v4 * b9;
      t18 += v4 * b10;
      t19 += v4 * b11;
      t20 += v4 * b12;
      t21 += v4 * b13;
      t22 += v4 * b14;
      t23 += v4 * b15;
      v4 = a4[9];
      t9 += v4 * b02;
      t10 += v4 * b1;
      t11 += v4 * b22;
      t12 += v4 * b32;
      t13 += v4 * b42;
      t14 += v4 * b5;
      t15 += v4 * b6;
      t16 += v4 * b7;
      t17 += v4 * b8;
      t18 += v4 * b9;
      t19 += v4 * b10;
      t20 += v4 * b11;
      t21 += v4 * b12;
      t22 += v4 * b13;
      t23 += v4 * b14;
      t24 += v4 * b15;
      v4 = a4[10];
      t10 += v4 * b02;
      t11 += v4 * b1;
      t12 += v4 * b22;
      t13 += v4 * b32;
      t14 += v4 * b42;
      t15 += v4 * b5;
      t16 += v4 * b6;
      t17 += v4 * b7;
      t18 += v4 * b8;
      t19 += v4 * b9;
      t20 += v4 * b10;
      t21 += v4 * b11;
      t22 += v4 * b12;
      t23 += v4 * b13;
      t24 += v4 * b14;
      t25 += v4 * b15;
      v4 = a4[11];
      t11 += v4 * b02;
      t12 += v4 * b1;
      t13 += v4 * b22;
      t14 += v4 * b32;
      t15 += v4 * b42;
      t16 += v4 * b5;
      t17 += v4 * b6;
      t18 += v4 * b7;
      t19 += v4 * b8;
      t20 += v4 * b9;
      t21 += v4 * b10;
      t22 += v4 * b11;
      t23 += v4 * b12;
      t24 += v4 * b13;
      t25 += v4 * b14;
      t26 += v4 * b15;
      v4 = a4[12];
      t12 += v4 * b02;
      t13 += v4 * b1;
      t14 += v4 * b22;
      t15 += v4 * b32;
      t16 += v4 * b42;
      t17 += v4 * b5;
      t18 += v4 * b6;
      t19 += v4 * b7;
      t20 += v4 * b8;
      t21 += v4 * b9;
      t22 += v4 * b10;
      t23 += v4 * b11;
      t24 += v4 * b12;
      t25 += v4 * b13;
      t26 += v4 * b14;
      t27 += v4 * b15;
      v4 = a4[13];
      t13 += v4 * b02;
      t14 += v4 * b1;
      t15 += v4 * b22;
      t16 += v4 * b32;
      t17 += v4 * b42;
      t18 += v4 * b5;
      t19 += v4 * b6;
      t20 += v4 * b7;
      t21 += v4 * b8;
      t22 += v4 * b9;
      t23 += v4 * b10;
      t24 += v4 * b11;
      t25 += v4 * b12;
      t26 += v4 * b13;
      t27 += v4 * b14;
      t28 += v4 * b15;
      v4 = a4[14];
      t14 += v4 * b02;
      t15 += v4 * b1;
      t16 += v4 * b22;
      t17 += v4 * b32;
      t18 += v4 * b42;
      t19 += v4 * b5;
      t20 += v4 * b6;
      t21 += v4 * b7;
      t22 += v4 * b8;
      t23 += v4 * b9;
      t24 += v4 * b10;
      t25 += v4 * b11;
      t26 += v4 * b12;
      t27 += v4 * b13;
      t28 += v4 * b14;
      t29 += v4 * b15;
      v4 = a4[15];
      t15 += v4 * b02;
      t16 += v4 * b1;
      t17 += v4 * b22;
      t18 += v4 * b32;
      t19 += v4 * b42;
      t20 += v4 * b5;
      t21 += v4 * b6;
      t22 += v4 * b7;
      t23 += v4 * b8;
      t24 += v4 * b9;
      t25 += v4 * b10;
      t26 += v4 * b11;
      t27 += v4 * b12;
      t28 += v4 * b13;
      t29 += v4 * b14;
      t30 += v4 * b15;
      t0 += 38 * t16;
      t1 += 38 * t17;
      t2 += 38 * t18;
      t3 += 38 * t19;
      t4 += 38 * t20;
      t5 += 38 * t21;
      t6 += 38 * t22;
      t7 += 38 * t23;
      t8 += 38 * t24;
      t9 += 38 * t25;
      t10 += 38 * t26;
      t11 += 38 * t27;
      t12 += 38 * t28;
      t13 += 38 * t29;
      t14 += 38 * t30;
      c5 = 1;
      v4 = t0 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t0 = v4 - c5 * 65536;
      v4 = t1 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t1 = v4 - c5 * 65536;
      v4 = t2 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t2 = v4 - c5 * 65536;
      v4 = t3 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t3 = v4 - c5 * 65536;
      v4 = t4 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t4 = v4 - c5 * 65536;
      v4 = t5 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t5 = v4 - c5 * 65536;
      v4 = t6 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t6 = v4 - c5 * 65536;
      v4 = t7 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t7 = v4 - c5 * 65536;
      v4 = t8 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t8 = v4 - c5 * 65536;
      v4 = t9 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t9 = v4 - c5 * 65536;
      v4 = t10 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t10 = v4 - c5 * 65536;
      v4 = t11 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t11 = v4 - c5 * 65536;
      v4 = t12 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t12 = v4 - c5 * 65536;
      v4 = t13 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t13 = v4 - c5 * 65536;
      v4 = t14 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t14 = v4 - c5 * 65536;
      v4 = t15 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t15 = v4 - c5 * 65536;
      t0 += c5 - 1 + 37 * (c5 - 1);
      c5 = 1;
      v4 = t0 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t0 = v4 - c5 * 65536;
      v4 = t1 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t1 = v4 - c5 * 65536;
      v4 = t2 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t2 = v4 - c5 * 65536;
      v4 = t3 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t3 = v4 - c5 * 65536;
      v4 = t4 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t4 = v4 - c5 * 65536;
      v4 = t5 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t5 = v4 - c5 * 65536;
      v4 = t6 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t6 = v4 - c5 * 65536;
      v4 = t7 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t7 = v4 - c5 * 65536;
      v4 = t8 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t8 = v4 - c5 * 65536;
      v4 = t9 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t9 = v4 - c5 * 65536;
      v4 = t10 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t10 = v4 - c5 * 65536;
      v4 = t11 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t11 = v4 - c5 * 65536;
      v4 = t12 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t12 = v4 - c5 * 65536;
      v4 = t13 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t13 = v4 - c5 * 65536;
      v4 = t14 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t14 = v4 - c5 * 65536;
      v4 = t15 + c5 + 65535;
      c5 = Math.floor(v4 / 65536);
      t15 = v4 - c5 * 65536;
      t0 += c5 - 1 + 37 * (c5 - 1);
      o5[0] = t0;
      o5[1] = t1;
      o5[2] = t2;
      o5[3] = t3;
      o5[4] = t4;
      o5[5] = t5;
      o5[6] = t6;
      o5[7] = t7;
      o5[8] = t8;
      o5[9] = t9;
      o5[10] = t10;
      o5[11] = t11;
      o5[12] = t12;
      o5[13] = t13;
      o5[14] = t14;
      o5[15] = t15;
    }
    function square(o5, a4) {
      mul(o5, a4, a4);
    }
    function inv25519(o5, i3) {
      const c5 = gf2();
      let a4;
      for (a4 = 0; a4 < 16; a4++) {
        c5[a4] = i3[a4];
      }
      for (a4 = 253; a4 >= 0; a4--) {
        square(c5, c5);
        if (a4 !== 2 && a4 !== 4) {
          mul(c5, c5, i3);
        }
      }
      for (a4 = 0; a4 < 16; a4++) {
        o5[a4] = c5[a4];
      }
    }
    function pow2523(o5, i3) {
      const c5 = gf2();
      let a4;
      for (a4 = 0; a4 < 16; a4++) {
        c5[a4] = i3[a4];
      }
      for (a4 = 250; a4 >= 0; a4--) {
        square(c5, c5);
        if (a4 !== 1) {
          mul(c5, c5, i3);
        }
      }
      for (a4 = 0; a4 < 16; a4++) {
        o5[a4] = c5[a4];
      }
    }
    function edadd(p4, q3) {
      const a4 = gf2(), b4 = gf2(), c5 = gf2(), d3 = gf2(), e2 = gf2(), f5 = gf2(), g4 = gf2(), h4 = gf2(), t = gf2();
      sub(a4, p4[1], p4[0]);
      sub(t, q3[1], q3[0]);
      mul(a4, a4, t);
      add(b4, p4[0], p4[1]);
      add(t, q3[0], q3[1]);
      mul(b4, b4, t);
      mul(c5, p4[3], q3[3]);
      mul(c5, c5, D22);
      mul(d3, p4[2], q3[2]);
      add(d3, d3, d3);
      sub(e2, b4, a4);
      sub(f5, d3, c5);
      add(g4, d3, c5);
      add(h4, b4, a4);
      mul(p4[0], e2, f5);
      mul(p4[1], h4, g4);
      mul(p4[2], g4, f5);
      mul(p4[3], e2, h4);
    }
    function cswap(p4, q3, b4) {
      for (let i3 = 0; i3 < 4; i3++) {
        sel25519(p4[i3], q3[i3], b4);
      }
    }
    function pack(r3, p4) {
      const tx = gf2(), ty = gf2(), zi2 = gf2();
      inv25519(zi2, p4[2]);
      mul(tx, p4[0], zi2);
      mul(ty, p4[1], zi2);
      pack25519(r3, ty);
      r3[31] ^= par25519(tx) << 7;
    }
    function scalarmult(p4, q3, s2) {
      set25519(p4[0], gf0);
      set25519(p4[1], gf1);
      set25519(p4[2], gf1);
      set25519(p4[3], gf0);
      for (let i3 = 255; i3 >= 0; --i3) {
        const b4 = s2[i3 / 8 | 0] >> (i3 & 7) & 1;
        cswap(p4, q3, b4);
        edadd(q3, p4);
        edadd(p4, p4);
        cswap(p4, q3, b4);
      }
    }
    function scalarbase(p4, s2) {
      const q3 = [gf2(), gf2(), gf2(), gf2()];
      set25519(q3[0], X3);
      set25519(q3[1], Y);
      set25519(q3[2], gf1);
      mul(q3[3], X3, Y);
      scalarmult(p4, q3, s2);
    }
    function generateKeyPairFromSeed2(seed) {
      if (seed.length !== exports.SEED_LENGTH) {
        throw new Error(`ed25519: seed must be ${exports.SEED_LENGTH} bytes`);
      }
      const d3 = (0, sha512_1.hash)(seed);
      d3[0] &= 248;
      d3[31] &= 127;
      d3[31] |= 64;
      const publicKey = new Uint8Array(32);
      const p4 = [gf2(), gf2(), gf2(), gf2()];
      scalarbase(p4, d3);
      pack(publicKey, p4);
      const secretKey = new Uint8Array(64);
      secretKey.set(seed);
      secretKey.set(publicKey, 32);
      return {
        publicKey,
        secretKey
      };
    }
    exports.generateKeyPairFromSeed = generateKeyPairFromSeed2;
    function generateKeyPair3(prng) {
      const seed = (0, random_1.randomBytes)(32, prng);
      const result = generateKeyPairFromSeed2(seed);
      (0, wipe_1.wipe)(seed);
      return result;
    }
    exports.generateKeyPair = generateKeyPair3;
    function extractPublicKeyFromSecretKey(secretKey) {
      if (secretKey.length !== exports.SECRET_KEY_LENGTH) {
        throw new Error(`ed25519: secret key must be ${exports.SECRET_KEY_LENGTH} bytes`);
      }
      return new Uint8Array(secretKey.subarray(32));
    }
    exports.extractPublicKeyFromSecretKey = extractPublicKeyFromSecretKey;
    var L5 = new Float64Array([
      237,
      211,
      245,
      92,
      26,
      99,
      18,
      88,
      214,
      156,
      247,
      162,
      222,
      249,
      222,
      20,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      16
    ]);
    function modL(r3, x2) {
      let carry;
      let i3;
      let j6;
      let k3;
      for (i3 = 63; i3 >= 32; --i3) {
        carry = 0;
        for (j6 = i3 - 32, k3 = i3 - 12; j6 < k3; ++j6) {
          x2[j6] += carry - 16 * x2[i3] * L5[j6 - (i3 - 32)];
          carry = Math.floor((x2[j6] + 128) / 256);
          x2[j6] -= carry * 256;
        }
        x2[j6] += carry;
        x2[i3] = 0;
      }
      carry = 0;
      for (j6 = 0; j6 < 32; j6++) {
        x2[j6] += carry - (x2[31] >> 4) * L5[j6];
        carry = x2[j6] >> 8;
        x2[j6] &= 255;
      }
      for (j6 = 0; j6 < 32; j6++) {
        x2[j6] -= carry * L5[j6];
      }
      for (i3 = 0; i3 < 32; i3++) {
        x2[i3 + 1] += x2[i3] >> 8;
        r3[i3] = x2[i3] & 255;
      }
    }
    function reduce(r3) {
      const x2 = new Float64Array(64);
      for (let i3 = 0; i3 < 64; i3++) {
        x2[i3] = r3[i3];
      }
      for (let i3 = 0; i3 < 64; i3++) {
        r3[i3] = 0;
      }
      modL(r3, x2);
    }
    function sign2(secretKey, message) {
      const x2 = new Float64Array(64);
      const p4 = [gf2(), gf2(), gf2(), gf2()];
      const d3 = (0, sha512_1.hash)(secretKey.subarray(0, 32));
      d3[0] &= 248;
      d3[31] &= 127;
      d3[31] |= 64;
      const signature = new Uint8Array(64);
      signature.set(d3.subarray(32), 32);
      const hs3 = new sha512_1.SHA512();
      hs3.update(signature.subarray(32));
      hs3.update(message);
      const r3 = hs3.digest();
      hs3.clean();
      reduce(r3);
      scalarbase(p4, r3);
      pack(signature, p4);
      hs3.reset();
      hs3.update(signature.subarray(0, 32));
      hs3.update(secretKey.subarray(32));
      hs3.update(message);
      const h4 = hs3.digest();
      reduce(h4);
      for (let i3 = 0; i3 < 32; i3++) {
        x2[i3] = r3[i3];
      }
      for (let i3 = 0; i3 < 32; i3++) {
        for (let j6 = 0; j6 < 32; j6++) {
          x2[i3 + j6] += h4[i3] * d3[j6];
        }
      }
      modL(signature.subarray(32), x2);
      return signature;
    }
    exports.sign = sign2;
    function unpackneg(r3, p4) {
      const t = gf2(), chk = gf2(), num = gf2(), den = gf2(), den2 = gf2(), den4 = gf2(), den6 = gf2();
      set25519(r3[2], gf1);
      unpack25519(r3[1], p4);
      square(num, r3[1]);
      mul(den, num, D4);
      sub(num, num, r3[2]);
      add(den, r3[2], den);
      square(den2, den);
      square(den4, den2);
      mul(den6, den4, den2);
      mul(t, den6, num);
      mul(t, t, den);
      pow2523(t, t);
      mul(t, t, num);
      mul(t, t, den);
      mul(t, t, den);
      mul(r3[0], t, den);
      square(chk, r3[0]);
      mul(chk, chk, den);
      if (neq25519(chk, num)) {
        mul(r3[0], r3[0], I2);
      }
      square(chk, r3[0]);
      mul(chk, chk, den);
      if (neq25519(chk, num)) {
        return -1;
      }
      if (par25519(r3[0]) === p4[31] >> 7) {
        sub(r3[0], gf0, r3[0]);
      }
      mul(r3[3], r3[0], r3[1]);
      return 0;
    }
    function verify2(publicKey, message, signature) {
      const t = new Uint8Array(32);
      const p4 = [gf2(), gf2(), gf2(), gf2()];
      const q3 = [gf2(), gf2(), gf2(), gf2()];
      if (signature.length !== exports.SIGNATURE_LENGTH) {
        throw new Error(`ed25519: signature must be ${exports.SIGNATURE_LENGTH} bytes`);
      }
      if (unpackneg(q3, publicKey)) {
        return false;
      }
      const hs3 = new sha512_1.SHA512();
      hs3.update(signature.subarray(0, 32));
      hs3.update(publicKey);
      hs3.update(message);
      const h4 = hs3.digest();
      reduce(h4);
      scalarmult(p4, q3, h4);
      scalarbase(q3, signature.subarray(32));
      edadd(p4, q3);
      pack(t, p4);
      if (verify32(signature, t)) {
        return false;
      }
      return true;
    }
    exports.verify = verify2;
    function convertPublicKeyToX25519(publicKey) {
      let q3 = [gf2(), gf2(), gf2(), gf2()];
      if (unpackneg(q3, publicKey)) {
        throw new Error("Ed25519: invalid public key");
      }
      let a4 = gf2();
      let b4 = gf2();
      let y8 = q3[1];
      add(a4, gf1, y8);
      sub(b4, gf1, y8);
      inv25519(b4, b4);
      mul(a4, a4, b4);
      let z5 = new Uint8Array(32);
      pack25519(z5, a4);
      return z5;
    }
    exports.convertPublicKeyToX25519 = convertPublicKeyToX25519;
    function convertSecretKeyToX25519(secretKey) {
      const d3 = (0, sha512_1.hash)(secretKey.subarray(0, 32));
      d3[0] &= 248;
      d3[31] &= 127;
      d3[31] |= 64;
      const o5 = new Uint8Array(d3.subarray(0, 32));
      (0, wipe_1.wipe)(d3);
      return o5;
    }
    exports.convertSecretKeyToX25519 = convertSecretKeyToX25519;
  }
});

// node_modules/@walletconnect/environment/dist/cjs/crypto.js
var require_crypto = __commonJS({
  "node_modules/@walletconnect/environment/dist/cjs/crypto.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isBrowserCryptoAvailable = exports.getSubtleCrypto = exports.getBrowerCrypto = void 0;
    function getBrowerCrypto() {
      return (global === null || global === void 0 ? void 0 : global.crypto) || (global === null || global === void 0 ? void 0 : global.msCrypto) || {};
    }
    exports.getBrowerCrypto = getBrowerCrypto;
    function getSubtleCrypto() {
      const browserCrypto = getBrowerCrypto();
      return browserCrypto.subtle || browserCrypto.webkitSubtle;
    }
    exports.getSubtleCrypto = getSubtleCrypto;
    function isBrowserCryptoAvailable() {
      return !!getBrowerCrypto() && !!getSubtleCrypto();
    }
    exports.isBrowserCryptoAvailable = isBrowserCryptoAvailable;
  }
});

// node_modules/@walletconnect/environment/dist/cjs/env.js
var require_env = __commonJS({
  "node_modules/@walletconnect/environment/dist/cjs/env.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isBrowser = exports.isNode = exports.isReactNative = void 0;
    function isReactNative() {
      return typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative";
    }
    exports.isReactNative = isReactNative;
    function isNode2() {
      return typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined";
    }
    exports.isNode = isNode2;
    function isBrowser() {
      return !isReactNative() && !isNode2();
    }
    exports.isBrowser = isBrowser;
  }
});

// node_modules/@walletconnect/environment/dist/cjs/index.js
var require_cjs4 = __commonJS({
  "node_modules/@walletconnect/environment/dist/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_crypto(), exports);
    tslib_1.__exportStar(require_env(), exports);
  }
});

// node_modules/ws/browser.js
var require_browser = __commonJS({
  "node_modules/ws/browser.js"(exports, module) {
    "use strict";
    module.exports = function() {
      throw new Error(
        "ws does not work in the browser. Browser clients must use the native WebSocket object"
      );
    };
  }
});

// node_modules/lodash.isequal/index.js
var require_lodash = __commonJS({
  "node_modules/lodash.isequal/index.js"(exports, module) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var asyncTag = "[object AsyncFunction]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var nullTag = "[object Null]";
    var objectTag = "[object Object]";
    var promiseTag = "[object Promise]";
    var proxyTag = "[object Proxy]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var undefinedTag = "[object Undefined]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e2) {
      }
    }();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function arrayFilter(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    function arraySome(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
    function baseTimes(n4, iteratee) {
      var index = -1, result = Array(n4);
      while (++index < n4) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    function setToArray(set2) {
      var index = -1, result = Array(set2.size);
      set2.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var nativeObjectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer2 = moduleExports ? root.Buffer : void 0;
    var Symbol2 = root.Symbol;
    var Uint8Array2 = root.Uint8Array;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var splice = arrayProto.splice;
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    var nativeGetSymbols = Object.getOwnPropertySymbols;
    var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
    var nativeKeys = overArg(Object.keys, Object);
    var DataView2 = getNative(root, "DataView");
    var Map2 = getNative(root, "Map");
    var Promise2 = getNative(root, "Promise");
    var Set2 = getNative(root, "Set");
    var WeakMap = getNative(root, "WeakMap");
    var nativeCreate = getNative(Object, "create");
    var dataViewCtorString = toSource(DataView2);
    var mapCtorString = toSource(Map2);
    var promiseCtorString = toSource(Promise2);
    var setCtorString = toSource(Set2);
    var weakMapCtorString = toSource(WeakMap);
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function Hash(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      var data = getMapData(this, key), size = data.size;
      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(values) {
      var index = -1, length = values == null ? 0 : values.length;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    function stackGet(key) {
      return this.__data__.get(key);
    }
    function stackHas(key) {
      return this.__data__.has(key);
    }
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;
      var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
          stack || (stack = new Stack());
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack());
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      var stacked = stack.get(array);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
      stack.set(array, other);
      stack.set(other, array);
      while (++index < arrLength) {
        var arrValue = array[index], othValue = other[index];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== void 0) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        if (seen) {
          if (!arraySome(other, function(othValue2, othIndex) {
            if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          result = false;
          break;
        }
      }
      stack["delete"](array);
      stack["delete"](other);
      return result;
    }
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;
        case arrayBufferTag:
          if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
            return false;
          }
          return true;
        case boolTag:
        case dateTag:
        case numberTag:
          return eq(+object, +other);
        case errorTag:
          return object.name == other.name && object.message == other.message;
        case regexpTag:
        case stringTag:
          return object == other + "";
        case mapTag:
          var convert = mapToArray;
        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);
          if (object.size != other.size && !isPartial) {
            return false;
          }
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack["delete"](object);
          return result;
        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var stacked = stack.get(object);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);
      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key], othValue = other[key];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
        }
        if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == "constructor");
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor, othCtor = other.constructor;
        if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack["delete"](object);
      stack["delete"](other);
      return result;
    }
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys2, getSymbols);
    }
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e2) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };
    var getTag = baseGetTag;
    if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
      getTag = function(value) {
        var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      };
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e2) {
        }
        try {
          return func + "";
        } catch (e2) {
        }
      }
      return "";
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    var isArguments = baseIsArguments(/* @__PURE__ */ function() {
      return arguments;
    }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    var isBuffer = nativeIsBuffer || stubFalse;
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    function keys2(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    function stubArray() {
      return [];
    }
    function stubFalse() {
      return false;
    }
    module.exports = isEqual;
  }
});

// node_modules/unfetch/dist/unfetch.module.js
var unfetch_module_exports = {};
__export(unfetch_module_exports, {
  default: () => unfetch_module_default
});
function unfetch_module_default(e2, n4) {
  return n4 = n4 || {}, new Promise(function(t, r3) {
    var s2 = new XMLHttpRequest(), o5 = [], u4 = [], i3 = {}, a4 = function() {
      return { ok: 2 == (s2.status / 100 | 0), statusText: s2.statusText, status: s2.status, url: s2.responseURL, text: function() {
        return Promise.resolve(s2.responseText);
      }, json: function() {
        return Promise.resolve(s2.responseText).then(JSON.parse);
      }, blob: function() {
        return Promise.resolve(new Blob([s2.response]));
      }, clone: a4, headers: { keys: function() {
        return o5;
      }, entries: function() {
        return u4;
      }, get: function(e3) {
        return i3[e3.toLowerCase()];
      }, has: function(e3) {
        return e3.toLowerCase() in i3;
      } } };
    };
    for (var l4 in s2.open(n4.method || "get", e2, true), s2.onload = function() {
      s2.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function(e3, n5, t2) {
        o5.push(n5 = n5.toLowerCase()), u4.push([n5, t2]), i3[n5] = i3[n5] ? i3[n5] + "," + t2 : t2;
      }), t(a4());
    }, s2.onerror = r3, s2.withCredentials = "include" == n4.credentials, n4.headers) s2.setRequestHeader(l4, n4.headers[l4]);
    s2.send(n4.body || null);
  });
}
var init_unfetch_module = __esm({
  "node_modules/unfetch/dist/unfetch.module.js"() {
  }
});

// node_modules/isomorphic-unfetch/browser.js
var require_browser2 = __commonJS({
  "node_modules/isomorphic-unfetch/browser.js"(exports, module) {
    module.exports = self.fetch || (self.fetch = (init_unfetch_module(), __toCommonJS(unfetch_module_exports)).default || (init_unfetch_module(), __toCommonJS(unfetch_module_exports)));
  }
});

// node_modules/@walletconnect/jsonrpc-http-connection/node_modules/cross-fetch/dist/browser-ponyfill.js
var require_browser_ponyfill = __commonJS({
  "node_modules/@walletconnect/jsonrpc-http-connection/node_modules/cross-fetch/dist/browser-ponyfill.js"(exports, module) {
    var global2 = typeof self !== "undefined" ? self : exports;
    var __self__ = function() {
      function F() {
        this.fetch = false;
        this.DOMException = global2.DOMException;
      }
      F.prototype = global2;
      return new F();
    }();
    (function(self2) {
      var irrelevant = function(exports2) {
        var support = {
          searchParams: "URLSearchParams" in self2,
          iterable: "Symbol" in self2 && "iterator" in Symbol,
          blob: "FileReader" in self2 && "Blob" in self2 && function() {
            try {
              new Blob();
              return true;
            } catch (e2) {
              return false;
            }
          }(),
          formData: "FormData" in self2,
          arrayBuffer: "ArrayBuffer" in self2
        };
        function isDataView(obj) {
          return obj && DataView.prototype.isPrototypeOf(obj);
        }
        if (support.arrayBuffer) {
          var viewClasses = [
            "[object Int8Array]",
            "[object Uint8Array]",
            "[object Uint8ClampedArray]",
            "[object Int16Array]",
            "[object Uint16Array]",
            "[object Int32Array]",
            "[object Uint32Array]",
            "[object Float32Array]",
            "[object Float64Array]"
          ];
          var isArrayBufferView = ArrayBuffer.isView || function(obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
          };
        }
        function normalizeName(name) {
          if (typeof name !== "string") {
            name = String(name);
          }
          if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
            throw new TypeError("Invalid character in header field name");
          }
          return name.toLowerCase();
        }
        function normalizeValue(value) {
          if (typeof value !== "string") {
            value = String(value);
          }
          return value;
        }
        function iteratorFor(items) {
          var iterator = {
            next: function() {
              var value = items.shift();
              return { done: value === void 0, value };
            }
          };
          if (support.iterable) {
            iterator[Symbol.iterator] = function() {
              return iterator;
            };
          }
          return iterator;
        }
        function Headers(headers) {
          this.map = {};
          if (headers instanceof Headers) {
            headers.forEach(function(value, name) {
              this.append(name, value);
            }, this);
          } else if (Array.isArray(headers)) {
            headers.forEach(function(header) {
              this.append(header[0], header[1]);
            }, this);
          } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function(name) {
              this.append(name, headers[name]);
            }, this);
          }
        }
        Headers.prototype.append = function(name, value) {
          name = normalizeName(name);
          value = normalizeValue(value);
          var oldValue = this.map[name];
          this.map[name] = oldValue ? oldValue + ", " + value : value;
        };
        Headers.prototype["delete"] = function(name) {
          delete this.map[normalizeName(name)];
        };
        Headers.prototype.get = function(name) {
          name = normalizeName(name);
          return this.has(name) ? this.map[name] : null;
        };
        Headers.prototype.has = function(name) {
          return this.map.hasOwnProperty(normalizeName(name));
        };
        Headers.prototype.set = function(name, value) {
          this.map[normalizeName(name)] = normalizeValue(value);
        };
        Headers.prototype.forEach = function(callback, thisArg) {
          for (var name in this.map) {
            if (this.map.hasOwnProperty(name)) {
              callback.call(thisArg, this.map[name], name, this);
            }
          }
        };
        Headers.prototype.keys = function() {
          var items = [];
          this.forEach(function(value, name) {
            items.push(name);
          });
          return iteratorFor(items);
        };
        Headers.prototype.values = function() {
          var items = [];
          this.forEach(function(value) {
            items.push(value);
          });
          return iteratorFor(items);
        };
        Headers.prototype.entries = function() {
          var items = [];
          this.forEach(function(value, name) {
            items.push([name, value]);
          });
          return iteratorFor(items);
        };
        if (support.iterable) {
          Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
        }
        function consumed(body) {
          if (body.bodyUsed) {
            return Promise.reject(new TypeError("Already read"));
          }
          body.bodyUsed = true;
        }
        function fileReaderReady(reader) {
          return new Promise(function(resolve, reject) {
            reader.onload = function() {
              resolve(reader.result);
            };
            reader.onerror = function() {
              reject(reader.error);
            };
          });
        }
        function readBlobAsArrayBuffer(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsArrayBuffer(blob);
          return promise;
        }
        function readBlobAsText(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsText(blob);
          return promise;
        }
        function readArrayBufferAsText(buf) {
          var view = new Uint8Array(buf);
          var chars = new Array(view.length);
          for (var i3 = 0; i3 < view.length; i3++) {
            chars[i3] = String.fromCharCode(view[i3]);
          }
          return chars.join("");
        }
        function bufferClone(buf) {
          if (buf.slice) {
            return buf.slice(0);
          } else {
            var view = new Uint8Array(buf.byteLength);
            view.set(new Uint8Array(buf));
            return view.buffer;
          }
        }
        function Body() {
          this.bodyUsed = false;
          this._initBody = function(body) {
            this._bodyInit = body;
            if (!body) {
              this._bodyText = "";
            } else if (typeof body === "string") {
              this._bodyText = body;
            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
              this._bodyBlob = body;
            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
              this._bodyFormData = body;
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this._bodyText = body.toString();
            } else if (support.arrayBuffer && support.blob && isDataView(body)) {
              this._bodyArrayBuffer = bufferClone(body.buffer);
              this._bodyInit = new Blob([this._bodyArrayBuffer]);
            } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
              this._bodyArrayBuffer = bufferClone(body);
            } else {
              this._bodyText = body = Object.prototype.toString.call(body);
            }
            if (!this.headers.get("content-type")) {
              if (typeof body === "string") {
                this.headers.set("content-type", "text/plain;charset=UTF-8");
              } else if (this._bodyBlob && this._bodyBlob.type) {
                this.headers.set("content-type", this._bodyBlob.type);
              } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
              }
            }
          };
          if (support.blob) {
            this.blob = function() {
              var rejected = consumed(this);
              if (rejected) {
                return rejected;
              }
              if (this._bodyBlob) {
                return Promise.resolve(this._bodyBlob);
              } else if (this._bodyArrayBuffer) {
                return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              } else if (this._bodyFormData) {
                throw new Error("could not read FormData body as blob");
              } else {
                return Promise.resolve(new Blob([this._bodyText]));
              }
            };
            this.arrayBuffer = function() {
              if (this._bodyArrayBuffer) {
                return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
              } else {
                return this.blob().then(readBlobAsArrayBuffer);
              }
            };
          }
          this.text = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return readBlobAsText(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
            } else if (this._bodyFormData) {
              throw new Error("could not read FormData body as text");
            } else {
              return Promise.resolve(this._bodyText);
            }
          };
          if (support.formData) {
            this.formData = function() {
              return this.text().then(decode);
            };
          }
          this.json = function() {
            return this.text().then(JSON.parse);
          };
          return this;
        }
        var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
        function normalizeMethod(method) {
          var upcased = method.toUpperCase();
          return methods.indexOf(upcased) > -1 ? upcased : method;
        }
        function Request(input, options) {
          options = options || {};
          var body = options.body;
          if (input instanceof Request) {
            if (input.bodyUsed) {
              throw new TypeError("Already read");
            }
            this.url = input.url;
            this.credentials = input.credentials;
            if (!options.headers) {
              this.headers = new Headers(input.headers);
            }
            this.method = input.method;
            this.mode = input.mode;
            this.signal = input.signal;
            if (!body && input._bodyInit != null) {
              body = input._bodyInit;
              input.bodyUsed = true;
            }
          } else {
            this.url = String(input);
          }
          this.credentials = options.credentials || this.credentials || "same-origin";
          if (options.headers || !this.headers) {
            this.headers = new Headers(options.headers);
          }
          this.method = normalizeMethod(options.method || this.method || "GET");
          this.mode = options.mode || this.mode || null;
          this.signal = options.signal || this.signal;
          this.referrer = null;
          if ((this.method === "GET" || this.method === "HEAD") && body) {
            throw new TypeError("Body not allowed for GET or HEAD requests");
          }
          this._initBody(body);
        }
        Request.prototype.clone = function() {
          return new Request(this, { body: this._bodyInit });
        };
        function decode(body) {
          var form = new FormData();
          body.trim().split("&").forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split("=");
              var name = split.shift().replace(/\+/g, " ");
              var value = split.join("=").replace(/\+/g, " ");
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
          return form;
        }
        function parseHeaders(rawHeaders) {
          var headers = new Headers();
          var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
          preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
            var parts = line.split(":");
            var key = parts.shift().trim();
            if (key) {
              var value = parts.join(":").trim();
              headers.append(key, value);
            }
          });
          return headers;
        }
        Body.call(Request.prototype);
        function Response(bodyInit, options) {
          if (!options) {
            options = {};
          }
          this.type = "default";
          this.status = options.status === void 0 ? 200 : options.status;
          this.ok = this.status >= 200 && this.status < 300;
          this.statusText = "statusText" in options ? options.statusText : "OK";
          this.headers = new Headers(options.headers);
          this.url = options.url || "";
          this._initBody(bodyInit);
        }
        Body.call(Response.prototype);
        Response.prototype.clone = function() {
          return new Response(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
          });
        };
        Response.error = function() {
          var response = new Response(null, { status: 0, statusText: "" });
          response.type = "error";
          return response;
        };
        var redirectStatuses = [301, 302, 303, 307, 308];
        Response.redirect = function(url, status) {
          if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError("Invalid status code");
          }
          return new Response(null, { status, headers: { location: url } });
        };
        exports2.DOMException = self2.DOMException;
        try {
          new exports2.DOMException();
        } catch (err) {
          exports2.DOMException = function(message, name) {
            this.message = message;
            this.name = name;
            var error = Error(message);
            this.stack = error.stack;
          };
          exports2.DOMException.prototype = Object.create(Error.prototype);
          exports2.DOMException.prototype.constructor = exports2.DOMException;
        }
        function fetch2(input, init) {
          return new Promise(function(resolve, reject) {
            var request = new Request(input, init);
            if (request.signal && request.signal.aborted) {
              return reject(new exports2.DOMException("Aborted", "AbortError"));
            }
            var xhr = new XMLHttpRequest();
            function abortXhr() {
              xhr.abort();
            }
            xhr.onload = function() {
              var options = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseHeaders(xhr.getAllResponseHeaders() || "")
              };
              options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
              var body = "response" in xhr ? xhr.response : xhr.responseText;
              resolve(new Response(body, options));
            };
            xhr.onerror = function() {
              reject(new TypeError("Network request failed"));
            };
            xhr.ontimeout = function() {
              reject(new TypeError("Network request failed"));
            };
            xhr.onabort = function() {
              reject(new exports2.DOMException("Aborted", "AbortError"));
            };
            xhr.open(request.method, request.url, true);
            if (request.credentials === "include") {
              xhr.withCredentials = true;
            } else if (request.credentials === "omit") {
              xhr.withCredentials = false;
            }
            if ("responseType" in xhr && support.blob) {
              xhr.responseType = "blob";
            }
            request.headers.forEach(function(value, name) {
              xhr.setRequestHeader(name, value);
            });
            if (request.signal) {
              request.signal.addEventListener("abort", abortXhr);
              xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                  request.signal.removeEventListener("abort", abortXhr);
                }
              };
            }
            xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
          });
        }
        fetch2.polyfill = true;
        if (!self2.fetch) {
          self2.fetch = fetch2;
          self2.Headers = Headers;
          self2.Request = Request;
          self2.Response = Response;
        }
        exports2.Headers = Headers;
        exports2.Request = Request;
        exports2.Response = Response;
        exports2.fetch = fetch2;
        Object.defineProperty(exports2, "__esModule", { value: true });
        return exports2;
      }({});
    })(__self__);
    __self__.fetch.ponyfill = true;
    delete __self__.fetch.polyfill;
    var ctx = __self__;
    exports = ctx.fetch;
    exports.default = ctx.fetch;
    exports.fetch = ctx.fetch;
    exports.Headers = ctx.Headers;
    exports.Request = ctx.Request;
    exports.Response = ctx.Response;
    module.exports = exports;
  }
});

// node_modules/@walletconnect/ethereum-provider/dist/index.es.js
var import_events11 = __toESM(require_events());

// node_modules/@walletconnect/utils/dist/index.es.js
var import_time = __toESM(require_cjs());
var import_window_getters = __toESM(require_cjs2());
var import_window_metadata = __toESM(require_cjs3());
var Nr = __toESM(require_query_string());
var import_chacha20poly1305 = __toESM(require_chacha20poly1305());
var import_hkdf = __toESM(require_hkdf());
var import_random = __toESM(require_random());
var import_sha256 = __toESM(require_sha256());
var cn = __toESM(require_x25519());
var Ir = ":";
function dn(e2) {
  const [t, r3] = e2.split(Ir);
  return { namespace: t, reference: r3 };
}
function zo(e2, t = []) {
  const r3 = [];
  return Object.keys(e2).forEach((i3) => {
    if (t.length && !t.includes(i3)) return;
    const n4 = e2[i3];
    r3.push(...n4.accounts);
  }), r3;
}
function _r(e2, t) {
  return e2.includes(":") ? [e2] : t.chains || [];
}
var Qo = Object.defineProperty;
var bn = Object.getOwnPropertySymbols;
var Jo = Object.prototype.hasOwnProperty;
var Go = Object.prototype.propertyIsEnumerable;
var yn = (e2, t, r3) => t in e2 ? Qo(e2, t, { enumerable: true, configurable: true, writable: true, value: r3 }) : e2[t] = r3;
var wn = (e2, t) => {
  for (var r3 in t || (t = {})) Jo.call(t, r3) && yn(e2, r3, t[r3]);
  if (bn) for (var r3 of bn(t)) Go.call(t, r3) && yn(e2, r3, t[r3]);
  return e2;
};
var xn = "ReactNative";
var qt = { reactNative: "react-native", node: "node", browser: "browser", unknown: "unknown" };
var En = "js";
function pi() {
  return typeof process < "u" && typeof process.versions < "u" && typeof process.versions.node < "u";
}
function er() {
  return !(0, import_window_getters.getDocument)() && !!(0, import_window_getters.getNavigator)() && navigator.product === xn;
}
function pr() {
  return !pi() && !!(0, import_window_getters.getNavigator)() && !!(0, import_window_getters.getDocument)();
}
function We() {
  return er() ? qt.reactNative : pi() ? qt.node : pr() ? qt.browser : qt.unknown;
}
function Wo() {
  var e2;
  try {
    return er() && typeof global < "u" && typeof (global == null ? void 0 : global.Application) < "u" ? (e2 = global.Application) == null ? void 0 : e2.applicationId : void 0;
  } catch {
    return;
  }
}
function Sn(e2, t) {
  let r3 = Nr.parse(e2);
  return r3 = wn(wn({}, r3), t), e2 = Nr.stringify(r3), e2;
}
function Xo() {
  return (0, import_window_metadata.getWindowMetadata)() || { name: "", description: "", url: "", icons: [""] };
}
function Nn() {
  if (We() === qt.reactNative && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u") {
    const { OS: r3, Version: i3 } = global.Platform;
    return [r3, i3].join("-");
  }
  const e2 = detect();
  if (e2 === null) return "unknown";
  const t = e2.os ? e2.os.replace(" ", "").toLowerCase() : "unknown";
  return e2.type === "browser" ? [t, e2.name, e2.version].join("-") : [t, e2.version].join("-");
}
function In() {
  var e2;
  const t = We();
  return t === qt.browser ? [t, ((e2 = (0, import_window_getters.getLocation)()) == null ? void 0 : e2.host) || "unknown"].join(":") : t;
}
function _n(e2, t, r3) {
  const i3 = Nn(), n4 = In();
  return [[e2, t].join("-"), [En, r3].join("-"), i3, n4].join("/");
}
function $o({ protocol: e2, version: t, relayUrl: r3, sdkVersion: i3, auth: n4, projectId: o5, useOnCloseEvent: h4, bundleId: p4 }) {
  const b4 = r3.split("?"), m3 = _n(e2, t, i3), w4 = { auth: n4, ua: m3, projectId: o5, useOnCloseEvent: h4 || void 0, origin: p4 || void 0 }, y8 = Sn(b4[1] || "", w4);
  return b4[0] + "?" + y8;
}
function _e(e2, t) {
  return e2.filter((r3) => t.includes(r3)).length === e2.length;
}
function i0(e2) {
  return Object.fromEntries(e2.entries());
}
function n0(e2) {
  return new Map(Object.entries(e2));
}
function a0(e2 = import_time.FIVE_MINUTES, t) {
  const r3 = (0, import_time.toMiliseconds)(e2 || import_time.FIVE_MINUTES);
  let i3, n4, o5;
  return { resolve: (h4) => {
    o5 && i3 && (clearTimeout(o5), i3(h4));
  }, reject: (h4) => {
    o5 && n4 && (clearTimeout(o5), n4(h4));
  }, done: () => new Promise((h4, p4) => {
    o5 = setTimeout(() => {
      p4(new Error(t));
    }, r3), i3 = h4, n4 = p4;
  }) };
}
function u0(e2, t, r3) {
  return new Promise(async (i3, n4) => {
    const o5 = setTimeout(() => n4(new Error(r3)), t);
    try {
      const h4 = await e2;
      i3(h4);
    } catch (h4) {
      n4(h4);
    }
    clearTimeout(o5);
  });
}
function vi(e2, t) {
  if (typeof t == "string" && t.startsWith(`${e2}:`)) return t;
  if (e2.toLowerCase() === "topic") {
    if (typeof t != "string") throw new Error('Value must be "string" for expirer target type: topic');
    return `topic:${t}`;
  } else if (e2.toLowerCase() === "id") {
    if (typeof t != "number") throw new Error('Value must be "number" for expirer target type: id');
    return `id:${t}`;
  }
  throw new Error(`Unknown expirer target type: ${e2}`);
}
function h0(e2) {
  return vi("topic", e2);
}
function c0(e2) {
  return vi("id", e2);
}
function l0(e2) {
  const [t, r3] = e2.split(":"), i3 = { id: void 0, topic: void 0 };
  if (t === "topic" && typeof r3 == "string") i3.topic = r3;
  else if (t === "id" && Number.isInteger(Number(r3))) i3.id = Number(r3);
  else throw new Error(`Invalid target, expected id:number or topic:string, got ${t}:${r3}`);
  return i3;
}
function d0(e2, t) {
  return (0, import_time.fromMiliseconds)((t || Date.now()) + (0, import_time.toMiliseconds)(e2));
}
function p0(e2) {
  return Date.now() >= (0, import_time.toMiliseconds)(e2);
}
function v0(e2, t) {
  return `${e2}${t ? `:${t}` : ""}`;
}
function ge(e2 = [], t = []) {
  return [.../* @__PURE__ */ new Set([...e2, ...t])];
}
async function m0({ id: e2, topic: t, wcDeepLink: r3 }) {
  try {
    if (!r3) return;
    const i3 = typeof r3 == "string" ? JSON.parse(r3) : r3;
    let n4 = i3 == null ? void 0 : i3.href;
    if (typeof n4 != "string") return;
    n4.endsWith("/") && (n4 = n4.slice(0, -1));
    const o5 = `${n4}/wc?requestId=${e2}&sessionTopic=${t}`, h4 = We();
    h4 === qt.browser ? o5.startsWith("https://") || o5.startsWith("http://") ? window.open(o5, "_blank", "noreferrer noopener") : window.open(o5, "_self", "noreferrer noopener") : h4 === qt.reactNative && typeof (global == null ? void 0 : global.Linking) < "u" && await global.Linking.openURL(o5);
  } catch (i3) {
    console.error(i3);
  }
}
async function g0(e2, t) {
  try {
    return await e2.getItem(t) || (pr() ? localStorage.getItem(t) : void 0);
  } catch (r3) {
    console.error(r3);
  }
}
var On = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function A0(e2) {
  var t = e2.default;
  if (typeof t == "function") {
    var r3 = function() {
      return t.apply(this, arguments);
    };
    r3.prototype = t.prototype;
  } else r3 = {};
  return Object.defineProperty(r3, "__esModule", { value: true }), Object.keys(e2).forEach(function(i3) {
    var n4 = Object.getOwnPropertyDescriptor(e2, i3);
    Object.defineProperty(r3, i3, n4.get ? n4 : { enumerable: true, get: function() {
      return e2[i3];
    } });
  }), r3;
}
var Pn = { exports: {} };
(function(e2) {
  (function() {
    var t = "input is invalid type", r3 = "finalize already called", i3 = typeof window == "object", n4 = i3 ? window : {};
    n4.JS_SHA3_NO_WINDOW && (i3 = false);
    var o5 = !i3 && typeof self == "object", h4 = !n4.JS_SHA3_NO_NODE_JS && typeof process == "object" && process.versions && process.versions.node;
    h4 ? n4 = On : o5 && (n4 = self);
    var p4 = !n4.JS_SHA3_NO_COMMON_JS && true && e2.exports, b4 = !n4.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer < "u", m3 = "0123456789abcdef".split(""), w4 = [31, 7936, 2031616, 520093696], y8 = [4, 1024, 262144, 67108864], S4 = [1, 256, 65536, 16777216], I2 = [6, 1536, 393216, 100663296], N3 = [0, 8, 16, 24], C4 = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649, 0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0, 2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771, 2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648, 2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648], F = [224, 256, 384, 512], U4 = [128, 256], J2 = ["hex", "buffer", "arrayBuffer", "array", "digest"], Bt3 = { 128: 168, 256: 136 };
    (n4.JS_SHA3_NO_NODE_JS || !Array.isArray) && (Array.isArray = function(u4) {
      return Object.prototype.toString.call(u4) === "[object Array]";
    }), b4 && (n4.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView) && (ArrayBuffer.isView = function(u4) {
      return typeof u4 == "object" && u4.buffer && u4.buffer.constructor === ArrayBuffer;
    });
    for (var G = function(u4, E7, _2) {
      return function(B2) {
        return new s2(u4, E7, u4).update(B2)[_2]();
      };
    }, H = function(u4, E7, _2) {
      return function(B2, R2) {
        return new s2(u4, E7, R2).update(B2)[_2]();
      };
    }, z5 = function(u4, E7, _2) {
      return function(B2, R2, T3, P2) {
        return f5["cshake" + u4].update(B2, R2, T3, P2)[_2]();
      };
    }, Pt2 = function(u4, E7, _2) {
      return function(B2, R2, T3, P2) {
        return f5["kmac" + u4].update(B2, R2, T3, P2)[_2]();
      };
    }, W2 = function(u4, E7, _2, B2) {
      for (var R2 = 0; R2 < J2.length; ++R2) {
        var T3 = J2[R2];
        u4[T3] = E7(_2, B2, T3);
      }
      return u4;
    }, Rt2 = function(u4, E7) {
      var _2 = G(u4, E7, "hex");
      return _2.create = function() {
        return new s2(u4, E7, u4);
      }, _2.update = function(B2) {
        return _2.create().update(B2);
      }, W2(_2, G, u4, E7);
    }, Yt3 = function(u4, E7) {
      var _2 = H(u4, E7, "hex");
      return _2.create = function(B2) {
        return new s2(u4, E7, B2);
      }, _2.update = function(B2, R2) {
        return _2.create(R2).update(B2);
      }, W2(_2, H, u4, E7);
    }, Y = function(u4, E7) {
      var _2 = Bt3[u4], B2 = z5(u4, E7, "hex");
      return B2.create = function(R2, T3, P2) {
        return !T3 && !P2 ? f5["shake" + u4].create(R2) : new s2(u4, E7, R2).bytepad([T3, P2], _2);
      }, B2.update = function(R2, T3, P2, O4) {
        return B2.create(T3, P2, O4).update(R2);
      }, W2(B2, z5, u4, E7);
    }, Vt3 = function(u4, E7) {
      var _2 = Bt3[u4], B2 = Pt2(u4, E7, "hex");
      return B2.create = function(R2, T3, P2) {
        return new v4(u4, E7, T3).bytepad(["KMAC", P2], _2).bytepad([R2], _2);
      }, B2.update = function(R2, T3, P2, O4) {
        return B2.create(R2, P2, O4).update(T3);
      }, W2(B2, Pt2, u4, E7);
    }, A4 = [{ name: "keccak", padding: S4, bits: F, createMethod: Rt2 }, { name: "sha3", padding: I2, bits: F, createMethod: Rt2 }, { name: "shake", padding: w4, bits: U4, createMethod: Yt3 }, { name: "cshake", padding: y8, bits: U4, createMethod: Y }, { name: "kmac", padding: y8, bits: U4, createMethod: Vt3 }], f5 = {}, a4 = [], c5 = 0; c5 < A4.length; ++c5) for (var d3 = A4[c5], g4 = d3.bits, x2 = 0; x2 < g4.length; ++x2) {
      var M4 = d3.name + "_" + g4[x2];
      if (a4.push(M4), f5[M4] = d3.createMethod(g4[x2], d3.padding), d3.name !== "sha3") {
        var l4 = d3.name + g4[x2];
        a4.push(l4), f5[l4] = f5[M4];
      }
    }
    function s2(u4, E7, _2) {
      this.blocks = [], this.s = [], this.padding = E7, this.outputBits = _2, this.reset = true, this.finalized = false, this.block = 0, this.start = 0, this.blockCount = 1600 - (u4 << 1) >> 5, this.byteCount = this.blockCount << 2, this.outputBlocks = _2 >> 5, this.extraBytes = (_2 & 31) >> 3;
      for (var B2 = 0; B2 < 50; ++B2) this.s[B2] = 0;
    }
    s2.prototype.update = function(u4) {
      if (this.finalized) throw new Error(r3);
      var E7, _2 = typeof u4;
      if (_2 !== "string") {
        if (_2 === "object") {
          if (u4 === null) throw new Error(t);
          if (b4 && u4.constructor === ArrayBuffer) u4 = new Uint8Array(u4);
          else if (!Array.isArray(u4) && (!b4 || !ArrayBuffer.isView(u4))) throw new Error(t);
        } else throw new Error(t);
        E7 = true;
      }
      for (var B2 = this.blocks, R2 = this.byteCount, T3 = u4.length, P2 = this.blockCount, O4 = 0, Ct4 = this.s, D4, q3; O4 < T3; ) {
        if (this.reset) for (this.reset = false, B2[0] = this.block, D4 = 1; D4 < P2 + 1; ++D4) B2[D4] = 0;
        if (E7) for (D4 = this.start; O4 < T3 && D4 < R2; ++O4) B2[D4 >> 2] |= u4[O4] << N3[D4++ & 3];
        else for (D4 = this.start; O4 < T3 && D4 < R2; ++O4) q3 = u4.charCodeAt(O4), q3 < 128 ? B2[D4 >> 2] |= q3 << N3[D4++ & 3] : q3 < 2048 ? (B2[D4 >> 2] |= (192 | q3 >> 6) << N3[D4++ & 3], B2[D4 >> 2] |= (128 | q3 & 63) << N3[D4++ & 3]) : q3 < 55296 || q3 >= 57344 ? (B2[D4 >> 2] |= (224 | q3 >> 12) << N3[D4++ & 3], B2[D4 >> 2] |= (128 | q3 >> 6 & 63) << N3[D4++ & 3], B2[D4 >> 2] |= (128 | q3 & 63) << N3[D4++ & 3]) : (q3 = 65536 + ((q3 & 1023) << 10 | u4.charCodeAt(++O4) & 1023), B2[D4 >> 2] |= (240 | q3 >> 18) << N3[D4++ & 3], B2[D4 >> 2] |= (128 | q3 >> 12 & 63) << N3[D4++ & 3], B2[D4 >> 2] |= (128 | q3 >> 6 & 63) << N3[D4++ & 3], B2[D4 >> 2] |= (128 | q3 & 63) << N3[D4++ & 3]);
        if (this.lastByteIndex = D4, D4 >= R2) {
          for (this.start = D4 - R2, this.block = B2[P2], D4 = 0; D4 < P2; ++D4) Ct4[D4] ^= B2[D4];
          k3(Ct4), this.reset = true;
        } else this.start = D4;
      }
      return this;
    }, s2.prototype.encode = function(u4, E7) {
      var _2 = u4 & 255, B2 = 1, R2 = [_2];
      for (u4 = u4 >> 8, _2 = u4 & 255; _2 > 0; ) R2.unshift(_2), u4 = u4 >> 8, _2 = u4 & 255, ++B2;
      return E7 ? R2.push(B2) : R2.unshift(B2), this.update(R2), R2.length;
    }, s2.prototype.encodeString = function(u4) {
      var E7, _2 = typeof u4;
      if (_2 !== "string") {
        if (_2 === "object") {
          if (u4 === null) throw new Error(t);
          if (b4 && u4.constructor === ArrayBuffer) u4 = new Uint8Array(u4);
          else if (!Array.isArray(u4) && (!b4 || !ArrayBuffer.isView(u4))) throw new Error(t);
        } else throw new Error(t);
        E7 = true;
      }
      var B2 = 0, R2 = u4.length;
      if (E7) B2 = R2;
      else for (var T3 = 0; T3 < u4.length; ++T3) {
        var P2 = u4.charCodeAt(T3);
        P2 < 128 ? B2 += 1 : P2 < 2048 ? B2 += 2 : P2 < 55296 || P2 >= 57344 ? B2 += 3 : (P2 = 65536 + ((P2 & 1023) << 10 | u4.charCodeAt(++T3) & 1023), B2 += 4);
      }
      return B2 += this.encode(B2 * 8), this.update(u4), B2;
    }, s2.prototype.bytepad = function(u4, E7) {
      for (var _2 = this.encode(E7), B2 = 0; B2 < u4.length; ++B2) _2 += this.encodeString(u4[B2]);
      var R2 = E7 - _2 % E7, T3 = [];
      return T3.length = R2, this.update(T3), this;
    }, s2.prototype.finalize = function() {
      if (!this.finalized) {
        this.finalized = true;
        var u4 = this.blocks, E7 = this.lastByteIndex, _2 = this.blockCount, B2 = this.s;
        if (u4[E7 >> 2] |= this.padding[E7 & 3], this.lastByteIndex === this.byteCount) for (u4[0] = u4[_2], E7 = 1; E7 < _2 + 1; ++E7) u4[E7] = 0;
        for (u4[_2 - 1] |= 2147483648, E7 = 0; E7 < _2; ++E7) B2[E7] ^= u4[E7];
        k3(B2);
      }
    }, s2.prototype.toString = s2.prototype.hex = function() {
      this.finalize();
      for (var u4 = this.blockCount, E7 = this.s, _2 = this.outputBlocks, B2 = this.extraBytes, R2 = 0, T3 = 0, P2 = "", O4; T3 < _2; ) {
        for (R2 = 0; R2 < u4 && T3 < _2; ++R2, ++T3) O4 = E7[R2], P2 += m3[O4 >> 4 & 15] + m3[O4 & 15] + m3[O4 >> 12 & 15] + m3[O4 >> 8 & 15] + m3[O4 >> 20 & 15] + m3[O4 >> 16 & 15] + m3[O4 >> 28 & 15] + m3[O4 >> 24 & 15];
        T3 % u4 === 0 && (k3(E7), R2 = 0);
      }
      return B2 && (O4 = E7[R2], P2 += m3[O4 >> 4 & 15] + m3[O4 & 15], B2 > 1 && (P2 += m3[O4 >> 12 & 15] + m3[O4 >> 8 & 15]), B2 > 2 && (P2 += m3[O4 >> 20 & 15] + m3[O4 >> 16 & 15])), P2;
    }, s2.prototype.arrayBuffer = function() {
      this.finalize();
      var u4 = this.blockCount, E7 = this.s, _2 = this.outputBlocks, B2 = this.extraBytes, R2 = 0, T3 = 0, P2 = this.outputBits >> 3, O4;
      B2 ? O4 = new ArrayBuffer(_2 + 1 << 2) : O4 = new ArrayBuffer(P2);
      for (var Ct4 = new Uint32Array(O4); T3 < _2; ) {
        for (R2 = 0; R2 < u4 && T3 < _2; ++R2, ++T3) Ct4[T3] = E7[R2];
        T3 % u4 === 0 && k3(E7);
      }
      return B2 && (Ct4[R2] = E7[R2], O4 = O4.slice(0, P2)), O4;
    }, s2.prototype.buffer = s2.prototype.arrayBuffer, s2.prototype.digest = s2.prototype.array = function() {
      this.finalize();
      for (var u4 = this.blockCount, E7 = this.s, _2 = this.outputBlocks, B2 = this.extraBytes, R2 = 0, T3 = 0, P2 = [], O4, Ct4; T3 < _2; ) {
        for (R2 = 0; R2 < u4 && T3 < _2; ++R2, ++T3) O4 = T3 << 2, Ct4 = E7[R2], P2[O4] = Ct4 & 255, P2[O4 + 1] = Ct4 >> 8 & 255, P2[O4 + 2] = Ct4 >> 16 & 255, P2[O4 + 3] = Ct4 >> 24 & 255;
        T3 % u4 === 0 && k3(E7);
      }
      return B2 && (O4 = T3 << 2, Ct4 = E7[R2], P2[O4] = Ct4 & 255, B2 > 1 && (P2[O4 + 1] = Ct4 >> 8 & 255), B2 > 2 && (P2[O4 + 2] = Ct4 >> 16 & 255)), P2;
    };
    function v4(u4, E7, _2) {
      s2.call(this, u4, E7, _2);
    }
    v4.prototype = new s2(), v4.prototype.finalize = function() {
      return this.encode(this.outputBits, true), s2.prototype.finalize.call(this);
    };
    var k3 = function(u4) {
      var E7, _2, B2, R2, T3, P2, O4, Ct4, D4, q3, De2, X3, Z2, Fe3, $3, tt2, Te, et2, rt2, Ue3, it2, nt2, ke3, ft3, ot2, qe2, st2, at2, Ke3, ut2, ht2, He3, ct2, lt2, ze2, dt2, pt2, Le2, vt2, mt2, je3, gt2, At2, Qe3, bt3, yt2, Je3, wt2, xt2, Ge3, Mt2, Et2, Ye3, St2, Nt2, Ve2, It2, _t2, Me3, Ee2, Se3, Ne, Ie;
      for (B2 = 0; B2 < 48; B2 += 2) R2 = u4[0] ^ u4[10] ^ u4[20] ^ u4[30] ^ u4[40], T3 = u4[1] ^ u4[11] ^ u4[21] ^ u4[31] ^ u4[41], P2 = u4[2] ^ u4[12] ^ u4[22] ^ u4[32] ^ u4[42], O4 = u4[3] ^ u4[13] ^ u4[23] ^ u4[33] ^ u4[43], Ct4 = u4[4] ^ u4[14] ^ u4[24] ^ u4[34] ^ u4[44], D4 = u4[5] ^ u4[15] ^ u4[25] ^ u4[35] ^ u4[45], q3 = u4[6] ^ u4[16] ^ u4[26] ^ u4[36] ^ u4[46], De2 = u4[7] ^ u4[17] ^ u4[27] ^ u4[37] ^ u4[47], X3 = u4[8] ^ u4[18] ^ u4[28] ^ u4[38] ^ u4[48], Z2 = u4[9] ^ u4[19] ^ u4[29] ^ u4[39] ^ u4[49], E7 = X3 ^ (P2 << 1 | O4 >>> 31), _2 = Z2 ^ (O4 << 1 | P2 >>> 31), u4[0] ^= E7, u4[1] ^= _2, u4[10] ^= E7, u4[11] ^= _2, u4[20] ^= E7, u4[21] ^= _2, u4[30] ^= E7, u4[31] ^= _2, u4[40] ^= E7, u4[41] ^= _2, E7 = R2 ^ (Ct4 << 1 | D4 >>> 31), _2 = T3 ^ (D4 << 1 | Ct4 >>> 31), u4[2] ^= E7, u4[3] ^= _2, u4[12] ^= E7, u4[13] ^= _2, u4[22] ^= E7, u4[23] ^= _2, u4[32] ^= E7, u4[33] ^= _2, u4[42] ^= E7, u4[43] ^= _2, E7 = P2 ^ (q3 << 1 | De2 >>> 31), _2 = O4 ^ (De2 << 1 | q3 >>> 31), u4[4] ^= E7, u4[5] ^= _2, u4[14] ^= E7, u4[15] ^= _2, u4[24] ^= E7, u4[25] ^= _2, u4[34] ^= E7, u4[35] ^= _2, u4[44] ^= E7, u4[45] ^= _2, E7 = Ct4 ^ (X3 << 1 | Z2 >>> 31), _2 = D4 ^ (Z2 << 1 | X3 >>> 31), u4[6] ^= E7, u4[7] ^= _2, u4[16] ^= E7, u4[17] ^= _2, u4[26] ^= E7, u4[27] ^= _2, u4[36] ^= E7, u4[37] ^= _2, u4[46] ^= E7, u4[47] ^= _2, E7 = q3 ^ (R2 << 1 | T3 >>> 31), _2 = De2 ^ (T3 << 1 | R2 >>> 31), u4[8] ^= E7, u4[9] ^= _2, u4[18] ^= E7, u4[19] ^= _2, u4[28] ^= E7, u4[29] ^= _2, u4[38] ^= E7, u4[39] ^= _2, u4[48] ^= E7, u4[49] ^= _2, Fe3 = u4[0], $3 = u4[1], yt2 = u4[11] << 4 | u4[10] >>> 28, Je3 = u4[10] << 4 | u4[11] >>> 28, at2 = u4[20] << 3 | u4[21] >>> 29, Ke3 = u4[21] << 3 | u4[20] >>> 29, Ee2 = u4[31] << 9 | u4[30] >>> 23, Se3 = u4[30] << 9 | u4[31] >>> 23, gt2 = u4[40] << 18 | u4[41] >>> 14, At2 = u4[41] << 18 | u4[40] >>> 14, lt2 = u4[2] << 1 | u4[3] >>> 31, ze2 = u4[3] << 1 | u4[2] >>> 31, tt2 = u4[13] << 12 | u4[12] >>> 20, Te = u4[12] << 12 | u4[13] >>> 20, wt2 = u4[22] << 10 | u4[23] >>> 22, xt2 = u4[23] << 10 | u4[22] >>> 22, ut2 = u4[33] << 13 | u4[32] >>> 19, ht2 = u4[32] << 13 | u4[33] >>> 19, Ne = u4[42] << 2 | u4[43] >>> 30, Ie = u4[43] << 2 | u4[42] >>> 30, St2 = u4[5] << 30 | u4[4] >>> 2, Nt2 = u4[4] << 30 | u4[5] >>> 2, dt2 = u4[14] << 6 | u4[15] >>> 26, pt2 = u4[15] << 6 | u4[14] >>> 26, et2 = u4[25] << 11 | u4[24] >>> 21, rt2 = u4[24] << 11 | u4[25] >>> 21, Ge3 = u4[34] << 15 | u4[35] >>> 17, Mt2 = u4[35] << 15 | u4[34] >>> 17, He3 = u4[45] << 29 | u4[44] >>> 3, ct2 = u4[44] << 29 | u4[45] >>> 3, ft3 = u4[6] << 28 | u4[7] >>> 4, ot2 = u4[7] << 28 | u4[6] >>> 4, Ve2 = u4[17] << 23 | u4[16] >>> 9, It2 = u4[16] << 23 | u4[17] >>> 9, Le2 = u4[26] << 25 | u4[27] >>> 7, vt2 = u4[27] << 25 | u4[26] >>> 7, Ue3 = u4[36] << 21 | u4[37] >>> 11, it2 = u4[37] << 21 | u4[36] >>> 11, Et2 = u4[47] << 24 | u4[46] >>> 8, Ye3 = u4[46] << 24 | u4[47] >>> 8, Qe3 = u4[8] << 27 | u4[9] >>> 5, bt3 = u4[9] << 27 | u4[8] >>> 5, qe2 = u4[18] << 20 | u4[19] >>> 12, st2 = u4[19] << 20 | u4[18] >>> 12, _t2 = u4[29] << 7 | u4[28] >>> 25, Me3 = u4[28] << 7 | u4[29] >>> 25, mt2 = u4[38] << 8 | u4[39] >>> 24, je3 = u4[39] << 8 | u4[38] >>> 24, nt2 = u4[48] << 14 | u4[49] >>> 18, ke3 = u4[49] << 14 | u4[48] >>> 18, u4[0] = Fe3 ^ ~tt2 & et2, u4[1] = $3 ^ ~Te & rt2, u4[10] = ft3 ^ ~qe2 & at2, u4[11] = ot2 ^ ~st2 & Ke3, u4[20] = lt2 ^ ~dt2 & Le2, u4[21] = ze2 ^ ~pt2 & vt2, u4[30] = Qe3 ^ ~yt2 & wt2, u4[31] = bt3 ^ ~Je3 & xt2, u4[40] = St2 ^ ~Ve2 & _t2, u4[41] = Nt2 ^ ~It2 & Me3, u4[2] = tt2 ^ ~et2 & Ue3, u4[3] = Te ^ ~rt2 & it2, u4[12] = qe2 ^ ~at2 & ut2, u4[13] = st2 ^ ~Ke3 & ht2, u4[22] = dt2 ^ ~Le2 & mt2, u4[23] = pt2 ^ ~vt2 & je3, u4[32] = yt2 ^ ~wt2 & Ge3, u4[33] = Je3 ^ ~xt2 & Mt2, u4[42] = Ve2 ^ ~_t2 & Ee2, u4[43] = It2 ^ ~Me3 & Se3, u4[4] = et2 ^ ~Ue3 & nt2, u4[5] = rt2 ^ ~it2 & ke3, u4[14] = at2 ^ ~ut2 & He3, u4[15] = Ke3 ^ ~ht2 & ct2, u4[24] = Le2 ^ ~mt2 & gt2, u4[25] = vt2 ^ ~je3 & At2, u4[34] = wt2 ^ ~Ge3 & Et2, u4[35] = xt2 ^ ~Mt2 & Ye3, u4[44] = _t2 ^ ~Ee2 & Ne, u4[45] = Me3 ^ ~Se3 & Ie, u4[6] = Ue3 ^ ~nt2 & Fe3, u4[7] = it2 ^ ~ke3 & $3, u4[16] = ut2 ^ ~He3 & ft3, u4[17] = ht2 ^ ~ct2 & ot2, u4[26] = mt2 ^ ~gt2 & lt2, u4[27] = je3 ^ ~At2 & ze2, u4[36] = Ge3 ^ ~Et2 & Qe3, u4[37] = Mt2 ^ ~Ye3 & bt3, u4[46] = Ee2 ^ ~Ne & St2, u4[47] = Se3 ^ ~Ie & Nt2, u4[8] = nt2 ^ ~Fe3 & tt2, u4[9] = ke3 ^ ~$3 & Te, u4[18] = He3 ^ ~ft3 & qe2, u4[19] = ct2 ^ ~ot2 & st2, u4[28] = gt2 ^ ~lt2 & dt2, u4[29] = At2 ^ ~ze2 & pt2, u4[38] = Et2 ^ ~Qe3 & yt2, u4[39] = Ye3 ^ ~bt3 & Je3, u4[48] = Ne ^ ~St2 & Ve2, u4[49] = Ie ^ ~Nt2 & It2, u4[0] ^= C4[B2], u4[1] ^= C4[B2 + 1];
    };
    if (p4) e2.exports = f5;
    else for (c5 = 0; c5 < a4.length; ++c5) n4[a4[c5]] = f5[a4[c5]];
  })();
})(Pn);
var b0 = Pn.exports;
var y0 = "logger/5.7.0";
var Dn = false;
var Fn = false;
var Cr = { debug: 1, default: 2, info: 2, warning: 3, error: 4, off: 5 };
var Tn = Cr.default;
var gi = null;
function w0() {
  try {
    const e2 = [];
    if (["NFD", "NFC", "NFKD", "NFKC"].forEach((t) => {
      try {
        if ("test".normalize(t) !== "test") throw new Error("bad normalize");
      } catch {
        e2.push(t);
      }
    }), e2.length) throw new Error("missing " + e2.join(", "));
    if (String.fromCharCode(233).normalize("NFD") !== String.fromCharCode(101, 769)) throw new Error("broken implementation");
  } catch (e2) {
    return e2.message;
  }
  return null;
}
var Un = w0();
var Ai;
(function(e2) {
  e2.DEBUG = "DEBUG", e2.INFO = "INFO", e2.WARNING = "WARNING", e2.ERROR = "ERROR", e2.OFF = "OFF";
})(Ai || (Ai = {}));
var re;
(function(e2) {
  e2.UNKNOWN_ERROR = "UNKNOWN_ERROR", e2.NOT_IMPLEMENTED = "NOT_IMPLEMENTED", e2.UNSUPPORTED_OPERATION = "UNSUPPORTED_OPERATION", e2.NETWORK_ERROR = "NETWORK_ERROR", e2.SERVER_ERROR = "SERVER_ERROR", e2.TIMEOUT = "TIMEOUT", e2.BUFFER_OVERRUN = "BUFFER_OVERRUN", e2.NUMERIC_FAULT = "NUMERIC_FAULT", e2.MISSING_NEW = "MISSING_NEW", e2.INVALID_ARGUMENT = "INVALID_ARGUMENT", e2.MISSING_ARGUMENT = "MISSING_ARGUMENT", e2.UNEXPECTED_ARGUMENT = "UNEXPECTED_ARGUMENT", e2.CALL_EXCEPTION = "CALL_EXCEPTION", e2.INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS", e2.NONCE_EXPIRED = "NONCE_EXPIRED", e2.REPLACEMENT_UNDERPRICED = "REPLACEMENT_UNDERPRICED", e2.UNPREDICTABLE_GAS_LIMIT = "UNPREDICTABLE_GAS_LIMIT", e2.TRANSACTION_REPLACED = "TRANSACTION_REPLACED", e2.ACTION_REJECTED = "ACTION_REJECTED";
})(re || (re = {}));
var kn = "0123456789abcdef";
var L = class _L {
  constructor(t) {
    Object.defineProperty(this, "version", { enumerable: true, value: t, writable: false });
  }
  _log(t, r3) {
    const i3 = t.toLowerCase();
    Cr[i3] == null && this.throwArgumentError("invalid log level name", "logLevel", t), !(Tn > Cr[i3]) && console.log.apply(console, r3);
  }
  debug(...t) {
    this._log(_L.levels.DEBUG, t);
  }
  info(...t) {
    this._log(_L.levels.INFO, t);
  }
  warn(...t) {
    this._log(_L.levels.WARNING, t);
  }
  makeError(t, r3, i3) {
    if (Fn) return this.makeError("censored error", r3, {});
    r3 || (r3 = _L.errors.UNKNOWN_ERROR), i3 || (i3 = {});
    const n4 = [];
    Object.keys(i3).forEach((b4) => {
      const m3 = i3[b4];
      try {
        if (m3 instanceof Uint8Array) {
          let w4 = "";
          for (let y8 = 0; y8 < m3.length; y8++) w4 += kn[m3[y8] >> 4], w4 += kn[m3[y8] & 15];
          n4.push(b4 + "=Uint8Array(0x" + w4 + ")");
        } else n4.push(b4 + "=" + JSON.stringify(m3));
      } catch {
        n4.push(b4 + "=" + JSON.stringify(i3[b4].toString()));
      }
    }), n4.push(`code=${r3}`), n4.push(`version=${this.version}`);
    const o5 = t;
    let h4 = "";
    switch (r3) {
      case re.NUMERIC_FAULT: {
        h4 = "NUMERIC_FAULT";
        const b4 = t;
        switch (b4) {
          case "overflow":
          case "underflow":
          case "division-by-zero":
            h4 += "-" + b4;
            break;
          case "negative-power":
          case "negative-width":
            h4 += "-unsupported";
            break;
          case "unbound-bitwise-result":
            h4 += "-unbound-result";
            break;
        }
        break;
      }
      case re.CALL_EXCEPTION:
      case re.INSUFFICIENT_FUNDS:
      case re.MISSING_NEW:
      case re.NONCE_EXPIRED:
      case re.REPLACEMENT_UNDERPRICED:
      case re.TRANSACTION_REPLACED:
      case re.UNPREDICTABLE_GAS_LIMIT:
        h4 = r3;
        break;
    }
    h4 && (t += " [ See: https://links.ethers.org/v5-errors-" + h4 + " ]"), n4.length && (t += " (" + n4.join(", ") + ")");
    const p4 = new Error(t);
    return p4.reason = o5, p4.code = r3, Object.keys(i3).forEach(function(b4) {
      p4[b4] = i3[b4];
    }), p4;
  }
  throwError(t, r3, i3) {
    throw this.makeError(t, r3, i3);
  }
  throwArgumentError(t, r3, i3) {
    return this.throwError(t, _L.errors.INVALID_ARGUMENT, { argument: r3, value: i3 });
  }
  assert(t, r3, i3, n4) {
    t || this.throwError(r3, i3, n4);
  }
  assertArgument(t, r3, i3, n4) {
    t || this.throwArgumentError(r3, i3, n4);
  }
  checkNormalize(t) {
    Un && this.throwError("platform missing String.prototype.normalize", _L.errors.UNSUPPORTED_OPERATION, { operation: "String.prototype.normalize", form: Un });
  }
  checkSafeUint53(t, r3) {
    typeof t == "number" && (r3 == null && (r3 = "value not safe"), (t < 0 || t >= 9007199254740991) && this.throwError(r3, _L.errors.NUMERIC_FAULT, { operation: "checkSafeInteger", fault: "out-of-safe-range", value: t }), t % 1 && this.throwError(r3, _L.errors.NUMERIC_FAULT, { operation: "checkSafeInteger", fault: "non-integer", value: t }));
  }
  checkArgumentCount(t, r3, i3) {
    i3 ? i3 = ": " + i3 : i3 = "", t < r3 && this.throwError("missing argument" + i3, _L.errors.MISSING_ARGUMENT, { count: t, expectedCount: r3 }), t > r3 && this.throwError("too many arguments" + i3, _L.errors.UNEXPECTED_ARGUMENT, { count: t, expectedCount: r3 });
  }
  checkNew(t, r3) {
    (t === Object || t == null) && this.throwError("missing new", _L.errors.MISSING_NEW, { name: r3.name });
  }
  checkAbstract(t, r3) {
    t === r3 ? this.throwError("cannot instantiate abstract class " + JSON.stringify(r3.name) + " directly; use a sub-class", _L.errors.UNSUPPORTED_OPERATION, { name: t.name, operation: "new" }) : (t === Object || t == null) && this.throwError("missing new", _L.errors.MISSING_NEW, { name: r3.name });
  }
  static globalLogger() {
    return gi || (gi = new _L(y0)), gi;
  }
  static setCensorship(t, r3) {
    if (!t && r3 && this.globalLogger().throwError("cannot permanently disable censorship", _L.errors.UNSUPPORTED_OPERATION, { operation: "setCensorship" }), Dn) {
      if (!t) return;
      this.globalLogger().throwError("error censorship permanent", _L.errors.UNSUPPORTED_OPERATION, { operation: "setCensorship" });
    }
    Fn = !!t, Dn = !!r3;
  }
  static setLogLevel(t) {
    const r3 = Cr[t.toLowerCase()];
    if (r3 == null) {
      _L.globalLogger().warn("invalid log level - " + t);
      return;
    }
    Tn = r3;
  }
  static from(t) {
    return new _L(t);
  }
};
L.errors = re, L.levels = Ai;
var x0 = "bytes/5.7.0";
var Dt = new L(x0);
function qn(e2) {
  return !!e2.toHexString;
}
function rr(e2) {
  return e2.slice || (e2.slice = function() {
    const t = Array.prototype.slice.call(arguments);
    return rr(new Uint8Array(Array.prototype.slice.apply(e2, t)));
  }), e2;
}
function M0(e2) {
  return Qt(e2) && !(e2.length % 2) || ir(e2);
}
function Kn(e2) {
  return typeof e2 == "number" && e2 == e2 && e2 % 1 === 0;
}
function ir(e2) {
  if (e2 == null) return false;
  if (e2.constructor === Uint8Array) return true;
  if (typeof e2 == "string" || !Kn(e2.length) || e2.length < 0) return false;
  for (let t = 0; t < e2.length; t++) {
    const r3 = e2[t];
    if (!Kn(r3) || r3 < 0 || r3 >= 256) return false;
  }
  return true;
}
function Ot(e2, t) {
  if (t || (t = {}), typeof e2 == "number") {
    Dt.checkSafeUint53(e2, "invalid arrayify value");
    const r3 = [];
    for (; e2; ) r3.unshift(e2 & 255), e2 = parseInt(String(e2 / 256));
    return r3.length === 0 && r3.push(0), rr(new Uint8Array(r3));
  }
  if (t.allowMissingPrefix && typeof e2 == "string" && e2.substring(0, 2) !== "0x" && (e2 = "0x" + e2), qn(e2) && (e2 = e2.toHexString()), Qt(e2)) {
    let r3 = e2.substring(2);
    r3.length % 2 && (t.hexPad === "left" ? r3 = "0" + r3 : t.hexPad === "right" ? r3 += "0" : Dt.throwArgumentError("hex data is odd-length", "value", e2));
    const i3 = [];
    for (let n4 = 0; n4 < r3.length; n4 += 2) i3.push(parseInt(r3.substring(n4, n4 + 2), 16));
    return rr(new Uint8Array(i3));
  }
  return ir(e2) ? rr(new Uint8Array(e2)) : Dt.throwArgumentError("invalid arrayify value", "value", e2);
}
function E0(e2) {
  const t = e2.map((n4) => Ot(n4)), r3 = t.reduce((n4, o5) => n4 + o5.length, 0), i3 = new Uint8Array(r3);
  return t.reduce((n4, o5) => (i3.set(o5, n4), n4 + o5.length), 0), rr(i3);
}
function S0(e2, t) {
  e2 = Ot(e2), e2.length > t && Dt.throwArgumentError("value out of range", "value", arguments[0]);
  const r3 = new Uint8Array(t);
  return r3.set(e2, t - e2.length), rr(r3);
}
function Qt(e2, t) {
  return !(typeof e2 != "string" || !e2.match(/^0x[0-9A-Fa-f]*$/) || t && e2.length !== 2 + 2 * t);
}
var bi = "0123456789abcdef";
function Kt(e2, t) {
  if (t || (t = {}), typeof e2 == "number") {
    Dt.checkSafeUint53(e2, "invalid hexlify value");
    let r3 = "";
    for (; e2; ) r3 = bi[e2 & 15] + r3, e2 = Math.floor(e2 / 16);
    return r3.length ? (r3.length % 2 && (r3 = "0" + r3), "0x" + r3) : "0x00";
  }
  if (typeof e2 == "bigint") return e2 = e2.toString(16), e2.length % 2 ? "0x0" + e2 : "0x" + e2;
  if (t.allowMissingPrefix && typeof e2 == "string" && e2.substring(0, 2) !== "0x" && (e2 = "0x" + e2), qn(e2)) return e2.toHexString();
  if (Qt(e2)) return e2.length % 2 && (t.hexPad === "left" ? e2 = "0x0" + e2.substring(2) : t.hexPad === "right" ? e2 += "0" : Dt.throwArgumentError("hex data is odd-length", "value", e2)), e2.toLowerCase();
  if (ir(e2)) {
    let r3 = "0x";
    for (let i3 = 0; i3 < e2.length; i3++) {
      let n4 = e2[i3];
      r3 += bi[(n4 & 240) >> 4] + bi[n4 & 15];
    }
    return r3;
  }
  return Dt.throwArgumentError("invalid hexlify value", "value", e2);
}
function N0(e2) {
  if (typeof e2 != "string") e2 = Kt(e2);
  else if (!Qt(e2) || e2.length % 2) return null;
  return (e2.length - 2) / 2;
}
function Hn(e2, t, r3) {
  return typeof e2 != "string" ? e2 = Kt(e2) : (!Qt(e2) || e2.length % 2) && Dt.throwArgumentError("invalid hexData", "value", e2), t = 2 + 2 * t, r3 != null ? "0x" + e2.substring(t, 2 + 2 * r3) : "0x" + e2.substring(t);
}
function oe(e2, t) {
  for (typeof e2 != "string" ? e2 = Kt(e2) : Qt(e2) || Dt.throwArgumentError("invalid hex string", "value", e2), e2.length > 2 * t + 2 && Dt.throwArgumentError("value out of range", "value", arguments[1]); e2.length < 2 * t + 2; ) e2 = "0x0" + e2.substring(2);
  return e2;
}
function zn(e2) {
  const t = { r: "0x", s: "0x", _vs: "0x", recoveryParam: 0, v: 0, yParityAndS: "0x", compact: "0x" };
  if (M0(e2)) {
    let r3 = Ot(e2);
    r3.length === 64 ? (t.v = 27 + (r3[32] >> 7), r3[32] &= 127, t.r = Kt(r3.slice(0, 32)), t.s = Kt(r3.slice(32, 64))) : r3.length === 65 ? (t.r = Kt(r3.slice(0, 32)), t.s = Kt(r3.slice(32, 64)), t.v = r3[64]) : Dt.throwArgumentError("invalid signature string", "signature", e2), t.v < 27 && (t.v === 0 || t.v === 1 ? t.v += 27 : Dt.throwArgumentError("signature invalid v byte", "signature", e2)), t.recoveryParam = 1 - t.v % 2, t.recoveryParam && (r3[32] |= 128), t._vs = Kt(r3.slice(32, 64));
  } else {
    if (t.r = e2.r, t.s = e2.s, t.v = e2.v, t.recoveryParam = e2.recoveryParam, t._vs = e2._vs, t._vs != null) {
      const n4 = S0(Ot(t._vs), 32);
      t._vs = Kt(n4);
      const o5 = n4[0] >= 128 ? 1 : 0;
      t.recoveryParam == null ? t.recoveryParam = o5 : t.recoveryParam !== o5 && Dt.throwArgumentError("signature recoveryParam mismatch _vs", "signature", e2), n4[0] &= 127;
      const h4 = Kt(n4);
      t.s == null ? t.s = h4 : t.s !== h4 && Dt.throwArgumentError("signature v mismatch _vs", "signature", e2);
    }
    if (t.recoveryParam == null) t.v == null ? Dt.throwArgumentError("signature missing v and recoveryParam", "signature", e2) : t.v === 0 || t.v === 1 ? t.recoveryParam = t.v : t.recoveryParam = 1 - t.v % 2;
    else if (t.v == null) t.v = 27 + t.recoveryParam;
    else {
      const n4 = t.v === 0 || t.v === 1 ? t.v : 1 - t.v % 2;
      t.recoveryParam !== n4 && Dt.throwArgumentError("signature recoveryParam mismatch v", "signature", e2);
    }
    t.r == null || !Qt(t.r) ? Dt.throwArgumentError("signature missing or invalid r", "signature", e2) : t.r = oe(t.r, 32), t.s == null || !Qt(t.s) ? Dt.throwArgumentError("signature missing or invalid s", "signature", e2) : t.s = oe(t.s, 32);
    const r3 = Ot(t.s);
    r3[0] >= 128 && Dt.throwArgumentError("signature s out of range", "signature", e2), t.recoveryParam && (r3[0] |= 128);
    const i3 = Kt(r3);
    t._vs && (Qt(t._vs) || Dt.throwArgumentError("signature invalid _vs", "signature", e2), t._vs = oe(t._vs, 32)), t._vs == null ? t._vs = i3 : t._vs !== i3 && Dt.throwArgumentError("signature _vs mismatch v and s", "signature", e2);
  }
  return t.yParityAndS = t._vs, t.compact = t.r + t.yParityAndS.substring(2), t;
}
function yi(e2) {
  return "0x" + b0.keccak_256(Ot(e2));
}
var Ln = { exports: {} };
var I0 = {};
var _0 = Object.freeze({ __proto__: null, default: I0 });
var B0 = A0(_0);
(function(e2) {
  (function(t, r3) {
    function i3(A4, f5) {
      if (!A4) throw new Error(f5 || "Assertion failed");
    }
    function n4(A4, f5) {
      A4.super_ = f5;
      var a4 = function() {
      };
      a4.prototype = f5.prototype, A4.prototype = new a4(), A4.prototype.constructor = A4;
    }
    function o5(A4, f5, a4) {
      if (o5.isBN(A4)) return A4;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, A4 !== null && ((f5 === "le" || f5 === "be") && (a4 = f5, f5 = 10), this._init(A4 || 0, f5 || 10, a4 || "be"));
    }
    typeof t == "object" ? t.exports = o5 : r3.BN = o5, o5.BN = o5, o5.wordSize = 26;
    var h4;
    try {
      typeof window < "u" && typeof window.Buffer < "u" ? h4 = window.Buffer : h4 = B0.Buffer;
    } catch {
    }
    o5.isBN = function(f5) {
      return f5 instanceof o5 ? true : f5 !== null && typeof f5 == "object" && f5.constructor.wordSize === o5.wordSize && Array.isArray(f5.words);
    }, o5.max = function(f5, a4) {
      return f5.cmp(a4) > 0 ? f5 : a4;
    }, o5.min = function(f5, a4) {
      return f5.cmp(a4) < 0 ? f5 : a4;
    }, o5.prototype._init = function(f5, a4, c5) {
      if (typeof f5 == "number") return this._initNumber(f5, a4, c5);
      if (typeof f5 == "object") return this._initArray(f5, a4, c5);
      a4 === "hex" && (a4 = 16), i3(a4 === (a4 | 0) && a4 >= 2 && a4 <= 36), f5 = f5.toString().replace(/\s+/g, "");
      var d3 = 0;
      f5[0] === "-" && (d3++, this.negative = 1), d3 < f5.length && (a4 === 16 ? this._parseHex(f5, d3, c5) : (this._parseBase(f5, a4, d3), c5 === "le" && this._initArray(this.toArray(), a4, c5)));
    }, o5.prototype._initNumber = function(f5, a4, c5) {
      f5 < 0 && (this.negative = 1, f5 = -f5), f5 < 67108864 ? (this.words = [f5 & 67108863], this.length = 1) : f5 < 4503599627370496 ? (this.words = [f5 & 67108863, f5 / 67108864 & 67108863], this.length = 2) : (i3(f5 < 9007199254740992), this.words = [f5 & 67108863, f5 / 67108864 & 67108863, 1], this.length = 3), c5 === "le" && this._initArray(this.toArray(), a4, c5);
    }, o5.prototype._initArray = function(f5, a4, c5) {
      if (i3(typeof f5.length == "number"), f5.length <= 0) return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(f5.length / 3), this.words = new Array(this.length);
      for (var d3 = 0; d3 < this.length; d3++) this.words[d3] = 0;
      var g4, x2, M4 = 0;
      if (c5 === "be") for (d3 = f5.length - 1, g4 = 0; d3 >= 0; d3 -= 3) x2 = f5[d3] | f5[d3 - 1] << 8 | f5[d3 - 2] << 16, this.words[g4] |= x2 << M4 & 67108863, this.words[g4 + 1] = x2 >>> 26 - M4 & 67108863, M4 += 24, M4 >= 26 && (M4 -= 26, g4++);
      else if (c5 === "le") for (d3 = 0, g4 = 0; d3 < f5.length; d3 += 3) x2 = f5[d3] | f5[d3 + 1] << 8 | f5[d3 + 2] << 16, this.words[g4] |= x2 << M4 & 67108863, this.words[g4 + 1] = x2 >>> 26 - M4 & 67108863, M4 += 24, M4 >= 26 && (M4 -= 26, g4++);
      return this._strip();
    };
    function p4(A4, f5) {
      var a4 = A4.charCodeAt(f5);
      if (a4 >= 48 && a4 <= 57) return a4 - 48;
      if (a4 >= 65 && a4 <= 70) return a4 - 55;
      if (a4 >= 97 && a4 <= 102) return a4 - 87;
      i3(false, "Invalid character in " + A4);
    }
    function b4(A4, f5, a4) {
      var c5 = p4(A4, a4);
      return a4 - 1 >= f5 && (c5 |= p4(A4, a4 - 1) << 4), c5;
    }
    o5.prototype._parseHex = function(f5, a4, c5) {
      this.length = Math.ceil((f5.length - a4) / 6), this.words = new Array(this.length);
      for (var d3 = 0; d3 < this.length; d3++) this.words[d3] = 0;
      var g4 = 0, x2 = 0, M4;
      if (c5 === "be") for (d3 = f5.length - 1; d3 >= a4; d3 -= 2) M4 = b4(f5, a4, d3) << g4, this.words[x2] |= M4 & 67108863, g4 >= 18 ? (g4 -= 18, x2 += 1, this.words[x2] |= M4 >>> 26) : g4 += 8;
      else {
        var l4 = f5.length - a4;
        for (d3 = l4 % 2 === 0 ? a4 + 1 : a4; d3 < f5.length; d3 += 2) M4 = b4(f5, a4, d3) << g4, this.words[x2] |= M4 & 67108863, g4 >= 18 ? (g4 -= 18, x2 += 1, this.words[x2] |= M4 >>> 26) : g4 += 8;
      }
      this._strip();
    };
    function m3(A4, f5, a4, c5) {
      for (var d3 = 0, g4 = 0, x2 = Math.min(A4.length, a4), M4 = f5; M4 < x2; M4++) {
        var l4 = A4.charCodeAt(M4) - 48;
        d3 *= c5, l4 >= 49 ? g4 = l4 - 49 + 10 : l4 >= 17 ? g4 = l4 - 17 + 10 : g4 = l4, i3(l4 >= 0 && g4 < c5, "Invalid character"), d3 += g4;
      }
      return d3;
    }
    o5.prototype._parseBase = function(f5, a4, c5) {
      this.words = [0], this.length = 1;
      for (var d3 = 0, g4 = 1; g4 <= 67108863; g4 *= a4) d3++;
      d3--, g4 = g4 / a4 | 0;
      for (var x2 = f5.length - c5, M4 = x2 % d3, l4 = Math.min(x2, x2 - M4) + c5, s2 = 0, v4 = c5; v4 < l4; v4 += d3) s2 = m3(f5, v4, v4 + d3, a4), this.imuln(g4), this.words[0] + s2 < 67108864 ? this.words[0] += s2 : this._iaddn(s2);
      if (M4 !== 0) {
        var k3 = 1;
        for (s2 = m3(f5, v4, f5.length, a4), v4 = 0; v4 < M4; v4++) k3 *= a4;
        this.imuln(k3), this.words[0] + s2 < 67108864 ? this.words[0] += s2 : this._iaddn(s2);
      }
      this._strip();
    }, o5.prototype.copy = function(f5) {
      f5.words = new Array(this.length);
      for (var a4 = 0; a4 < this.length; a4++) f5.words[a4] = this.words[a4];
      f5.length = this.length, f5.negative = this.negative, f5.red = this.red;
    };
    function w4(A4, f5) {
      A4.words = f5.words, A4.length = f5.length, A4.negative = f5.negative, A4.red = f5.red;
    }
    if (o5.prototype._move = function(f5) {
      w4(f5, this);
    }, o5.prototype.clone = function() {
      var f5 = new o5(null);
      return this.copy(f5), f5;
    }, o5.prototype._expand = function(f5) {
      for (; this.length < f5; ) this.words[this.length++] = 0;
      return this;
    }, o5.prototype._strip = function() {
      for (; this.length > 1 && this.words[this.length - 1] === 0; ) this.length--;
      return this._normSign();
    }, o5.prototype._normSign = function() {
      return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
    }, typeof Symbol < "u" && typeof Symbol.for == "function") try {
      o5.prototype[Symbol.for("nodejs.util.inspect.custom")] = y8;
    } catch {
      o5.prototype.inspect = y8;
    }
    else o5.prototype.inspect = y8;
    function y8() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    }
    var S4 = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"], I2 = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], N3 = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];
    o5.prototype.toString = function(f5, a4) {
      f5 = f5 || 10, a4 = a4 | 0 || 1;
      var c5;
      if (f5 === 16 || f5 === "hex") {
        c5 = "";
        for (var d3 = 0, g4 = 0, x2 = 0; x2 < this.length; x2++) {
          var M4 = this.words[x2], l4 = ((M4 << d3 | g4) & 16777215).toString(16);
          g4 = M4 >>> 24 - d3 & 16777215, d3 += 2, d3 >= 26 && (d3 -= 26, x2--), g4 !== 0 || x2 !== this.length - 1 ? c5 = S4[6 - l4.length] + l4 + c5 : c5 = l4 + c5;
        }
        for (g4 !== 0 && (c5 = g4.toString(16) + c5); c5.length % a4 !== 0; ) c5 = "0" + c5;
        return this.negative !== 0 && (c5 = "-" + c5), c5;
      }
      if (f5 === (f5 | 0) && f5 >= 2 && f5 <= 36) {
        var s2 = I2[f5], v4 = N3[f5];
        c5 = "";
        var k3 = this.clone();
        for (k3.negative = 0; !k3.isZero(); ) {
          var u4 = k3.modrn(v4).toString(f5);
          k3 = k3.idivn(v4), k3.isZero() ? c5 = u4 + c5 : c5 = S4[s2 - u4.length] + u4 + c5;
        }
        for (this.isZero() && (c5 = "0" + c5); c5.length % a4 !== 0; ) c5 = "0" + c5;
        return this.negative !== 0 && (c5 = "-" + c5), c5;
      }
      i3(false, "Base should be between 2 and 36");
    }, o5.prototype.toNumber = function() {
      var f5 = this.words[0];
      return this.length === 2 ? f5 += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? f5 += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && i3(false, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -f5 : f5;
    }, o5.prototype.toJSON = function() {
      return this.toString(16, 2);
    }, h4 && (o5.prototype.toBuffer = function(f5, a4) {
      return this.toArrayLike(h4, f5, a4);
    }), o5.prototype.toArray = function(f5, a4) {
      return this.toArrayLike(Array, f5, a4);
    };
    var C4 = function(f5, a4) {
      return f5.allocUnsafe ? f5.allocUnsafe(a4) : new f5(a4);
    };
    o5.prototype.toArrayLike = function(f5, a4, c5) {
      this._strip();
      var d3 = this.byteLength(), g4 = c5 || Math.max(1, d3);
      i3(d3 <= g4, "byte array longer than desired length"), i3(g4 > 0, "Requested array length <= 0");
      var x2 = C4(f5, g4), M4 = a4 === "le" ? "LE" : "BE";
      return this["_toArrayLike" + M4](x2, d3), x2;
    }, o5.prototype._toArrayLikeLE = function(f5, a4) {
      for (var c5 = 0, d3 = 0, g4 = 0, x2 = 0; g4 < this.length; g4++) {
        var M4 = this.words[g4] << x2 | d3;
        f5[c5++] = M4 & 255, c5 < f5.length && (f5[c5++] = M4 >> 8 & 255), c5 < f5.length && (f5[c5++] = M4 >> 16 & 255), x2 === 6 ? (c5 < f5.length && (f5[c5++] = M4 >> 24 & 255), d3 = 0, x2 = 0) : (d3 = M4 >>> 24, x2 += 2);
      }
      if (c5 < f5.length) for (f5[c5++] = d3; c5 < f5.length; ) f5[c5++] = 0;
    }, o5.prototype._toArrayLikeBE = function(f5, a4) {
      for (var c5 = f5.length - 1, d3 = 0, g4 = 0, x2 = 0; g4 < this.length; g4++) {
        var M4 = this.words[g4] << x2 | d3;
        f5[c5--] = M4 & 255, c5 >= 0 && (f5[c5--] = M4 >> 8 & 255), c5 >= 0 && (f5[c5--] = M4 >> 16 & 255), x2 === 6 ? (c5 >= 0 && (f5[c5--] = M4 >> 24 & 255), d3 = 0, x2 = 0) : (d3 = M4 >>> 24, x2 += 2);
      }
      if (c5 >= 0) for (f5[c5--] = d3; c5 >= 0; ) f5[c5--] = 0;
    }, Math.clz32 ? o5.prototype._countBits = function(f5) {
      return 32 - Math.clz32(f5);
    } : o5.prototype._countBits = function(f5) {
      var a4 = f5, c5 = 0;
      return a4 >= 4096 && (c5 += 13, a4 >>>= 13), a4 >= 64 && (c5 += 7, a4 >>>= 7), a4 >= 8 && (c5 += 4, a4 >>>= 4), a4 >= 2 && (c5 += 2, a4 >>>= 2), c5 + a4;
    }, o5.prototype._zeroBits = function(f5) {
      if (f5 === 0) return 26;
      var a4 = f5, c5 = 0;
      return a4 & 8191 || (c5 += 13, a4 >>>= 13), a4 & 127 || (c5 += 7, a4 >>>= 7), a4 & 15 || (c5 += 4, a4 >>>= 4), a4 & 3 || (c5 += 2, a4 >>>= 2), a4 & 1 || c5++, c5;
    }, o5.prototype.bitLength = function() {
      var f5 = this.words[this.length - 1], a4 = this._countBits(f5);
      return (this.length - 1) * 26 + a4;
    };
    function F(A4) {
      for (var f5 = new Array(A4.bitLength()), a4 = 0; a4 < f5.length; a4++) {
        var c5 = a4 / 26 | 0, d3 = a4 % 26;
        f5[a4] = A4.words[c5] >>> d3 & 1;
      }
      return f5;
    }
    o5.prototype.zeroBits = function() {
      if (this.isZero()) return 0;
      for (var f5 = 0, a4 = 0; a4 < this.length; a4++) {
        var c5 = this._zeroBits(this.words[a4]);
        if (f5 += c5, c5 !== 26) break;
      }
      return f5;
    }, o5.prototype.byteLength = function() {
      return Math.ceil(this.bitLength() / 8);
    }, o5.prototype.toTwos = function(f5) {
      return this.negative !== 0 ? this.abs().inotn(f5).iaddn(1) : this.clone();
    }, o5.prototype.fromTwos = function(f5) {
      return this.testn(f5 - 1) ? this.notn(f5).iaddn(1).ineg() : this.clone();
    }, o5.prototype.isNeg = function() {
      return this.negative !== 0;
    }, o5.prototype.neg = function() {
      return this.clone().ineg();
    }, o5.prototype.ineg = function() {
      return this.isZero() || (this.negative ^= 1), this;
    }, o5.prototype.iuor = function(f5) {
      for (; this.length < f5.length; ) this.words[this.length++] = 0;
      for (var a4 = 0; a4 < f5.length; a4++) this.words[a4] = this.words[a4] | f5.words[a4];
      return this._strip();
    }, o5.prototype.ior = function(f5) {
      return i3((this.negative | f5.negative) === 0), this.iuor(f5);
    }, o5.prototype.or = function(f5) {
      return this.length > f5.length ? this.clone().ior(f5) : f5.clone().ior(this);
    }, o5.prototype.uor = function(f5) {
      return this.length > f5.length ? this.clone().iuor(f5) : f5.clone().iuor(this);
    }, o5.prototype.iuand = function(f5) {
      var a4;
      this.length > f5.length ? a4 = f5 : a4 = this;
      for (var c5 = 0; c5 < a4.length; c5++) this.words[c5] = this.words[c5] & f5.words[c5];
      return this.length = a4.length, this._strip();
    }, o5.prototype.iand = function(f5) {
      return i3((this.negative | f5.negative) === 0), this.iuand(f5);
    }, o5.prototype.and = function(f5) {
      return this.length > f5.length ? this.clone().iand(f5) : f5.clone().iand(this);
    }, o5.prototype.uand = function(f5) {
      return this.length > f5.length ? this.clone().iuand(f5) : f5.clone().iuand(this);
    }, o5.prototype.iuxor = function(f5) {
      var a4, c5;
      this.length > f5.length ? (a4 = this, c5 = f5) : (a4 = f5, c5 = this);
      for (var d3 = 0; d3 < c5.length; d3++) this.words[d3] = a4.words[d3] ^ c5.words[d3];
      if (this !== a4) for (; d3 < a4.length; d3++) this.words[d3] = a4.words[d3];
      return this.length = a4.length, this._strip();
    }, o5.prototype.ixor = function(f5) {
      return i3((this.negative | f5.negative) === 0), this.iuxor(f5);
    }, o5.prototype.xor = function(f5) {
      return this.length > f5.length ? this.clone().ixor(f5) : f5.clone().ixor(this);
    }, o5.prototype.uxor = function(f5) {
      return this.length > f5.length ? this.clone().iuxor(f5) : f5.clone().iuxor(this);
    }, o5.prototype.inotn = function(f5) {
      i3(typeof f5 == "number" && f5 >= 0);
      var a4 = Math.ceil(f5 / 26) | 0, c5 = f5 % 26;
      this._expand(a4), c5 > 0 && a4--;
      for (var d3 = 0; d3 < a4; d3++) this.words[d3] = ~this.words[d3] & 67108863;
      return c5 > 0 && (this.words[d3] = ~this.words[d3] & 67108863 >> 26 - c5), this._strip();
    }, o5.prototype.notn = function(f5) {
      return this.clone().inotn(f5);
    }, o5.prototype.setn = function(f5, a4) {
      i3(typeof f5 == "number" && f5 >= 0);
      var c5 = f5 / 26 | 0, d3 = f5 % 26;
      return this._expand(c5 + 1), a4 ? this.words[c5] = this.words[c5] | 1 << d3 : this.words[c5] = this.words[c5] & ~(1 << d3), this._strip();
    }, o5.prototype.iadd = function(f5) {
      var a4;
      if (this.negative !== 0 && f5.negative === 0) return this.negative = 0, a4 = this.isub(f5), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && f5.negative !== 0) return f5.negative = 0, a4 = this.isub(f5), f5.negative = 1, a4._normSign();
      var c5, d3;
      this.length > f5.length ? (c5 = this, d3 = f5) : (c5 = f5, d3 = this);
      for (var g4 = 0, x2 = 0; x2 < d3.length; x2++) a4 = (c5.words[x2] | 0) + (d3.words[x2] | 0) + g4, this.words[x2] = a4 & 67108863, g4 = a4 >>> 26;
      for (; g4 !== 0 && x2 < c5.length; x2++) a4 = (c5.words[x2] | 0) + g4, this.words[x2] = a4 & 67108863, g4 = a4 >>> 26;
      if (this.length = c5.length, g4 !== 0) this.words[this.length] = g4, this.length++;
      else if (c5 !== this) for (; x2 < c5.length; x2++) this.words[x2] = c5.words[x2];
      return this;
    }, o5.prototype.add = function(f5) {
      var a4;
      return f5.negative !== 0 && this.negative === 0 ? (f5.negative = 0, a4 = this.sub(f5), f5.negative ^= 1, a4) : f5.negative === 0 && this.negative !== 0 ? (this.negative = 0, a4 = f5.sub(this), this.negative = 1, a4) : this.length > f5.length ? this.clone().iadd(f5) : f5.clone().iadd(this);
    }, o5.prototype.isub = function(f5) {
      if (f5.negative !== 0) {
        f5.negative = 0;
        var a4 = this.iadd(f5);
        return f5.negative = 1, a4._normSign();
      } else if (this.negative !== 0) return this.negative = 0, this.iadd(f5), this.negative = 1, this._normSign();
      var c5 = this.cmp(f5);
      if (c5 === 0) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var d3, g4;
      c5 > 0 ? (d3 = this, g4 = f5) : (d3 = f5, g4 = this);
      for (var x2 = 0, M4 = 0; M4 < g4.length; M4++) a4 = (d3.words[M4] | 0) - (g4.words[M4] | 0) + x2, x2 = a4 >> 26, this.words[M4] = a4 & 67108863;
      for (; x2 !== 0 && M4 < d3.length; M4++) a4 = (d3.words[M4] | 0) + x2, x2 = a4 >> 26, this.words[M4] = a4 & 67108863;
      if (x2 === 0 && M4 < d3.length && d3 !== this) for (; M4 < d3.length; M4++) this.words[M4] = d3.words[M4];
      return this.length = Math.max(this.length, M4), d3 !== this && (this.negative = 1), this._strip();
    }, o5.prototype.sub = function(f5) {
      return this.clone().isub(f5);
    };
    function U4(A4, f5, a4) {
      a4.negative = f5.negative ^ A4.negative;
      var c5 = A4.length + f5.length | 0;
      a4.length = c5, c5 = c5 - 1 | 0;
      var d3 = A4.words[0] | 0, g4 = f5.words[0] | 0, x2 = d3 * g4, M4 = x2 & 67108863, l4 = x2 / 67108864 | 0;
      a4.words[0] = M4;
      for (var s2 = 1; s2 < c5; s2++) {
        for (var v4 = l4 >>> 26, k3 = l4 & 67108863, u4 = Math.min(s2, f5.length - 1), E7 = Math.max(0, s2 - A4.length + 1); E7 <= u4; E7++) {
          var _2 = s2 - E7 | 0;
          d3 = A4.words[_2] | 0, g4 = f5.words[E7] | 0, x2 = d3 * g4 + k3, v4 += x2 / 67108864 | 0, k3 = x2 & 67108863;
        }
        a4.words[s2] = k3 | 0, l4 = v4 | 0;
      }
      return l4 !== 0 ? a4.words[s2] = l4 | 0 : a4.length--, a4._strip();
    }
    var J2 = function(f5, a4, c5) {
      var d3 = f5.words, g4 = a4.words, x2 = c5.words, M4 = 0, l4, s2, v4, k3 = d3[0] | 0, u4 = k3 & 8191, E7 = k3 >>> 13, _2 = d3[1] | 0, B2 = _2 & 8191, R2 = _2 >>> 13, T3 = d3[2] | 0, P2 = T3 & 8191, O4 = T3 >>> 13, Ct4 = d3[3] | 0, D4 = Ct4 & 8191, q3 = Ct4 >>> 13, De2 = d3[4] | 0, X3 = De2 & 8191, Z2 = De2 >>> 13, Fe3 = d3[5] | 0, $3 = Fe3 & 8191, tt2 = Fe3 >>> 13, Te = d3[6] | 0, et2 = Te & 8191, rt2 = Te >>> 13, Ue3 = d3[7] | 0, it2 = Ue3 & 8191, nt2 = Ue3 >>> 13, ke3 = d3[8] | 0, ft3 = ke3 & 8191, ot2 = ke3 >>> 13, qe2 = d3[9] | 0, st2 = qe2 & 8191, at2 = qe2 >>> 13, Ke3 = g4[0] | 0, ut2 = Ke3 & 8191, ht2 = Ke3 >>> 13, He3 = g4[1] | 0, ct2 = He3 & 8191, lt2 = He3 >>> 13, ze2 = g4[2] | 0, dt2 = ze2 & 8191, pt2 = ze2 >>> 13, Le2 = g4[3] | 0, vt2 = Le2 & 8191, mt2 = Le2 >>> 13, je3 = g4[4] | 0, gt2 = je3 & 8191, At2 = je3 >>> 13, Qe3 = g4[5] | 0, bt3 = Qe3 & 8191, yt2 = Qe3 >>> 13, Je3 = g4[6] | 0, wt2 = Je3 & 8191, xt2 = Je3 >>> 13, Ge3 = g4[7] | 0, Mt2 = Ge3 & 8191, Et2 = Ge3 >>> 13, Ye3 = g4[8] | 0, St2 = Ye3 & 8191, Nt2 = Ye3 >>> 13, Ve2 = g4[9] | 0, It2 = Ve2 & 8191, _t2 = Ve2 >>> 13;
      c5.negative = f5.negative ^ a4.negative, c5.length = 19, l4 = Math.imul(u4, ut2), s2 = Math.imul(u4, ht2), s2 = s2 + Math.imul(E7, ut2) | 0, v4 = Math.imul(E7, ht2);
      var Me3 = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (Me3 >>> 26) | 0, Me3 &= 67108863, l4 = Math.imul(B2, ut2), s2 = Math.imul(B2, ht2), s2 = s2 + Math.imul(R2, ut2) | 0, v4 = Math.imul(R2, ht2), l4 = l4 + Math.imul(u4, ct2) | 0, s2 = s2 + Math.imul(u4, lt2) | 0, s2 = s2 + Math.imul(E7, ct2) | 0, v4 = v4 + Math.imul(E7, lt2) | 0;
      var Ee2 = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (Ee2 >>> 26) | 0, Ee2 &= 67108863, l4 = Math.imul(P2, ut2), s2 = Math.imul(P2, ht2), s2 = s2 + Math.imul(O4, ut2) | 0, v4 = Math.imul(O4, ht2), l4 = l4 + Math.imul(B2, ct2) | 0, s2 = s2 + Math.imul(B2, lt2) | 0, s2 = s2 + Math.imul(R2, ct2) | 0, v4 = v4 + Math.imul(R2, lt2) | 0, l4 = l4 + Math.imul(u4, dt2) | 0, s2 = s2 + Math.imul(u4, pt2) | 0, s2 = s2 + Math.imul(E7, dt2) | 0, v4 = v4 + Math.imul(E7, pt2) | 0;
      var Se3 = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (Se3 >>> 26) | 0, Se3 &= 67108863, l4 = Math.imul(D4, ut2), s2 = Math.imul(D4, ht2), s2 = s2 + Math.imul(q3, ut2) | 0, v4 = Math.imul(q3, ht2), l4 = l4 + Math.imul(P2, ct2) | 0, s2 = s2 + Math.imul(P2, lt2) | 0, s2 = s2 + Math.imul(O4, ct2) | 0, v4 = v4 + Math.imul(O4, lt2) | 0, l4 = l4 + Math.imul(B2, dt2) | 0, s2 = s2 + Math.imul(B2, pt2) | 0, s2 = s2 + Math.imul(R2, dt2) | 0, v4 = v4 + Math.imul(R2, pt2) | 0, l4 = l4 + Math.imul(u4, vt2) | 0, s2 = s2 + Math.imul(u4, mt2) | 0, s2 = s2 + Math.imul(E7, vt2) | 0, v4 = v4 + Math.imul(E7, mt2) | 0;
      var Ne = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (Ne >>> 26) | 0, Ne &= 67108863, l4 = Math.imul(X3, ut2), s2 = Math.imul(X3, ht2), s2 = s2 + Math.imul(Z2, ut2) | 0, v4 = Math.imul(Z2, ht2), l4 = l4 + Math.imul(D4, ct2) | 0, s2 = s2 + Math.imul(D4, lt2) | 0, s2 = s2 + Math.imul(q3, ct2) | 0, v4 = v4 + Math.imul(q3, lt2) | 0, l4 = l4 + Math.imul(P2, dt2) | 0, s2 = s2 + Math.imul(P2, pt2) | 0, s2 = s2 + Math.imul(O4, dt2) | 0, v4 = v4 + Math.imul(O4, pt2) | 0, l4 = l4 + Math.imul(B2, vt2) | 0, s2 = s2 + Math.imul(B2, mt2) | 0, s2 = s2 + Math.imul(R2, vt2) | 0, v4 = v4 + Math.imul(R2, mt2) | 0, l4 = l4 + Math.imul(u4, gt2) | 0, s2 = s2 + Math.imul(u4, At2) | 0, s2 = s2 + Math.imul(E7, gt2) | 0, v4 = v4 + Math.imul(E7, At2) | 0;
      var Ie = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (Ie >>> 26) | 0, Ie &= 67108863, l4 = Math.imul($3, ut2), s2 = Math.imul($3, ht2), s2 = s2 + Math.imul(tt2, ut2) | 0, v4 = Math.imul(tt2, ht2), l4 = l4 + Math.imul(X3, ct2) | 0, s2 = s2 + Math.imul(X3, lt2) | 0, s2 = s2 + Math.imul(Z2, ct2) | 0, v4 = v4 + Math.imul(Z2, lt2) | 0, l4 = l4 + Math.imul(D4, dt2) | 0, s2 = s2 + Math.imul(D4, pt2) | 0, s2 = s2 + Math.imul(q3, dt2) | 0, v4 = v4 + Math.imul(q3, pt2) | 0, l4 = l4 + Math.imul(P2, vt2) | 0, s2 = s2 + Math.imul(P2, mt2) | 0, s2 = s2 + Math.imul(O4, vt2) | 0, v4 = v4 + Math.imul(O4, mt2) | 0, l4 = l4 + Math.imul(B2, gt2) | 0, s2 = s2 + Math.imul(B2, At2) | 0, s2 = s2 + Math.imul(R2, gt2) | 0, v4 = v4 + Math.imul(R2, At2) | 0, l4 = l4 + Math.imul(u4, bt3) | 0, s2 = s2 + Math.imul(u4, yt2) | 0, s2 = s2 + Math.imul(E7, bt3) | 0, v4 = v4 + Math.imul(E7, yt2) | 0;
      var Wr = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (Wr >>> 26) | 0, Wr &= 67108863, l4 = Math.imul(et2, ut2), s2 = Math.imul(et2, ht2), s2 = s2 + Math.imul(rt2, ut2) | 0, v4 = Math.imul(rt2, ht2), l4 = l4 + Math.imul($3, ct2) | 0, s2 = s2 + Math.imul($3, lt2) | 0, s2 = s2 + Math.imul(tt2, ct2) | 0, v4 = v4 + Math.imul(tt2, lt2) | 0, l4 = l4 + Math.imul(X3, dt2) | 0, s2 = s2 + Math.imul(X3, pt2) | 0, s2 = s2 + Math.imul(Z2, dt2) | 0, v4 = v4 + Math.imul(Z2, pt2) | 0, l4 = l4 + Math.imul(D4, vt2) | 0, s2 = s2 + Math.imul(D4, mt2) | 0, s2 = s2 + Math.imul(q3, vt2) | 0, v4 = v4 + Math.imul(q3, mt2) | 0, l4 = l4 + Math.imul(P2, gt2) | 0, s2 = s2 + Math.imul(P2, At2) | 0, s2 = s2 + Math.imul(O4, gt2) | 0, v4 = v4 + Math.imul(O4, At2) | 0, l4 = l4 + Math.imul(B2, bt3) | 0, s2 = s2 + Math.imul(B2, yt2) | 0, s2 = s2 + Math.imul(R2, bt3) | 0, v4 = v4 + Math.imul(R2, yt2) | 0, l4 = l4 + Math.imul(u4, wt2) | 0, s2 = s2 + Math.imul(u4, xt2) | 0, s2 = s2 + Math.imul(E7, wt2) | 0, v4 = v4 + Math.imul(E7, xt2) | 0;
      var Xr = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (Xr >>> 26) | 0, Xr &= 67108863, l4 = Math.imul(it2, ut2), s2 = Math.imul(it2, ht2), s2 = s2 + Math.imul(nt2, ut2) | 0, v4 = Math.imul(nt2, ht2), l4 = l4 + Math.imul(et2, ct2) | 0, s2 = s2 + Math.imul(et2, lt2) | 0, s2 = s2 + Math.imul(rt2, ct2) | 0, v4 = v4 + Math.imul(rt2, lt2) | 0, l4 = l4 + Math.imul($3, dt2) | 0, s2 = s2 + Math.imul($3, pt2) | 0, s2 = s2 + Math.imul(tt2, dt2) | 0, v4 = v4 + Math.imul(tt2, pt2) | 0, l4 = l4 + Math.imul(X3, vt2) | 0, s2 = s2 + Math.imul(X3, mt2) | 0, s2 = s2 + Math.imul(Z2, vt2) | 0, v4 = v4 + Math.imul(Z2, mt2) | 0, l4 = l4 + Math.imul(D4, gt2) | 0, s2 = s2 + Math.imul(D4, At2) | 0, s2 = s2 + Math.imul(q3, gt2) | 0, v4 = v4 + Math.imul(q3, At2) | 0, l4 = l4 + Math.imul(P2, bt3) | 0, s2 = s2 + Math.imul(P2, yt2) | 0, s2 = s2 + Math.imul(O4, bt3) | 0, v4 = v4 + Math.imul(O4, yt2) | 0, l4 = l4 + Math.imul(B2, wt2) | 0, s2 = s2 + Math.imul(B2, xt2) | 0, s2 = s2 + Math.imul(R2, wt2) | 0, v4 = v4 + Math.imul(R2, xt2) | 0, l4 = l4 + Math.imul(u4, Mt2) | 0, s2 = s2 + Math.imul(u4, Et2) | 0, s2 = s2 + Math.imul(E7, Mt2) | 0, v4 = v4 + Math.imul(E7, Et2) | 0;
      var Zr = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (Zr >>> 26) | 0, Zr &= 67108863, l4 = Math.imul(ft3, ut2), s2 = Math.imul(ft3, ht2), s2 = s2 + Math.imul(ot2, ut2) | 0, v4 = Math.imul(ot2, ht2), l4 = l4 + Math.imul(it2, ct2) | 0, s2 = s2 + Math.imul(it2, lt2) | 0, s2 = s2 + Math.imul(nt2, ct2) | 0, v4 = v4 + Math.imul(nt2, lt2) | 0, l4 = l4 + Math.imul(et2, dt2) | 0, s2 = s2 + Math.imul(et2, pt2) | 0, s2 = s2 + Math.imul(rt2, dt2) | 0, v4 = v4 + Math.imul(rt2, pt2) | 0, l4 = l4 + Math.imul($3, vt2) | 0, s2 = s2 + Math.imul($3, mt2) | 0, s2 = s2 + Math.imul(tt2, vt2) | 0, v4 = v4 + Math.imul(tt2, mt2) | 0, l4 = l4 + Math.imul(X3, gt2) | 0, s2 = s2 + Math.imul(X3, At2) | 0, s2 = s2 + Math.imul(Z2, gt2) | 0, v4 = v4 + Math.imul(Z2, At2) | 0, l4 = l4 + Math.imul(D4, bt3) | 0, s2 = s2 + Math.imul(D4, yt2) | 0, s2 = s2 + Math.imul(q3, bt3) | 0, v4 = v4 + Math.imul(q3, yt2) | 0, l4 = l4 + Math.imul(P2, wt2) | 0, s2 = s2 + Math.imul(P2, xt2) | 0, s2 = s2 + Math.imul(O4, wt2) | 0, v4 = v4 + Math.imul(O4, xt2) | 0, l4 = l4 + Math.imul(B2, Mt2) | 0, s2 = s2 + Math.imul(B2, Et2) | 0, s2 = s2 + Math.imul(R2, Mt2) | 0, v4 = v4 + Math.imul(R2, Et2) | 0, l4 = l4 + Math.imul(u4, St2) | 0, s2 = s2 + Math.imul(u4, Nt2) | 0, s2 = s2 + Math.imul(E7, St2) | 0, v4 = v4 + Math.imul(E7, Nt2) | 0;
      var $r2 = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + ($r2 >>> 26) | 0, $r2 &= 67108863, l4 = Math.imul(st2, ut2), s2 = Math.imul(st2, ht2), s2 = s2 + Math.imul(at2, ut2) | 0, v4 = Math.imul(at2, ht2), l4 = l4 + Math.imul(ft3, ct2) | 0, s2 = s2 + Math.imul(ft3, lt2) | 0, s2 = s2 + Math.imul(ot2, ct2) | 0, v4 = v4 + Math.imul(ot2, lt2) | 0, l4 = l4 + Math.imul(it2, dt2) | 0, s2 = s2 + Math.imul(it2, pt2) | 0, s2 = s2 + Math.imul(nt2, dt2) | 0, v4 = v4 + Math.imul(nt2, pt2) | 0, l4 = l4 + Math.imul(et2, vt2) | 0, s2 = s2 + Math.imul(et2, mt2) | 0, s2 = s2 + Math.imul(rt2, vt2) | 0, v4 = v4 + Math.imul(rt2, mt2) | 0, l4 = l4 + Math.imul($3, gt2) | 0, s2 = s2 + Math.imul($3, At2) | 0, s2 = s2 + Math.imul(tt2, gt2) | 0, v4 = v4 + Math.imul(tt2, At2) | 0, l4 = l4 + Math.imul(X3, bt3) | 0, s2 = s2 + Math.imul(X3, yt2) | 0, s2 = s2 + Math.imul(Z2, bt3) | 0, v4 = v4 + Math.imul(Z2, yt2) | 0, l4 = l4 + Math.imul(D4, wt2) | 0, s2 = s2 + Math.imul(D4, xt2) | 0, s2 = s2 + Math.imul(q3, wt2) | 0, v4 = v4 + Math.imul(q3, xt2) | 0, l4 = l4 + Math.imul(P2, Mt2) | 0, s2 = s2 + Math.imul(P2, Et2) | 0, s2 = s2 + Math.imul(O4, Mt2) | 0, v4 = v4 + Math.imul(O4, Et2) | 0, l4 = l4 + Math.imul(B2, St2) | 0, s2 = s2 + Math.imul(B2, Nt2) | 0, s2 = s2 + Math.imul(R2, St2) | 0, v4 = v4 + Math.imul(R2, Nt2) | 0, l4 = l4 + Math.imul(u4, It2) | 0, s2 = s2 + Math.imul(u4, _t2) | 0, s2 = s2 + Math.imul(E7, It2) | 0, v4 = v4 + Math.imul(E7, _t2) | 0;
      var ti = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (ti >>> 26) | 0, ti &= 67108863, l4 = Math.imul(st2, ct2), s2 = Math.imul(st2, lt2), s2 = s2 + Math.imul(at2, ct2) | 0, v4 = Math.imul(at2, lt2), l4 = l4 + Math.imul(ft3, dt2) | 0, s2 = s2 + Math.imul(ft3, pt2) | 0, s2 = s2 + Math.imul(ot2, dt2) | 0, v4 = v4 + Math.imul(ot2, pt2) | 0, l4 = l4 + Math.imul(it2, vt2) | 0, s2 = s2 + Math.imul(it2, mt2) | 0, s2 = s2 + Math.imul(nt2, vt2) | 0, v4 = v4 + Math.imul(nt2, mt2) | 0, l4 = l4 + Math.imul(et2, gt2) | 0, s2 = s2 + Math.imul(et2, At2) | 0, s2 = s2 + Math.imul(rt2, gt2) | 0, v4 = v4 + Math.imul(rt2, At2) | 0, l4 = l4 + Math.imul($3, bt3) | 0, s2 = s2 + Math.imul($3, yt2) | 0, s2 = s2 + Math.imul(tt2, bt3) | 0, v4 = v4 + Math.imul(tt2, yt2) | 0, l4 = l4 + Math.imul(X3, wt2) | 0, s2 = s2 + Math.imul(X3, xt2) | 0, s2 = s2 + Math.imul(Z2, wt2) | 0, v4 = v4 + Math.imul(Z2, xt2) | 0, l4 = l4 + Math.imul(D4, Mt2) | 0, s2 = s2 + Math.imul(D4, Et2) | 0, s2 = s2 + Math.imul(q3, Mt2) | 0, v4 = v4 + Math.imul(q3, Et2) | 0, l4 = l4 + Math.imul(P2, St2) | 0, s2 = s2 + Math.imul(P2, Nt2) | 0, s2 = s2 + Math.imul(O4, St2) | 0, v4 = v4 + Math.imul(O4, Nt2) | 0, l4 = l4 + Math.imul(B2, It2) | 0, s2 = s2 + Math.imul(B2, _t2) | 0, s2 = s2 + Math.imul(R2, It2) | 0, v4 = v4 + Math.imul(R2, _t2) | 0;
      var ei = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (ei >>> 26) | 0, ei &= 67108863, l4 = Math.imul(st2, dt2), s2 = Math.imul(st2, pt2), s2 = s2 + Math.imul(at2, dt2) | 0, v4 = Math.imul(at2, pt2), l4 = l4 + Math.imul(ft3, vt2) | 0, s2 = s2 + Math.imul(ft3, mt2) | 0, s2 = s2 + Math.imul(ot2, vt2) | 0, v4 = v4 + Math.imul(ot2, mt2) | 0, l4 = l4 + Math.imul(it2, gt2) | 0, s2 = s2 + Math.imul(it2, At2) | 0, s2 = s2 + Math.imul(nt2, gt2) | 0, v4 = v4 + Math.imul(nt2, At2) | 0, l4 = l4 + Math.imul(et2, bt3) | 0, s2 = s2 + Math.imul(et2, yt2) | 0, s2 = s2 + Math.imul(rt2, bt3) | 0, v4 = v4 + Math.imul(rt2, yt2) | 0, l4 = l4 + Math.imul($3, wt2) | 0, s2 = s2 + Math.imul($3, xt2) | 0, s2 = s2 + Math.imul(tt2, wt2) | 0, v4 = v4 + Math.imul(tt2, xt2) | 0, l4 = l4 + Math.imul(X3, Mt2) | 0, s2 = s2 + Math.imul(X3, Et2) | 0, s2 = s2 + Math.imul(Z2, Mt2) | 0, v4 = v4 + Math.imul(Z2, Et2) | 0, l4 = l4 + Math.imul(D4, St2) | 0, s2 = s2 + Math.imul(D4, Nt2) | 0, s2 = s2 + Math.imul(q3, St2) | 0, v4 = v4 + Math.imul(q3, Nt2) | 0, l4 = l4 + Math.imul(P2, It2) | 0, s2 = s2 + Math.imul(P2, _t2) | 0, s2 = s2 + Math.imul(O4, It2) | 0, v4 = v4 + Math.imul(O4, _t2) | 0;
      var ri = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (ri >>> 26) | 0, ri &= 67108863, l4 = Math.imul(st2, vt2), s2 = Math.imul(st2, mt2), s2 = s2 + Math.imul(at2, vt2) | 0, v4 = Math.imul(at2, mt2), l4 = l4 + Math.imul(ft3, gt2) | 0, s2 = s2 + Math.imul(ft3, At2) | 0, s2 = s2 + Math.imul(ot2, gt2) | 0, v4 = v4 + Math.imul(ot2, At2) | 0, l4 = l4 + Math.imul(it2, bt3) | 0, s2 = s2 + Math.imul(it2, yt2) | 0, s2 = s2 + Math.imul(nt2, bt3) | 0, v4 = v4 + Math.imul(nt2, yt2) | 0, l4 = l4 + Math.imul(et2, wt2) | 0, s2 = s2 + Math.imul(et2, xt2) | 0, s2 = s2 + Math.imul(rt2, wt2) | 0, v4 = v4 + Math.imul(rt2, xt2) | 0, l4 = l4 + Math.imul($3, Mt2) | 0, s2 = s2 + Math.imul($3, Et2) | 0, s2 = s2 + Math.imul(tt2, Mt2) | 0, v4 = v4 + Math.imul(tt2, Et2) | 0, l4 = l4 + Math.imul(X3, St2) | 0, s2 = s2 + Math.imul(X3, Nt2) | 0, s2 = s2 + Math.imul(Z2, St2) | 0, v4 = v4 + Math.imul(Z2, Nt2) | 0, l4 = l4 + Math.imul(D4, It2) | 0, s2 = s2 + Math.imul(D4, _t2) | 0, s2 = s2 + Math.imul(q3, It2) | 0, v4 = v4 + Math.imul(q3, _t2) | 0;
      var ii = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (ii >>> 26) | 0, ii &= 67108863, l4 = Math.imul(st2, gt2), s2 = Math.imul(st2, At2), s2 = s2 + Math.imul(at2, gt2) | 0, v4 = Math.imul(at2, At2), l4 = l4 + Math.imul(ft3, bt3) | 0, s2 = s2 + Math.imul(ft3, yt2) | 0, s2 = s2 + Math.imul(ot2, bt3) | 0, v4 = v4 + Math.imul(ot2, yt2) | 0, l4 = l4 + Math.imul(it2, wt2) | 0, s2 = s2 + Math.imul(it2, xt2) | 0, s2 = s2 + Math.imul(nt2, wt2) | 0, v4 = v4 + Math.imul(nt2, xt2) | 0, l4 = l4 + Math.imul(et2, Mt2) | 0, s2 = s2 + Math.imul(et2, Et2) | 0, s2 = s2 + Math.imul(rt2, Mt2) | 0, v4 = v4 + Math.imul(rt2, Et2) | 0, l4 = l4 + Math.imul($3, St2) | 0, s2 = s2 + Math.imul($3, Nt2) | 0, s2 = s2 + Math.imul(tt2, St2) | 0, v4 = v4 + Math.imul(tt2, Nt2) | 0, l4 = l4 + Math.imul(X3, It2) | 0, s2 = s2 + Math.imul(X3, _t2) | 0, s2 = s2 + Math.imul(Z2, It2) | 0, v4 = v4 + Math.imul(Z2, _t2) | 0;
      var ni = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (ni >>> 26) | 0, ni &= 67108863, l4 = Math.imul(st2, bt3), s2 = Math.imul(st2, yt2), s2 = s2 + Math.imul(at2, bt3) | 0, v4 = Math.imul(at2, yt2), l4 = l4 + Math.imul(ft3, wt2) | 0, s2 = s2 + Math.imul(ft3, xt2) | 0, s2 = s2 + Math.imul(ot2, wt2) | 0, v4 = v4 + Math.imul(ot2, xt2) | 0, l4 = l4 + Math.imul(it2, Mt2) | 0, s2 = s2 + Math.imul(it2, Et2) | 0, s2 = s2 + Math.imul(nt2, Mt2) | 0, v4 = v4 + Math.imul(nt2, Et2) | 0, l4 = l4 + Math.imul(et2, St2) | 0, s2 = s2 + Math.imul(et2, Nt2) | 0, s2 = s2 + Math.imul(rt2, St2) | 0, v4 = v4 + Math.imul(rt2, Nt2) | 0, l4 = l4 + Math.imul($3, It2) | 0, s2 = s2 + Math.imul($3, _t2) | 0, s2 = s2 + Math.imul(tt2, It2) | 0, v4 = v4 + Math.imul(tt2, _t2) | 0;
      var fi = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (fi >>> 26) | 0, fi &= 67108863, l4 = Math.imul(st2, wt2), s2 = Math.imul(st2, xt2), s2 = s2 + Math.imul(at2, wt2) | 0, v4 = Math.imul(at2, xt2), l4 = l4 + Math.imul(ft3, Mt2) | 0, s2 = s2 + Math.imul(ft3, Et2) | 0, s2 = s2 + Math.imul(ot2, Mt2) | 0, v4 = v4 + Math.imul(ot2, Et2) | 0, l4 = l4 + Math.imul(it2, St2) | 0, s2 = s2 + Math.imul(it2, Nt2) | 0, s2 = s2 + Math.imul(nt2, St2) | 0, v4 = v4 + Math.imul(nt2, Nt2) | 0, l4 = l4 + Math.imul(et2, It2) | 0, s2 = s2 + Math.imul(et2, _t2) | 0, s2 = s2 + Math.imul(rt2, It2) | 0, v4 = v4 + Math.imul(rt2, _t2) | 0;
      var oi = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (oi >>> 26) | 0, oi &= 67108863, l4 = Math.imul(st2, Mt2), s2 = Math.imul(st2, Et2), s2 = s2 + Math.imul(at2, Mt2) | 0, v4 = Math.imul(at2, Et2), l4 = l4 + Math.imul(ft3, St2) | 0, s2 = s2 + Math.imul(ft3, Nt2) | 0, s2 = s2 + Math.imul(ot2, St2) | 0, v4 = v4 + Math.imul(ot2, Nt2) | 0, l4 = l4 + Math.imul(it2, It2) | 0, s2 = s2 + Math.imul(it2, _t2) | 0, s2 = s2 + Math.imul(nt2, It2) | 0, v4 = v4 + Math.imul(nt2, _t2) | 0;
      var si = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (si >>> 26) | 0, si &= 67108863, l4 = Math.imul(st2, St2), s2 = Math.imul(st2, Nt2), s2 = s2 + Math.imul(at2, St2) | 0, v4 = Math.imul(at2, Nt2), l4 = l4 + Math.imul(ft3, It2) | 0, s2 = s2 + Math.imul(ft3, _t2) | 0, s2 = s2 + Math.imul(ot2, It2) | 0, v4 = v4 + Math.imul(ot2, _t2) | 0;
      var ai = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      M4 = (v4 + (s2 >>> 13) | 0) + (ai >>> 26) | 0, ai &= 67108863, l4 = Math.imul(st2, It2), s2 = Math.imul(st2, _t2), s2 = s2 + Math.imul(at2, It2) | 0, v4 = Math.imul(at2, _t2);
      var ui = (M4 + l4 | 0) + ((s2 & 8191) << 13) | 0;
      return M4 = (v4 + (s2 >>> 13) | 0) + (ui >>> 26) | 0, ui &= 67108863, x2[0] = Me3, x2[1] = Ee2, x2[2] = Se3, x2[3] = Ne, x2[4] = Ie, x2[5] = Wr, x2[6] = Xr, x2[7] = Zr, x2[8] = $r2, x2[9] = ti, x2[10] = ei, x2[11] = ri, x2[12] = ii, x2[13] = ni, x2[14] = fi, x2[15] = oi, x2[16] = si, x2[17] = ai, x2[18] = ui, M4 !== 0 && (x2[19] = M4, c5.length++), c5;
    };
    Math.imul || (J2 = U4);
    function Bt3(A4, f5, a4) {
      a4.negative = f5.negative ^ A4.negative, a4.length = A4.length + f5.length;
      for (var c5 = 0, d3 = 0, g4 = 0; g4 < a4.length - 1; g4++) {
        var x2 = d3;
        d3 = 0;
        for (var M4 = c5 & 67108863, l4 = Math.min(g4, f5.length - 1), s2 = Math.max(0, g4 - A4.length + 1); s2 <= l4; s2++) {
          var v4 = g4 - s2, k3 = A4.words[v4] | 0, u4 = f5.words[s2] | 0, E7 = k3 * u4, _2 = E7 & 67108863;
          x2 = x2 + (E7 / 67108864 | 0) | 0, _2 = _2 + M4 | 0, M4 = _2 & 67108863, x2 = x2 + (_2 >>> 26) | 0, d3 += x2 >>> 26, x2 &= 67108863;
        }
        a4.words[g4] = M4, c5 = x2, x2 = d3;
      }
      return c5 !== 0 ? a4.words[g4] = c5 : a4.length--, a4._strip();
    }
    function G(A4, f5, a4) {
      return Bt3(A4, f5, a4);
    }
    o5.prototype.mulTo = function(f5, a4) {
      var c5, d3 = this.length + f5.length;
      return this.length === 10 && f5.length === 10 ? c5 = J2(this, f5, a4) : d3 < 63 ? c5 = U4(this, f5, a4) : d3 < 1024 ? c5 = Bt3(this, f5, a4) : c5 = G(this, f5, a4), c5;
    }, o5.prototype.mul = function(f5) {
      var a4 = new o5(null);
      return a4.words = new Array(this.length + f5.length), this.mulTo(f5, a4);
    }, o5.prototype.mulf = function(f5) {
      var a4 = new o5(null);
      return a4.words = new Array(this.length + f5.length), G(this, f5, a4);
    }, o5.prototype.imul = function(f5) {
      return this.clone().mulTo(f5, this);
    }, o5.prototype.imuln = function(f5) {
      var a4 = f5 < 0;
      a4 && (f5 = -f5), i3(typeof f5 == "number"), i3(f5 < 67108864);
      for (var c5 = 0, d3 = 0; d3 < this.length; d3++) {
        var g4 = (this.words[d3] | 0) * f5, x2 = (g4 & 67108863) + (c5 & 67108863);
        c5 >>= 26, c5 += g4 / 67108864 | 0, c5 += x2 >>> 26, this.words[d3] = x2 & 67108863;
      }
      return c5 !== 0 && (this.words[d3] = c5, this.length++), a4 ? this.ineg() : this;
    }, o5.prototype.muln = function(f5) {
      return this.clone().imuln(f5);
    }, o5.prototype.sqr = function() {
      return this.mul(this);
    }, o5.prototype.isqr = function() {
      return this.imul(this.clone());
    }, o5.prototype.pow = function(f5) {
      var a4 = F(f5);
      if (a4.length === 0) return new o5(1);
      for (var c5 = this, d3 = 0; d3 < a4.length && a4[d3] === 0; d3++, c5 = c5.sqr()) ;
      if (++d3 < a4.length) for (var g4 = c5.sqr(); d3 < a4.length; d3++, g4 = g4.sqr()) a4[d3] !== 0 && (c5 = c5.mul(g4));
      return c5;
    }, o5.prototype.iushln = function(f5) {
      i3(typeof f5 == "number" && f5 >= 0);
      var a4 = f5 % 26, c5 = (f5 - a4) / 26, d3 = 67108863 >>> 26 - a4 << 26 - a4, g4;
      if (a4 !== 0) {
        var x2 = 0;
        for (g4 = 0; g4 < this.length; g4++) {
          var M4 = this.words[g4] & d3, l4 = (this.words[g4] | 0) - M4 << a4;
          this.words[g4] = l4 | x2, x2 = M4 >>> 26 - a4;
        }
        x2 && (this.words[g4] = x2, this.length++);
      }
      if (c5 !== 0) {
        for (g4 = this.length - 1; g4 >= 0; g4--) this.words[g4 + c5] = this.words[g4];
        for (g4 = 0; g4 < c5; g4++) this.words[g4] = 0;
        this.length += c5;
      }
      return this._strip();
    }, o5.prototype.ishln = function(f5) {
      return i3(this.negative === 0), this.iushln(f5);
    }, o5.prototype.iushrn = function(f5, a4, c5) {
      i3(typeof f5 == "number" && f5 >= 0);
      var d3;
      a4 ? d3 = (a4 - a4 % 26) / 26 : d3 = 0;
      var g4 = f5 % 26, x2 = Math.min((f5 - g4) / 26, this.length), M4 = 67108863 ^ 67108863 >>> g4 << g4, l4 = c5;
      if (d3 -= x2, d3 = Math.max(0, d3), l4) {
        for (var s2 = 0; s2 < x2; s2++) l4.words[s2] = this.words[s2];
        l4.length = x2;
      }
      if (x2 !== 0) if (this.length > x2) for (this.length -= x2, s2 = 0; s2 < this.length; s2++) this.words[s2] = this.words[s2 + x2];
      else this.words[0] = 0, this.length = 1;
      var v4 = 0;
      for (s2 = this.length - 1; s2 >= 0 && (v4 !== 0 || s2 >= d3); s2--) {
        var k3 = this.words[s2] | 0;
        this.words[s2] = v4 << 26 - g4 | k3 >>> g4, v4 = k3 & M4;
      }
      return l4 && v4 !== 0 && (l4.words[l4.length++] = v4), this.length === 0 && (this.words[0] = 0, this.length = 1), this._strip();
    }, o5.prototype.ishrn = function(f5, a4, c5) {
      return i3(this.negative === 0), this.iushrn(f5, a4, c5);
    }, o5.prototype.shln = function(f5) {
      return this.clone().ishln(f5);
    }, o5.prototype.ushln = function(f5) {
      return this.clone().iushln(f5);
    }, o5.prototype.shrn = function(f5) {
      return this.clone().ishrn(f5);
    }, o5.prototype.ushrn = function(f5) {
      return this.clone().iushrn(f5);
    }, o5.prototype.testn = function(f5) {
      i3(typeof f5 == "number" && f5 >= 0);
      var a4 = f5 % 26, c5 = (f5 - a4) / 26, d3 = 1 << a4;
      if (this.length <= c5) return false;
      var g4 = this.words[c5];
      return !!(g4 & d3);
    }, o5.prototype.imaskn = function(f5) {
      i3(typeof f5 == "number" && f5 >= 0);
      var a4 = f5 % 26, c5 = (f5 - a4) / 26;
      if (i3(this.negative === 0, "imaskn works only with positive numbers"), this.length <= c5) return this;
      if (a4 !== 0 && c5++, this.length = Math.min(c5, this.length), a4 !== 0) {
        var d3 = 67108863 ^ 67108863 >>> a4 << a4;
        this.words[this.length - 1] &= d3;
      }
      return this._strip();
    }, o5.prototype.maskn = function(f5) {
      return this.clone().imaskn(f5);
    }, o5.prototype.iaddn = function(f5) {
      return i3(typeof f5 == "number"), i3(f5 < 67108864), f5 < 0 ? this.isubn(-f5) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) <= f5 ? (this.words[0] = f5 - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(f5), this.negative = 1, this) : this._iaddn(f5);
    }, o5.prototype._iaddn = function(f5) {
      this.words[0] += f5;
      for (var a4 = 0; a4 < this.length && this.words[a4] >= 67108864; a4++) this.words[a4] -= 67108864, a4 === this.length - 1 ? this.words[a4 + 1] = 1 : this.words[a4 + 1]++;
      return this.length = Math.max(this.length, a4 + 1), this;
    }, o5.prototype.isubn = function(f5) {
      if (i3(typeof f5 == "number"), i3(f5 < 67108864), f5 < 0) return this.iaddn(-f5);
      if (this.negative !== 0) return this.negative = 0, this.iaddn(f5), this.negative = 1, this;
      if (this.words[0] -= f5, this.length === 1 && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1;
      else for (var a4 = 0; a4 < this.length && this.words[a4] < 0; a4++) this.words[a4] += 67108864, this.words[a4 + 1] -= 1;
      return this._strip();
    }, o5.prototype.addn = function(f5) {
      return this.clone().iaddn(f5);
    }, o5.prototype.subn = function(f5) {
      return this.clone().isubn(f5);
    }, o5.prototype.iabs = function() {
      return this.negative = 0, this;
    }, o5.prototype.abs = function() {
      return this.clone().iabs();
    }, o5.prototype._ishlnsubmul = function(f5, a4, c5) {
      var d3 = f5.length + c5, g4;
      this._expand(d3);
      var x2, M4 = 0;
      for (g4 = 0; g4 < f5.length; g4++) {
        x2 = (this.words[g4 + c5] | 0) + M4;
        var l4 = (f5.words[g4] | 0) * a4;
        x2 -= l4 & 67108863, M4 = (x2 >> 26) - (l4 / 67108864 | 0), this.words[g4 + c5] = x2 & 67108863;
      }
      for (; g4 < this.length - c5; g4++) x2 = (this.words[g4 + c5] | 0) + M4, M4 = x2 >> 26, this.words[g4 + c5] = x2 & 67108863;
      if (M4 === 0) return this._strip();
      for (i3(M4 === -1), M4 = 0, g4 = 0; g4 < this.length; g4++) x2 = -(this.words[g4] | 0) + M4, M4 = x2 >> 26, this.words[g4] = x2 & 67108863;
      return this.negative = 1, this._strip();
    }, o5.prototype._wordDiv = function(f5, a4) {
      var c5 = this.length - f5.length, d3 = this.clone(), g4 = f5, x2 = g4.words[g4.length - 1] | 0, M4 = this._countBits(x2);
      c5 = 26 - M4, c5 !== 0 && (g4 = g4.ushln(c5), d3.iushln(c5), x2 = g4.words[g4.length - 1] | 0);
      var l4 = d3.length - g4.length, s2;
      if (a4 !== "mod") {
        s2 = new o5(null), s2.length = l4 + 1, s2.words = new Array(s2.length);
        for (var v4 = 0; v4 < s2.length; v4++) s2.words[v4] = 0;
      }
      var k3 = d3.clone()._ishlnsubmul(g4, 1, l4);
      k3.negative === 0 && (d3 = k3, s2 && (s2.words[l4] = 1));
      for (var u4 = l4 - 1; u4 >= 0; u4--) {
        var E7 = (d3.words[g4.length + u4] | 0) * 67108864 + (d3.words[g4.length + u4 - 1] | 0);
        for (E7 = Math.min(E7 / x2 | 0, 67108863), d3._ishlnsubmul(g4, E7, u4); d3.negative !== 0; ) E7--, d3.negative = 0, d3._ishlnsubmul(g4, 1, u4), d3.isZero() || (d3.negative ^= 1);
        s2 && (s2.words[u4] = E7);
      }
      return s2 && s2._strip(), d3._strip(), a4 !== "div" && c5 !== 0 && d3.iushrn(c5), { div: s2 || null, mod: d3 };
    }, o5.prototype.divmod = function(f5, a4, c5) {
      if (i3(!f5.isZero()), this.isZero()) return { div: new o5(0), mod: new o5(0) };
      var d3, g4, x2;
      return this.negative !== 0 && f5.negative === 0 ? (x2 = this.neg().divmod(f5, a4), a4 !== "mod" && (d3 = x2.div.neg()), a4 !== "div" && (g4 = x2.mod.neg(), c5 && g4.negative !== 0 && g4.iadd(f5)), { div: d3, mod: g4 }) : this.negative === 0 && f5.negative !== 0 ? (x2 = this.divmod(f5.neg(), a4), a4 !== "mod" && (d3 = x2.div.neg()), { div: d3, mod: x2.mod }) : this.negative & f5.negative ? (x2 = this.neg().divmod(f5.neg(), a4), a4 !== "div" && (g4 = x2.mod.neg(), c5 && g4.negative !== 0 && g4.isub(f5)), { div: x2.div, mod: g4 }) : f5.length > this.length || this.cmp(f5) < 0 ? { div: new o5(0), mod: this } : f5.length === 1 ? a4 === "div" ? { div: this.divn(f5.words[0]), mod: null } : a4 === "mod" ? { div: null, mod: new o5(this.modrn(f5.words[0])) } : { div: this.divn(f5.words[0]), mod: new o5(this.modrn(f5.words[0])) } : this._wordDiv(f5, a4);
    }, o5.prototype.div = function(f5) {
      return this.divmod(f5, "div", false).div;
    }, o5.prototype.mod = function(f5) {
      return this.divmod(f5, "mod", false).mod;
    }, o5.prototype.umod = function(f5) {
      return this.divmod(f5, "mod", true).mod;
    }, o5.prototype.divRound = function(f5) {
      var a4 = this.divmod(f5);
      if (a4.mod.isZero()) return a4.div;
      var c5 = a4.div.negative !== 0 ? a4.mod.isub(f5) : a4.mod, d3 = f5.ushrn(1), g4 = f5.andln(1), x2 = c5.cmp(d3);
      return x2 < 0 || g4 === 1 && x2 === 0 ? a4.div : a4.div.negative !== 0 ? a4.div.isubn(1) : a4.div.iaddn(1);
    }, o5.prototype.modrn = function(f5) {
      var a4 = f5 < 0;
      a4 && (f5 = -f5), i3(f5 <= 67108863);
      for (var c5 = (1 << 26) % f5, d3 = 0, g4 = this.length - 1; g4 >= 0; g4--) d3 = (c5 * d3 + (this.words[g4] | 0)) % f5;
      return a4 ? -d3 : d3;
    }, o5.prototype.modn = function(f5) {
      return this.modrn(f5);
    }, o5.prototype.idivn = function(f5) {
      var a4 = f5 < 0;
      a4 && (f5 = -f5), i3(f5 <= 67108863);
      for (var c5 = 0, d3 = this.length - 1; d3 >= 0; d3--) {
        var g4 = (this.words[d3] | 0) + c5 * 67108864;
        this.words[d3] = g4 / f5 | 0, c5 = g4 % f5;
      }
      return this._strip(), a4 ? this.ineg() : this;
    }, o5.prototype.divn = function(f5) {
      return this.clone().idivn(f5);
    }, o5.prototype.egcd = function(f5) {
      i3(f5.negative === 0), i3(!f5.isZero());
      var a4 = this, c5 = f5.clone();
      a4.negative !== 0 ? a4 = a4.umod(f5) : a4 = a4.clone();
      for (var d3 = new o5(1), g4 = new o5(0), x2 = new o5(0), M4 = new o5(1), l4 = 0; a4.isEven() && c5.isEven(); ) a4.iushrn(1), c5.iushrn(1), ++l4;
      for (var s2 = c5.clone(), v4 = a4.clone(); !a4.isZero(); ) {
        for (var k3 = 0, u4 = 1; !(a4.words[0] & u4) && k3 < 26; ++k3, u4 <<= 1) ;
        if (k3 > 0) for (a4.iushrn(k3); k3-- > 0; ) (d3.isOdd() || g4.isOdd()) && (d3.iadd(s2), g4.isub(v4)), d3.iushrn(1), g4.iushrn(1);
        for (var E7 = 0, _2 = 1; !(c5.words[0] & _2) && E7 < 26; ++E7, _2 <<= 1) ;
        if (E7 > 0) for (c5.iushrn(E7); E7-- > 0; ) (x2.isOdd() || M4.isOdd()) && (x2.iadd(s2), M4.isub(v4)), x2.iushrn(1), M4.iushrn(1);
        a4.cmp(c5) >= 0 ? (a4.isub(c5), d3.isub(x2), g4.isub(M4)) : (c5.isub(a4), x2.isub(d3), M4.isub(g4));
      }
      return { a: x2, b: M4, gcd: c5.iushln(l4) };
    }, o5.prototype._invmp = function(f5) {
      i3(f5.negative === 0), i3(!f5.isZero());
      var a4 = this, c5 = f5.clone();
      a4.negative !== 0 ? a4 = a4.umod(f5) : a4 = a4.clone();
      for (var d3 = new o5(1), g4 = new o5(0), x2 = c5.clone(); a4.cmpn(1) > 0 && c5.cmpn(1) > 0; ) {
        for (var M4 = 0, l4 = 1; !(a4.words[0] & l4) && M4 < 26; ++M4, l4 <<= 1) ;
        if (M4 > 0) for (a4.iushrn(M4); M4-- > 0; ) d3.isOdd() && d3.iadd(x2), d3.iushrn(1);
        for (var s2 = 0, v4 = 1; !(c5.words[0] & v4) && s2 < 26; ++s2, v4 <<= 1) ;
        if (s2 > 0) for (c5.iushrn(s2); s2-- > 0; ) g4.isOdd() && g4.iadd(x2), g4.iushrn(1);
        a4.cmp(c5) >= 0 ? (a4.isub(c5), d3.isub(g4)) : (c5.isub(a4), g4.isub(d3));
      }
      var k3;
      return a4.cmpn(1) === 0 ? k3 = d3 : k3 = g4, k3.cmpn(0) < 0 && k3.iadd(f5), k3;
    }, o5.prototype.gcd = function(f5) {
      if (this.isZero()) return f5.abs();
      if (f5.isZero()) return this.abs();
      var a4 = this.clone(), c5 = f5.clone();
      a4.negative = 0, c5.negative = 0;
      for (var d3 = 0; a4.isEven() && c5.isEven(); d3++) a4.iushrn(1), c5.iushrn(1);
      do {
        for (; a4.isEven(); ) a4.iushrn(1);
        for (; c5.isEven(); ) c5.iushrn(1);
        var g4 = a4.cmp(c5);
        if (g4 < 0) {
          var x2 = a4;
          a4 = c5, c5 = x2;
        } else if (g4 === 0 || c5.cmpn(1) === 0) break;
        a4.isub(c5);
      } while (true);
      return c5.iushln(d3);
    }, o5.prototype.invm = function(f5) {
      return this.egcd(f5).a.umod(f5);
    }, o5.prototype.isEven = function() {
      return (this.words[0] & 1) === 0;
    }, o5.prototype.isOdd = function() {
      return (this.words[0] & 1) === 1;
    }, o5.prototype.andln = function(f5) {
      return this.words[0] & f5;
    }, o5.prototype.bincn = function(f5) {
      i3(typeof f5 == "number");
      var a4 = f5 % 26, c5 = (f5 - a4) / 26, d3 = 1 << a4;
      if (this.length <= c5) return this._expand(c5 + 1), this.words[c5] |= d3, this;
      for (var g4 = d3, x2 = c5; g4 !== 0 && x2 < this.length; x2++) {
        var M4 = this.words[x2] | 0;
        M4 += g4, g4 = M4 >>> 26, M4 &= 67108863, this.words[x2] = M4;
      }
      return g4 !== 0 && (this.words[x2] = g4, this.length++), this;
    }, o5.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, o5.prototype.cmpn = function(f5) {
      var a4 = f5 < 0;
      if (this.negative !== 0 && !a4) return -1;
      if (this.negative === 0 && a4) return 1;
      this._strip();
      var c5;
      if (this.length > 1) c5 = 1;
      else {
        a4 && (f5 = -f5), i3(f5 <= 67108863, "Number is too big");
        var d3 = this.words[0] | 0;
        c5 = d3 === f5 ? 0 : d3 < f5 ? -1 : 1;
      }
      return this.negative !== 0 ? -c5 | 0 : c5;
    }, o5.prototype.cmp = function(f5) {
      if (this.negative !== 0 && f5.negative === 0) return -1;
      if (this.negative === 0 && f5.negative !== 0) return 1;
      var a4 = this.ucmp(f5);
      return this.negative !== 0 ? -a4 | 0 : a4;
    }, o5.prototype.ucmp = function(f5) {
      if (this.length > f5.length) return 1;
      if (this.length < f5.length) return -1;
      for (var a4 = 0, c5 = this.length - 1; c5 >= 0; c5--) {
        var d3 = this.words[c5] | 0, g4 = f5.words[c5] | 0;
        if (d3 !== g4) {
          d3 < g4 ? a4 = -1 : d3 > g4 && (a4 = 1);
          break;
        }
      }
      return a4;
    }, o5.prototype.gtn = function(f5) {
      return this.cmpn(f5) === 1;
    }, o5.prototype.gt = function(f5) {
      return this.cmp(f5) === 1;
    }, o5.prototype.gten = function(f5) {
      return this.cmpn(f5) >= 0;
    }, o5.prototype.gte = function(f5) {
      return this.cmp(f5) >= 0;
    }, o5.prototype.ltn = function(f5) {
      return this.cmpn(f5) === -1;
    }, o5.prototype.lt = function(f5) {
      return this.cmp(f5) === -1;
    }, o5.prototype.lten = function(f5) {
      return this.cmpn(f5) <= 0;
    }, o5.prototype.lte = function(f5) {
      return this.cmp(f5) <= 0;
    }, o5.prototype.eqn = function(f5) {
      return this.cmpn(f5) === 0;
    }, o5.prototype.eq = function(f5) {
      return this.cmp(f5) === 0;
    }, o5.red = function(f5) {
      return new Y(f5);
    }, o5.prototype.toRed = function(f5) {
      return i3(!this.red, "Already a number in reduction context"), i3(this.negative === 0, "red works only with positives"), f5.convertTo(this)._forceRed(f5);
    }, o5.prototype.fromRed = function() {
      return i3(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, o5.prototype._forceRed = function(f5) {
      return this.red = f5, this;
    }, o5.prototype.forceRed = function(f5) {
      return i3(!this.red, "Already a number in reduction context"), this._forceRed(f5);
    }, o5.prototype.redAdd = function(f5) {
      return i3(this.red, "redAdd works only with red numbers"), this.red.add(this, f5);
    }, o5.prototype.redIAdd = function(f5) {
      return i3(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, f5);
    }, o5.prototype.redSub = function(f5) {
      return i3(this.red, "redSub works only with red numbers"), this.red.sub(this, f5);
    }, o5.prototype.redISub = function(f5) {
      return i3(this.red, "redISub works only with red numbers"), this.red.isub(this, f5);
    }, o5.prototype.redShl = function(f5) {
      return i3(this.red, "redShl works only with red numbers"), this.red.shl(this, f5);
    }, o5.prototype.redMul = function(f5) {
      return i3(this.red, "redMul works only with red numbers"), this.red._verify2(this, f5), this.red.mul(this, f5);
    }, o5.prototype.redIMul = function(f5) {
      return i3(this.red, "redMul works only with red numbers"), this.red._verify2(this, f5), this.red.imul(this, f5);
    }, o5.prototype.redSqr = function() {
      return i3(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, o5.prototype.redISqr = function() {
      return i3(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, o5.prototype.redSqrt = function() {
      return i3(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, o5.prototype.redInvm = function() {
      return i3(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, o5.prototype.redNeg = function() {
      return i3(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, o5.prototype.redPow = function(f5) {
      return i3(this.red && !f5.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, f5);
    };
    var H = { k256: null, p224: null, p192: null, p25519: null };
    function z5(A4, f5) {
      this.name = A4, this.p = new o5(f5, 16), this.n = this.p.bitLength(), this.k = new o5(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    z5.prototype._tmp = function() {
      var f5 = new o5(null);
      return f5.words = new Array(Math.ceil(this.n / 13)), f5;
    }, z5.prototype.ireduce = function(f5) {
      var a4 = f5, c5;
      do
        this.split(a4, this.tmp), a4 = this.imulK(a4), a4 = a4.iadd(this.tmp), c5 = a4.bitLength();
      while (c5 > this.n);
      var d3 = c5 < this.n ? -1 : a4.ucmp(this.p);
      return d3 === 0 ? (a4.words[0] = 0, a4.length = 1) : d3 > 0 ? a4.isub(this.p) : a4.strip !== void 0 ? a4.strip() : a4._strip(), a4;
    }, z5.prototype.split = function(f5, a4) {
      f5.iushrn(this.n, 0, a4);
    }, z5.prototype.imulK = function(f5) {
      return f5.imul(this.k);
    };
    function Pt2() {
      z5.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
    }
    n4(Pt2, z5), Pt2.prototype.split = function(f5, a4) {
      for (var c5 = 4194303, d3 = Math.min(f5.length, 9), g4 = 0; g4 < d3; g4++) a4.words[g4] = f5.words[g4];
      if (a4.length = d3, f5.length <= 9) {
        f5.words[0] = 0, f5.length = 1;
        return;
      }
      var x2 = f5.words[9];
      for (a4.words[a4.length++] = x2 & c5, g4 = 10; g4 < f5.length; g4++) {
        var M4 = f5.words[g4] | 0;
        f5.words[g4 - 10] = (M4 & c5) << 4 | x2 >>> 22, x2 = M4;
      }
      x2 >>>= 22, f5.words[g4 - 10] = x2, x2 === 0 && f5.length > 10 ? f5.length -= 10 : f5.length -= 9;
    }, Pt2.prototype.imulK = function(f5) {
      f5.words[f5.length] = 0, f5.words[f5.length + 1] = 0, f5.length += 2;
      for (var a4 = 0, c5 = 0; c5 < f5.length; c5++) {
        var d3 = f5.words[c5] | 0;
        a4 += d3 * 977, f5.words[c5] = a4 & 67108863, a4 = d3 * 64 + (a4 / 67108864 | 0);
      }
      return f5.words[f5.length - 1] === 0 && (f5.length--, f5.words[f5.length - 1] === 0 && f5.length--), f5;
    };
    function W2() {
      z5.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
    }
    n4(W2, z5);
    function Rt2() {
      z5.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
    }
    n4(Rt2, z5);
    function Yt3() {
      z5.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
    }
    n4(Yt3, z5), Yt3.prototype.imulK = function(f5) {
      for (var a4 = 0, c5 = 0; c5 < f5.length; c5++) {
        var d3 = (f5.words[c5] | 0) * 19 + a4, g4 = d3 & 67108863;
        d3 >>>= 26, f5.words[c5] = g4, a4 = d3;
      }
      return a4 !== 0 && (f5.words[f5.length++] = a4), f5;
    }, o5._prime = function(f5) {
      if (H[f5]) return H[f5];
      var a4;
      if (f5 === "k256") a4 = new Pt2();
      else if (f5 === "p224") a4 = new W2();
      else if (f5 === "p192") a4 = new Rt2();
      else if (f5 === "p25519") a4 = new Yt3();
      else throw new Error("Unknown prime " + f5);
      return H[f5] = a4, a4;
    };
    function Y(A4) {
      if (typeof A4 == "string") {
        var f5 = o5._prime(A4);
        this.m = f5.p, this.prime = f5;
      } else i3(A4.gtn(1), "modulus must be greater than 1"), this.m = A4, this.prime = null;
    }
    Y.prototype._verify1 = function(f5) {
      i3(f5.negative === 0, "red works only with positives"), i3(f5.red, "red works only with red numbers");
    }, Y.prototype._verify2 = function(f5, a4) {
      i3((f5.negative | a4.negative) === 0, "red works only with positives"), i3(f5.red && f5.red === a4.red, "red works only with red numbers");
    }, Y.prototype.imod = function(f5) {
      return this.prime ? this.prime.ireduce(f5)._forceRed(this) : (w4(f5, f5.umod(this.m)._forceRed(this)), f5);
    }, Y.prototype.neg = function(f5) {
      return f5.isZero() ? f5.clone() : this.m.sub(f5)._forceRed(this);
    }, Y.prototype.add = function(f5, a4) {
      this._verify2(f5, a4);
      var c5 = f5.add(a4);
      return c5.cmp(this.m) >= 0 && c5.isub(this.m), c5._forceRed(this);
    }, Y.prototype.iadd = function(f5, a4) {
      this._verify2(f5, a4);
      var c5 = f5.iadd(a4);
      return c5.cmp(this.m) >= 0 && c5.isub(this.m), c5;
    }, Y.prototype.sub = function(f5, a4) {
      this._verify2(f5, a4);
      var c5 = f5.sub(a4);
      return c5.cmpn(0) < 0 && c5.iadd(this.m), c5._forceRed(this);
    }, Y.prototype.isub = function(f5, a4) {
      this._verify2(f5, a4);
      var c5 = f5.isub(a4);
      return c5.cmpn(0) < 0 && c5.iadd(this.m), c5;
    }, Y.prototype.shl = function(f5, a4) {
      return this._verify1(f5), this.imod(f5.ushln(a4));
    }, Y.prototype.imul = function(f5, a4) {
      return this._verify2(f5, a4), this.imod(f5.imul(a4));
    }, Y.prototype.mul = function(f5, a4) {
      return this._verify2(f5, a4), this.imod(f5.mul(a4));
    }, Y.prototype.isqr = function(f5) {
      return this.imul(f5, f5.clone());
    }, Y.prototype.sqr = function(f5) {
      return this.mul(f5, f5);
    }, Y.prototype.sqrt = function(f5) {
      if (f5.isZero()) return f5.clone();
      var a4 = this.m.andln(3);
      if (i3(a4 % 2 === 1), a4 === 3) {
        var c5 = this.m.add(new o5(1)).iushrn(2);
        return this.pow(f5, c5);
      }
      for (var d3 = this.m.subn(1), g4 = 0; !d3.isZero() && d3.andln(1) === 0; ) g4++, d3.iushrn(1);
      i3(!d3.isZero());
      var x2 = new o5(1).toRed(this), M4 = x2.redNeg(), l4 = this.m.subn(1).iushrn(1), s2 = this.m.bitLength();
      for (s2 = new o5(2 * s2 * s2).toRed(this); this.pow(s2, l4).cmp(M4) !== 0; ) s2.redIAdd(M4);
      for (var v4 = this.pow(s2, d3), k3 = this.pow(f5, d3.addn(1).iushrn(1)), u4 = this.pow(f5, d3), E7 = g4; u4.cmp(x2) !== 0; ) {
        for (var _2 = u4, B2 = 0; _2.cmp(x2) !== 0; B2++) _2 = _2.redSqr();
        i3(B2 < E7);
        var R2 = this.pow(v4, new o5(1).iushln(E7 - B2 - 1));
        k3 = k3.redMul(R2), v4 = R2.redSqr(), u4 = u4.redMul(v4), E7 = B2;
      }
      return k3;
    }, Y.prototype.invm = function(f5) {
      var a4 = f5._invmp(this.m);
      return a4.negative !== 0 ? (a4.negative = 0, this.imod(a4).redNeg()) : this.imod(a4);
    }, Y.prototype.pow = function(f5, a4) {
      if (a4.isZero()) return new o5(1).toRed(this);
      if (a4.cmpn(1) === 0) return f5.clone();
      var c5 = 4, d3 = new Array(1 << c5);
      d3[0] = new o5(1).toRed(this), d3[1] = f5;
      for (var g4 = 2; g4 < d3.length; g4++) d3[g4] = this.mul(d3[g4 - 1], f5);
      var x2 = d3[0], M4 = 0, l4 = 0, s2 = a4.bitLength() % 26;
      for (s2 === 0 && (s2 = 26), g4 = a4.length - 1; g4 >= 0; g4--) {
        for (var v4 = a4.words[g4], k3 = s2 - 1; k3 >= 0; k3--) {
          var u4 = v4 >> k3 & 1;
          if (x2 !== d3[0] && (x2 = this.sqr(x2)), u4 === 0 && M4 === 0) {
            l4 = 0;
            continue;
          }
          M4 <<= 1, M4 |= u4, l4++, !(l4 !== c5 && (g4 !== 0 || k3 !== 0)) && (x2 = this.mul(x2, d3[M4]), l4 = 0, M4 = 0);
        }
        s2 = 26;
      }
      return x2;
    }, Y.prototype.convertTo = function(f5) {
      var a4 = f5.umod(this.m);
      return a4 === f5 ? a4.clone() : a4;
    }, Y.prototype.convertFrom = function(f5) {
      var a4 = f5.clone();
      return a4.red = null, a4;
    }, o5.mont = function(f5) {
      return new Vt3(f5);
    };
    function Vt3(A4) {
      Y.call(this, A4), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new o5(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    n4(Vt3, Y), Vt3.prototype.convertTo = function(f5) {
      return this.imod(f5.ushln(this.shift));
    }, Vt3.prototype.convertFrom = function(f5) {
      var a4 = this.imod(f5.mul(this.rinv));
      return a4.red = null, a4;
    }, Vt3.prototype.imul = function(f5, a4) {
      if (f5.isZero() || a4.isZero()) return f5.words[0] = 0, f5.length = 1, f5;
      var c5 = f5.imul(a4), d3 = c5.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), g4 = c5.isub(d3).iushrn(this.shift), x2 = g4;
      return g4.cmp(this.m) >= 0 ? x2 = g4.isub(this.m) : g4.cmpn(0) < 0 && (x2 = g4.iadd(this.m)), x2._forceRed(this);
    }, Vt3.prototype.mul = function(f5, a4) {
      if (f5.isZero() || a4.isZero()) return new o5(0)._forceRed(this);
      var c5 = f5.mul(a4), d3 = c5.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), g4 = c5.isub(d3).iushrn(this.shift), x2 = g4;
      return g4.cmp(this.m) >= 0 ? x2 = g4.isub(this.m) : g4.cmpn(0) < 0 && (x2 = g4.iadd(this.m)), x2._forceRed(this);
    }, Vt3.prototype.invm = function(f5) {
      var a4 = this.imod(f5._invmp(this.m).mul(this.r2));
      return a4._forceRed(this);
    };
  })(e2, On);
})(Ln);
var K = Ln.exports;
var jn = "bignumber/5.7.0";
var Rr = K.BN;
var Ae = new L(jn);
var wi = {};
var Qn = 9007199254740991;
function C0(e2) {
  return e2 != null && (V.isBigNumber(e2) || typeof e2 == "number" && e2 % 1 === 0 || typeof e2 == "string" && !!e2.match(/^-?[0-9]+$/) || Qt(e2) || typeof e2 == "bigint" || ir(e2));
}
var Jn = false;
var V = class _V {
  constructor(t, r3) {
    t !== wi && Ae.throwError("cannot call constructor directly; use BigNumber.from", L.errors.UNSUPPORTED_OPERATION, { operation: "new (BigNumber)" }), this._hex = r3, this._isBigNumber = true, Object.freeze(this);
  }
  fromTwos(t) {
    return Lt(j(this).fromTwos(t));
  }
  toTwos(t) {
    return Lt(j(this).toTwos(t));
  }
  abs() {
    return this._hex[0] === "-" ? _V.from(this._hex.substring(1)) : this;
  }
  add(t) {
    return Lt(j(this).add(j(t)));
  }
  sub(t) {
    return Lt(j(this).sub(j(t)));
  }
  div(t) {
    return _V.from(t).isZero() && Wt("division-by-zero", "div"), Lt(j(this).div(j(t)));
  }
  mul(t) {
    return Lt(j(this).mul(j(t)));
  }
  mod(t) {
    const r3 = j(t);
    return r3.isNeg() && Wt("division-by-zero", "mod"), Lt(j(this).umod(r3));
  }
  pow(t) {
    const r3 = j(t);
    return r3.isNeg() && Wt("negative-power", "pow"), Lt(j(this).pow(r3));
  }
  and(t) {
    const r3 = j(t);
    return (this.isNegative() || r3.isNeg()) && Wt("unbound-bitwise-result", "and"), Lt(j(this).and(r3));
  }
  or(t) {
    const r3 = j(t);
    return (this.isNegative() || r3.isNeg()) && Wt("unbound-bitwise-result", "or"), Lt(j(this).or(r3));
  }
  xor(t) {
    const r3 = j(t);
    return (this.isNegative() || r3.isNeg()) && Wt("unbound-bitwise-result", "xor"), Lt(j(this).xor(r3));
  }
  mask(t) {
    return (this.isNegative() || t < 0) && Wt("negative-width", "mask"), Lt(j(this).maskn(t));
  }
  shl(t) {
    return (this.isNegative() || t < 0) && Wt("negative-width", "shl"), Lt(j(this).shln(t));
  }
  shr(t) {
    return (this.isNegative() || t < 0) && Wt("negative-width", "shr"), Lt(j(this).shrn(t));
  }
  eq(t) {
    return j(this).eq(j(t));
  }
  lt(t) {
    return j(this).lt(j(t));
  }
  lte(t) {
    return j(this).lte(j(t));
  }
  gt(t) {
    return j(this).gt(j(t));
  }
  gte(t) {
    return j(this).gte(j(t));
  }
  isNegative() {
    return this._hex[0] === "-";
  }
  isZero() {
    return j(this).isZero();
  }
  toNumber() {
    try {
      return j(this).toNumber();
    } catch {
      Wt("overflow", "toNumber", this.toString());
    }
    return null;
  }
  toBigInt() {
    try {
      return BigInt(this.toString());
    } catch {
    }
    return Ae.throwError("this platform does not support BigInt", L.errors.UNSUPPORTED_OPERATION, { value: this.toString() });
  }
  toString() {
    return arguments.length > 0 && (arguments[0] === 10 ? Jn || (Jn = true, Ae.warn("BigNumber.toString does not accept any parameters; base-10 is assumed")) : arguments[0] === 16 ? Ae.throwError("BigNumber.toString does not accept any parameters; use bigNumber.toHexString()", L.errors.UNEXPECTED_ARGUMENT, {}) : Ae.throwError("BigNumber.toString does not accept parameters", L.errors.UNEXPECTED_ARGUMENT, {})), j(this).toString(10);
  }
  toHexString() {
    return this._hex;
  }
  toJSON(t) {
    return { type: "BigNumber", hex: this.toHexString() };
  }
  static from(t) {
    if (t instanceof _V) return t;
    if (typeof t == "string") return t.match(/^-?0x[0-9a-f]+$/i) ? new _V(wi, vr(t)) : t.match(/^-?[0-9]+$/) ? new _V(wi, vr(new Rr(t))) : Ae.throwArgumentError("invalid BigNumber string", "value", t);
    if (typeof t == "number") return t % 1 && Wt("underflow", "BigNumber.from", t), (t >= Qn || t <= -Qn) && Wt("overflow", "BigNumber.from", t), _V.from(String(t));
    const r3 = t;
    if (typeof r3 == "bigint") return _V.from(r3.toString());
    if (ir(r3)) return _V.from(Kt(r3));
    if (r3) if (r3.toHexString) {
      const i3 = r3.toHexString();
      if (typeof i3 == "string") return _V.from(i3);
    } else {
      let i3 = r3._hex;
      if (i3 == null && r3.type === "BigNumber" && (i3 = r3.hex), typeof i3 == "string" && (Qt(i3) || i3[0] === "-" && Qt(i3.substring(1)))) return _V.from(i3);
    }
    return Ae.throwArgumentError("invalid BigNumber value", "value", t);
  }
  static isBigNumber(t) {
    return !!(t && t._isBigNumber);
  }
};
function vr(e2) {
  if (typeof e2 != "string") return vr(e2.toString(16));
  if (e2[0] === "-") return e2 = e2.substring(1), e2[0] === "-" && Ae.throwArgumentError("invalid hex", "value", e2), e2 = vr(e2), e2 === "0x00" ? e2 : "-" + e2;
  if (e2.substring(0, 2) !== "0x" && (e2 = "0x" + e2), e2 === "0x") return "0x00";
  for (e2.length % 2 && (e2 = "0x0" + e2.substring(2)); e2.length > 4 && e2.substring(0, 4) === "0x00"; ) e2 = "0x" + e2.substring(4);
  return e2;
}
function Lt(e2) {
  return V.from(vr(e2));
}
function j(e2) {
  const t = V.from(e2).toHexString();
  return t[0] === "-" ? new Rr("-" + t.substring(3), 16) : new Rr(t.substring(2), 16);
}
function Wt(e2, t, r3) {
  const i3 = { fault: e2, operation: t };
  return r3 != null && (i3.value = r3), Ae.throwError(e2, L.errors.NUMERIC_FAULT, i3);
}
function R0(e2) {
  return new Rr(e2, 36).toString(16);
}
var Ht = new L(jn);
var mr = {};
var Gn = V.from(0);
var Yn = V.from(-1);
function Vn(e2, t, r3, i3) {
  const n4 = { fault: t, operation: r3 };
  return i3 !== void 0 && (n4.value = i3), Ht.throwError(e2, L.errors.NUMERIC_FAULT, n4);
}
var gr = "0";
for (; gr.length < 256; ) gr += gr;
function xi(e2) {
  if (typeof e2 != "number") try {
    e2 = V.from(e2).toNumber();
  } catch {
  }
  return typeof e2 == "number" && e2 >= 0 && e2 <= 256 && !(e2 % 1) ? "1" + gr.substring(0, e2) : Ht.throwArgumentError("invalid decimal size", "decimals", e2);
}
function Mi(e2, t) {
  t == null && (t = 0);
  const r3 = xi(t);
  e2 = V.from(e2);
  const i3 = e2.lt(Gn);
  i3 && (e2 = e2.mul(Yn));
  let n4 = e2.mod(r3).toString();
  for (; n4.length < r3.length - 1; ) n4 = "0" + n4;
  n4 = n4.match(/^([0-9]*[1-9]|0)(0*)/)[1];
  const o5 = e2.div(r3).toString();
  return r3.length === 1 ? e2 = o5 : e2 = o5 + "." + n4, i3 && (e2 = "-" + e2), e2;
}
function be(e2, t) {
  t == null && (t = 0);
  const r3 = xi(t);
  (typeof e2 != "string" || !e2.match(/^-?[0-9.]+$/)) && Ht.throwArgumentError("invalid decimal value", "value", e2);
  const i3 = e2.substring(0, 1) === "-";
  i3 && (e2 = e2.substring(1)), e2 === "." && Ht.throwArgumentError("missing value", "value", e2);
  const n4 = e2.split(".");
  n4.length > 2 && Ht.throwArgumentError("too many decimal points", "value", e2);
  let o5 = n4[0], h4 = n4[1];
  for (o5 || (o5 = "0"), h4 || (h4 = "0"); h4[h4.length - 1] === "0"; ) h4 = h4.substring(0, h4.length - 1);
  for (h4.length > r3.length - 1 && Vn("fractional component exceeds decimals", "underflow", "parseFixed"), h4 === "" && (h4 = "0"); h4.length < r3.length - 1; ) h4 += "0";
  const p4 = V.from(o5), b4 = V.from(h4);
  let m3 = p4.mul(r3).add(b4);
  return i3 && (m3 = m3.mul(Yn)), m3;
}
var dr = class _dr {
  constructor(t, r3, i3, n4) {
    t !== mr && Ht.throwError("cannot use FixedFormat constructor; use FixedFormat.from", L.errors.UNSUPPORTED_OPERATION, { operation: "new FixedFormat" }), this.signed = r3, this.width = i3, this.decimals = n4, this.name = (r3 ? "" : "u") + "fixed" + String(i3) + "x" + String(n4), this._multiplier = xi(n4), Object.freeze(this);
  }
  static from(t) {
    if (t instanceof _dr) return t;
    typeof t == "number" && (t = `fixed128x${t}`);
    let r3 = true, i3 = 128, n4 = 18;
    if (typeof t == "string") {
      if (t !== "fixed") if (t === "ufixed") r3 = false;
      else {
        const o5 = t.match(/^(u?)fixed([0-9]+)x([0-9]+)$/);
        o5 || Ht.throwArgumentError("invalid fixed format", "format", t), r3 = o5[1] !== "u", i3 = parseInt(o5[2]), n4 = parseInt(o5[3]);
      }
    } else if (t) {
      const o5 = (h4, p4, b4) => t[h4] == null ? b4 : (typeof t[h4] !== p4 && Ht.throwArgumentError("invalid fixed format (" + h4 + " not " + p4 + ")", "format." + h4, t[h4]), t[h4]);
      r3 = o5("signed", "boolean", r3), i3 = o5("width", "number", i3), n4 = o5("decimals", "number", n4);
    }
    return i3 % 8 && Ht.throwArgumentError("invalid fixed format width (not byte aligned)", "format.width", i3), n4 > 80 && Ht.throwArgumentError("invalid fixed format (decimals too large)", "format.decimals", n4), new _dr(mr, r3, i3, n4);
  }
};
var Ut = class _Ut {
  constructor(t, r3, i3, n4) {
    t !== mr && Ht.throwError("cannot use FixedNumber constructor; use FixedNumber.from", L.errors.UNSUPPORTED_OPERATION, { operation: "new FixedFormat" }), this.format = n4, this._hex = r3, this._value = i3, this._isFixedNumber = true, Object.freeze(this);
  }
  _checkFormat(t) {
    this.format.name !== t.format.name && Ht.throwArgumentError("incompatible format; use fixedNumber.toFormat", "other", t);
  }
  addUnsafe(t) {
    this._checkFormat(t);
    const r3 = be(this._value, this.format.decimals), i3 = be(t._value, t.format.decimals);
    return _Ut.fromValue(r3.add(i3), this.format.decimals, this.format);
  }
  subUnsafe(t) {
    this._checkFormat(t);
    const r3 = be(this._value, this.format.decimals), i3 = be(t._value, t.format.decimals);
    return _Ut.fromValue(r3.sub(i3), this.format.decimals, this.format);
  }
  mulUnsafe(t) {
    this._checkFormat(t);
    const r3 = be(this._value, this.format.decimals), i3 = be(t._value, t.format.decimals);
    return _Ut.fromValue(r3.mul(i3).div(this.format._multiplier), this.format.decimals, this.format);
  }
  divUnsafe(t) {
    this._checkFormat(t);
    const r3 = be(this._value, this.format.decimals), i3 = be(t._value, t.format.decimals);
    return _Ut.fromValue(r3.mul(this.format._multiplier).div(i3), this.format.decimals, this.format);
  }
  floor() {
    const t = this.toString().split(".");
    t.length === 1 && t.push("0");
    let r3 = _Ut.from(t[0], this.format);
    const i3 = !t[1].match(/^(0*)$/);
    return this.isNegative() && i3 && (r3 = r3.subUnsafe(Wn.toFormat(r3.format))), r3;
  }
  ceiling() {
    const t = this.toString().split(".");
    t.length === 1 && t.push("0");
    let r3 = _Ut.from(t[0], this.format);
    const i3 = !t[1].match(/^(0*)$/);
    return !this.isNegative() && i3 && (r3 = r3.addUnsafe(Wn.toFormat(r3.format))), r3;
  }
  round(t) {
    t == null && (t = 0);
    const r3 = this.toString().split(".");
    if (r3.length === 1 && r3.push("0"), (t < 0 || t > 80 || t % 1) && Ht.throwArgumentError("invalid decimal count", "decimals", t), r3[1].length <= t) return this;
    const i3 = _Ut.from("1" + gr.substring(0, t), this.format), n4 = O0.toFormat(this.format);
    return this.mulUnsafe(i3).addUnsafe(n4).floor().divUnsafe(i3);
  }
  isZero() {
    return this._value === "0.0" || this._value === "0";
  }
  isNegative() {
    return this._value[0] === "-";
  }
  toString() {
    return this._value;
  }
  toHexString(t) {
    if (t == null) return this._hex;
    t % 8 && Ht.throwArgumentError("invalid byte width", "width", t);
    const r3 = V.from(this._hex).fromTwos(this.format.width).toTwos(t).toHexString();
    return oe(r3, t / 8);
  }
  toUnsafeFloat() {
    return parseFloat(this.toString());
  }
  toFormat(t) {
    return _Ut.fromString(this._value, t);
  }
  static fromValue(t, r3, i3) {
    return i3 == null && r3 != null && !C0(r3) && (i3 = r3, r3 = null), r3 == null && (r3 = 0), i3 == null && (i3 = "fixed"), _Ut.fromString(Mi(t, r3), dr.from(i3));
  }
  static fromString(t, r3) {
    r3 == null && (r3 = "fixed");
    const i3 = dr.from(r3), n4 = be(t, i3.decimals);
    !i3.signed && n4.lt(Gn) && Vn("unsigned value cannot be negative", "overflow", "value", t);
    let o5 = null;
    i3.signed ? o5 = n4.toTwos(i3.width).toHexString() : (o5 = n4.toHexString(), o5 = oe(o5, i3.width / 8));
    const h4 = Mi(n4, i3.decimals);
    return new _Ut(mr, o5, h4, i3);
  }
  static fromBytes(t, r3) {
    r3 == null && (r3 = "fixed");
    const i3 = dr.from(r3);
    if (Ot(t).length > i3.width / 8) throw new Error("overflow");
    let n4 = V.from(t);
    i3.signed && (n4 = n4.fromTwos(i3.width));
    const o5 = n4.toTwos((i3.signed ? 0 : 1) + i3.width).toHexString(), h4 = Mi(n4, i3.decimals);
    return new _Ut(mr, o5, h4, i3);
  }
  static from(t, r3) {
    if (typeof t == "string") return _Ut.fromString(t, r3);
    if (ir(t)) return _Ut.fromBytes(t, r3);
    try {
      return _Ut.fromValue(t, 0, r3);
    } catch (i3) {
      if (i3.code !== L.errors.INVALID_ARGUMENT) throw i3;
    }
    return Ht.throwArgumentError("invalid FixedNumber value", "value", t);
  }
  static isFixedNumber(t) {
    return !!(t && t._isFixedNumber);
  }
};
var Wn = Ut.from(1);
var O0 = Ut.from("0.5");
var P0 = "strings/5.7.0";
var Xn = new L(P0);
var Or;
(function(e2) {
  e2.current = "", e2.NFC = "NFC", e2.NFD = "NFD", e2.NFKC = "NFKC", e2.NFKD = "NFKD";
})(Or || (Or = {}));
var nr;
(function(e2) {
  e2.UNEXPECTED_CONTINUE = "unexpected continuation byte", e2.BAD_PREFIX = "bad codepoint prefix", e2.OVERRUN = "string overrun", e2.MISSING_CONTINUE = "missing continuation byte", e2.OUT_OF_RANGE = "out of UTF-8 range", e2.UTF16_SURROGATE = "UTF-16 surrogate", e2.OVERLONG = "overlong representation";
})(nr || (nr = {}));
function D0(e2, t, r3, i3, n4) {
  return Xn.throwArgumentError(`invalid codepoint at offset ${t}; ${e2}`, "bytes", r3);
}
function Zn(e2, t, r3, i3, n4) {
  if (e2 === nr.BAD_PREFIX || e2 === nr.UNEXPECTED_CONTINUE) {
    let o5 = 0;
    for (let h4 = t + 1; h4 < r3.length && r3[h4] >> 6 === 2; h4++) o5++;
    return o5;
  }
  return e2 === nr.OVERRUN ? r3.length - t - 1 : 0;
}
function F0(e2, t, r3, i3, n4) {
  return e2 === nr.OVERLONG ? (i3.push(n4), 0) : (i3.push(65533), Zn(e2, t, r3));
}
Object.freeze({ error: D0, ignore: Zn, replace: F0 });
function Ei(e2, t = Or.current) {
  t != Or.current && (Xn.checkNormalize(), e2 = e2.normalize(t));
  let r3 = [];
  for (let i3 = 0; i3 < e2.length; i3++) {
    const n4 = e2.charCodeAt(i3);
    if (n4 < 128) r3.push(n4);
    else if (n4 < 2048) r3.push(n4 >> 6 | 192), r3.push(n4 & 63 | 128);
    else if ((n4 & 64512) == 55296) {
      i3++;
      const o5 = e2.charCodeAt(i3);
      if (i3 >= e2.length || (o5 & 64512) !== 56320) throw new Error("invalid utf-8 string");
      const h4 = 65536 + ((n4 & 1023) << 10) + (o5 & 1023);
      r3.push(h4 >> 18 | 240), r3.push(h4 >> 12 & 63 | 128), r3.push(h4 >> 6 & 63 | 128), r3.push(h4 & 63 | 128);
    } else r3.push(n4 >> 12 | 224), r3.push(n4 >> 6 & 63 | 128), r3.push(n4 & 63 | 128);
  }
  return Ot(r3);
}
function T0(e2) {
  if (e2.length % 4 !== 0) throw new Error("bad data");
  let t = [];
  for (let r3 = 0; r3 < e2.length; r3 += 4) t.push(parseInt(e2.substring(r3, r3 + 4), 16));
  return t;
}
function Si(e2, t) {
  t || (t = function(n4) {
    return [parseInt(n4, 16)];
  });
  let r3 = 0, i3 = {};
  return e2.split(",").forEach((n4) => {
    let o5 = n4.split(":");
    r3 += parseInt(o5[0], 16), i3[r3] = t(o5[1]);
  }), i3;
}
function $n(e2) {
  let t = 0;
  return e2.split(",").map((r3) => {
    let i3 = r3.split("-");
    i3.length === 1 ? i3[1] = "0" : i3[1] === "" && (i3[1] = "1");
    let n4 = t + parseInt(i3[0], 16);
    return t = parseInt(i3[1], 16), { l: n4, h: t };
  });
}
$n("221,13-1b,5f-,40-10,51-f,11-3,3-3,2-2,2-4,8,2,15,2d,28-8,88,48,27-,3-5,11-20,27-,8,28,3-5,12,18,b-a,1c-4,6-16,2-d,2-2,2,1b-4,17-9,8f-,10,f,1f-2,1c-34,33-14e,4,36-,13-,6-2,1a-f,4,9-,3-,17,8,2-2,5-,2,8-,3-,4-8,2-3,3,6-,16-6,2-,7-3,3-,17,8,3,3,3-,2,6-3,3-,4-a,5,2-6,10-b,4,8,2,4,17,8,3,6-,b,4,4-,2-e,2-4,b-10,4,9-,3-,17,8,3-,5-,9-2,3-,4-7,3-3,3,4-3,c-10,3,7-2,4,5-2,3,2,3-2,3-2,4-2,9,4-3,6-2,4,5-8,2-e,d-d,4,9,4,18,b,6-3,8,4,5-6,3-8,3-3,b-11,3,9,4,18,b,6-3,8,4,5-6,3-6,2,3-3,b-11,3,9,4,18,11-3,7-,4,5-8,2-7,3-3,b-11,3,13-2,19,a,2-,8-2,2-3,7,2,9-11,4-b,3b-3,1e-24,3,2-,3,2-,2-5,5,8,4,2,2-,3,e,4-,6,2,7-,b-,3-21,49,23-5,1c-3,9,25,10-,2-2f,23,6,3,8-2,5-5,1b-45,27-9,2a-,2-3,5b-4,45-4,53-5,8,40,2,5-,8,2,5-,28,2,5-,20,2,5-,8,2,5-,8,8,18,20,2,5-,8,28,14-5,1d-22,56-b,277-8,1e-2,52-e,e,8-a,18-8,15-b,e,4,3-b,5e-2,b-15,10,b-5,59-7,2b-555,9d-3,5b-5,17-,7-,27-,7-,9,2,2,2,20-,36,10,f-,7,14-,4,a,54-3,2-6,6-5,9-,1c-10,13-1d,1c-14,3c-,10-6,32-b,240-30,28-18,c-14,a0,115-,3,66-,b-76,5,5-,1d,24,2,5-2,2,8-,35-2,19,f-10,1d-3,311-37f,1b,5a-b,d7-19,d-3,41,57-,68-4,29-3,5f,29-37,2e-2,25-c,2c-2,4e-3,30,78-3,64-,20,19b7-49,51a7-59,48e-2,38-738,2ba5-5b,222f-,3c-94,8-b,6-4,1b,6,2,3,3,6d-20,16e-f,41-,37-7,2e-2,11-f,5-b,18-,b,14,5-3,6,88-,2,bf-2,7-,7-,7-,4-2,8,8-9,8-2ff,20,5-b,1c-b4,27-,27-cbb1,f7-9,28-2,b5-221,56,48,3-,2-,3-,5,d,2,5,3,42,5-,9,8,1d,5,6,2-2,8,153-3,123-3,33-27fd,a6da-5128,21f-5df,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3,2-1d,61-ff7d"), "ad,34f,1806,180b,180c,180d,200b,200c,200d,2060,feff".split(",").map((e2) => parseInt(e2, 16)), Si("b5:3bc,c3:ff,7:73,2:253,5:254,3:256,1:257,5:259,1:25b,3:260,1:263,2:269,1:268,5:26f,1:272,2:275,7:280,3:283,5:288,3:28a,1:28b,5:292,3f:195,1:1bf,29:19e,125:3b9,8b:3b2,1:3b8,1:3c5,3:3c6,1:3c0,1a:3ba,1:3c1,1:3c3,2:3b8,1:3b5,1bc9:3b9,1c:1f76,1:1f77,f:1f7a,1:1f7b,d:1f78,1:1f79,1:1f7c,1:1f7d,107:63,5:25b,4:68,1:68,1:68,3:69,1:69,1:6c,3:6e,4:70,1:71,1:72,1:72,1:72,7:7a,2:3c9,2:7a,2:6b,1:e5,1:62,1:63,3:65,1:66,2:6d,b:3b3,1:3c0,6:64,1b574:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3"), Si("179:1,2:1,2:1,5:1,2:1,a:4f,a:1,8:1,2:1,2:1,3:1,5:1,3:1,4:1,2:1,3:1,4:1,8:2,1:1,2:2,1:1,2:2,27:2,195:26,2:25,1:25,1:25,2:40,2:3f,1:3f,33:1,11:-6,1:-9,1ac7:-3a,6d:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,b:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,c:-8,2:-8,2:-8,2:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,49:-8,1:-8,1:-4a,1:-4a,d:-56,1:-56,1:-56,1:-56,d:-8,1:-8,f:-8,1:-8,3:-7"), Si("df:00730073,51:00690307,19:02BC006E,a7:006A030C,18a:002003B9,16:03B903080301,20:03C503080301,1d7:05650582,190f:00680331,1:00740308,1:0077030A,1:0079030A,1:006102BE,b6:03C50313,2:03C503130300,2:03C503130301,2:03C503130342,2a:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,3:1F7003B9,1:03B103B9,1:03AC03B9,2:03B10342,1:03B1034203B9,5:03B103B9,6:1F7403B9,1:03B703B9,1:03AE03B9,2:03B70342,1:03B7034203B9,5:03B703B9,6:03B903080300,1:03B903080301,3:03B90342,1:03B903080342,b:03C503080300,1:03C503080301,1:03C10313,2:03C50342,1:03C503080342,b:1F7C03B9,1:03C903B9,1:03CE03B9,2:03C90342,1:03C9034203B9,5:03C903B9,ac:00720073,5b:00B00063,6:00B00066,d:006E006F,a:0073006D,1:00740065006C,1:0074006D,124f:006800700061,2:00610075,2:006F0076,b:00700061,1:006E0061,1:03BC0061,1:006D0061,1:006B0061,1:006B0062,1:006D0062,1:00670062,3:00700066,1:006E0066,1:03BC0066,4:0068007A,1:006B0068007A,1:006D0068007A,1:00670068007A,1:00740068007A,15:00700061,1:006B00700061,1:006D00700061,1:006700700061,8:00700076,1:006E0076,1:03BC0076,1:006D0076,1:006B0076,1:006D0076,1:00700077,1:006E0077,1:03BC0077,1:006D0077,1:006B0077,1:006D0077,1:006B03C9,1:006D03C9,2:00620071,3:00632215006B0067,1:0063006F002E,1:00640062,1:00670079,2:00680070,2:006B006B,1:006B006D,9:00700068,2:00700070006D,1:00700072,2:00730076,1:00770062,c723:00660066,1:00660069,1:0066006C,1:006600660069,1:00660066006C,1:00730074,1:00730074,d:05740576,1:05740565,1:0574056B,1:057E0576,1:0574056D", T0), $n("80-20,2a0-,39c,32,f71,18e,7f2-f,19-7,30-4,7-5,f81-b,5,a800-20ff,4d1-1f,110,fa-6,d174-7,2e84-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,2,1f-5f,ff7f-20001");
var tf = "hash/5.7.0";
function U0(e2) {
  e2 = atob(e2);
  const t = [];
  for (let r3 = 0; r3 < e2.length; r3++) t.push(e2.charCodeAt(r3));
  return Ot(t);
}
function ef(e2, t) {
  t == null && (t = 1);
  const r3 = [], i3 = r3.forEach, n4 = function(o5, h4) {
    i3.call(o5, function(p4) {
      h4 > 0 && Array.isArray(p4) ? n4(p4, h4 - 1) : r3.push(p4);
    });
  };
  return n4(e2, t), r3;
}
function k0(e2) {
  const t = {};
  for (let r3 = 0; r3 < e2.length; r3++) {
    const i3 = e2[r3];
    t[i3[0]] = i3[1];
  }
  return t;
}
function q0(e2) {
  let t = 0;
  function r3() {
    return e2[t++] << 8 | e2[t++];
  }
  let i3 = r3(), n4 = 1, o5 = [0, 1];
  for (let H = 1; H < i3; H++) o5.push(n4 += r3());
  let h4 = r3(), p4 = t;
  t += h4;
  let b4 = 0, m3 = 0;
  function w4() {
    return b4 == 0 && (m3 = m3 << 8 | e2[t++], b4 = 8), m3 >> --b4 & 1;
  }
  const y8 = 31, S4 = Math.pow(2, y8), I2 = S4 >>> 1, N3 = I2 >> 1, C4 = S4 - 1;
  let F = 0;
  for (let H = 0; H < y8; H++) F = F << 1 | w4();
  let U4 = [], J2 = 0, Bt3 = S4;
  for (; ; ) {
    let H = Math.floor(((F - J2 + 1) * n4 - 1) / Bt3), z5 = 0, Pt2 = i3;
    for (; Pt2 - z5 > 1; ) {
      let Yt3 = z5 + Pt2 >>> 1;
      H < o5[Yt3] ? Pt2 = Yt3 : z5 = Yt3;
    }
    if (z5 == 0) break;
    U4.push(z5);
    let W2 = J2 + Math.floor(Bt3 * o5[z5] / n4), Rt2 = J2 + Math.floor(Bt3 * o5[z5 + 1] / n4) - 1;
    for (; !((W2 ^ Rt2) & I2); ) F = F << 1 & C4 | w4(), W2 = W2 << 1 & C4, Rt2 = Rt2 << 1 & C4 | 1;
    for (; W2 & ~Rt2 & N3; ) F = F & I2 | F << 1 & C4 >>> 1 | w4(), W2 = W2 << 1 ^ I2, Rt2 = (Rt2 ^ I2) << 1 | I2 | 1;
    J2 = W2, Bt3 = 1 + Rt2 - W2;
  }
  let G = i3 - 4;
  return U4.map((H) => {
    switch (H - G) {
      case 3:
        return G + 65792 + (e2[p4++] << 16 | e2[p4++] << 8 | e2[p4++]);
      case 2:
        return G + 256 + (e2[p4++] << 8 | e2[p4++]);
      case 1:
        return G + e2[p4++];
      default:
        return H - 1;
    }
  });
}
function K0(e2) {
  let t = 0;
  return () => e2[t++];
}
function H0(e2) {
  return K0(q0(e2));
}
function z0(e2) {
  return e2 & 1 ? ~e2 >> 1 : e2 >> 1;
}
function L0(e2, t) {
  let r3 = Array(e2);
  for (let i3 = 0; i3 < e2; i3++) r3[i3] = 1 + t();
  return r3;
}
function rf(e2, t) {
  let r3 = Array(e2);
  for (let i3 = 0, n4 = -1; i3 < e2; i3++) r3[i3] = n4 += 1 + t();
  return r3;
}
function j0(e2, t) {
  let r3 = Array(e2);
  for (let i3 = 0, n4 = 0; i3 < e2; i3++) r3[i3] = n4 += z0(t());
  return r3;
}
function Pr(e2, t) {
  let r3 = rf(e2(), e2), i3 = e2(), n4 = rf(i3, e2), o5 = L0(i3, e2);
  for (let h4 = 0; h4 < i3; h4++) for (let p4 = 0; p4 < o5[h4]; p4++) r3.push(n4[h4] + p4);
  return t ? r3.map((h4) => t[h4]) : r3;
}
function Q0(e2) {
  let t = [];
  for (; ; ) {
    let r3 = e2();
    if (r3 == 0) break;
    t.push(G0(r3, e2));
  }
  for (; ; ) {
    let r3 = e2() - 1;
    if (r3 < 0) break;
    t.push(Y0(r3, e2));
  }
  return k0(ef(t));
}
function J0(e2) {
  let t = [];
  for (; ; ) {
    let r3 = e2();
    if (r3 == 0) break;
    t.push(r3);
  }
  return t;
}
function nf(e2, t, r3) {
  let i3 = Array(e2).fill(void 0).map(() => []);
  for (let n4 = 0; n4 < t; n4++) j0(e2, r3).forEach((o5, h4) => i3[h4].push(o5));
  return i3;
}
function G0(e2, t) {
  let r3 = 1 + t(), i3 = t(), n4 = J0(t), o5 = nf(n4.length, 1 + e2, t);
  return ef(o5.map((h4, p4) => {
    const b4 = h4[0], m3 = h4.slice(1);
    return Array(n4[p4]).fill(void 0).map((w4, y8) => {
      let S4 = y8 * i3;
      return [b4 + y8 * r3, m3.map((I2) => I2 + S4)];
    });
  }));
}
function Y0(e2, t) {
  let r3 = 1 + t();
  return nf(r3, 1 + e2, t).map((n4) => [n4[0], n4.slice(1)]);
}
function V0(e2) {
  let t = Pr(e2).sort((i3, n4) => i3 - n4);
  return r3();
  function r3() {
    let i3 = [];
    for (; ; ) {
      let m3 = Pr(e2, t);
      if (m3.length == 0) break;
      i3.push({ set: new Set(m3), node: r3() });
    }
    i3.sort((m3, w4) => w4.set.size - m3.set.size);
    let n4 = e2(), o5 = n4 % 3;
    n4 = n4 / 3 | 0;
    let h4 = !!(n4 & 1);
    n4 >>= 1;
    let p4 = n4 == 1, b4 = n4 == 2;
    return { branches: i3, valid: o5, fe0f: h4, save: p4, check: b4 };
  }
}
function W0() {
  return H0(U0("AEQF2AO2DEsA2wIrAGsBRABxAN8AZwCcAEwAqgA0AGwAUgByADcATAAVAFYAIQAyACEAKAAYAFgAGwAjABQAMAAmADIAFAAfABQAKwATACoADgAbAA8AHQAYABoAGQAxADgALAAoADwAEwA9ABMAGgARAA4ADwAWABMAFgAIAA8AHgQXBYMA5BHJAS8JtAYoAe4AExozi0UAH21tAaMnBT8CrnIyhrMDhRgDygIBUAEHcoFHUPe8AXBjAewCjgDQR8IICIcEcQLwATXCDgzvHwBmBoHNAqsBdBcUAykgDhAMShskMgo8AY8jqAQfAUAfHw8BDw87MioGlCIPBwZCa4ELatMAAMspJVgsDl8AIhckSg8XAHdvTwBcIQEiDT4OPhUqbyECAEoAS34Aej8Ybx83JgT/Xw8gHxZ/7w8RICxPHA9vBw+Pfw8PHwAPFv+fAsAvCc8vEr8ivwD/EQ8Bol8OEBa/A78hrwAPCU8vESNvvwWfHwNfAVoDHr+ZAAED34YaAdJPAK7PLwSEgDLHAGo1Pz8Pvx9fUwMrpb8O/58VTzAPIBoXIyQJNF8hpwIVAT8YGAUADDNBaX3RAMomJCg9EhUeA29MABsZBTMNJipjOhc19gcIDR8bBwQHEggCWi6DIgLuAQYA+BAFCha3A5XiAEsqM7UFFgFLhAMjFTMYE1Klnw74nRVBG/ASCm0BYRN/BrsU3VoWy+S0vV8LQx+vN8gF2AC2AK5EAWwApgYDKmAAroQ0NDQ0AT+OCg7wAAIHRAbpNgVcBV0APTA5BfbPFgMLzcYL/QqqA82eBALKCjQCjqYCht0/k2+OAsXQAoP3ASTKDgDw6ACKAUYCMpIKJpRaAE4A5womABzZvs0REEKiACIQAd5QdAECAj4Ywg/wGqY2AVgAYADYvAoCGAEubA0gvAY2ALAAbpbvqpyEAGAEpgQAJgAG7gAgAEACmghUFwCqAMpAINQIwC4DthRAAPcycKgApoIdABwBfCisABoATwBqASIAvhnSBP8aH/ECeAKXAq40NjgDBTwFYQU6AXs3oABgAD4XNgmcCY1eCl5tIFZeUqGgyoNHABgAEQAaABNwWQAmABMATPMa3T34ADldyprmM1M2XociUQgLzvwAXT3xABgAEQAaABNwIGFAnADD8AAgAD4BBJWzaCcIAIEBFMAWwKoAAdq9BWAF5wLQpALEtQAKUSGkahR4GnJM+gsAwCgeFAiUAECQ0BQuL8AAIAAAADKeIheclvFqQAAETr4iAMxIARMgAMIoHhQIAn0E0pDQFC4HhznoAAAAIAI2C0/4lvFqQAAETgBJJwYCAy4ABgYAFAA8MBKYEH4eRhTkAjYeFcgACAYAeABsOqyQ5gRwDayqugEgaIIAtgoACgDmEABmBAWGme5OBJJA2m4cDeoAmITWAXwrMgOgAGwBCh6CBXYF1Tzg1wKAAFdiuABRAFwAXQBsAG8AdgBrAHYAbwCEAHEwfxQBVE5TEQADVFhTBwBDANILAqcCzgLTApQCrQL6vAAMAL8APLhNBKkE6glGKTAU4Dr4N2EYEwBCkABKk8rHAbYBmwIoAiU4Ajf/Aq4CowCAANIChzgaNBsCsTgeODcFXrgClQKdAqQBiQGYAqsCsjTsNHsfNPA0ixsAWTWiOAMFPDQSNCk2BDZHNow2TTZUNhk28Jk9VzI3QkEoAoICoQKwAqcAQAAxBV4FXbS9BW47YkIXP1ciUqs05DS/FwABUwJW11e6nHuYZmSh/RAYA8oMKvZ8KASoUAJYWAJ6ILAsAZSoqjpgA0ocBIhmDgDWAAawRDQoAAcuAj5iAHABZiR2AIgiHgCaAU68ACxuHAG0ygM8MiZIAlgBdF4GagJqAPZOHAMuBgoATkYAsABiAHgAMLoGDPj0HpKEBAAOJgAuALggTAHWAeAMEDbd20Uege0ADwAWADkAQgA9OHd+2MUQZBBhBgNNDkxxPxUQArEPqwvqERoM1irQ090ANK4H8ANYB/ADWANYB/AH8ANYB/ADWANYA1gDWBwP8B/YxRBkD00EcgWTBZAE2wiIJk4RhgctCNdUEnQjHEwDSgEBIypJITuYMxAlR0wRTQgIATZHbKx9PQNMMbBU+pCnA9AyVDlxBgMedhKlAC8PeCE1uk6DekxxpQpQT7NX9wBFBgASqwAS5gBJDSgAUCwGPQBI4zTYABNGAE2bAE3KAExdGABKaAbgAFBXAFCOAFBJABI2SWdObALDOq0//QomCZhvwHdTBkIQHCemEPgMNAG2ATwN7kvZBPIGPATKH34ZGg/OlZ0Ipi3eDO4m5C6igFsj9iqEBe5L9TzeC05RaQ9aC2YJ5DpkgU8DIgEOIowK3g06CG4Q9ArKbA3mEUYHOgPWSZsApgcCCxIdNhW2JhFirQsKOXgG/Br3C5AmsBMqev0F1BoiBk4BKhsAANAu6IWxWjJcHU9gBgQLJiPIFKlQIQ0mQLh4SRocBxYlqgKSQ3FKiFE3HpQh9zw+DWcuFFF9B/Y8BhlQC4I8n0asRQ8R0z6OPUkiSkwtBDaALDAnjAnQD4YMunxzAVoJIgmyDHITMhEYN8YIOgcaLpclJxYIIkaWYJsE+KAD9BPSAwwFQAlCBxQDthwuEy8VKgUOgSXYAvQ21i60ApBWgQEYBcwPJh/gEFFH4Q7qCJwCZgOEJewALhUiABginAhEZABgj9lTBi7MCMhqbSN1A2gU6GIRdAeSDlgHqBw0FcAc4nDJXgyGCSiksAlcAXYJmgFgBOQICjVcjKEgQmdUi1kYnCBiQUBd/QIyDGYVoES+h3kCjA9sEhwBNgF0BzoNAgJ4Ee4RbBCWCOyGBTW2M/k6JgRQIYQgEgooA1BszwsoJvoM+WoBpBJjAw00PnfvZ6xgtyUX/gcaMsZBYSHyC5NPzgydGsIYQ1QvGeUHwAP0GvQn60FYBgADpAQUOk4z7wS+C2oIjAlAAEoOpBgH2BhrCnKM0QEyjAG4mgNYkoQCcJAGOAcMAGgMiAV65gAeAqgIpAAGANADWAA6Aq4HngAaAIZCAT4DKDABIuYCkAOUCDLMAZYwAfQqBBzEDBYA+DhuSwLDsgKAa2ajBd5ZAo8CSjYBTiYEBk9IUgOwcuIA3ABMBhTgSAEWrEvMG+REAeBwLADIAPwABjYHBkIBzgH0bgC4AWALMgmjtLYBTuoqAIQAFmwB2AKKAN4ANgCA8gFUAE4FWvoF1AJQSgESMhksWGIBvAMgATQBDgB6BsyOpsoIIARuB9QCEBwV4gLvLwe2AgMi4BPOQsYCvd9WADIXUu5eZwqoCqdeaAC0YTQHMnM9UQAPH6k+yAdy/BZIiQImSwBQ5gBQQzSaNTFWSTYBpwGqKQK38AFtqwBI/wK37gK3rQK3sAK6280C0gK33AK3zxAAUEIAUD9SklKDArekArw5AEQAzAHCO147WTteO1k7XjtZO147WTteO1kDmChYI03AVU0oJqkKbV9GYewMpw3VRMk6ShPcYFJgMxPJLbgUwhXPJVcZPhq9JwYl5VUKDwUt1GYxCC00dhe9AEApaYNCY4ceMQpMHOhTklT5LRwAskujM7ANrRsWREEFSHXuYisWDwojAmSCAmJDXE6wXDchAqH4AmiZAmYKAp+FOBwMAmY8AmYnBG8EgAN/FAN+kzkHOXgYOYM6JCQCbB4CMjc4CwJtyAJtr/CLADRoRiwBaADfAOIASwYHmQyOAP8MwwAOtgJ3MAJ2o0ACeUxEAni7Hl3cRa9G9AJ8QAJ6yQJ9CgJ88UgBSH5kJQAsFklZSlwWGErNAtECAtDNSygDiFADh+dExpEzAvKiXQQDA69Lz0wuJgTQTU1NsAKLQAKK2cIcCB5EaAa4Ao44Ao5dQZiCAo7aAo5deVG1UzYLUtVUhgKT/AKTDQDqAB1VH1WwVdEHLBwplocy4nhnRTw6ApegAu+zWCKpAFomApaQApZ9nQCqWa1aCoJOADwClrYClk9cRVzSApnMApllXMtdCBoCnJw5wzqeApwXAp+cAp65iwAeEDIrEAKd8gKekwC2PmE1YfACntQCoG8BqgKeoCACnk+mY8lkKCYsAiewAiZ/AqD8AqBN2AKmMAKlzwKoAAB+AqfzaH1osgAESmodatICrOQCrK8CrWgCrQMCVx4CVd0CseLYAx9PbJgCsr4OArLpGGzhbWRtSWADJc4Ctl08QG6RAylGArhfArlIFgK5K3hwN3DiAr0aAy2zAzISAr6JcgMDM3ICvhtzI3NQAsPMAsMFc4N0TDZGdOEDPKgDPJsDPcACxX0CxkgCxhGKAshqUgLIRQLJUALJLwJkngLd03h6YniveSZL0QMYpGcDAmH1GfSVJXsMXpNevBICz2wCz20wTFTT9BSgAMeuAs90ASrrA04TfkwGAtwoAtuLAtJQA1JdA1NgAQIDVY2AikABzBfuYUZ2AILPg44C2sgC2d+EEYRKpz0DhqYAMANkD4ZyWvoAVgLfZgLeuXR4AuIw7RUB8zEoAfScAfLTiALr9ALpcXoAAur6AurlAPpIAboC7ooC652Wq5cEAu5AA4XhmHpw4XGiAvMEAGoDjheZlAL3FAORbwOSiAL3mQL52gL4Z5odmqy8OJsfA52EAv77ARwAOp8dn7QDBY4DpmsDptoA0sYDBmuhiaIGCgMMSgFgASACtgNGAJwEgLpoBgC8BGzAEowcggCEDC6kdjoAJAM0C5IKRoABZCgiAIzw3AYBLACkfng9ogigkgNmWAN6AEQCvrkEVqTGAwCsBRbAA+4iQkMCHR072jI2PTbUNsk2RjY5NvA23TZKNiU3EDcZN5I+RTxDRTBCJkK5VBYKFhZfwQCWygU3AJBRHpu+OytgNxa61A40GMsYjsn7BVwFXQVcBV0FaAVdBVwFXQVcBV0FXAVdBVwFXUsaCNyKAK4AAQUHBwKU7oICoW1e7jAEzgPxA+YDwgCkBFDAwADABKzAAOxFLhitA1UFTDeyPkM+bj51QkRCuwTQWWQ8X+0AWBYzsACNA8xwzAGm7EZ/QisoCTAbLDs6fnLfb8H2GccsbgFw13M1HAVkBW/Jxsm9CNRO8E8FDD0FBQw9FkcClOYCoMFegpDfADgcMiA2AJQACB8AsigKAIzIEAJKeBIApY5yPZQIAKQiHb4fvj5BKSRPQrZCOz0oXyxgOywfKAnGbgMClQaCAkILXgdeCD9IIGUgQj5fPoY+dT52Ao5CM0dAX9BTVG9SDzFwWTQAbxBzJF/lOEIQQglCCkKJIAls5AcClQICoKPMODEFxhi6KSAbiyfIRrMjtCgdWCAkPlFBIitCsEJRzAbMAV/OEyQzDg0OAQQEJ36i328/Mk9AybDJsQlq3tDRApUKAkFzXf1d/j9uALYP6hCoFgCTGD8kPsFKQiobrm0+zj0KSD8kPnVCRBwMDyJRTHFgMTJa5rwXQiQ2YfI/JD7BMEJEHGINTw4TOFlIRzwJO0icMQpyPyQ+wzJCRBv6DVgnKB01NgUKj2bwYzMqCoBkznBgEF+zYDIocwRIX+NgHj4HICNfh2C4CwdwFWpTG/lgUhYGAwRfv2Ts8mAaXzVgml/XYIJfuWC4HI1gUF9pYJZgMR6ilQHMAOwLAlDRefC0in4AXAEJA6PjCwc0IamOANMMCAECRQDFNRTZBgd+CwQlRA+r6+gLBDEFBnwUBXgKATIArwAGRAAHA3cDdAN2A3kDdwN9A3oDdQN7A30DfAN4A3oDfQAYEAAlAtYASwMAUAFsAHcKAHcAmgB3AHUAdQB2AHVu8UgAygDAAHcAdQB1AHYAdQALCgB3AAsAmgB3AAsCOwB3AAtu8UgAygDAAHgKAJoAdwB3AHUAdQB2AHUAeAB1AHUAdgB1bvFIAMoAwAALCgCaAHcACwB3AAsCOwB3AAtu8UgAygDAAH4ACwGgALcBpwC6AahdAu0COwLtbvFIAMoAwAALCgCaAu0ACwLtAAsCOwLtAAtu8UgAygDAA24ACwNvAAu0VsQAAzsAABCkjUIpAAsAUIusOggWcgMeBxVsGwL67U/2HlzmWOEeOgALASvuAAseAfpKUpnpGgYJDCIZM6YyARUE9ThqAD5iXQgnAJYJPnOzw0ZAEZxEKsIAkA4DhAHnTAIDxxUDK0lxCQlPYgIvIQVYJQBVqE1GakUAKGYiDToSBA1EtAYAXQJYAIF8GgMHRyAAIAjOe9YncekRAA0KACUrjwE7Ayc6AAYWAqaiKG4McEcqANoN3+Mg9TwCBhIkuCny+JwUQ29L008JluRxu3K+oAdqiHOqFH0AG5SUIfUJ5SxCGfxdipRzqTmT4V5Zb+r1Uo4Vm+NqSSEl2mNvR2JhIa8SpYO6ntdwFXHCWTCK8f2+Hxo7uiG3drDycAuKIMP5bhi06ACnqArH1rz4Rqg//lm6SgJGEVbF9xJHISaR6HxqxSnkw6shDnelHKNEfGUXSJRJ1GcsmtJw25xrZMDK9gXSm1/YMkdX4/6NKYOdtk/NQ3/NnDASjTc3fPjIjW/5sVfVObX2oTDWkr1dF9f3kxBsD3/3aQO8hPfRz+e0uEiJqt1161griu7gz8hDDwtpy+F+BWtefnKHZPAxcZoWbnznhJpy0e842j36bcNzGnIEusgGX0a8ZxsnjcSsPDZ09yZ36fCQbriHeQ72JRMILNl6ePPf2HWoVwgWAm1fb3V2sAY0+B6rAXqSwPBgseVmoqsBTSrm91+XasMYYySI8eeRxH3ZvHkMz3BQ5aJ3iUVbYPNM3/7emRtjlsMgv/9VyTsyt/mK+8fgWeT6SoFaclXqn42dAIsvAarF5vNNWHzKSkKQ/8Hfk5ZWK7r9yliOsooyBjRhfkHP4Q2DkWXQi6FG/9r/IwbmkV5T7JSopHKn1pJwm9tb5Ot0oyN1Z2mPpKXHTxx2nlK08fKk1hEYA8WgVVWL5lgx0iTv+KdojJeU23ZDjmiubXOxVXJKKi2Wjuh2HLZOFLiSC7Tls5SMh4f+Pj6xUSrNjFqLGehRNB8lC0QSLNmkJJx/wSG3MnjE9T1CkPwJI0wH2lfzwETIiVqUxg0dfu5q39Gt+hwdcxkhhNvQ4TyrBceof3Mhs/IxFci1HmHr4FMZgXEEczPiGCx0HRwzAqDq2j9AVm1kwN0mRVLWLylgtoPNapF5cY4Y1wJh/e0BBwZj44YgZrDNqvD/9Hv7GFYdUQeDJuQ3EWI4HaKqavU1XjC/n41kT4L79kqGq0kLhdTZvgP3TA3fS0ozVz+5piZsoOtIvBUFoMKbNcmBL6YxxaUAusHB38XrS8dQMnQwJfUUkpRoGr5AUeWicvBTzyK9g77+yCkf5PAysL7r/JjcZgrbvRpMW9iyaxZvKO6ceZN2EwIxKwVFPuvFuiEPGCoagbMo+SpydLrXqBzNCDGFCrO/rkcwa2xhokQZ5CdZ0AsU3JfSqJ6n5I14YA+P/uAgfhPU84Tlw7cEFfp7AEE8ey4sP12PTt4Cods1GRgDOB5xvyiR5m+Bx8O5nBCNctU8BevfV5A08x6RHd5jcwPTMDSZJOedIZ1cGQ704lxbAzqZOP05ZxaOghzSdvFBHYqomATARyAADK4elP8Ly3IrUZKfWh23Xy20uBUmLS4Pfagu9+oyVa2iPgqRP3F2CTUsvJ7+RYnN8fFZbU/HVvxvcFFDKkiTqV5UBZ3Gz54JAKByi9hkKMZJvuGgcSYXFmw08UyoQyVdfTD1/dMkCHXcTGAKeROgArsvmRrQTLUOXioOHGK2QkjHuoYFgXciZoTJd6Fs5q1QX1G+p/e26hYsEf7QZD1nnIyl/SFkNtYYmmBhpBrxl9WbY0YpHWRuw2Ll/tj9mD8P4snVzJl4F9J+1arVeTb9E5r2ILH04qStjxQNwn3m4YNqxmaNbLAqW2TN6LidwuJRqS+NXbtqxoeDXpxeGWmxzSkWxjkyCkX4NQRme6q5SAcC+M7+9ETfA/EwrzQajKakCwYyeunP6ZFlxU2oMEn1Pz31zeStW74G406ZJFCl1wAXIoUKkWotYEpOuXB1uVNxJ63dpJEqfxBeptwIHNrPz8BllZoIcBoXwgfJ+8VAUnVPvRvexnw0Ma/WiGYuJO5y8QTvEYBigFmhUxY5RqzE8OcywN/8m4UYrlaniJO75XQ6KSo9+tWHlu+hMi0UVdiKQp7NelnoZUzNaIyBPVeOwK6GNp+FfHuPOoyhaWuNvTYFkvxscMQWDh+zeFCFkgwbXftiV23ywJ4+uwRqmg9k3KzwIQpzppt8DBBOMbrqwQM5Gb05sEwdKzMiAqOloaA/lr0KA+1pr0/+HiWoiIjHA/wir2nIuS3PeU/ji3O6ZwoxcR1SZ9FhtLC5S0FIzFhbBWcGVP/KpxOPSiUoAdWUpqKH++6Scz507iCcxYI6rdMBICPJZea7OcmeFw5mObJSiqpjg2UoWNIs+cFhyDSt6geV5qgi3FunmwwDoGSMgerFOZGX1m0dMCYo5XOruxO063dwENK9DbnVM9wYFREzh4vyU1WYYJ/LRRp6oxgjqP/X5a8/4Af6p6NWkQferzBmXme0zY/4nwMJm/wd1tIqSwGz+E3xPEAOoZlJit3XddD7/BT1pllzOx+8bmQtANQ/S6fZexc6qi3W+Q2xcmXTUhuS5mpHQRvcxZUN0S5+PL9lXWUAaRZhEH8hTdAcuNMMCuVNKTEGtSUKNi3O6KhSaTzck8csZ2vWRZ+d7mW8c4IKwXIYd25S/zIftPkwPzufjEvOHWVD1m+FjpDVUTV0DGDuHj6QnaEwLu/dEgdLQOg9E1Sro9XHJ8ykLAwtPu+pxqKDuFexqON1sKQm7rwbE1E68UCfA/erovrTCG+DBSNg0l4goDQvZN6uNlbyLpcZAwj2UclycvLpIZMgv4yRlpb3YuMftozorbcGVHt/VeDV3+Fdf1TP0iuaCsPi2G4XeGhsyF1ubVDxkoJhmniQ0/jSg/eYML9KLfnCFgISWkp91eauR3IQvED0nAPXK+6hPCYs+n3+hCZbiskmVMG2da+0EsZPonUeIY8EbfusQXjsK/eFDaosbPjEfQS0RKG7yj5GG69M7MeO1HmiUYocgygJHL6M1qzUDDwUSmr99V7Sdr2F3JjQAJY+F0yH33Iv3+C9M38eML7gTgmNu/r2bUMiPvpYbZ6v1/IaESirBHNa7mPKn4dEmYg7v/+HQgPN1G79jBQ1+soydfDC2r+h2Bl/KIc5KjMK7OH6nb1jLsNf0EHVe2KBiE51ox636uyG6Lho0t3J34L5QY/ilE3mikaF4HKXG1mG1rCevT1Vv6GavltxoQe/bMrpZvRggnBxSEPEeEzkEdOxTnPXHVjUYdw8JYvjB/o7Eegc3Ma+NUxLLnsK0kJlinPmUHzHGtrk5+CAbVzFOBqpyy3QVUnzTDfC/0XD94/okH+OB+i7g9lolhWIjSnfIb+Eq43ZXOWmwvjyV/qqD+t0e+7mTEM74qP/Ozt8nmC7mRpyu63OB4KnUzFc074SqoyPUAgM+/TJGFo6T44EHnQU4X4z6qannVqgw/U7zCpwcmXV1AubIrvOmkKHazJAR55ePjp5tLBsN8vAqs3NAHdcEHOR2xQ0lsNAFzSUuxFQCFYvXLZJdOj9p4fNq6p0HBGUik2YzaI4xySy91KzhQ0+q1hjxvImRwPRf76tChlRkhRCi74NXZ9qUNeIwP+s5p+3m5nwPdNOHgSLD79n7O9m1n1uDHiMntq4nkYwV5OZ1ENbXxFd4PgrlvavZsyUO4MqYlqqn1O8W/I1dEZq5dXhrbETLaZIbC2Kj/Aa/QM+fqUOHdf0tXAQ1huZ3cmWECWSXy/43j35+Mvq9xws7JKseriZ1pEWKc8qlzNrGPUGcVgOa9cPJYIJsGnJTAUsEcDOEVULO5x0rXBijc1lgXEzQQKhROf8zIV82w8eswc78YX11KYLWQRcgHNJElBxfXr72lS2RBSl07qTKorO2uUDZr3sFhYsvnhLZn0A94KRzJ/7DEGIAhW5ZWFpL8gEwu1aLA9MuWZzNwl8Oze9Y+bX+v9gywRVnoB5I/8kXTXU3141yRLYrIOOz6SOnyHNy4SieqzkBXharjfjqq1q6tklaEbA8Qfm2DaIPs7OTq/nvJBjKfO2H9bH2cCMh1+5gspfycu8f/cuuRmtDjyqZ7uCIMyjdV3a+p3fqmXsRx4C8lujezIFHnQiVTXLXuI1XrwN3+siYYj2HHTvESUx8DlOTXpak9qFRK+L3mgJ1WsD7F4cu1aJoFoYQnu+wGDMOjJM3kiBQWHCcvhJ/HRdxodOQp45YZaOTA22Nb4XKCVxqkbwMYFhzYQYIAnCW8FW14uf98jhUG2zrKhQQ0q0CEq0t5nXyvUyvR8DvD69LU+g3i+HFWQMQ8PqZuHD+sNKAV0+M6EJC0szq7rEr7B5bQ8BcNHzvDMc9eqB5ZCQdTf80Obn4uzjwpYU7SISdtV0QGa9D3Wrh2BDQtpBKxaNFV+/Cy2P/Sv+8s7Ud0Fd74X4+o/TNztWgETUapy+majNQ68Lq3ee0ZO48VEbTZYiH1Co4OlfWef82RWeyUXo7woM03PyapGfikTnQinoNq5z5veLpeMV3HCAMTaZmA1oGLAn7XS3XYsz+XK7VMQsc4XKrmDXOLU/pSXVNUq8dIqTba///3x6LiLS6xs1xuCAYSfcQ3+rQgmu7uvf3THKt5Ooo97TqcbRqxx7EASizaQCBQllG/rYxVapMLgtLbZS64w1MDBMXX+PQpBKNwqUKOf2DDRDUXQf9EhOS0Qj4nTmlA8dzSLz/G1d+Ud8MTy/6ghhdiLpeerGY/UlDOfiuqFsMUU5/UYlP+BAmgRLuNpvrUaLlVkrqDievNVEAwF+4CoM1MZTmjxjJMsKJq+u8Zd7tNCUFy6LiyYXRJQ4VyvEQFFaCGKsxIwQkk7EzZ6LTJq2hUuPhvAW+gQnSG6J+MszC+7QCRHcnqDdyNRJ6T9xyS87A6MDutbzKGvGktpbXqtzWtXb9HsfK2cBMomjN9a4y+TaJLnXxAeX/HWzmf4cR4vALt/P4w4qgKY04ml4ZdLOinFYS6cup3G/1ie4+t1eOnpBNlqGqs75ilzkT4+DsZQxNvaSKJ//6zIbbk/M7LOhFmRc/1R+kBtz7JFGdZm/COotIdvQoXpTqP/1uqEUmCb/QWoGLMwO5ANcHzxdY48IGP5+J+zKOTBFZ4Pid+GTM+Wq12MV/H86xEJptBa6T+p3kgpwLedManBHC2GgNrFpoN2xnrMz9WFWX/8/ygSBkavq2Uv7FdCsLEYLu9LLIvAU0bNRDtzYl+/vXmjpIvuJFYjmI0im6QEYqnIeMsNjXG4vIutIGHijeAG/9EDBozKV5cldkHbLxHh25vT+ZEzbhXlqvpzKJwcEgfNwLAKFeo0/pvEE10XDB+EXRTXtSzJozQKFFAJhMxYkVaCW+E9AL7tMeU8acxidHqzb6lX4691UsDpy/LLRmT+epgW56+5Cw8tB4kMUv6s9lh3eRKbyGs+H/4mQMaYzPTf2OOdokEn+zzgvoD3FqNKk8QqGAXVsqcGdXrT62fSPkR2vROFi68A6se86UxRUk4cajfPyCC4G5wDhD+zNq4jodQ4u4n/m37Lr36n4LIAAsVr02dFi9AiwA81MYs2rm4eDlDNmdMRvEKRHfBwW5DdMNp0jPFZMeARqF/wL4XBfd+EMLBfMzpH5GH6NaW+1vrvMdg+VxDzatk3MXgO3ro3P/DpcC6+Mo4MySJhKJhSR01SGGGp5hPWmrrUgrv3lDnP+HhcI3nt3YqBoVAVTBAQT5iuhTg8nvPtd8ZeYj6w1x6RqGUBrSku7+N1+BaasZvjTk64RoIDlL8brpEcJx3OmY7jLoZsswdtmhfC/G21llXhITOwmvRDDeTTPbyASOa16cF5/A1fZAidJpqju3wYAy9avPR1ya6eNp9K8XYrrtuxlqi+bDKwlfrYdR0RRiKRVTLOH85+ZY7XSmzRpfZBJjaTa81VDcJHpZnZnSQLASGYW9l51ZV/h7eVzTi3Hv6hUsgc/51AqJRTkpbFVLXXszoBL8nBX0u/0jBLT8nH+fJePbrwURT58OY+UieRjd1vs04w0VG5VN2U6MoGZkQzKN/ptz0Q366dxoTGmj7i1NQGHi9GgnquXFYdrCfZBmeb7s0T6yrdlZH5cZuwHFyIJ/kAtGsTg0xH5taAAq44BAk1CPk9KVVbqQzrCUiFdF/6gtlPQ8bHHc1G1W92MXGZ5HEHftyLYs8mbD/9xYRUWkHmlM0zC2ilJlnNgV4bfALpQghxOUoZL7VTqtCHIaQSXm+YUMnpkXybnV+A6xlm2CVy8fn0Xlm2XRa0+zzOa21JWWmixfiPMSCZ7qA4rS93VN3pkpF1s5TonQjisHf7iU9ZGvUPOAKZcR1pbeVf/Ul7OhepGCaId9wOtqo7pJ7yLcBZ0pFkOF28y4zEI/kcUNmutBHaQpBdNM8vjCS6HZRokkeo88TBAjGyG7SR+6vUgTcyK9Imalj0kuxz0wmK+byQU11AiJFk/ya5dNduRClcnU64yGu/ieWSeOos1t3ep+RPIWQ2pyTYVbZltTbsb7NiwSi3AV+8KLWk7LxCnfZUetEM8ThnsSoGH38/nyAwFguJp8FjvlHtcWZuU4hPva0rHfr0UhOOJ/F6vS62FW7KzkmRll2HEc7oUq4fyi5T70Vl7YVIfsPHUCdHesf9Lk7WNVWO75JDkYbMI8TOW8JKVtLY9d6UJRITO8oKo0xS+o99Yy04iniGHAaGj88kEWgwv0OrHdY/nr76DOGNS59hXCGXzTKUvDl9iKpLSWYN1lxIeyywdNpTkhay74w2jFT6NS8qkjo5CxA1yfSYwp6AJIZNKIeEK5PJAW7ORgWgwp0VgzYpqovMrWxbu+DGZ6Lhie1RAqpzm8VUzKJOH3mCzWuTOLsN3VT/dv2eeYe9UjbR8YTBsLz7q60VN1sU51k+um1f8JxD5pPhbhSC8rRaB454tmh6YUWrJI3+GWY0qeWioj/tbkYITOkJaeuGt4JrJvHA+l0Gu7kY7XOaa05alMnRWVCXqFgLIwSY4uF59Ue5SU4QKuc/HamDxbr0x6csCetXGoP7Qn1Bk/J9DsynO/UD6iZ1Hyrz+jit0hDCwi/E9OjgKTbB3ZQKQ/0ZOvevfNHG0NK4Aj3Cp7NpRk07RT1i/S0EL93Ag8GRgKI9CfpajKyK6+Jj/PI1KO5/85VAwz2AwzP8FTBb075IxCXv6T9RVvWT2tUaqxDS92zrGUbWzUYk9mSs82pECH+fkqsDt93VW++4YsR/dHCYcQSYTO/KaBMDj9LSD/J/+z20Kq8XvZUAIHtm9hRPP3ItbuAu2Hm5lkPs92pd7kCxgRs0xOVBnZ13ccdA0aunrwv9SdqElJRC3g+oCu+nXyCgmXUs9yMjTMAIHfxZV+aPKcZeUBWt057Xo85Ks1Ir5gzEHCWqZEhrLZMuF11ziGtFQUds/EESajhagzcKsxamcSZxGth4UII+adPhQkUnx2WyN+4YWR+r3f8MnkyGFuR4zjzxJS8WsQYR5PTyRaD9ixa6Mh741nBHbzfjXHskGDq179xaRNrCIB1z1xRfWfjqw2pHc1zk9xlPpL8sQWAIuETZZhbnmL54rceXVNRvUiKrrqIkeogsl0XXb17ylNb0f4GA9Wd44vffEG8FSZGHEL2fbaTGRcSiCeA8PmA/f6Hz8HCS76fXUHwgwkzSwlI71ekZ7Fapmlk/KC+Hs8hUcw3N2LN5LhkVYyizYFl/uPeVP5lsoJHhhfWvvSWruCUW1ZcJOeuTbrDgywJ/qG07gZJplnTvLcYdNaH0KMYOYMGX+rB4NGPFmQsNaIwlWrfCezxre8zXBrsMT+edVLbLqN1BqB76JH4BvZTqUIMfGwPGEn+EnmTV86fPBaYbFL3DFEhjB45CewkXEAtJxk4/Ms2pPXnaRqdky0HOYdcUcE2zcXq4vaIvW2/v0nHFJH2XXe22ueDmq/18XGtELSq85j9X8q0tcNSSKJIX8FTuJF/Pf8j5PhqG2u+osvsLxYrvvfeVJL+4tkcXcr9JV7v0ERmj/X6fM3NC4j6dS1+9Umr2oPavqiAydTZPLMNRGY23LO9zAVDly7jD+70G5TPPLdhRIl4WxcYjLnM+SNcJ26FOrkrISUtPObIz5Zb3AG612krnpy15RMW+1cQjlnWFI6538qky9axd2oJmHIHP08KyP0ubGO+TQNOYuv2uh17yCIvR8VcStw7o1g0NM60sk+8Tq7YfIBJrtp53GkvzXH7OA0p8/n/u1satf/VJhtR1l8Wa6Gmaug7haSpaCaYQax6ta0mkutlb+eAOSG1aobM81D9A4iS1RRlzBBoVX6tU1S6WE2N9ORY6DfeLRC4l9Rvr5h95XDWB2mR1d4WFudpsgVYwiTwT31ljskD8ZyDOlm5DkGh9N/UB/0AI5Xvb8ZBmai2hQ4BWMqFwYnzxwB26YHSOv9WgY3JXnvoN+2R4rqGVh/LLDMtpFP+SpMGJNWvbIl5SOodbCczW2RKleksPoUeGEzrjtKHVdtZA+kfqO+rVx/iclCqwoopepvJpSTDjT+b9GWylGRF8EDbGlw6eUzmJM95Ovoz+kwLX3c2fTjFeYEsE7vUZm3mqdGJuKh2w9/QGSaqRHs99aScGOdDqkFcACoqdbBoQqqjamhH6Q9ng39JCg3lrGJwd50Qk9ovnqBTr8MME7Ps2wiVfygUmPoUBJJfJWX5Nda0nuncbFkA=="));
}
var Dr = W0();
new Set(Pr(Dr)), new Set(Pr(Dr)), Q0(Dr), V0(Dr), new L(tf);
var X0 = new Uint8Array(32);
X0.fill(0);
var Z0 = `Ethereum Signed Message:
`;
function ff(e2) {
  return typeof e2 == "string" && (e2 = Ei(e2)), yi(E0([Ei(Z0), Ei(String(e2.length)), e2]));
}
var $0 = "rlp/5.7.0";
new L($0);
var ts = "address/5.7.0";
var Ar = new L(ts);
function of(e2) {
  Qt(e2, 20) || Ar.throwArgumentError("invalid address", "address", e2), e2 = e2.toLowerCase();
  const t = e2.substring(2).split(""), r3 = new Uint8Array(40);
  for (let n4 = 0; n4 < 40; n4++) r3[n4] = t[n4].charCodeAt(0);
  const i3 = Ot(yi(r3));
  for (let n4 = 0; n4 < 40; n4 += 2) i3[n4 >> 1] >> 4 >= 8 && (t[n4] = t[n4].toUpperCase()), (i3[n4 >> 1] & 15) >= 8 && (t[n4 + 1] = t[n4 + 1].toUpperCase());
  return "0x" + t.join("");
}
var es = 9007199254740991;
function rs(e2) {
  return Math.log10 ? Math.log10(e2) : Math.log(e2) / Math.LN10;
}
var Ni = {};
for (let e2 = 0; e2 < 10; e2++) Ni[String(e2)] = String(e2);
for (let e2 = 0; e2 < 26; e2++) Ni[String.fromCharCode(65 + e2)] = String(10 + e2);
var sf = Math.floor(rs(es));
function is(e2) {
  e2 = e2.toUpperCase(), e2 = e2.substring(4) + e2.substring(0, 2) + "00";
  let t = e2.split("").map((i3) => Ni[i3]).join("");
  for (; t.length >= sf; ) {
    let i3 = t.substring(0, sf);
    t = parseInt(i3, 10) % 97 + t.substring(i3.length);
  }
  let r3 = String(98 - parseInt(t, 10) % 97);
  for (; r3.length < 2; ) r3 = "0" + r3;
  return r3;
}
function ns(e2) {
  let t = null;
  if (typeof e2 != "string" && Ar.throwArgumentError("invalid address", "address", e2), e2.match(/^(0x)?[0-9a-fA-F]{40}$/)) e2.substring(0, 2) !== "0x" && (e2 = "0x" + e2), t = of(e2), e2.match(/([A-F].*[a-f])|([a-f].*[A-F])/) && t !== e2 && Ar.throwArgumentError("bad address checksum", "address", e2);
  else if (e2.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
    for (e2.substring(2, 4) !== is(e2) && Ar.throwArgumentError("bad icap checksum", "address", e2), t = R0(e2.substring(4)); t.length < 40; ) t = "0" + t;
    t = of("0x" + t);
  } else Ar.throwArgumentError("invalid address", "address", e2);
  return t;
}
var fs = "properties/5.7.0";
new L(fs);
function br(e2, t, r3) {
  Object.defineProperty(e2, t, { enumerable: true, value: r3, writable: false });
}
new L(tf);
var os = new Uint8Array(32);
os.fill(0), V.from(-1);
var ss = V.from(0);
var as = V.from(1);
V.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), oe(as.toHexString(), 32), oe(ss.toHexString(), 32);
var se = {};
var Q = {};
var yr = af;
function af(e2, t) {
  if (!e2) throw new Error(t || "Assertion failed");
}
af.equal = function(t, r3, i3) {
  if (t != r3) throw new Error(i3 || "Assertion failed: " + t + " != " + r3);
};
var Ii = { exports: {} };
typeof Object.create == "function" ? Ii.exports = function(t, r3) {
  r3 && (t.super_ = r3, t.prototype = Object.create(r3.prototype, { constructor: { value: t, enumerable: false, writable: true, configurable: true } }));
} : Ii.exports = function(t, r3) {
  if (r3) {
    t.super_ = r3;
    var i3 = function() {
    };
    i3.prototype = r3.prototype, t.prototype = new i3(), t.prototype.constructor = t;
  }
};
var us = yr;
var hs = Ii.exports;
Q.inherits = hs;
function cs(e2, t) {
  return (e2.charCodeAt(t) & 64512) !== 55296 || t < 0 || t + 1 >= e2.length ? false : (e2.charCodeAt(t + 1) & 64512) === 56320;
}
function ls(e2, t) {
  if (Array.isArray(e2)) return e2.slice();
  if (!e2) return [];
  var r3 = [];
  if (typeof e2 == "string") if (t) {
    if (t === "hex") for (e2 = e2.replace(/[^a-z0-9]+/ig, ""), e2.length % 2 !== 0 && (e2 = "0" + e2), n4 = 0; n4 < e2.length; n4 += 2) r3.push(parseInt(e2[n4] + e2[n4 + 1], 16));
  } else for (var i3 = 0, n4 = 0; n4 < e2.length; n4++) {
    var o5 = e2.charCodeAt(n4);
    o5 < 128 ? r3[i3++] = o5 : o5 < 2048 ? (r3[i3++] = o5 >> 6 | 192, r3[i3++] = o5 & 63 | 128) : cs(e2, n4) ? (o5 = 65536 + ((o5 & 1023) << 10) + (e2.charCodeAt(++n4) & 1023), r3[i3++] = o5 >> 18 | 240, r3[i3++] = o5 >> 12 & 63 | 128, r3[i3++] = o5 >> 6 & 63 | 128, r3[i3++] = o5 & 63 | 128) : (r3[i3++] = o5 >> 12 | 224, r3[i3++] = o5 >> 6 & 63 | 128, r3[i3++] = o5 & 63 | 128);
  }
  else for (n4 = 0; n4 < e2.length; n4++) r3[n4] = e2[n4] | 0;
  return r3;
}
Q.toArray = ls;
function ds(e2) {
  for (var t = "", r3 = 0; r3 < e2.length; r3++) t += hf(e2[r3].toString(16));
  return t;
}
Q.toHex = ds;
function uf(e2) {
  var t = e2 >>> 24 | e2 >>> 8 & 65280 | e2 << 8 & 16711680 | (e2 & 255) << 24;
  return t >>> 0;
}
Q.htonl = uf;
function ps(e2, t) {
  for (var r3 = "", i3 = 0; i3 < e2.length; i3++) {
    var n4 = e2[i3];
    t === "little" && (n4 = uf(n4)), r3 += cf(n4.toString(16));
  }
  return r3;
}
Q.toHex32 = ps;
function hf(e2) {
  return e2.length === 1 ? "0" + e2 : e2;
}
Q.zero2 = hf;
function cf(e2) {
  return e2.length === 7 ? "0" + e2 : e2.length === 6 ? "00" + e2 : e2.length === 5 ? "000" + e2 : e2.length === 4 ? "0000" + e2 : e2.length === 3 ? "00000" + e2 : e2.length === 2 ? "000000" + e2 : e2.length === 1 ? "0000000" + e2 : e2;
}
Q.zero8 = cf;
function vs(e2, t, r3, i3) {
  var n4 = r3 - t;
  us(n4 % 4 === 0);
  for (var o5 = new Array(n4 / 4), h4 = 0, p4 = t; h4 < o5.length; h4++, p4 += 4) {
    var b4;
    i3 === "big" ? b4 = e2[p4] << 24 | e2[p4 + 1] << 16 | e2[p4 + 2] << 8 | e2[p4 + 3] : b4 = e2[p4 + 3] << 24 | e2[p4 + 2] << 16 | e2[p4 + 1] << 8 | e2[p4], o5[h4] = b4 >>> 0;
  }
  return o5;
}
Q.join32 = vs;
function ms(e2, t) {
  for (var r3 = new Array(e2.length * 4), i3 = 0, n4 = 0; i3 < e2.length; i3++, n4 += 4) {
    var o5 = e2[i3];
    t === "big" ? (r3[n4] = o5 >>> 24, r3[n4 + 1] = o5 >>> 16 & 255, r3[n4 + 2] = o5 >>> 8 & 255, r3[n4 + 3] = o5 & 255) : (r3[n4 + 3] = o5 >>> 24, r3[n4 + 2] = o5 >>> 16 & 255, r3[n4 + 1] = o5 >>> 8 & 255, r3[n4] = o5 & 255);
  }
  return r3;
}
Q.split32 = ms;
function gs(e2, t) {
  return e2 >>> t | e2 << 32 - t;
}
Q.rotr32 = gs;
function As(e2, t) {
  return e2 << t | e2 >>> 32 - t;
}
Q.rotl32 = As;
function bs(e2, t) {
  return e2 + t >>> 0;
}
Q.sum32 = bs;
function ys(e2, t, r3) {
  return e2 + t + r3 >>> 0;
}
Q.sum32_3 = ys;
function ws(e2, t, r3, i3) {
  return e2 + t + r3 + i3 >>> 0;
}
Q.sum32_4 = ws;
function xs(e2, t, r3, i3, n4) {
  return e2 + t + r3 + i3 + n4 >>> 0;
}
Q.sum32_5 = xs;
function Ms(e2, t, r3, i3) {
  var n4 = e2[t], o5 = e2[t + 1], h4 = i3 + o5 >>> 0, p4 = (h4 < i3 ? 1 : 0) + r3 + n4;
  e2[t] = p4 >>> 0, e2[t + 1] = h4;
}
Q.sum64 = Ms;
function Es(e2, t, r3, i3) {
  var n4 = t + i3 >>> 0, o5 = (n4 < t ? 1 : 0) + e2 + r3;
  return o5 >>> 0;
}
Q.sum64_hi = Es;
function Ss(e2, t, r3, i3) {
  var n4 = t + i3;
  return n4 >>> 0;
}
Q.sum64_lo = Ss;
function Ns(e2, t, r3, i3, n4, o5, h4, p4) {
  var b4 = 0, m3 = t;
  m3 = m3 + i3 >>> 0, b4 += m3 < t ? 1 : 0, m3 = m3 + o5 >>> 0, b4 += m3 < o5 ? 1 : 0, m3 = m3 + p4 >>> 0, b4 += m3 < p4 ? 1 : 0;
  var w4 = e2 + r3 + n4 + h4 + b4;
  return w4 >>> 0;
}
Q.sum64_4_hi = Ns;
function Is(e2, t, r3, i3, n4, o5, h4, p4) {
  var b4 = t + i3 + o5 + p4;
  return b4 >>> 0;
}
Q.sum64_4_lo = Is;
function _s(e2, t, r3, i3, n4, o5, h4, p4, b4, m3) {
  var w4 = 0, y8 = t;
  y8 = y8 + i3 >>> 0, w4 += y8 < t ? 1 : 0, y8 = y8 + o5 >>> 0, w4 += y8 < o5 ? 1 : 0, y8 = y8 + p4 >>> 0, w4 += y8 < p4 ? 1 : 0, y8 = y8 + m3 >>> 0, w4 += y8 < m3 ? 1 : 0;
  var S4 = e2 + r3 + n4 + h4 + b4 + w4;
  return S4 >>> 0;
}
Q.sum64_5_hi = _s;
function Bs(e2, t, r3, i3, n4, o5, h4, p4, b4, m3) {
  var w4 = t + i3 + o5 + p4 + m3;
  return w4 >>> 0;
}
Q.sum64_5_lo = Bs;
function Cs(e2, t, r3) {
  var i3 = t << 32 - r3 | e2 >>> r3;
  return i3 >>> 0;
}
Q.rotr64_hi = Cs;
function Rs(e2, t, r3) {
  var i3 = e2 << 32 - r3 | t >>> r3;
  return i3 >>> 0;
}
Q.rotr64_lo = Rs;
function Os(e2, t, r3) {
  return e2 >>> r3;
}
Q.shr64_hi = Os;
function Ps(e2, t, r3) {
  var i3 = e2 << 32 - r3 | t >>> r3;
  return i3 >>> 0;
}
Q.shr64_lo = Ps;
var fr = {};
var lf = Q;
var Ds = yr;
function Fr() {
  this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
}
fr.BlockHash = Fr, Fr.prototype.update = function(t, r3) {
  if (t = lf.toArray(t, r3), this.pending ? this.pending = this.pending.concat(t) : this.pending = t, this.pendingTotal += t.length, this.pending.length >= this._delta8) {
    t = this.pending;
    var i3 = t.length % this._delta8;
    this.pending = t.slice(t.length - i3, t.length), this.pending.length === 0 && (this.pending = null), t = lf.join32(t, 0, t.length - i3, this.endian);
    for (var n4 = 0; n4 < t.length; n4 += this._delta32) this._update(t, n4, n4 + this._delta32);
  }
  return this;
}, Fr.prototype.digest = function(t) {
  return this.update(this._pad()), Ds(this.pending === null), this._digest(t);
}, Fr.prototype._pad = function() {
  var t = this.pendingTotal, r3 = this._delta8, i3 = r3 - (t + this.padLength) % r3, n4 = new Array(i3 + this.padLength);
  n4[0] = 128;
  for (var o5 = 1; o5 < i3; o5++) n4[o5] = 0;
  if (t <<= 3, this.endian === "big") {
    for (var h4 = 8; h4 < this.padLength; h4++) n4[o5++] = 0;
    n4[o5++] = 0, n4[o5++] = 0, n4[o5++] = 0, n4[o5++] = 0, n4[o5++] = t >>> 24 & 255, n4[o5++] = t >>> 16 & 255, n4[o5++] = t >>> 8 & 255, n4[o5++] = t & 255;
  } else for (n4[o5++] = t & 255, n4[o5++] = t >>> 8 & 255, n4[o5++] = t >>> 16 & 255, n4[o5++] = t >>> 24 & 255, n4[o5++] = 0, n4[o5++] = 0, n4[o5++] = 0, n4[o5++] = 0, h4 = 8; h4 < this.padLength; h4++) n4[o5++] = 0;
  return n4;
};
var or = {};
var ae = {};
var Fs = Q;
var ue = Fs.rotr32;
function Ts(e2, t, r3, i3) {
  if (e2 === 0) return df(t, r3, i3);
  if (e2 === 1 || e2 === 3) return vf(t, r3, i3);
  if (e2 === 2) return pf(t, r3, i3);
}
ae.ft_1 = Ts;
function df(e2, t, r3) {
  return e2 & t ^ ~e2 & r3;
}
ae.ch32 = df;
function pf(e2, t, r3) {
  return e2 & t ^ e2 & r3 ^ t & r3;
}
ae.maj32 = pf;
function vf(e2, t, r3) {
  return e2 ^ t ^ r3;
}
ae.p32 = vf;
function Us(e2) {
  return ue(e2, 2) ^ ue(e2, 13) ^ ue(e2, 22);
}
ae.s0_256 = Us;
function ks(e2) {
  return ue(e2, 6) ^ ue(e2, 11) ^ ue(e2, 25);
}
ae.s1_256 = ks;
function qs(e2) {
  return ue(e2, 7) ^ ue(e2, 18) ^ e2 >>> 3;
}
ae.g0_256 = qs;
function Ks(e2) {
  return ue(e2, 17) ^ ue(e2, 19) ^ e2 >>> 10;
}
ae.g1_256 = Ks;
var sr = Q;
var Hs = fr;
var zs = ae;
var _i = sr.rotl32;
var wr = sr.sum32;
var Ls = sr.sum32_5;
var js = zs.ft_1;
var mf = Hs.BlockHash;
var Qs = [1518500249, 1859775393, 2400959708, 3395469782];
function he() {
  if (!(this instanceof he)) return new he();
  mf.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.W = new Array(80);
}
sr.inherits(he, mf);
var Js = he;
he.blockSize = 512, he.outSize = 160, he.hmacStrength = 80, he.padLength = 64, he.prototype._update = function(t, r3) {
  for (var i3 = this.W, n4 = 0; n4 < 16; n4++) i3[n4] = t[r3 + n4];
  for (; n4 < i3.length; n4++) i3[n4] = _i(i3[n4 - 3] ^ i3[n4 - 8] ^ i3[n4 - 14] ^ i3[n4 - 16], 1);
  var o5 = this.h[0], h4 = this.h[1], p4 = this.h[2], b4 = this.h[3], m3 = this.h[4];
  for (n4 = 0; n4 < i3.length; n4++) {
    var w4 = ~~(n4 / 20), y8 = Ls(_i(o5, 5), js(w4, h4, p4, b4), m3, i3[n4], Qs[w4]);
    m3 = b4, b4 = p4, p4 = _i(h4, 30), h4 = o5, o5 = y8;
  }
  this.h[0] = wr(this.h[0], o5), this.h[1] = wr(this.h[1], h4), this.h[2] = wr(this.h[2], p4), this.h[3] = wr(this.h[3], b4), this.h[4] = wr(this.h[4], m3);
}, he.prototype._digest = function(t) {
  return t === "hex" ? sr.toHex32(this.h, "big") : sr.split32(this.h, "big");
};
var ar = Q;
var Gs = fr;
var ur = ae;
var Ys = yr;
var ie = ar.sum32;
var Vs = ar.sum32_4;
var Ws = ar.sum32_5;
var Xs = ur.ch32;
var Zs = ur.maj32;
var $s = ur.s0_256;
var ta = ur.s1_256;
var ea = ur.g0_256;
var ra = ur.g1_256;
var gf = Gs.BlockHash;
var ia = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
function ce() {
  if (!(this instanceof ce)) return new ce();
  gf.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = ia, this.W = new Array(64);
}
ar.inherits(ce, gf);
var Af = ce;
ce.blockSize = 512, ce.outSize = 256, ce.hmacStrength = 192, ce.padLength = 64, ce.prototype._update = function(t, r3) {
  for (var i3 = this.W, n4 = 0; n4 < 16; n4++) i3[n4] = t[r3 + n4];
  for (; n4 < i3.length; n4++) i3[n4] = Vs(ra(i3[n4 - 2]), i3[n4 - 7], ea(i3[n4 - 15]), i3[n4 - 16]);
  var o5 = this.h[0], h4 = this.h[1], p4 = this.h[2], b4 = this.h[3], m3 = this.h[4], w4 = this.h[5], y8 = this.h[6], S4 = this.h[7];
  for (Ys(this.k.length === i3.length), n4 = 0; n4 < i3.length; n4++) {
    var I2 = Ws(S4, ta(m3), Xs(m3, w4, y8), this.k[n4], i3[n4]), N3 = ie($s(o5), Zs(o5, h4, p4));
    S4 = y8, y8 = w4, w4 = m3, m3 = ie(b4, I2), b4 = p4, p4 = h4, h4 = o5, o5 = ie(I2, N3);
  }
  this.h[0] = ie(this.h[0], o5), this.h[1] = ie(this.h[1], h4), this.h[2] = ie(this.h[2], p4), this.h[3] = ie(this.h[3], b4), this.h[4] = ie(this.h[4], m3), this.h[5] = ie(this.h[5], w4), this.h[6] = ie(this.h[6], y8), this.h[7] = ie(this.h[7], S4);
}, ce.prototype._digest = function(t) {
  return t === "hex" ? ar.toHex32(this.h, "big") : ar.split32(this.h, "big");
};
var Bi = Q;
var bf = Af;
function ye() {
  if (!(this instanceof ye)) return new ye();
  bf.call(this), this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428];
}
Bi.inherits(ye, bf);
var na = ye;
ye.blockSize = 512, ye.outSize = 224, ye.hmacStrength = 192, ye.padLength = 64, ye.prototype._digest = function(t) {
  return t === "hex" ? Bi.toHex32(this.h.slice(0, 7), "big") : Bi.split32(this.h.slice(0, 7), "big");
};
var jt = Q;
var fa = fr;
var oa = yr;
var le = jt.rotr64_hi;
var de = jt.rotr64_lo;
var yf = jt.shr64_hi;
var wf = jt.shr64_lo;
var Be = jt.sum64;
var Ci = jt.sum64_hi;
var Ri = jt.sum64_lo;
var sa = jt.sum64_4_hi;
var aa = jt.sum64_4_lo;
var ua = jt.sum64_5_hi;
var ha = jt.sum64_5_lo;
var xf = fa.BlockHash;
var ca = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];
function ne() {
  if (!(this instanceof ne)) return new ne();
  xf.call(this), this.h = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], this.k = ca, this.W = new Array(160);
}
jt.inherits(ne, xf);
var Mf = ne;
ne.blockSize = 1024, ne.outSize = 512, ne.hmacStrength = 192, ne.padLength = 128, ne.prototype._prepareBlock = function(t, r3) {
  for (var i3 = this.W, n4 = 0; n4 < 32; n4++) i3[n4] = t[r3 + n4];
  for (; n4 < i3.length; n4 += 2) {
    var o5 = xa(i3[n4 - 4], i3[n4 - 3]), h4 = Ma(i3[n4 - 4], i3[n4 - 3]), p4 = i3[n4 - 14], b4 = i3[n4 - 13], m3 = ya(i3[n4 - 30], i3[n4 - 29]), w4 = wa(i3[n4 - 30], i3[n4 - 29]), y8 = i3[n4 - 32], S4 = i3[n4 - 31];
    i3[n4] = sa(o5, h4, p4, b4, m3, w4, y8, S4), i3[n4 + 1] = aa(o5, h4, p4, b4, m3, w4, y8, S4);
  }
}, ne.prototype._update = function(t, r3) {
  this._prepareBlock(t, r3);
  var i3 = this.W, n4 = this.h[0], o5 = this.h[1], h4 = this.h[2], p4 = this.h[3], b4 = this.h[4], m3 = this.h[5], w4 = this.h[6], y8 = this.h[7], S4 = this.h[8], I2 = this.h[9], N3 = this.h[10], C4 = this.h[11], F = this.h[12], U4 = this.h[13], J2 = this.h[14], Bt3 = this.h[15];
  oa(this.k.length === i3.length);
  for (var G = 0; G < i3.length; G += 2) {
    var H = J2, z5 = Bt3, Pt2 = Aa(S4, I2), W2 = ba(S4, I2), Rt2 = la(S4, I2, N3, C4, F), Yt3 = da(S4, I2, N3, C4, F, U4), Y = this.k[G], Vt3 = this.k[G + 1], A4 = i3[G], f5 = i3[G + 1], a4 = ua(H, z5, Pt2, W2, Rt2, Yt3, Y, Vt3, A4, f5), c5 = ha(H, z5, Pt2, W2, Rt2, Yt3, Y, Vt3, A4, f5);
    H = ma(n4, o5), z5 = ga(n4, o5), Pt2 = pa(n4, o5, h4, p4, b4), W2 = va(n4, o5, h4, p4, b4, m3);
    var d3 = Ci(H, z5, Pt2, W2), g4 = Ri(H, z5, Pt2, W2);
    J2 = F, Bt3 = U4, F = N3, U4 = C4, N3 = S4, C4 = I2, S4 = Ci(w4, y8, a4, c5), I2 = Ri(y8, y8, a4, c5), w4 = b4, y8 = m3, b4 = h4, m3 = p4, h4 = n4, p4 = o5, n4 = Ci(a4, c5, d3, g4), o5 = Ri(a4, c5, d3, g4);
  }
  Be(this.h, 0, n4, o5), Be(this.h, 2, h4, p4), Be(this.h, 4, b4, m3), Be(this.h, 6, w4, y8), Be(this.h, 8, S4, I2), Be(this.h, 10, N3, C4), Be(this.h, 12, F, U4), Be(this.h, 14, J2, Bt3);
}, ne.prototype._digest = function(t) {
  return t === "hex" ? jt.toHex32(this.h, "big") : jt.split32(this.h, "big");
};
function la(e2, t, r3, i3, n4) {
  var o5 = e2 & r3 ^ ~e2 & n4;
  return o5 < 0 && (o5 += 4294967296), o5;
}
function da(e2, t, r3, i3, n4, o5) {
  var h4 = t & i3 ^ ~t & o5;
  return h4 < 0 && (h4 += 4294967296), h4;
}
function pa(e2, t, r3, i3, n4) {
  var o5 = e2 & r3 ^ e2 & n4 ^ r3 & n4;
  return o5 < 0 && (o5 += 4294967296), o5;
}
function va(e2, t, r3, i3, n4, o5) {
  var h4 = t & i3 ^ t & o5 ^ i3 & o5;
  return h4 < 0 && (h4 += 4294967296), h4;
}
function ma(e2, t) {
  var r3 = le(e2, t, 28), i3 = le(t, e2, 2), n4 = le(t, e2, 7), o5 = r3 ^ i3 ^ n4;
  return o5 < 0 && (o5 += 4294967296), o5;
}
function ga(e2, t) {
  var r3 = de(e2, t, 28), i3 = de(t, e2, 2), n4 = de(t, e2, 7), o5 = r3 ^ i3 ^ n4;
  return o5 < 0 && (o5 += 4294967296), o5;
}
function Aa(e2, t) {
  var r3 = le(e2, t, 14), i3 = le(e2, t, 18), n4 = le(t, e2, 9), o5 = r3 ^ i3 ^ n4;
  return o5 < 0 && (o5 += 4294967296), o5;
}
function ba(e2, t) {
  var r3 = de(e2, t, 14), i3 = de(e2, t, 18), n4 = de(t, e2, 9), o5 = r3 ^ i3 ^ n4;
  return o5 < 0 && (o5 += 4294967296), o5;
}
function ya(e2, t) {
  var r3 = le(e2, t, 1), i3 = le(e2, t, 8), n4 = yf(e2, t, 7), o5 = r3 ^ i3 ^ n4;
  return o5 < 0 && (o5 += 4294967296), o5;
}
function wa(e2, t) {
  var r3 = de(e2, t, 1), i3 = de(e2, t, 8), n4 = wf(e2, t, 7), o5 = r3 ^ i3 ^ n4;
  return o5 < 0 && (o5 += 4294967296), o5;
}
function xa(e2, t) {
  var r3 = le(e2, t, 19), i3 = le(t, e2, 29), n4 = yf(e2, t, 6), o5 = r3 ^ i3 ^ n4;
  return o5 < 0 && (o5 += 4294967296), o5;
}
function Ma(e2, t) {
  var r3 = de(e2, t, 19), i3 = de(t, e2, 29), n4 = wf(e2, t, 6), o5 = r3 ^ i3 ^ n4;
  return o5 < 0 && (o5 += 4294967296), o5;
}
var Oi = Q;
var Ef = Mf;
function we() {
  if (!(this instanceof we)) return new we();
  Ef.call(this), this.h = [3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428];
}
Oi.inherits(we, Ef);
var Ea = we;
we.blockSize = 1024, we.outSize = 384, we.hmacStrength = 192, we.padLength = 128, we.prototype._digest = function(t) {
  return t === "hex" ? Oi.toHex32(this.h.slice(0, 12), "big") : Oi.split32(this.h.slice(0, 12), "big");
}, or.sha1 = Js, or.sha224 = na, or.sha256 = Af, or.sha384 = Ea, or.sha512 = Mf;
var Sf = {};
var Xe = Q;
var Sa = fr;
var Tr = Xe.rotl32;
var Nf = Xe.sum32;
var xr = Xe.sum32_3;
var If = Xe.sum32_4;
var _f = Sa.BlockHash;
function pe() {
  if (!(this instanceof pe)) return new pe();
  _f.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little";
}
Xe.inherits(pe, _f), Sf.ripemd160 = pe, pe.blockSize = 512, pe.outSize = 160, pe.hmacStrength = 192, pe.padLength = 64, pe.prototype._update = function(t, r3) {
  for (var i3 = this.h[0], n4 = this.h[1], o5 = this.h[2], h4 = this.h[3], p4 = this.h[4], b4 = i3, m3 = n4, w4 = o5, y8 = h4, S4 = p4, I2 = 0; I2 < 80; I2++) {
    var N3 = Nf(Tr(If(i3, Bf(I2, n4, o5, h4), t[_a[I2] + r3], Na(I2)), Ca[I2]), p4);
    i3 = p4, p4 = h4, h4 = Tr(o5, 10), o5 = n4, n4 = N3, N3 = Nf(Tr(If(b4, Bf(79 - I2, m3, w4, y8), t[Ba[I2] + r3], Ia(I2)), Ra[I2]), S4), b4 = S4, S4 = y8, y8 = Tr(w4, 10), w4 = m3, m3 = N3;
  }
  N3 = xr(this.h[1], o5, y8), this.h[1] = xr(this.h[2], h4, S4), this.h[2] = xr(this.h[3], p4, b4), this.h[3] = xr(this.h[4], i3, m3), this.h[4] = xr(this.h[0], n4, w4), this.h[0] = N3;
}, pe.prototype._digest = function(t) {
  return t === "hex" ? Xe.toHex32(this.h, "little") : Xe.split32(this.h, "little");
};
function Bf(e2, t, r3, i3) {
  return e2 <= 15 ? t ^ r3 ^ i3 : e2 <= 31 ? t & r3 | ~t & i3 : e2 <= 47 ? (t | ~r3) ^ i3 : e2 <= 63 ? t & i3 | r3 & ~i3 : t ^ (r3 | ~i3);
}
function Na(e2) {
  return e2 <= 15 ? 0 : e2 <= 31 ? 1518500249 : e2 <= 47 ? 1859775393 : e2 <= 63 ? 2400959708 : 2840853838;
}
function Ia(e2) {
  return e2 <= 15 ? 1352829926 : e2 <= 31 ? 1548603684 : e2 <= 47 ? 1836072691 : e2 <= 63 ? 2053994217 : 0;
}
var _a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13];
var Ba = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11];
var Ca = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6];
var Ra = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];
var Oa = Q;
var Pa = yr;
function hr(e2, t, r3) {
  if (!(this instanceof hr)) return new hr(e2, t, r3);
  this.Hash = e2, this.blockSize = e2.blockSize / 8, this.outSize = e2.outSize / 8, this.inner = null, this.outer = null, this._init(Oa.toArray(t, r3));
}
var Da = hr;
hr.prototype._init = function(t) {
  t.length > this.blockSize && (t = new this.Hash().update(t).digest()), Pa(t.length <= this.blockSize);
  for (var r3 = t.length; r3 < this.blockSize; r3++) t.push(0);
  for (r3 = 0; r3 < t.length; r3++) t[r3] ^= 54;
  for (this.inner = new this.Hash().update(t), r3 = 0; r3 < t.length; r3++) t[r3] ^= 106;
  this.outer = new this.Hash().update(t);
}, hr.prototype.update = function(t, r3) {
  return this.inner.update(t, r3), this;
}, hr.prototype.digest = function(t) {
  return this.outer.update(this.inner.digest()), this.outer.digest(t);
}, function(e2) {
  var t = e2;
  t.utils = Q, t.common = fr, t.sha = or, t.ripemd = Sf, t.hmac = Da, t.sha1 = t.sha.sha1, t.sha256 = t.sha.sha256, t.sha224 = t.sha.sha224, t.sha384 = t.sha.sha384, t.sha512 = t.sha.sha512, t.ripemd160 = t.ripemd.ripemd160;
}(se);
function cr(e2, t, r3) {
  return r3 = { path: t, exports: {}, require: function(i3, n4) {
    return Fa(i3, n4 ?? r3.path);
  } }, e2(r3, r3.exports), r3.exports;
}
function Fa() {
  throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}
var Pi = Cf;
function Cf(e2, t) {
  if (!e2) throw new Error(t || "Assertion failed");
}
Cf.equal = function(t, r3, i3) {
  if (t != r3) throw new Error(i3 || "Assertion failed: " + t + " != " + r3);
};
var fe = cr(function(e2, t) {
  var r3 = t;
  function i3(h4, p4) {
    if (Array.isArray(h4)) return h4.slice();
    if (!h4) return [];
    var b4 = [];
    if (typeof h4 != "string") {
      for (var m3 = 0; m3 < h4.length; m3++) b4[m3] = h4[m3] | 0;
      return b4;
    }
    if (p4 === "hex") {
      h4 = h4.replace(/[^a-z0-9]+/ig, ""), h4.length % 2 !== 0 && (h4 = "0" + h4);
      for (var m3 = 0; m3 < h4.length; m3 += 2) b4.push(parseInt(h4[m3] + h4[m3 + 1], 16));
    } else for (var m3 = 0; m3 < h4.length; m3++) {
      var w4 = h4.charCodeAt(m3), y8 = w4 >> 8, S4 = w4 & 255;
      y8 ? b4.push(y8, S4) : b4.push(S4);
    }
    return b4;
  }
  r3.toArray = i3;
  function n4(h4) {
    return h4.length === 1 ? "0" + h4 : h4;
  }
  r3.zero2 = n4;
  function o5(h4) {
    for (var p4 = "", b4 = 0; b4 < h4.length; b4++) p4 += n4(h4[b4].toString(16));
    return p4;
  }
  r3.toHex = o5, r3.encode = function(p4, b4) {
    return b4 === "hex" ? o5(p4) : p4;
  };
});
var Jt = cr(function(e2, t) {
  var r3 = t;
  r3.assert = Pi, r3.toArray = fe.toArray, r3.zero2 = fe.zero2, r3.toHex = fe.toHex, r3.encode = fe.encode;
  function i3(b4, m3, w4) {
    var y8 = new Array(Math.max(b4.bitLength(), w4) + 1);
    y8.fill(0);
    for (var S4 = 1 << m3 + 1, I2 = b4.clone(), N3 = 0; N3 < y8.length; N3++) {
      var C4, F = I2.andln(S4 - 1);
      I2.isOdd() ? (F > (S4 >> 1) - 1 ? C4 = (S4 >> 1) - F : C4 = F, I2.isubn(C4)) : C4 = 0, y8[N3] = C4, I2.iushrn(1);
    }
    return y8;
  }
  r3.getNAF = i3;
  function n4(b4, m3) {
    var w4 = [[], []];
    b4 = b4.clone(), m3 = m3.clone();
    for (var y8 = 0, S4 = 0, I2; b4.cmpn(-y8) > 0 || m3.cmpn(-S4) > 0; ) {
      var N3 = b4.andln(3) + y8 & 3, C4 = m3.andln(3) + S4 & 3;
      N3 === 3 && (N3 = -1), C4 === 3 && (C4 = -1);
      var F;
      N3 & 1 ? (I2 = b4.andln(7) + y8 & 7, (I2 === 3 || I2 === 5) && C4 === 2 ? F = -N3 : F = N3) : F = 0, w4[0].push(F);
      var U4;
      C4 & 1 ? (I2 = m3.andln(7) + S4 & 7, (I2 === 3 || I2 === 5) && N3 === 2 ? U4 = -C4 : U4 = C4) : U4 = 0, w4[1].push(U4), 2 * y8 === F + 1 && (y8 = 1 - y8), 2 * S4 === U4 + 1 && (S4 = 1 - S4), b4.iushrn(1), m3.iushrn(1);
    }
    return w4;
  }
  r3.getJSF = n4;
  function o5(b4, m3, w4) {
    var y8 = "_" + m3;
    b4.prototype[m3] = function() {
      return this[y8] !== void 0 ? this[y8] : this[y8] = w4.call(this);
    };
  }
  r3.cachedProperty = o5;
  function h4(b4) {
    return typeof b4 == "string" ? r3.toArray(b4, "hex") : b4;
  }
  r3.parseBytes = h4;
  function p4(b4) {
    return new K(b4, "hex", "le");
  }
  r3.intFromLE = p4;
});
var Ur = Jt.getNAF;
var Ta = Jt.getJSF;
var kr = Jt.assert;
function Ce(e2, t) {
  this.type = e2, this.p = new K(t.p, 16), this.red = t.prime ? K.red(t.prime) : K.mont(this.p), this.zero = new K(0).toRed(this.red), this.one = new K(1).toRed(this.red), this.two = new K(2).toRed(this.red), this.n = t.n && new K(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
  var r3 = this.n && this.p.div(this.n);
  !r3 || r3.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = true, this.redN = this.n.toRed(this.red));
}
var Ze = Ce;
Ce.prototype.point = function() {
  throw new Error("Not implemented");
}, Ce.prototype.validate = function() {
  throw new Error("Not implemented");
}, Ce.prototype._fixedNafMul = function(t, r3) {
  kr(t.precomputed);
  var i3 = t._getDoubles(), n4 = Ur(r3, 1, this._bitLength), o5 = (1 << i3.step + 1) - (i3.step % 2 === 0 ? 2 : 1);
  o5 /= 3;
  var h4 = [], p4, b4;
  for (p4 = 0; p4 < n4.length; p4 += i3.step) {
    b4 = 0;
    for (var m3 = p4 + i3.step - 1; m3 >= p4; m3--) b4 = (b4 << 1) + n4[m3];
    h4.push(b4);
  }
  for (var w4 = this.jpoint(null, null, null), y8 = this.jpoint(null, null, null), S4 = o5; S4 > 0; S4--) {
    for (p4 = 0; p4 < h4.length; p4++) b4 = h4[p4], b4 === S4 ? y8 = y8.mixedAdd(i3.points[p4]) : b4 === -S4 && (y8 = y8.mixedAdd(i3.points[p4].neg()));
    w4 = w4.add(y8);
  }
  return w4.toP();
}, Ce.prototype._wnafMul = function(t, r3) {
  var i3 = 4, n4 = t._getNAFPoints(i3);
  i3 = n4.wnd;
  for (var o5 = n4.points, h4 = Ur(r3, i3, this._bitLength), p4 = this.jpoint(null, null, null), b4 = h4.length - 1; b4 >= 0; b4--) {
    for (var m3 = 0; b4 >= 0 && h4[b4] === 0; b4--) m3++;
    if (b4 >= 0 && m3++, p4 = p4.dblp(m3), b4 < 0) break;
    var w4 = h4[b4];
    kr(w4 !== 0), t.type === "affine" ? w4 > 0 ? p4 = p4.mixedAdd(o5[w4 - 1 >> 1]) : p4 = p4.mixedAdd(o5[-w4 - 1 >> 1].neg()) : w4 > 0 ? p4 = p4.add(o5[w4 - 1 >> 1]) : p4 = p4.add(o5[-w4 - 1 >> 1].neg());
  }
  return t.type === "affine" ? p4.toP() : p4;
}, Ce.prototype._wnafMulAdd = function(t, r3, i3, n4, o5) {
  var h4 = this._wnafT1, p4 = this._wnafT2, b4 = this._wnafT3, m3 = 0, w4, y8, S4;
  for (w4 = 0; w4 < n4; w4++) {
    S4 = r3[w4];
    var I2 = S4._getNAFPoints(t);
    h4[w4] = I2.wnd, p4[w4] = I2.points;
  }
  for (w4 = n4 - 1; w4 >= 1; w4 -= 2) {
    var N3 = w4 - 1, C4 = w4;
    if (h4[N3] !== 1 || h4[C4] !== 1) {
      b4[N3] = Ur(i3[N3], h4[N3], this._bitLength), b4[C4] = Ur(i3[C4], h4[C4], this._bitLength), m3 = Math.max(b4[N3].length, m3), m3 = Math.max(b4[C4].length, m3);
      continue;
    }
    var F = [r3[N3], null, null, r3[C4]];
    r3[N3].y.cmp(r3[C4].y) === 0 ? (F[1] = r3[N3].add(r3[C4]), F[2] = r3[N3].toJ().mixedAdd(r3[C4].neg())) : r3[N3].y.cmp(r3[C4].y.redNeg()) === 0 ? (F[1] = r3[N3].toJ().mixedAdd(r3[C4]), F[2] = r3[N3].add(r3[C4].neg())) : (F[1] = r3[N3].toJ().mixedAdd(r3[C4]), F[2] = r3[N3].toJ().mixedAdd(r3[C4].neg()));
    var U4 = [-3, -1, -5, -7, 0, 7, 5, 1, 3], J2 = Ta(i3[N3], i3[C4]);
    for (m3 = Math.max(J2[0].length, m3), b4[N3] = new Array(m3), b4[C4] = new Array(m3), y8 = 0; y8 < m3; y8++) {
      var Bt3 = J2[0][y8] | 0, G = J2[1][y8] | 0;
      b4[N3][y8] = U4[(Bt3 + 1) * 3 + (G + 1)], b4[C4][y8] = 0, p4[N3] = F;
    }
  }
  var H = this.jpoint(null, null, null), z5 = this._wnafT4;
  for (w4 = m3; w4 >= 0; w4--) {
    for (var Pt2 = 0; w4 >= 0; ) {
      var W2 = true;
      for (y8 = 0; y8 < n4; y8++) z5[y8] = b4[y8][w4] | 0, z5[y8] !== 0 && (W2 = false);
      if (!W2) break;
      Pt2++, w4--;
    }
    if (w4 >= 0 && Pt2++, H = H.dblp(Pt2), w4 < 0) break;
    for (y8 = 0; y8 < n4; y8++) {
      var Rt2 = z5[y8];
      Rt2 !== 0 && (Rt2 > 0 ? S4 = p4[y8][Rt2 - 1 >> 1] : Rt2 < 0 && (S4 = p4[y8][-Rt2 - 1 >> 1].neg()), S4.type === "affine" ? H = H.mixedAdd(S4) : H = H.add(S4));
    }
  }
  for (w4 = 0; w4 < n4; w4++) p4[w4] = null;
  return o5 ? H : H.toP();
};
function Xt(e2, t) {
  this.curve = e2, this.type = t, this.precomputed = null;
}
Ce.BasePoint = Xt, Xt.prototype.eq = function() {
  throw new Error("Not implemented");
}, Xt.prototype.validate = function() {
  return this.curve.validate(this);
}, Ce.prototype.decodePoint = function(t, r3) {
  t = Jt.toArray(t, r3);
  var i3 = this.p.byteLength();
  if ((t[0] === 4 || t[0] === 6 || t[0] === 7) && t.length - 1 === 2 * i3) {
    t[0] === 6 ? kr(t[t.length - 1] % 2 === 0) : t[0] === 7 && kr(t[t.length - 1] % 2 === 1);
    var n4 = this.point(t.slice(1, 1 + i3), t.slice(1 + i3, 1 + 2 * i3));
    return n4;
  } else if ((t[0] === 2 || t[0] === 3) && t.length - 1 === i3) return this.pointFromX(t.slice(1, 1 + i3), t[0] === 3);
  throw new Error("Unknown point format");
}, Xt.prototype.encodeCompressed = function(t) {
  return this.encode(t, true);
}, Xt.prototype._encode = function(t) {
  var r3 = this.curve.p.byteLength(), i3 = this.getX().toArray("be", r3);
  return t ? [this.getY().isEven() ? 2 : 3].concat(i3) : [4].concat(i3, this.getY().toArray("be", r3));
}, Xt.prototype.encode = function(t, r3) {
  return Jt.encode(this._encode(r3), t);
}, Xt.prototype.precompute = function(t) {
  if (this.precomputed) return this;
  var r3 = { doubles: null, naf: null, beta: null };
  return r3.naf = this._getNAFPoints(8), r3.doubles = this._getDoubles(4, t), r3.beta = this._getBeta(), this.precomputed = r3, this;
}, Xt.prototype._hasDoubles = function(t) {
  if (!this.precomputed) return false;
  var r3 = this.precomputed.doubles;
  return r3 ? r3.points.length >= Math.ceil((t.bitLength() + 1) / r3.step) : false;
}, Xt.prototype._getDoubles = function(t, r3) {
  if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
  for (var i3 = [this], n4 = this, o5 = 0; o5 < r3; o5 += t) {
    for (var h4 = 0; h4 < t; h4++) n4 = n4.dbl();
    i3.push(n4);
  }
  return { step: t, points: i3 };
}, Xt.prototype._getNAFPoints = function(t) {
  if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
  for (var r3 = [this], i3 = (1 << t) - 1, n4 = i3 === 1 ? null : this.dbl(), o5 = 1; o5 < i3; o5++) r3[o5] = r3[o5 - 1].add(n4);
  return { wnd: t, points: r3 };
}, Xt.prototype._getBeta = function() {
  return null;
}, Xt.prototype.dblp = function(t) {
  for (var r3 = this, i3 = 0; i3 < t; i3++) r3 = r3.dbl();
  return r3;
};
var Di = cr(function(e2) {
  typeof Object.create == "function" ? e2.exports = function(r3, i3) {
    i3 && (r3.super_ = i3, r3.prototype = Object.create(i3.prototype, { constructor: { value: r3, enumerable: false, writable: true, configurable: true } }));
  } : e2.exports = function(r3, i3) {
    if (i3) {
      r3.super_ = i3;
      var n4 = function() {
      };
      n4.prototype = i3.prototype, r3.prototype = new n4(), r3.prototype.constructor = r3;
    }
  };
});
var Ua = Jt.assert;
function Zt(e2) {
  Ze.call(this, "short", e2), this.a = new K(e2.a, 16).toRed(this.red), this.b = new K(e2.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = this.a.fromRed().cmpn(0) === 0, this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0, this.endo = this._getEndomorphism(e2), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);
}
Di(Zt, Ze);
var ka = Zt;
Zt.prototype._getEndomorphism = function(t) {
  if (!(!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)) {
    var r3, i3;
    if (t.beta) r3 = new K(t.beta, 16).toRed(this.red);
    else {
      var n4 = this._getEndoRoots(this.p);
      r3 = n4[0].cmp(n4[1]) < 0 ? n4[0] : n4[1], r3 = r3.toRed(this.red);
    }
    if (t.lambda) i3 = new K(t.lambda, 16);
    else {
      var o5 = this._getEndoRoots(this.n);
      this.g.mul(o5[0]).x.cmp(this.g.x.redMul(r3)) === 0 ? i3 = o5[0] : (i3 = o5[1], Ua(this.g.mul(i3).x.cmp(this.g.x.redMul(r3)) === 0));
    }
    var h4;
    return t.basis ? h4 = t.basis.map(function(p4) {
      return { a: new K(p4.a, 16), b: new K(p4.b, 16) };
    }) : h4 = this._getEndoBasis(i3), { beta: r3, lambda: i3, basis: h4 };
  }
}, Zt.prototype._getEndoRoots = function(t) {
  var r3 = t === this.p ? this.red : K.mont(t), i3 = new K(2).toRed(r3).redInvm(), n4 = i3.redNeg(), o5 = new K(3).toRed(r3).redNeg().redSqrt().redMul(i3), h4 = n4.redAdd(o5).fromRed(), p4 = n4.redSub(o5).fromRed();
  return [h4, p4];
}, Zt.prototype._getEndoBasis = function(t) {
  for (var r3 = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), i3 = t, n4 = this.n.clone(), o5 = new K(1), h4 = new K(0), p4 = new K(0), b4 = new K(1), m3, w4, y8, S4, I2, N3, C4, F = 0, U4, J2; i3.cmpn(0) !== 0; ) {
    var Bt3 = n4.div(i3);
    U4 = n4.sub(Bt3.mul(i3)), J2 = p4.sub(Bt3.mul(o5));
    var G = b4.sub(Bt3.mul(h4));
    if (!y8 && U4.cmp(r3) < 0) m3 = C4.neg(), w4 = o5, y8 = U4.neg(), S4 = J2;
    else if (y8 && ++F === 2) break;
    C4 = U4, n4 = i3, i3 = U4, p4 = o5, o5 = J2, b4 = h4, h4 = G;
  }
  I2 = U4.neg(), N3 = J2;
  var H = y8.sqr().add(S4.sqr()), z5 = I2.sqr().add(N3.sqr());
  return z5.cmp(H) >= 0 && (I2 = m3, N3 = w4), y8.negative && (y8 = y8.neg(), S4 = S4.neg()), I2.negative && (I2 = I2.neg(), N3 = N3.neg()), [{ a: y8, b: S4 }, { a: I2, b: N3 }];
}, Zt.prototype._endoSplit = function(t) {
  var r3 = this.endo.basis, i3 = r3[0], n4 = r3[1], o5 = n4.b.mul(t).divRound(this.n), h4 = i3.b.neg().mul(t).divRound(this.n), p4 = o5.mul(i3.a), b4 = h4.mul(n4.a), m3 = o5.mul(i3.b), w4 = h4.mul(n4.b), y8 = t.sub(p4).sub(b4), S4 = m3.add(w4).neg();
  return { k1: y8, k2: S4 };
}, Zt.prototype.pointFromX = function(t, r3) {
  t = new K(t, 16), t.red || (t = t.toRed(this.red));
  var i3 = t.redSqr().redMul(t).redIAdd(t.redMul(this.a)).redIAdd(this.b), n4 = i3.redSqrt();
  if (n4.redSqr().redSub(i3).cmp(this.zero) !== 0) throw new Error("invalid point");
  var o5 = n4.fromRed().isOdd();
  return (r3 && !o5 || !r3 && o5) && (n4 = n4.redNeg()), this.point(t, n4);
}, Zt.prototype.validate = function(t) {
  if (t.inf) return true;
  var r3 = t.x, i3 = t.y, n4 = this.a.redMul(r3), o5 = r3.redSqr().redMul(r3).redIAdd(n4).redIAdd(this.b);
  return i3.redSqr().redISub(o5).cmpn(0) === 0;
}, Zt.prototype._endoWnafMulAdd = function(t, r3, i3) {
  for (var n4 = this._endoWnafT1, o5 = this._endoWnafT2, h4 = 0; h4 < t.length; h4++) {
    var p4 = this._endoSplit(r3[h4]), b4 = t[h4], m3 = b4._getBeta();
    p4.k1.negative && (p4.k1.ineg(), b4 = b4.neg(true)), p4.k2.negative && (p4.k2.ineg(), m3 = m3.neg(true)), n4[h4 * 2] = b4, n4[h4 * 2 + 1] = m3, o5[h4 * 2] = p4.k1, o5[h4 * 2 + 1] = p4.k2;
  }
  for (var w4 = this._wnafMulAdd(1, n4, o5, h4 * 2, i3), y8 = 0; y8 < h4 * 2; y8++) n4[y8] = null, o5[y8] = null;
  return w4;
};
function Ft(e2, t, r3, i3) {
  Ze.BasePoint.call(this, e2, "affine"), t === null && r3 === null ? (this.x = null, this.y = null, this.inf = true) : (this.x = new K(t, 16), this.y = new K(r3, 16), i3 && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = false);
}
Di(Ft, Ze.BasePoint), Zt.prototype.point = function(t, r3, i3) {
  return new Ft(this, t, r3, i3);
}, Zt.prototype.pointFromJSON = function(t, r3) {
  return Ft.fromJSON(this, t, r3);
}, Ft.prototype._getBeta = function() {
  if (this.curve.endo) {
    var t = this.precomputed;
    if (t && t.beta) return t.beta;
    var r3 = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
    if (t) {
      var i3 = this.curve, n4 = function(o5) {
        return i3.point(o5.x.redMul(i3.endo.beta), o5.y);
      };
      t.beta = r3, r3.precomputed = { beta: null, naf: t.naf && { wnd: t.naf.wnd, points: t.naf.points.map(n4) }, doubles: t.doubles && { step: t.doubles.step, points: t.doubles.points.map(n4) } };
    }
    return r3;
  }
}, Ft.prototype.toJSON = function() {
  return this.precomputed ? [this.x, this.y, this.precomputed && { doubles: this.precomputed.doubles && { step: this.precomputed.doubles.step, points: this.precomputed.doubles.points.slice(1) }, naf: this.precomputed.naf && { wnd: this.precomputed.naf.wnd, points: this.precomputed.naf.points.slice(1) } }] : [this.x, this.y];
}, Ft.fromJSON = function(t, r3, i3) {
  typeof r3 == "string" && (r3 = JSON.parse(r3));
  var n4 = t.point(r3[0], r3[1], i3);
  if (!r3[2]) return n4;
  function o5(p4) {
    return t.point(p4[0], p4[1], i3);
  }
  var h4 = r3[2];
  return n4.precomputed = { beta: null, doubles: h4.doubles && { step: h4.doubles.step, points: [n4].concat(h4.doubles.points.map(o5)) }, naf: h4.naf && { wnd: h4.naf.wnd, points: [n4].concat(h4.naf.points.map(o5)) } }, n4;
}, Ft.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
}, Ft.prototype.isInfinity = function() {
  return this.inf;
}, Ft.prototype.add = function(t) {
  if (this.inf) return t;
  if (t.inf) return this;
  if (this.eq(t)) return this.dbl();
  if (this.neg().eq(t)) return this.curve.point(null, null);
  if (this.x.cmp(t.x) === 0) return this.curve.point(null, null);
  var r3 = this.y.redSub(t.y);
  r3.cmpn(0) !== 0 && (r3 = r3.redMul(this.x.redSub(t.x).redInvm()));
  var i3 = r3.redSqr().redISub(this.x).redISub(t.x), n4 = r3.redMul(this.x.redSub(i3)).redISub(this.y);
  return this.curve.point(i3, n4);
}, Ft.prototype.dbl = function() {
  if (this.inf) return this;
  var t = this.y.redAdd(this.y);
  if (t.cmpn(0) === 0) return this.curve.point(null, null);
  var r3 = this.curve.a, i3 = this.x.redSqr(), n4 = t.redInvm(), o5 = i3.redAdd(i3).redIAdd(i3).redIAdd(r3).redMul(n4), h4 = o5.redSqr().redISub(this.x.redAdd(this.x)), p4 = o5.redMul(this.x.redSub(h4)).redISub(this.y);
  return this.curve.point(h4, p4);
}, Ft.prototype.getX = function() {
  return this.x.fromRed();
}, Ft.prototype.getY = function() {
  return this.y.fromRed();
}, Ft.prototype.mul = function(t) {
  return t = new K(t, 16), this.isInfinity() ? this : this._hasDoubles(t) ? this.curve._fixedNafMul(this, t) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [t]) : this.curve._wnafMul(this, t);
}, Ft.prototype.mulAdd = function(t, r3, i3) {
  var n4 = [this, r3], o5 = [t, i3];
  return this.curve.endo ? this.curve._endoWnafMulAdd(n4, o5) : this.curve._wnafMulAdd(1, n4, o5, 2);
}, Ft.prototype.jmulAdd = function(t, r3, i3) {
  var n4 = [this, r3], o5 = [t, i3];
  return this.curve.endo ? this.curve._endoWnafMulAdd(n4, o5, true) : this.curve._wnafMulAdd(1, n4, o5, 2, true);
}, Ft.prototype.eq = function(t) {
  return this === t || this.inf === t.inf && (this.inf || this.x.cmp(t.x) === 0 && this.y.cmp(t.y) === 0);
}, Ft.prototype.neg = function(t) {
  if (this.inf) return this;
  var r3 = this.curve.point(this.x, this.y.redNeg());
  if (t && this.precomputed) {
    var i3 = this.precomputed, n4 = function(o5) {
      return o5.neg();
    };
    r3.precomputed = { naf: i3.naf && { wnd: i3.naf.wnd, points: i3.naf.points.map(n4) }, doubles: i3.doubles && { step: i3.doubles.step, points: i3.doubles.points.map(n4) } };
  }
  return r3;
}, Ft.prototype.toJ = function() {
  if (this.inf) return this.curve.jpoint(null, null, null);
  var t = this.curve.jpoint(this.x, this.y, this.curve.one);
  return t;
};
function Tt(e2, t, r3, i3) {
  Ze.BasePoint.call(this, e2, "jacobian"), t === null && r3 === null && i3 === null ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new K(0)) : (this.x = new K(t, 16), this.y = new K(r3, 16), this.z = new K(i3, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
}
Di(Tt, Ze.BasePoint), Zt.prototype.jpoint = function(t, r3, i3) {
  return new Tt(this, t, r3, i3);
}, Tt.prototype.toP = function() {
  if (this.isInfinity()) return this.curve.point(null, null);
  var t = this.z.redInvm(), r3 = t.redSqr(), i3 = this.x.redMul(r3), n4 = this.y.redMul(r3).redMul(t);
  return this.curve.point(i3, n4);
}, Tt.prototype.neg = function() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
}, Tt.prototype.add = function(t) {
  if (this.isInfinity()) return t;
  if (t.isInfinity()) return this;
  var r3 = t.z.redSqr(), i3 = this.z.redSqr(), n4 = this.x.redMul(r3), o5 = t.x.redMul(i3), h4 = this.y.redMul(r3.redMul(t.z)), p4 = t.y.redMul(i3.redMul(this.z)), b4 = n4.redSub(o5), m3 = h4.redSub(p4);
  if (b4.cmpn(0) === 0) return m3.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var w4 = b4.redSqr(), y8 = w4.redMul(b4), S4 = n4.redMul(w4), I2 = m3.redSqr().redIAdd(y8).redISub(S4).redISub(S4), N3 = m3.redMul(S4.redISub(I2)).redISub(h4.redMul(y8)), C4 = this.z.redMul(t.z).redMul(b4);
  return this.curve.jpoint(I2, N3, C4);
}, Tt.prototype.mixedAdd = function(t) {
  if (this.isInfinity()) return t.toJ();
  if (t.isInfinity()) return this;
  var r3 = this.z.redSqr(), i3 = this.x, n4 = t.x.redMul(r3), o5 = this.y, h4 = t.y.redMul(r3).redMul(this.z), p4 = i3.redSub(n4), b4 = o5.redSub(h4);
  if (p4.cmpn(0) === 0) return b4.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var m3 = p4.redSqr(), w4 = m3.redMul(p4), y8 = i3.redMul(m3), S4 = b4.redSqr().redIAdd(w4).redISub(y8).redISub(y8), I2 = b4.redMul(y8.redISub(S4)).redISub(o5.redMul(w4)), N3 = this.z.redMul(p4);
  return this.curve.jpoint(S4, I2, N3);
}, Tt.prototype.dblp = function(t) {
  if (t === 0) return this;
  if (this.isInfinity()) return this;
  if (!t) return this.dbl();
  var r3;
  if (this.curve.zeroA || this.curve.threeA) {
    var i3 = this;
    for (r3 = 0; r3 < t; r3++) i3 = i3.dbl();
    return i3;
  }
  var n4 = this.curve.a, o5 = this.curve.tinv, h4 = this.x, p4 = this.y, b4 = this.z, m3 = b4.redSqr().redSqr(), w4 = p4.redAdd(p4);
  for (r3 = 0; r3 < t; r3++) {
    var y8 = h4.redSqr(), S4 = w4.redSqr(), I2 = S4.redSqr(), N3 = y8.redAdd(y8).redIAdd(y8).redIAdd(n4.redMul(m3)), C4 = h4.redMul(S4), F = N3.redSqr().redISub(C4.redAdd(C4)), U4 = C4.redISub(F), J2 = N3.redMul(U4);
    J2 = J2.redIAdd(J2).redISub(I2);
    var Bt3 = w4.redMul(b4);
    r3 + 1 < t && (m3 = m3.redMul(I2)), h4 = F, b4 = Bt3, w4 = J2;
  }
  return this.curve.jpoint(h4, w4.redMul(o5), b4);
}, Tt.prototype.dbl = function() {
  return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
}, Tt.prototype._zeroDbl = function() {
  var t, r3, i3;
  if (this.zOne) {
    var n4 = this.x.redSqr(), o5 = this.y.redSqr(), h4 = o5.redSqr(), p4 = this.x.redAdd(o5).redSqr().redISub(n4).redISub(h4);
    p4 = p4.redIAdd(p4);
    var b4 = n4.redAdd(n4).redIAdd(n4), m3 = b4.redSqr().redISub(p4).redISub(p4), w4 = h4.redIAdd(h4);
    w4 = w4.redIAdd(w4), w4 = w4.redIAdd(w4), t = m3, r3 = b4.redMul(p4.redISub(m3)).redISub(w4), i3 = this.y.redAdd(this.y);
  } else {
    var y8 = this.x.redSqr(), S4 = this.y.redSqr(), I2 = S4.redSqr(), N3 = this.x.redAdd(S4).redSqr().redISub(y8).redISub(I2);
    N3 = N3.redIAdd(N3);
    var C4 = y8.redAdd(y8).redIAdd(y8), F = C4.redSqr(), U4 = I2.redIAdd(I2);
    U4 = U4.redIAdd(U4), U4 = U4.redIAdd(U4), t = F.redISub(N3).redISub(N3), r3 = C4.redMul(N3.redISub(t)).redISub(U4), i3 = this.y.redMul(this.z), i3 = i3.redIAdd(i3);
  }
  return this.curve.jpoint(t, r3, i3);
}, Tt.prototype._threeDbl = function() {
  var t, r3, i3;
  if (this.zOne) {
    var n4 = this.x.redSqr(), o5 = this.y.redSqr(), h4 = o5.redSqr(), p4 = this.x.redAdd(o5).redSqr().redISub(n4).redISub(h4);
    p4 = p4.redIAdd(p4);
    var b4 = n4.redAdd(n4).redIAdd(n4).redIAdd(this.curve.a), m3 = b4.redSqr().redISub(p4).redISub(p4);
    t = m3;
    var w4 = h4.redIAdd(h4);
    w4 = w4.redIAdd(w4), w4 = w4.redIAdd(w4), r3 = b4.redMul(p4.redISub(m3)).redISub(w4), i3 = this.y.redAdd(this.y);
  } else {
    var y8 = this.z.redSqr(), S4 = this.y.redSqr(), I2 = this.x.redMul(S4), N3 = this.x.redSub(y8).redMul(this.x.redAdd(y8));
    N3 = N3.redAdd(N3).redIAdd(N3);
    var C4 = I2.redIAdd(I2);
    C4 = C4.redIAdd(C4);
    var F = C4.redAdd(C4);
    t = N3.redSqr().redISub(F), i3 = this.y.redAdd(this.z).redSqr().redISub(S4).redISub(y8);
    var U4 = S4.redSqr();
    U4 = U4.redIAdd(U4), U4 = U4.redIAdd(U4), U4 = U4.redIAdd(U4), r3 = N3.redMul(C4.redISub(t)).redISub(U4);
  }
  return this.curve.jpoint(t, r3, i3);
}, Tt.prototype._dbl = function() {
  var t = this.curve.a, r3 = this.x, i3 = this.y, n4 = this.z, o5 = n4.redSqr().redSqr(), h4 = r3.redSqr(), p4 = i3.redSqr(), b4 = h4.redAdd(h4).redIAdd(h4).redIAdd(t.redMul(o5)), m3 = r3.redAdd(r3);
  m3 = m3.redIAdd(m3);
  var w4 = m3.redMul(p4), y8 = b4.redSqr().redISub(w4.redAdd(w4)), S4 = w4.redISub(y8), I2 = p4.redSqr();
  I2 = I2.redIAdd(I2), I2 = I2.redIAdd(I2), I2 = I2.redIAdd(I2);
  var N3 = b4.redMul(S4).redISub(I2), C4 = i3.redAdd(i3).redMul(n4);
  return this.curve.jpoint(y8, N3, C4);
}, Tt.prototype.trpl = function() {
  if (!this.curve.zeroA) return this.dbl().add(this);
  var t = this.x.redSqr(), r3 = this.y.redSqr(), i3 = this.z.redSqr(), n4 = r3.redSqr(), o5 = t.redAdd(t).redIAdd(t), h4 = o5.redSqr(), p4 = this.x.redAdd(r3).redSqr().redISub(t).redISub(n4);
  p4 = p4.redIAdd(p4), p4 = p4.redAdd(p4).redIAdd(p4), p4 = p4.redISub(h4);
  var b4 = p4.redSqr(), m3 = n4.redIAdd(n4);
  m3 = m3.redIAdd(m3), m3 = m3.redIAdd(m3), m3 = m3.redIAdd(m3);
  var w4 = o5.redIAdd(p4).redSqr().redISub(h4).redISub(b4).redISub(m3), y8 = r3.redMul(w4);
  y8 = y8.redIAdd(y8), y8 = y8.redIAdd(y8);
  var S4 = this.x.redMul(b4).redISub(y8);
  S4 = S4.redIAdd(S4), S4 = S4.redIAdd(S4);
  var I2 = this.y.redMul(w4.redMul(m3.redISub(w4)).redISub(p4.redMul(b4)));
  I2 = I2.redIAdd(I2), I2 = I2.redIAdd(I2), I2 = I2.redIAdd(I2);
  var N3 = this.z.redAdd(p4).redSqr().redISub(i3).redISub(b4);
  return this.curve.jpoint(S4, I2, N3);
}, Tt.prototype.mul = function(t, r3) {
  return t = new K(t, r3), this.curve._wnafMul(this, t);
}, Tt.prototype.eq = function(t) {
  if (t.type === "affine") return this.eq(t.toJ());
  if (this === t) return true;
  var r3 = this.z.redSqr(), i3 = t.z.redSqr();
  if (this.x.redMul(i3).redISub(t.x.redMul(r3)).cmpn(0) !== 0) return false;
  var n4 = r3.redMul(this.z), o5 = i3.redMul(t.z);
  return this.y.redMul(o5).redISub(t.y.redMul(n4)).cmpn(0) === 0;
}, Tt.prototype.eqXToP = function(t) {
  var r3 = this.z.redSqr(), i3 = t.toRed(this.curve.red).redMul(r3);
  if (this.x.cmp(i3) === 0) return true;
  for (var n4 = t.clone(), o5 = this.curve.redN.redMul(r3); ; ) {
    if (n4.iadd(this.curve.n), n4.cmp(this.curve.p) >= 0) return false;
    if (i3.redIAdd(o5), this.x.cmp(i3) === 0) return true;
  }
}, Tt.prototype.inspect = function() {
  return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
}, Tt.prototype.isInfinity = function() {
  return this.z.cmpn(0) === 0;
};
var qr = cr(function(e2, t) {
  var r3 = t;
  r3.base = Ze, r3.short = ka, r3.mont = null, r3.edwards = null;
});
var Kr = cr(function(e2, t) {
  var r3 = t, i3 = Jt.assert;
  function n4(p4) {
    p4.type === "short" ? this.curve = new qr.short(p4) : p4.type === "edwards" ? this.curve = new qr.edwards(p4) : this.curve = new qr.mont(p4), this.g = this.curve.g, this.n = this.curve.n, this.hash = p4.hash, i3(this.g.validate(), "Invalid curve"), i3(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
  }
  r3.PresetCurve = n4;
  function o5(p4, b4) {
    Object.defineProperty(r3, p4, { configurable: true, enumerable: true, get: function() {
      var m3 = new n4(b4);
      return Object.defineProperty(r3, p4, { configurable: true, enumerable: true, value: m3 }), m3;
    } });
  }
  o5("p192", { type: "short", prime: "p192", p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff", a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc", b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1", n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831", hash: se.sha256, gRed: false, g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"] }), o5("p224", { type: "short", prime: "p224", p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001", a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe", b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4", n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d", hash: se.sha256, gRed: false, g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"] }), o5("p256", { type: "short", prime: null, p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff", a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc", b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b", n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551", hash: se.sha256, gRed: false, g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"] }), o5("p384", { type: "short", prime: null, p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff", a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc", b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef", n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973", hash: se.sha384, gRed: false, g: ["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"] }), o5("p521", { type: "short", prime: null, p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff", a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc", b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00", n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409", hash: se.sha512, gRed: false, g: ["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"] }), o5("curve25519", { type: "mont", prime: "p25519", p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed", a: "76d06", b: "1", n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed", hash: se.sha256, gRed: false, g: ["9"] }), o5("ed25519", { type: "edwards", prime: "p25519", p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed", a: "-1", c: "1", d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3", n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed", hash: se.sha256, gRed: false, g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"] });
  var h4;
  try {
    h4 = null.crash();
  } catch {
    h4 = void 0;
  }
  o5("secp256k1", { type: "short", prime: "k256", p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f", a: "0", b: "7", n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141", h: "1", hash: se.sha256, beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee", lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72", basis: [{ a: "3086d221a7d46bcde86c90e49284eb15", b: "-e4437ed6010e88286f547fa90abfe4c3" }, { a: "114ca50f7a8e2f3f657c1108d9d44cfd8", b: "3086d221a7d46bcde86c90e49284eb15" }], gRed: false, g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", h4] });
});
function Re(e2) {
  if (!(this instanceof Re)) return new Re(e2);
  this.hash = e2.hash, this.predResist = !!e2.predResist, this.outLen = this.hash.outSize, this.minEntropy = e2.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
  var t = fe.toArray(e2.entropy, e2.entropyEnc || "hex"), r3 = fe.toArray(e2.nonce, e2.nonceEnc || "hex"), i3 = fe.toArray(e2.pers, e2.persEnc || "hex");
  Pi(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(t, r3, i3);
}
var Rf = Re;
Re.prototype._init = function(t, r3, i3) {
  var n4 = t.concat(r3).concat(i3);
  this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
  for (var o5 = 0; o5 < this.V.length; o5++) this.K[o5] = 0, this.V[o5] = 1;
  this._update(n4), this._reseed = 1, this.reseedInterval = 281474976710656;
}, Re.prototype._hmac = function() {
  return new se.hmac(this.hash, this.K);
}, Re.prototype._update = function(t) {
  var r3 = this._hmac().update(this.V).update([0]);
  t && (r3 = r3.update(t)), this.K = r3.digest(), this.V = this._hmac().update(this.V).digest(), t && (this.K = this._hmac().update(this.V).update([1]).update(t).digest(), this.V = this._hmac().update(this.V).digest());
}, Re.prototype.reseed = function(t, r3, i3, n4) {
  typeof r3 != "string" && (n4 = i3, i3 = r3, r3 = null), t = fe.toArray(t, r3), i3 = fe.toArray(i3, n4), Pi(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(t.concat(i3 || [])), this._reseed = 1;
}, Re.prototype.generate = function(t, r3, i3, n4) {
  if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
  typeof r3 != "string" && (n4 = i3, i3 = r3, r3 = null), i3 && (i3 = fe.toArray(i3, n4 || "hex"), this._update(i3));
  for (var o5 = []; o5.length < t; ) this.V = this._hmac().update(this.V).digest(), o5 = o5.concat(this.V);
  var h4 = o5.slice(0, t);
  return this._update(i3), this._reseed++, fe.encode(h4, r3);
};
var Fi = Jt.assert;
function kt(e2, t) {
  this.ec = e2, this.priv = null, this.pub = null, t.priv && this._importPrivate(t.priv, t.privEnc), t.pub && this._importPublic(t.pub, t.pubEnc);
}
var Ti = kt;
kt.fromPublic = function(t, r3, i3) {
  return r3 instanceof kt ? r3 : new kt(t, { pub: r3, pubEnc: i3 });
}, kt.fromPrivate = function(t, r3, i3) {
  return r3 instanceof kt ? r3 : new kt(t, { priv: r3, privEnc: i3 });
}, kt.prototype.validate = function() {
  var t = this.getPublic();
  return t.isInfinity() ? { result: false, reason: "Invalid public key" } : t.validate() ? t.mul(this.ec.curve.n).isInfinity() ? { result: true, reason: null } : { result: false, reason: "Public key * N != O" } : { result: false, reason: "Public key is not a point" };
}, kt.prototype.getPublic = function(t, r3) {
  return typeof t == "string" && (r3 = t, t = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), r3 ? this.pub.encode(r3, t) : this.pub;
}, kt.prototype.getPrivate = function(t) {
  return t === "hex" ? this.priv.toString(16, 2) : this.priv;
}, kt.prototype._importPrivate = function(t, r3) {
  this.priv = new K(t, r3 || 16), this.priv = this.priv.umod(this.ec.curve.n);
}, kt.prototype._importPublic = function(t, r3) {
  if (t.x || t.y) {
    this.ec.curve.type === "mont" ? Fi(t.x, "Need x coordinate") : (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") && Fi(t.x && t.y, "Need both x and y coordinate"), this.pub = this.ec.curve.point(t.x, t.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(t, r3);
}, kt.prototype.derive = function(t) {
  return t.validate() || Fi(t.validate(), "public point not validated"), t.mul(this.priv).getX();
}, kt.prototype.sign = function(t, r3, i3) {
  return this.ec.sign(t, this, r3, i3);
}, kt.prototype.verify = function(t, r3) {
  return this.ec.verify(t, r3, this);
}, kt.prototype.inspect = function() {
  return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
};
var qa = Jt.assert;
function Hr(e2, t) {
  if (e2 instanceof Hr) return e2;
  this._importDER(e2, t) || (qa(e2.r && e2.s, "Signature without r or s"), this.r = new K(e2.r, 16), this.s = new K(e2.s, 16), e2.recoveryParam === void 0 ? this.recoveryParam = null : this.recoveryParam = e2.recoveryParam);
}
var zr = Hr;
function Ka() {
  this.place = 0;
}
function Ui(e2, t) {
  var r3 = e2[t.place++];
  if (!(r3 & 128)) return r3;
  var i3 = r3 & 15;
  if (i3 === 0 || i3 > 4) return false;
  for (var n4 = 0, o5 = 0, h4 = t.place; o5 < i3; o5++, h4++) n4 <<= 8, n4 |= e2[h4], n4 >>>= 0;
  return n4 <= 127 ? false : (t.place = h4, n4);
}
function Of(e2) {
  for (var t = 0, r3 = e2.length - 1; !e2[t] && !(e2[t + 1] & 128) && t < r3; ) t++;
  return t === 0 ? e2 : e2.slice(t);
}
Hr.prototype._importDER = function(t, r3) {
  t = Jt.toArray(t, r3);
  var i3 = new Ka();
  if (t[i3.place++] !== 48) return false;
  var n4 = Ui(t, i3);
  if (n4 === false || n4 + i3.place !== t.length || t[i3.place++] !== 2) return false;
  var o5 = Ui(t, i3);
  if (o5 === false) return false;
  var h4 = t.slice(i3.place, o5 + i3.place);
  if (i3.place += o5, t[i3.place++] !== 2) return false;
  var p4 = Ui(t, i3);
  if (p4 === false || t.length !== p4 + i3.place) return false;
  var b4 = t.slice(i3.place, p4 + i3.place);
  if (h4[0] === 0) if (h4[1] & 128) h4 = h4.slice(1);
  else return false;
  if (b4[0] === 0) if (b4[1] & 128) b4 = b4.slice(1);
  else return false;
  return this.r = new K(h4), this.s = new K(b4), this.recoveryParam = null, true;
};
function ki(e2, t) {
  if (t < 128) {
    e2.push(t);
    return;
  }
  var r3 = 1 + (Math.log(t) / Math.LN2 >>> 3);
  for (e2.push(r3 | 128); --r3; ) e2.push(t >>> (r3 << 3) & 255);
  e2.push(t);
}
Hr.prototype.toDER = function(t) {
  var r3 = this.r.toArray(), i3 = this.s.toArray();
  for (r3[0] & 128 && (r3 = [0].concat(r3)), i3[0] & 128 && (i3 = [0].concat(i3)), r3 = Of(r3), i3 = Of(i3); !i3[0] && !(i3[1] & 128); ) i3 = i3.slice(1);
  var n4 = [2];
  ki(n4, r3.length), n4 = n4.concat(r3), n4.push(2), ki(n4, i3.length);
  var o5 = n4.concat(i3), h4 = [48];
  return ki(h4, o5.length), h4 = h4.concat(o5), Jt.encode(h4, t);
};
var Ha = function() {
  throw new Error("unsupported");
};
var Pf = Jt.assert;
function $t(e2) {
  if (!(this instanceof $t)) return new $t(e2);
  typeof e2 == "string" && (Pf(Object.prototype.hasOwnProperty.call(Kr, e2), "Unknown curve " + e2), e2 = Kr[e2]), e2 instanceof Kr.PresetCurve && (e2 = { curve: e2 }), this.curve = e2.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = e2.curve.g, this.g.precompute(e2.curve.n.bitLength() + 1), this.hash = e2.hash || e2.curve.hash;
}
var za = $t;
$t.prototype.keyPair = function(t) {
  return new Ti(this, t);
}, $t.prototype.keyFromPrivate = function(t, r3) {
  return Ti.fromPrivate(this, t, r3);
}, $t.prototype.keyFromPublic = function(t, r3) {
  return Ti.fromPublic(this, t, r3);
}, $t.prototype.genKeyPair = function(t) {
  t || (t = {});
  for (var r3 = new Rf({ hash: this.hash, pers: t.pers, persEnc: t.persEnc || "utf8", entropy: t.entropy || Ha(this.hash.hmacStrength), entropyEnc: t.entropy && t.entropyEnc || "utf8", nonce: this.n.toArray() }), i3 = this.n.byteLength(), n4 = this.n.sub(new K(2)); ; ) {
    var o5 = new K(r3.generate(i3));
    if (!(o5.cmp(n4) > 0)) return o5.iaddn(1), this.keyFromPrivate(o5);
  }
}, $t.prototype._truncateToN = function(t, r3) {
  var i3 = t.byteLength() * 8 - this.n.bitLength();
  return i3 > 0 && (t = t.ushrn(i3)), !r3 && t.cmp(this.n) >= 0 ? t.sub(this.n) : t;
}, $t.prototype.sign = function(t, r3, i3, n4) {
  typeof i3 == "object" && (n4 = i3, i3 = null), n4 || (n4 = {}), r3 = this.keyFromPrivate(r3, i3), t = this._truncateToN(new K(t, 16));
  for (var o5 = this.n.byteLength(), h4 = r3.getPrivate().toArray("be", o5), p4 = t.toArray("be", o5), b4 = new Rf({ hash: this.hash, entropy: h4, nonce: p4, pers: n4.pers, persEnc: n4.persEnc || "utf8" }), m3 = this.n.sub(new K(1)), w4 = 0; ; w4++) {
    var y8 = n4.k ? n4.k(w4) : new K(b4.generate(this.n.byteLength()));
    if (y8 = this._truncateToN(y8, true), !(y8.cmpn(1) <= 0 || y8.cmp(m3) >= 0)) {
      var S4 = this.g.mul(y8);
      if (!S4.isInfinity()) {
        var I2 = S4.getX(), N3 = I2.umod(this.n);
        if (N3.cmpn(0) !== 0) {
          var C4 = y8.invm(this.n).mul(N3.mul(r3.getPrivate()).iadd(t));
          if (C4 = C4.umod(this.n), C4.cmpn(0) !== 0) {
            var F = (S4.getY().isOdd() ? 1 : 0) | (I2.cmp(N3) !== 0 ? 2 : 0);
            return n4.canonical && C4.cmp(this.nh) > 0 && (C4 = this.n.sub(C4), F ^= 1), new zr({ r: N3, s: C4, recoveryParam: F });
          }
        }
      }
    }
  }
}, $t.prototype.verify = function(t, r3, i3, n4) {
  t = this._truncateToN(new K(t, 16)), i3 = this.keyFromPublic(i3, n4), r3 = new zr(r3, "hex");
  var o5 = r3.r, h4 = r3.s;
  if (o5.cmpn(1) < 0 || o5.cmp(this.n) >= 0 || h4.cmpn(1) < 0 || h4.cmp(this.n) >= 0) return false;
  var p4 = h4.invm(this.n), b4 = p4.mul(t).umod(this.n), m3 = p4.mul(o5).umod(this.n), w4;
  return this.curve._maxwellTrick ? (w4 = this.g.jmulAdd(b4, i3.getPublic(), m3), w4.isInfinity() ? false : w4.eqXToP(o5)) : (w4 = this.g.mulAdd(b4, i3.getPublic(), m3), w4.isInfinity() ? false : w4.getX().umod(this.n).cmp(o5) === 0);
}, $t.prototype.recoverPubKey = function(e2, t, r3, i3) {
  Pf((3 & r3) === r3, "The recovery param is more than two bits"), t = new zr(t, i3);
  var n4 = this.n, o5 = new K(e2), h4 = t.r, p4 = t.s, b4 = r3 & 1, m3 = r3 >> 1;
  if (h4.cmp(this.curve.p.umod(this.curve.n)) >= 0 && m3) throw new Error("Unable to find sencond key candinate");
  m3 ? h4 = this.curve.pointFromX(h4.add(this.curve.n), b4) : h4 = this.curve.pointFromX(h4, b4);
  var w4 = t.r.invm(n4), y8 = n4.sub(o5).mul(w4).umod(n4), S4 = p4.mul(w4).umod(n4);
  return this.g.mulAdd(y8, h4, S4);
}, $t.prototype.getKeyRecoveryParam = function(e2, t, r3, i3) {
  if (t = new zr(t, i3), t.recoveryParam !== null) return t.recoveryParam;
  for (var n4 = 0; n4 < 4; n4++) {
    var o5;
    try {
      o5 = this.recoverPubKey(e2, t, n4);
    } catch {
      continue;
    }
    if (o5.eq(r3)) return n4;
  }
  throw new Error("Unable to find valid recovery factor");
};
var La = cr(function(e2, t) {
  var r3 = t;
  r3.version = "6.5.4", r3.utils = Jt, r3.rand = function() {
    throw new Error("unsupported");
  }, r3.curve = qr, r3.curves = Kr, r3.ec = za, r3.eddsa = null;
});
var ja = La.ec;
var Qa = "signing-key/5.7.0";
var qi = new L(Qa);
var Ki = null;
function ve() {
  return Ki || (Ki = new ja("secp256k1")), Ki;
}
var Ja = class {
  constructor(t) {
    br(this, "curve", "secp256k1"), br(this, "privateKey", Kt(t)), N0(this.privateKey) !== 32 && qi.throwArgumentError("invalid private key", "privateKey", "[[ REDACTED ]]");
    const r3 = ve().keyFromPrivate(Ot(this.privateKey));
    br(this, "publicKey", "0x" + r3.getPublic(false, "hex")), br(this, "compressedPublicKey", "0x" + r3.getPublic(true, "hex")), br(this, "_isSigningKey", true);
  }
  _addPoint(t) {
    const r3 = ve().keyFromPublic(Ot(this.publicKey)), i3 = ve().keyFromPublic(Ot(t));
    return "0x" + r3.pub.add(i3.pub).encodeCompressed("hex");
  }
  signDigest(t) {
    const r3 = ve().keyFromPrivate(Ot(this.privateKey)), i3 = Ot(t);
    i3.length !== 32 && qi.throwArgumentError("bad digest length", "digest", t);
    const n4 = r3.sign(i3, { canonical: true });
    return zn({ recoveryParam: n4.recoveryParam, r: oe("0x" + n4.r.toString(16), 32), s: oe("0x" + n4.s.toString(16), 32) });
  }
  computeSharedSecret(t) {
    const r3 = ve().keyFromPrivate(Ot(this.privateKey)), i3 = ve().keyFromPublic(Ot(Df(t)));
    return oe("0x" + r3.derive(i3.getPublic()).toString(16), 32);
  }
  static isSigningKey(t) {
    return !!(t && t._isSigningKey);
  }
};
function Ga(e2, t) {
  const r3 = zn(t), i3 = { r: Ot(r3.r), s: Ot(r3.s) };
  return "0x" + ve().recoverPubKey(Ot(e2), i3, r3.recoveryParam).encode("hex", false);
}
function Df(e2, t) {
  const r3 = Ot(e2);
  if (r3.length === 32) {
    const i3 = new Ja(r3);
    return t ? "0x" + ve().keyFromPrivate(r3).getPublic(true, "hex") : i3.publicKey;
  } else {
    if (r3.length === 33) return t ? Kt(r3) : "0x" + ve().keyFromPublic(r3).getPublic(false, "hex");
    if (r3.length === 65) return t ? "0x" + ve().keyFromPublic(r3).getPublic(true, "hex") : Kt(r3);
  }
  return qi.throwArgumentError("invalid public or private key", "key", "[REDACTED]");
}
var Ya = "transactions/5.7.0";
new L(Ya);
var Ff;
(function(e2) {
  e2[e2.legacy = 0] = "legacy", e2[e2.eip2930 = 1] = "eip2930", e2[e2.eip1559 = 2] = "eip1559";
})(Ff || (Ff = {}));
function Va(e2) {
  const t = Df(e2);
  return ns(Hn(yi(Hn(t, 1)), 12));
}
function Wa(e2, t) {
  return Va(Ga(Ot(e2), t));
}
var Xa = "https://rpc.walletconnect.com/v1";
async function Tf(e2, t, r3, i3, n4, o5) {
  switch (r3.t) {
    case "eip191":
      return Uf(e2, t, r3.s);
    case "eip1271":
      return await kf(e2, t, r3.s, i3, n4, o5);
    default:
      throw new Error(`verifySignature failed: Attempted to verify CacaoSignature with unknown type: ${r3.t}`);
  }
}
function Uf(e2, t, r3) {
  return Wa(ff(t), r3).toLowerCase() === e2.toLowerCase();
}
async function kf(e2, t, r3, i3, n4, o5) {
  try {
    const h4 = "0x1626ba7e", p4 = "0000000000000000000000000000000000000000000000000000000000000040", b4 = "0000000000000000000000000000000000000000000000000000000000000041", m3 = r3.substring(2), w4 = ff(t).substring(2), y8 = h4 + w4 + p4 + b4 + m3, S4 = await fetch(`${o5 || Xa}/?chainId=${i3}&projectId=${n4}`, { method: "POST", body: JSON.stringify({ id: Za(), jsonrpc: "2.0", method: "eth_call", params: [{ to: e2, data: y8 }, "latest"] }) }), { result: I2 } = await S4.json();
    return I2 ? I2.slice(0, h4.length).toLowerCase() === h4.toLowerCase() : false;
  } catch (h4) {
    return console.error("isValidEip1271Signature: ", h4), false;
  }
}
function Za() {
  return Date.now() + Math.floor(Math.random() * 1e3);
}
var $a = Object.defineProperty;
var tu = Object.defineProperties;
var eu = Object.getOwnPropertyDescriptors;
var qf = Object.getOwnPropertySymbols;
var ru = Object.prototype.hasOwnProperty;
var iu = Object.prototype.propertyIsEnumerable;
var Kf = (e2, t, r3) => t in e2 ? $a(e2, t, { enumerable: true, configurable: true, writable: true, value: r3 }) : e2[t] = r3;
var Hi = (e2, t) => {
  for (var r3 in t || (t = {})) ru.call(t, r3) && Kf(e2, r3, t[r3]);
  if (qf) for (var r3 of qf(t)) iu.call(t, r3) && Kf(e2, r3, t[r3]);
  return e2;
};
var Hf = (e2, t) => tu(e2, eu(t));
var nu = "did:pkh:";
var Lr = (e2) => e2 == null ? void 0 : e2.split(":");
var zi = (e2) => {
  const t = e2 && Lr(e2);
  if (t) return e2.includes(nu) ? t[3] : t[1];
};
var fu = (e2) => {
  const t = e2 && Lr(e2);
  if (t) return t[2] + ":" + t[3];
};
var Li = (e2) => {
  const t = e2 && Lr(e2);
  if (t) return t.pop();
};
async function ou(e2) {
  const { cacao: t, projectId: r3 } = e2, { s: i3, p: n4 } = t, o5 = zf(n4, n4.iss), h4 = Li(n4.iss);
  return await Tf(h4, o5, i3, zi(n4.iss), r3);
}
var zf = (e2, t) => {
  const r3 = `${e2.domain} wants you to sign in with your Ethereum account:`, i3 = Li(t);
  if (!e2.aud && !e2.uri) throw new Error("Either `aud` or `uri` is required to construct the message");
  let n4 = e2.statement || void 0;
  const o5 = `URI: ${e2.aud || e2.uri}`, h4 = `Version: ${e2.version}`, p4 = `Chain ID: ${zi(t)}`, b4 = `Nonce: ${e2.nonce}`, m3 = `Issued At: ${e2.iat}`, w4 = e2.resources ? `Resources:${e2.resources.map((S4) => `
- ${S4}`).join("")}` : void 0, y8 = Qr(e2.resources);
  if (y8) {
    const S4 = Oe(y8);
    n4 = Ji(n4, S4);
  }
  return [r3, i3, "", n4, "", o5, h4, p4, b4, m3, w4].filter((S4) => S4 != null).join(`
`);
};
function Jf(e2) {
  return Buffer.from(JSON.stringify(e2)).toString("base64");
}
function Gf(e2) {
  return JSON.parse(Buffer.from(e2, "base64").toString("utf-8"));
}
function me(e2) {
  if (!e2) throw new Error("No recap provided, value is undefined");
  if (!e2.att) throw new Error("No `att` property found");
  const t = Object.keys(e2.att);
  if (!(t != null && t.length)) throw new Error("No resources found in `att` property");
  t.forEach((r3) => {
    const i3 = e2.att[r3];
    if (Array.isArray(i3)) throw new Error(`Resource must be an object: ${r3}`);
    if (typeof i3 != "object") throw new Error(`Resource must be an object: ${r3}`);
    if (!Object.keys(i3).length) throw new Error(`Resource object is empty: ${r3}`);
    Object.keys(i3).forEach((n4) => {
      const o5 = i3[n4];
      if (!Array.isArray(o5)) throw new Error(`Ability limits ${n4} must be an array of objects, found: ${o5}`);
      if (!o5.length) throw new Error(`Value of ${n4} is empty array, must be an array with objects`);
      o5.forEach((h4) => {
        if (typeof h4 != "object") throw new Error(`Ability limits (${n4}) must be an array of objects, found: ${h4}`);
      });
    });
  });
}
function Yf(e2, t, r3, i3 = {}) {
  return r3 == null ? void 0 : r3.sort((n4, o5) => n4.localeCompare(o5)), { att: { [e2]: ji(t, r3, i3) } };
}
function ji(e2, t, r3 = {}) {
  t = t == null ? void 0 : t.sort((n4, o5) => n4.localeCompare(o5));
  const i3 = t.map((n4) => ({ [`${e2}/${n4}`]: [r3] }));
  return Object.assign({}, ...i3);
}
function jr(e2) {
  return me(e2), `urn:recap:${Jf(e2).replace(/=/g, "")}`;
}
function Oe(e2) {
  const t = Gf(e2.replace("urn:recap:", ""));
  return me(t), t;
}
function cu(e2, t, r3) {
  const i3 = Yf(e2, t, r3);
  return jr(i3);
}
function Qi(e2) {
  return e2 && e2.includes("urn:recap:");
}
function lu(e2, t) {
  const r3 = Oe(e2), i3 = Oe(t), n4 = Wf(r3, i3);
  return jr(n4);
}
function Wf(e2, t) {
  me(e2), me(t);
  const r3 = Object.keys(e2.att).concat(Object.keys(t.att)).sort((n4, o5) => n4.localeCompare(o5)), i3 = { att: {} };
  return r3.forEach((n4) => {
    var o5, h4;
    Object.keys(((o5 = e2.att) == null ? void 0 : o5[n4]) || {}).concat(Object.keys(((h4 = t.att) == null ? void 0 : h4[n4]) || {})).sort((p4, b4) => p4.localeCompare(b4)).forEach((p4) => {
      var b4, m3;
      i3.att[n4] = Hf(Hi({}, i3.att[n4]), { [p4]: ((b4 = e2.att[n4]) == null ? void 0 : b4[p4]) || ((m3 = t.att[n4]) == null ? void 0 : m3[p4]) });
    });
  }), i3;
}
function Ji(e2 = "", t) {
  me(t);
  const r3 = "I further authorize the stated URI to perform the following actions on my behalf: ";
  if (e2.includes(r3)) return e2;
  const i3 = [];
  let n4 = 0;
  Object.keys(t.att).forEach((p4) => {
    const b4 = Object.keys(t.att[p4]).map((y8) => ({ ability: y8.split("/")[0], action: y8.split("/")[1] }));
    b4.sort((y8, S4) => y8.action.localeCompare(S4.action));
    const m3 = {};
    b4.forEach((y8) => {
      m3[y8.ability] || (m3[y8.ability] = []), m3[y8.ability].push(y8.action);
    });
    const w4 = Object.keys(m3).map((y8) => (n4++, `(${n4}) '${y8}': '${m3[y8].join("', '")}' for '${p4}'.`));
    i3.push(w4.join(", ").replace(".,", "."));
  });
  const o5 = i3.join(" "), h4 = `${r3}${o5}`;
  return `${e2 ? e2 + " " : ""}${h4}`;
}
function du(e2) {
  var t;
  const r3 = Oe(e2);
  me(r3);
  const i3 = (t = r3.att) == null ? void 0 : t.eip155;
  return i3 ? Object.keys(i3).map((n4) => n4.split("/")[1]) : [];
}
function pu(e2) {
  const t = Oe(e2);
  me(t);
  const r3 = [];
  return Object.values(t.att).forEach((i3) => {
    Object.values(i3).forEach((n4) => {
      var o5;
      (o5 = n4 == null ? void 0 : n4[0]) != null && o5.chains && r3.push(n4[0].chains);
    });
  }), [...new Set(r3.flat())];
}
function Qr(e2) {
  if (!e2) return;
  const t = e2 == null ? void 0 : e2[e2.length - 1];
  return Qi(t) ? t : void 0;
}
var Gi = "base10";
var zt = "base16";
var Jr = "base64pad";
var Gr = "utf8";
var Yi = 0;
var lr = 1;
var vu = 0;
var Zf = 1;
var Vi = 12;
var Wi = 32;
function mu() {
  const e2 = cn.generateKeyPair();
  return { privateKey: toString(e2.secretKey, zt), publicKey: toString(e2.publicKey, zt) };
}
function gu() {
  const e2 = (0, import_random.randomBytes)(Wi);
  return toString(e2, zt);
}
function Au(e2, t) {
  const r3 = cn.sharedKey(fromString(e2, zt), fromString(t, zt), true), i3 = new import_hkdf.HKDF(import_sha256.SHA256, r3).expand(Wi);
  return toString(i3, zt);
}
function bu(e2) {
  const t = (0, import_sha256.hash)(fromString(e2, zt));
  return toString(t, zt);
}
function yu(e2) {
  const t = (0, import_sha256.hash)(fromString(e2, Gr));
  return toString(t, zt);
}
function $f(e2) {
  return fromString(`${e2}`, Gi);
}
function Mr(e2) {
  return Number(toString(e2, Gi));
}
function wu(e2) {
  const t = $f(typeof e2.type < "u" ? e2.type : Yi);
  if (Mr(t) === lr && typeof e2.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
  const r3 = typeof e2.senderPublicKey < "u" ? fromString(e2.senderPublicKey, zt) : void 0, i3 = typeof e2.iv < "u" ? fromString(e2.iv, zt) : (0, import_random.randomBytes)(Vi), n4 = new import_chacha20poly1305.ChaCha20Poly1305(fromString(e2.symKey, zt)).seal(i3, fromString(e2.message, Gr));
  return to({ type: t, sealed: n4, iv: i3, senderPublicKey: r3 });
}
function xu(e2) {
  const t = new import_chacha20poly1305.ChaCha20Poly1305(fromString(e2.symKey, zt)), { sealed: r3, iv: i3 } = Xi(e2.encoded), n4 = t.open(i3, r3);
  if (n4 === null) throw new Error("Failed to decrypt");
  return toString(n4, Gr);
}
function to(e2) {
  if (Mr(e2.type) === lr) {
    if (typeof e2.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
    return toString(concat([e2.type, e2.senderPublicKey, e2.iv, e2.sealed]), Jr);
  }
  return toString(concat([e2.type, e2.iv, e2.sealed]), Jr);
}
function Xi(e2) {
  const t = fromString(e2, Jr), r3 = t.slice(vu, Zf), i3 = Zf;
  if (Mr(r3) === lr) {
    const p4 = i3 + Wi, b4 = p4 + Vi, m3 = t.slice(i3, p4), w4 = t.slice(p4, b4), y8 = t.slice(b4);
    return { type: r3, sealed: y8, iv: w4, senderPublicKey: m3 };
  }
  const n4 = i3 + Vi, o5 = t.slice(i3, n4), h4 = t.slice(n4);
  return { type: r3, sealed: h4, iv: o5 };
}
function Mu(e2, t) {
  const r3 = Xi(e2);
  return eo({ type: Mr(r3.type), senderPublicKey: typeof r3.senderPublicKey < "u" ? toString(r3.senderPublicKey, zt) : void 0, receiverPublicKey: t == null ? void 0 : t.receiverPublicKey });
}
function eo(e2) {
  const t = (e2 == null ? void 0 : e2.type) || Yi;
  if (t === lr) {
    if (typeof (e2 == null ? void 0 : e2.senderPublicKey) > "u") throw new Error("missing sender public key");
    if (typeof (e2 == null ? void 0 : e2.receiverPublicKey) > "u") throw new Error("missing receiver public key");
  }
  return { type: t, senderPublicKey: e2 == null ? void 0 : e2.senderPublicKey, receiverPublicKey: e2 == null ? void 0 : e2.receiverPublicKey };
}
function Eu(e2) {
  return e2.type === lr && typeof e2.senderPublicKey == "string" && typeof e2.receiverPublicKey == "string";
}
var ro = "irn";
function Su(e2) {
  return (e2 == null ? void 0 : e2.relay) || { protocol: ro };
}
function Nu(e2) {
  const t = C[e2];
  if (typeof t > "u") throw new Error(`Relay Protocol not supported: ${e2}`);
  return t;
}
var Iu = Object.defineProperty;
var _u = Object.defineProperties;
var Bu = Object.getOwnPropertyDescriptors;
var io = Object.getOwnPropertySymbols;
var Cu = Object.prototype.hasOwnProperty;
var Ru = Object.prototype.propertyIsEnumerable;
var no = (e2, t, r3) => t in e2 ? Iu(e2, t, { enumerable: true, configurable: true, writable: true, value: r3 }) : e2[t] = r3;
var fo = (e2, t) => {
  for (var r3 in t || (t = {})) Cu.call(t, r3) && no(e2, r3, t[r3]);
  if (io) for (var r3 of io(t)) Ru.call(t, r3) && no(e2, r3, t[r3]);
  return e2;
};
var Ou = (e2, t) => _u(e2, Bu(t));
function oo(e2, t = "-") {
  const r3 = {}, i3 = "relay" + t;
  return Object.keys(e2).forEach((n4) => {
    if (n4.startsWith(i3)) {
      const o5 = n4.replace(i3, ""), h4 = e2[n4];
      r3[o5] = h4;
    }
  }), r3;
}
function Pu(e2) {
  e2 = e2.includes("wc://") ? e2.replace("wc://", "") : e2, e2 = e2.includes("wc:") ? e2.replace("wc:", "") : e2;
  const t = e2.indexOf(":"), r3 = e2.indexOf("?") !== -1 ? e2.indexOf("?") : void 0, i3 = e2.substring(0, t), n4 = e2.substring(t + 1, r3).split("@"), o5 = typeof r3 < "u" ? e2.substring(r3) : "", h4 = Nr.parse(o5), p4 = typeof h4.methods == "string" ? h4.methods.split(",") : void 0;
  return { protocol: i3, topic: so(n4[0]), version: parseInt(n4[1], 10), symKey: h4.symKey, relay: oo(h4), methods: p4, expiryTimestamp: h4.expiryTimestamp ? parseInt(h4.expiryTimestamp, 10) : void 0 };
}
function so(e2) {
  return e2.startsWith("//") ? e2.substring(2) : e2;
}
function ao(e2, t = "-") {
  const r3 = "relay", i3 = {};
  return Object.keys(e2).forEach((n4) => {
    const o5 = r3 + t + n4;
    e2[n4] && (i3[o5] = e2[n4]);
  }), i3;
}
function Du(e2) {
  return `${e2.protocol}:${e2.topic}@${e2.version}?` + Nr.stringify(fo(Ou(fo({ symKey: e2.symKey }, ao(e2.relay)), { expiryTimestamp: e2.expiryTimestamp }), e2.methods ? { methods: e2.methods.join(",") } : {}));
}
function $e(e2) {
  const t = [];
  return e2.forEach((r3) => {
    const [i3, n4] = r3.split(":");
    t.push(`${i3}:${n4}`);
  }), t;
}
function co(e2) {
  const t = [];
  return Object.values(e2).forEach((r3) => {
    t.push(...$e(r3.accounts));
  }), t;
}
function lo(e2, t) {
  const r3 = [];
  return Object.values(e2).forEach((i3) => {
    $e(i3.accounts).includes(t) && r3.push(...i3.methods);
  }), r3;
}
function po(e2, t) {
  const r3 = [];
  return Object.values(e2).forEach((i3) => {
    $e(i3.accounts).includes(t) && r3.push(...i3.events);
  }), r3;
}
function Zi(e2) {
  return e2.includes(":");
}
function vo(e2) {
  return Zi(e2) ? e2.split(":")[0] : e2;
}
function mo(e2) {
  const t = {};
  return e2 == null ? void 0 : e2.forEach((r3) => {
    const [i3, n4] = r3.split(":");
    t[i3] || (t[i3] = { accounts: [], chains: [], events: [] }), t[i3].accounts.push(r3), t[i3].chains.push(`${i3}:${n4}`);
  }), t;
}
function ju(e2, t) {
  t = t.map((i3) => i3.replace("did:pkh:", ""));
  const r3 = mo(t);
  for (const [i3, n4] of Object.entries(r3)) n4.methods ? n4.methods = ge(n4.methods, e2) : n4.methods = e2, n4.events = ["chainChanged", "accountsChanged"];
  return r3;
}
var go = { INVALID_METHOD: { message: "Invalid method.", code: 1001 }, INVALID_EVENT: { message: "Invalid event.", code: 1002 }, INVALID_UPDATE_REQUEST: { message: "Invalid update request.", code: 1003 }, INVALID_EXTEND_REQUEST: { message: "Invalid extend request.", code: 1004 }, INVALID_SESSION_SETTLE_REQUEST: { message: "Invalid session settle request.", code: 1005 }, UNAUTHORIZED_METHOD: { message: "Unauthorized method.", code: 3001 }, UNAUTHORIZED_EVENT: { message: "Unauthorized event.", code: 3002 }, UNAUTHORIZED_UPDATE_REQUEST: { message: "Unauthorized update request.", code: 3003 }, UNAUTHORIZED_EXTEND_REQUEST: { message: "Unauthorized extend request.", code: 3004 }, USER_REJECTED: { message: "User rejected.", code: 5e3 }, USER_REJECTED_CHAINS: { message: "User rejected chains.", code: 5001 }, USER_REJECTED_METHODS: { message: "User rejected methods.", code: 5002 }, USER_REJECTED_EVENTS: { message: "User rejected events.", code: 5003 }, UNSUPPORTED_CHAINS: { message: "Unsupported chains.", code: 5100 }, UNSUPPORTED_METHODS: { message: "Unsupported methods.", code: 5101 }, UNSUPPORTED_EVENTS: { message: "Unsupported events.", code: 5102 }, UNSUPPORTED_ACCOUNTS: { message: "Unsupported accounts.", code: 5103 }, UNSUPPORTED_NAMESPACE_KEY: { message: "Unsupported namespace key.", code: 5104 }, USER_DISCONNECTED: { message: "User disconnected.", code: 6e3 }, SESSION_SETTLEMENT_FAILED: { message: "Session settlement failed.", code: 7e3 }, WC_METHOD_UNSUPPORTED: { message: "Unsupported wc_ method.", code: 10001 } };
var Ao = { NOT_INITIALIZED: { message: "Not initialized.", code: 1 }, NO_MATCHING_KEY: { message: "No matching key.", code: 2 }, RESTORE_WILL_OVERRIDE: { message: "Restore will override.", code: 3 }, RESUBSCRIBED: { message: "Resubscribed.", code: 4 }, MISSING_OR_INVALID: { message: "Missing or invalid.", code: 5 }, EXPIRED: { message: "Expired.", code: 6 }, UNKNOWN_TYPE: { message: "Unknown type.", code: 7 }, MISMATCHED_TOPIC: { message: "Mismatched topic.", code: 8 }, NON_CONFORMING_NAMESPACES: { message: "Non conforming namespaces.", code: 9 } };
function xe(e2, t) {
  const { message: r3, code: i3 } = Ao[e2];
  return { message: t ? `${r3} ${t}` : r3, code: i3 };
}
function tr(e2, t) {
  const { message: r3, code: i3 } = go[e2];
  return { message: t ? `${r3} ${t}` : r3, code: i3 };
}
function Er(e2, t) {
  return Array.isArray(e2) ? typeof t < "u" && e2.length ? e2.every(t) : true : false;
}
function Yr(e2) {
  return Object.getPrototypeOf(e2) === Object.prototype && Object.keys(e2).length;
}
function Pe(e2) {
  return typeof e2 > "u";
}
function Gt(e2, t) {
  return t && Pe(e2) ? true : typeof e2 == "string" && !!e2.trim().length;
}
function Vr(e2, t) {
  return t && Pe(e2) ? true : typeof e2 == "number" && !isNaN(e2);
}
function Qu(e2, t) {
  const { requiredNamespaces: r3 } = t, i3 = Object.keys(e2.namespaces), n4 = Object.keys(r3);
  let o5 = true;
  return _e(n4, i3) ? (i3.forEach((h4) => {
    const { accounts: p4, methods: b4, events: m3 } = e2.namespaces[h4], w4 = $e(p4), y8 = r3[h4];
    (!_e(_r(h4, y8), w4) || !_e(y8.methods, b4) || !_e(y8.events, m3)) && (o5 = false);
  }), o5) : false;
}
function Sr(e2) {
  return Gt(e2, false) && e2.includes(":") ? e2.split(":").length === 2 : false;
}
function bo(e2) {
  if (Gt(e2, false) && e2.includes(":")) {
    const t = e2.split(":");
    if (t.length === 3) {
      const r3 = t[0] + ":" + t[1];
      return !!t[2] && Sr(r3);
    }
  }
  return false;
}
function Ju(e2) {
  if (Gt(e2, false)) try {
    return typeof new URL(e2) < "u";
  } catch {
    return false;
  }
  return false;
}
function Gu(e2) {
  var t;
  return (t = e2 == null ? void 0 : e2.proposer) == null ? void 0 : t.publicKey;
}
function Yu(e2) {
  return e2 == null ? void 0 : e2.topic;
}
function Vu(e2, t) {
  let r3 = null;
  return Gt(e2 == null ? void 0 : e2.publicKey, false) || (r3 = xe("MISSING_OR_INVALID", `${t} controller public key should be a string`)), r3;
}
function tn(e2) {
  let t = true;
  return Er(e2) ? e2.length && (t = e2.every((r3) => Gt(r3, false))) : t = false, t;
}
function yo(e2, t, r3) {
  let i3 = null;
  return Er(t) && t.length ? t.forEach((n4) => {
    i3 || Sr(n4) || (i3 = tr("UNSUPPORTED_CHAINS", `${r3}, chain ${n4} should be a string and conform to "namespace:chainId" format`));
  }) : Sr(e2) || (i3 = tr("UNSUPPORTED_CHAINS", `${r3}, chains must be defined as "namespace:chainId" e.g. "eip155:1": {...} in the namespace key OR as an array of CAIP-2 chainIds e.g. eip155: { chains: ["eip155:1", "eip155:5"] }`)), i3;
}
function wo(e2, t, r3) {
  let i3 = null;
  return Object.entries(e2).forEach(([n4, o5]) => {
    if (i3) return;
    const h4 = yo(n4, _r(n4, o5), `${t} ${r3}`);
    h4 && (i3 = h4);
  }), i3;
}
function xo(e2, t) {
  let r3 = null;
  return Er(e2) ? e2.forEach((i3) => {
    r3 || bo(i3) || (r3 = tr("UNSUPPORTED_ACCOUNTS", `${t}, account ${i3} should be a string and conform to "namespace:chainId:address" format`));
  }) : r3 = tr("UNSUPPORTED_ACCOUNTS", `${t}, accounts should be an array of strings conforming to "namespace:chainId:address" format`), r3;
}
function Mo(e2, t) {
  let r3 = null;
  return Object.values(e2).forEach((i3) => {
    if (r3) return;
    const n4 = xo(i3 == null ? void 0 : i3.accounts, `${t} namespace`);
    n4 && (r3 = n4);
  }), r3;
}
function Eo(e2, t) {
  let r3 = null;
  return tn(e2 == null ? void 0 : e2.methods) ? tn(e2 == null ? void 0 : e2.events) || (r3 = tr("UNSUPPORTED_EVENTS", `${t}, events should be an array of strings or empty array for no events`)) : r3 = tr("UNSUPPORTED_METHODS", `${t}, methods should be an array of strings or empty array for no methods`), r3;
}
function en(e2, t) {
  let r3 = null;
  return Object.values(e2).forEach((i3) => {
    if (r3) return;
    const n4 = Eo(i3, `${t}, namespace`);
    n4 && (r3 = n4);
  }), r3;
}
function Wu(e2, t, r3) {
  let i3 = null;
  if (e2 && Yr(e2)) {
    const n4 = en(e2, t);
    n4 && (i3 = n4);
    const o5 = wo(e2, t, r3);
    o5 && (i3 = o5);
  } else i3 = xe("MISSING_OR_INVALID", `${t}, ${r3} should be an object with data`);
  return i3;
}
function So(e2, t) {
  let r3 = null;
  if (e2 && Yr(e2)) {
    const i3 = en(e2, t);
    i3 && (r3 = i3);
    const n4 = Mo(e2, t);
    n4 && (r3 = n4);
  } else r3 = xe("MISSING_OR_INVALID", `${t}, namespaces should be an object with data`);
  return r3;
}
function No(e2) {
  return Gt(e2.protocol, true);
}
function Xu(e2, t) {
  let r3 = false;
  return t && !e2 ? r3 = true : e2 && Er(e2) && e2.length && e2.forEach((i3) => {
    r3 = No(i3);
  }), r3;
}
function Zu(e2) {
  return typeof e2 == "number";
}
function $u(e2) {
  return typeof e2 < "u" && typeof e2 !== null;
}
function th(e2) {
  return !(!e2 || typeof e2 != "object" || !e2.code || !Vr(e2.code, false) || !e2.message || !Gt(e2.message, false));
}
function eh(e2) {
  return !(Pe(e2) || !Gt(e2.method, false));
}
function rh(e2) {
  return !(Pe(e2) || Pe(e2.result) && Pe(e2.error) || !Vr(e2.id, false) || !Gt(e2.jsonrpc, false));
}
function ih(e2) {
  return !(Pe(e2) || !Gt(e2.name, false));
}
function nh(e2, t) {
  return !(!Sr(t) || !co(e2).includes(t));
}
function fh(e2, t, r3) {
  return Gt(r3, false) ? lo(e2, t).includes(r3) : false;
}
function oh(e2, t, r3) {
  return Gt(r3, false) ? po(e2, t).includes(r3) : false;
}
function Io(e2, t, r3) {
  let i3 = null;
  const n4 = sh(e2), o5 = ah(t), h4 = Object.keys(n4), p4 = Object.keys(o5), b4 = _o(Object.keys(e2)), m3 = _o(Object.keys(t)), w4 = b4.filter((y8) => !m3.includes(y8));
  return w4.length && (i3 = xe("NON_CONFORMING_NAMESPACES", `${r3} namespaces keys don't satisfy requiredNamespaces.
      Required: ${w4.toString()}
      Received: ${Object.keys(t).toString()}`)), _e(h4, p4) || (i3 = xe("NON_CONFORMING_NAMESPACES", `${r3} namespaces chains don't satisfy required namespaces.
      Required: ${h4.toString()}
      Approved: ${p4.toString()}`)), Object.keys(t).forEach((y8) => {
    if (!y8.includes(":") || i3) return;
    const S4 = $e(t[y8].accounts);
    S4.includes(y8) || (i3 = xe("NON_CONFORMING_NAMESPACES", `${r3} namespaces accounts don't satisfy namespace accounts for ${y8}
        Required: ${y8}
        Approved: ${S4.toString()}`));
  }), h4.forEach((y8) => {
    i3 || (_e(n4[y8].methods, o5[y8].methods) ? _e(n4[y8].events, o5[y8].events) || (i3 = xe("NON_CONFORMING_NAMESPACES", `${r3} namespaces events don't satisfy namespace events for ${y8}`)) : i3 = xe("NON_CONFORMING_NAMESPACES", `${r3} namespaces methods don't satisfy namespace methods for ${y8}`));
  }), i3;
}
function sh(e2) {
  const t = {};
  return Object.keys(e2).forEach((r3) => {
    var i3;
    r3.includes(":") ? t[r3] = e2[r3] : (i3 = e2[r3].chains) == null || i3.forEach((n4) => {
      t[n4] = { methods: e2[r3].methods, events: e2[r3].events };
    });
  }), t;
}
function _o(e2) {
  return [...new Set(e2.map((t) => t.includes(":") ? t.split(":")[0] : t))];
}
function ah(e2) {
  const t = {};
  return Object.keys(e2).forEach((r3) => {
    if (r3.includes(":")) t[r3] = e2[r3];
    else {
      const i3 = $e(e2[r3].accounts);
      i3 == null ? void 0 : i3.forEach((n4) => {
        t[n4] = { accounts: e2[r3].accounts.filter((o5) => o5.includes(`${n4}:`)), methods: e2[r3].methods, events: e2[r3].events };
      });
    }
  }), t;
}
function uh(e2, t) {
  return Vr(e2, false) && e2 <= t.max && e2 >= t.min;
}
function hh() {
  const e2 = We();
  return new Promise((t) => {
    switch (e2) {
      case qt.browser:
        t(Bo());
        break;
      case qt.reactNative:
        t(Co());
        break;
      case qt.node:
        t(Ro());
        break;
      default:
        t(true);
    }
  });
}
function Bo() {
  return pr() && (navigator == null ? void 0 : navigator.onLine);
}
async function Co() {
  if (er() && typeof global < "u" && global != null && global.NetInfo) {
    const e2 = await (global == null ? void 0 : global.NetInfo.fetch());
    return e2 == null ? void 0 : e2.isConnected;
  }
  return true;
}
function Ro() {
  return true;
}
function ch(e2) {
  switch (We()) {
    case qt.browser:
      Oo(e2);
      break;
    case qt.reactNative:
      Po(e2);
      break;
    case qt.node:
      break;
  }
}
function Oo(e2) {
  !er() && pr() && (window.addEventListener("online", () => e2(true)), window.addEventListener("offline", () => e2(false)));
}
function Po(e2) {
  er() && typeof global < "u" && global != null && global.NetInfo && (global == null ? void 0 : global.NetInfo.addEventListener((t) => e2(t == null ? void 0 : t.isConnected)));
}
var rn = {};
var lh = class {
  static get(t) {
    return rn[t];
  }
  static set(t, r3) {
    rn[t] = r3;
  }
  static delete(t) {
    delete rn[t];
  }
};

// node_modules/@walletconnect/core/dist/index.es.js
var import_events7 = __toESM(require_events());

// node_modules/destr/dist/index.mjs
var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
var JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.endsWith('"') && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

// node_modules/unstorage/dist/shared/unstorage.8581f561.mjs
function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify2(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify2(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
function checkBufferSupport() {
  if (typeof Buffer === void 0) {
    throw new TypeError("[unstorage] Buffer is not supported!");
  }
}
var BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  checkBufferSupport();
  const base64 = Buffer.from(value).toString("base64");
  return BASE64_PREFIX + base64;
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  checkBufferSupport();
  return Buffer.from(value.slice(BASE64_PREFIX.length), "base64");
}
function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}
function joinKeys(...keys2) {
  return normalizeKey(keys2.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey(base);
  return base ? base + ":" : "";
}

// node_modules/unstorage/dist/index.mjs
function defineDriver(factory) {
  return factory;
}
var DRIVER_NAME = "memory";
var memory = defineDriver(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME,
    options: {},
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return Array.from(data.keys());
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});
function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r3) => r3.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r3) => r3.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify2(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify2(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify2(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      for (const mount of mounts) {
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        const keys2 = rawKeys.map((key) => mount.mountpoint + normalizeKey(key)).filter((key) => !maskedMounts.some((p4) => key.startsWith(p4)));
        allKeys.push(...keys2);
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p4) => !p4.startsWith(mount.mountpoint))
        ];
      }
      return base ? allKeys.filter((key) => key.startsWith(base) && !key.endsWith("$")) : allKeys.filter((key) => !key.endsWith("$"));
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m3) => {
          if (m3.driver.clear) {
            return asyncCall(m3.driver.clear, m3.relativeBase, opts);
          }
          if (m3.driver.removeItem) {
            const keys2 = await m3.driver.getKeys(m3.relativeBase || "", opts);
            return Promise.all(
              keys2.map((key) => m3.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a4, b4) => b4.length - a4.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey(key) + ":";
      const m3 = getMount(key);
      return {
        driver: m3.driver,
        base: m3.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m3) => ({
        driver: m3.driver,
        base: m3.mountpoint
      }));
    }
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

// node_modules/idb-keyval/dist/index.js
function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
}
function createStore(dbName, storeName) {
  const request = indexedDB.open(dbName);
  request.onupgradeneeded = () => request.result.createObjectStore(storeName);
  const dbp = promisifyRequest(request);
  return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
var defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
function get(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
function set(key, value, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}
function del(key, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.delete(key);
    return promisifyRequest(store.transaction);
  });
}
function clear(customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.clear();
    return promisifyRequest(store.transaction);
  });
}
function eachCursor(store, callback) {
  store.openCursor().onsuccess = function() {
    if (!this.result)
      return;
    callback(this.result);
    this.result.continue();
  };
  return promisifyRequest(store.transaction);
}
function keys(customStore = defaultGetStore()) {
  return customStore("readonly", (store) => {
    if (store.getAllKeys) {
      return promisifyRequest(store.getAllKeys());
    }
    const items = [];
    return eachCursor(store, (cursor) => items.push(cursor.key)).then(() => items);
  });
}

// node_modules/@walletconnect/core/node_modules/@walletconnect/keyvaluestorage/dist/index.es.js
var x = "idb-keyval";
var z = (i3 = {}) => {
  const t = i3.base && i3.base.length > 0 ? `${i3.base}:` : "", e2 = (s2) => t + s2;
  let n4;
  return i3.dbName && i3.storeName && (n4 = createStore(i3.dbName, i3.storeName)), { name: x, options: i3, async hasItem(s2) {
    return !(typeof await get(e2(s2), n4) > "u");
  }, async getItem(s2) {
    return await get(e2(s2), n4) ?? null;
  }, setItem(s2, a4) {
    return set(e2(s2), a4, n4);
  }, removeItem(s2) {
    return del(e2(s2), n4);
  }, getKeys() {
    return keys(n4);
  }, clear() {
    return clear(n4);
  } };
};
var D = "WALLET_CONNECT_V2_INDEXED_DB";
var E2 = "keyvaluestorage";
var _ = class {
  constructor() {
    this.indexedDb = createStorage({ driver: z({ dbName: D, storeName: E2 }) });
  }
  async getKeys() {
    return this.indexedDb.getKeys();
  }
  async getEntries() {
    return (await this.indexedDb.getItems(await this.indexedDb.getKeys())).map((t) => [t.key, t.value]);
  }
  async getItem(t) {
    const e2 = await this.indexedDb.getItem(t);
    if (e2 !== null) return e2;
  }
  async setItem(t, e2) {
    await this.indexedDb.setItem(t, safeJsonStringify(e2));
  }
  async removeItem(t) {
    await this.indexedDb.removeItem(t);
  }
};
var l = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
var c = { exports: {} };
(function() {
  let i3;
  function t() {
  }
  i3 = t, i3.prototype.getItem = function(e2) {
    return this.hasOwnProperty(e2) ? String(this[e2]) : null;
  }, i3.prototype.setItem = function(e2, n4) {
    this[e2] = String(n4);
  }, i3.prototype.removeItem = function(e2) {
    delete this[e2];
  }, i3.prototype.clear = function() {
    const e2 = this;
    Object.keys(e2).forEach(function(n4) {
      e2[n4] = void 0, delete e2[n4];
    });
  }, i3.prototype.key = function(e2) {
    return e2 = e2 || 0, Object.keys(this)[e2];
  }, i3.prototype.__defineGetter__("length", function() {
    return Object.keys(this).length;
  }), typeof l < "u" && l.localStorage ? c.exports = l.localStorage : typeof window < "u" && window.localStorage ? c.exports = window.localStorage : c.exports = new t();
})();
function k2(i3) {
  var t;
  return [i3[0], safeJsonParse((t = i3[1]) != null ? t : "")];
}
var K2 = class {
  constructor() {
    this.localStorage = c.exports;
  }
  async getKeys() {
    return Object.keys(this.localStorage);
  }
  async getEntries() {
    return Object.entries(this.localStorage).map(k2);
  }
  async getItem(t) {
    const e2 = this.localStorage.getItem(t);
    if (e2 !== null) return safeJsonParse(e2);
  }
  async setItem(t, e2) {
    this.localStorage.setItem(t, safeJsonStringify(e2));
  }
  async removeItem(t) {
    this.localStorage.removeItem(t);
  }
};
var N = "wc_storage_version";
var y2 = 1;
var O = async (i3, t, e2) => {
  const n4 = N, s2 = await t.getItem(n4);
  if (s2 && s2 >= y2) {
    e2(t);
    return;
  }
  const a4 = await i3.getKeys();
  if (!a4.length) {
    e2(t);
    return;
  }
  const m3 = [];
  for (; a4.length; ) {
    const r3 = a4.shift();
    if (!r3) continue;
    const o5 = r3.toLowerCase();
    if (o5.includes("wc@") || o5.includes("walletconnect") || o5.includes("wc_") || o5.includes("wallet_connect")) {
      const f5 = await i3.getItem(r3);
      await t.setItem(r3, f5), m3.push(r3);
    }
  }
  await t.setItem(n4, y2), e2(t), j2(i3, m3);
};
var j2 = async (i3, t) => {
  t.length && t.forEach(async (e2) => {
    await i3.removeItem(e2);
  });
};
var h = class {
  constructor() {
    this.initialized = false, this.setInitialized = (e2) => {
      this.storage = e2, this.initialized = true;
    };
    const t = new K2();
    this.storage = t;
    try {
      const e2 = new _();
      O(t, e2, this.setInitialized);
    } catch {
      this.initialized = true;
    }
  }
  async getKeys() {
    return await this.initialize(), this.storage.getKeys();
  }
  async getEntries() {
    return await this.initialize(), this.storage.getEntries();
  }
  async getItem(t) {
    return await this.initialize(), this.storage.getItem(t);
  }
  async setItem(t, e2) {
    return await this.initialize(), this.storage.setItem(t, e2);
  }
  async removeItem(t) {
    return await this.initialize(), this.storage.removeItem(t);
  }
  async initialize() {
    this.initialized || await new Promise((t) => {
      const e2 = setInterval(() => {
        this.initialized && (clearInterval(e2), t());
      }, 20);
    });
  }
};

// node_modules/@walletconnect/heartbeat/dist/index.es.js
var import_events = __toESM(require_events());
var import_time2 = __toESM(require_cjs());

// node_modules/@walletconnect/events/dist/esm/events.js
var IEvents = class {
};

// node_modules/@walletconnect/heartbeat/dist/index.es.js
var n = class extends IEvents {
  constructor(e2) {
    super();
  }
};
var s = import_time2.FIVE_SECONDS;
var r = { pulse: "heartbeat_pulse" };
var i = class _i2 extends n {
  constructor(e2) {
    super(e2), this.events = new import_events.EventEmitter(), this.interval = s, this.interval = (e2 == null ? void 0 : e2.interval) || s;
  }
  static async init(e2) {
    const t = new _i2(e2);
    return await t.init(), t;
  }
  async init() {
    await this.initialize();
  }
  stop() {
    clearInterval(this.intervalRef);
  }
  on(e2, t) {
    this.events.on(e2, t);
  }
  once(e2, t) {
    this.events.once(e2, t);
  }
  off(e2, t) {
    this.events.off(e2, t);
  }
  removeListener(e2, t) {
    this.events.removeListener(e2, t);
  }
  async initialize() {
    this.intervalRef = setInterval(() => this.pulse(), (0, import_time2.toMiliseconds)(this.interval));
  }
  pulse() {
    this.events.emit(r.pulse);
  }
};

// node_modules/@walletconnect/types/dist/index.es.js
var import_events4 = __toESM(require_events());
var n2 = class extends IEvents {
  constructor(s2) {
    super(), this.opts = s2, this.protocol = "wc", this.version = 2;
  }
};
var h2 = class extends IEvents {
  constructor(s2, t) {
    super(), this.core = s2, this.logger = t, this.records = /* @__PURE__ */ new Map();
  }
};
var a2 = class {
  constructor(s2, t) {
    this.logger = s2, this.core = t;
  }
};
var u = class extends IEvents {
  constructor(s2, t) {
    super(), this.relayer = s2, this.logger = t;
  }
};
var g = class extends IEvents {
  constructor(s2) {
    super();
  }
};
var p = class {
  constructor(s2, t, o5, M4) {
    this.core = s2, this.logger = t, this.name = o5;
  }
};
var d = class extends IEvents {
  constructor(s2, t) {
    super(), this.relayer = s2, this.logger = t;
  }
};
var E3 = class extends IEvents {
  constructor(s2, t) {
    super(), this.core = s2, this.logger = t;
  }
};
var y3 = class {
  constructor(s2, t) {
    this.projectId = s2, this.logger = t;
  }
};
var v = class {
  constructor(s2, t) {
    this.projectId = s2, this.logger = t;
  }
};
var b = class {
  constructor(s2) {
    this.opts = s2, this.protocol = "wc", this.version = 2;
  }
};
var w = class {
  constructor(s2) {
    this.client = s2;
  }
};

// node_modules/@walletconnect/relay-auth/dist/esm/api.js
var ed25519 = __toESM(require_ed25519());
var import_random2 = __toESM(require_random());
var import_time3 = __toESM(require_cjs());

// node_modules/@walletconnect/relay-auth/dist/esm/constants.js
var JWT_IRIDIUM_ALG = "EdDSA";
var JWT_IRIDIUM_TYP = "JWT";
var JWT_DELIMITER = ".";
var JWT_ENCODING = "base64url";
var JSON_ENCODING = "utf8";
var DATA_ENCODING = "utf8";
var DID_DELIMITER = ":";
var DID_PREFIX = "did";
var DID_METHOD = "key";
var MULTICODEC_ED25519_ENCODING = "base58btc";
var MULTICODEC_ED25519_BASE = "z";
var MULTICODEC_ED25519_HEADER = "K36";
var KEY_PAIR_SEED_LENGTH = 32;

// node_modules/@walletconnect/relay-auth/dist/esm/utils.js
function encodeJSON(val) {
  return toString(fromString(safeJsonStringify(val), JSON_ENCODING), JWT_ENCODING);
}
function encodeIss(publicKey) {
  const header = fromString(MULTICODEC_ED25519_HEADER, MULTICODEC_ED25519_ENCODING);
  const multicodec = MULTICODEC_ED25519_BASE + toString(concat([header, publicKey]), MULTICODEC_ED25519_ENCODING);
  return [DID_PREFIX, DID_METHOD, multicodec].join(DID_DELIMITER);
}
function encodeSig(bytes) {
  return toString(bytes, JWT_ENCODING);
}
function encodeData(params) {
  return fromString([encodeJSON(params.header), encodeJSON(params.payload)].join(JWT_DELIMITER), DATA_ENCODING);
}
function encodeJWT(params) {
  return [
    encodeJSON(params.header),
    encodeJSON(params.payload),
    encodeSig(params.signature)
  ].join(JWT_DELIMITER);
}

// node_modules/@walletconnect/relay-auth/dist/esm/api.js
function generateKeyPair2(seed = (0, import_random2.randomBytes)(KEY_PAIR_SEED_LENGTH)) {
  return ed25519.generateKeyPairFromSeed(seed);
}
async function signJWT(sub, aud, ttl, keyPair, iat = (0, import_time3.fromMiliseconds)(Date.now())) {
  const header = { alg: JWT_IRIDIUM_ALG, typ: JWT_IRIDIUM_TYP };
  const iss = encodeIss(keyPair.publicKey);
  const exp = iat + ttl;
  const payload = { iss, sub, aud, iat, exp };
  const data = encodeData({ header, payload });
  const signature = ed25519.sign(keyPair.secretKey, data);
  return encodeJWT({ header, payload, signature });
}

// node_modules/@walletconnect/core/dist/index.es.js
var import_time4 = __toESM(require_cjs());

// node_modules/@walletconnect/jsonrpc-provider/dist/index.es.js
var import_events5 = __toESM(require_events());

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  DEFAULT_ERROR: () => DEFAULT_ERROR,
  IBaseJsonRpcProvider: () => n3,
  IEvents: () => e,
  IJsonRpcConnection: () => o2,
  IJsonRpcProvider: () => r2,
  INTERNAL_ERROR: () => INTERNAL_ERROR,
  INVALID_PARAMS: () => INVALID_PARAMS,
  INVALID_REQUEST: () => INVALID_REQUEST,
  METHOD_NOT_FOUND: () => METHOD_NOT_FOUND,
  PARSE_ERROR: () => PARSE_ERROR,
  RESERVED_ERROR_CODES: () => RESERVED_ERROR_CODES,
  SERVER_ERROR: () => SERVER_ERROR,
  SERVER_ERROR_CODE_RANGE: () => SERVER_ERROR_CODE_RANGE,
  STANDARD_ERROR_MAP: () => STANDARD_ERROR_MAP,
  formatErrorMessage: () => formatErrorMessage,
  formatJsonRpcError: () => formatJsonRpcError,
  formatJsonRpcRequest: () => formatJsonRpcRequest,
  formatJsonRpcResult: () => formatJsonRpcResult,
  getBigIntRpcId: () => getBigIntRpcId,
  getError: () => getError,
  getErrorByCode: () => getErrorByCode,
  isHttpUrl: () => isHttpUrl,
  isJsonRpcError: () => isJsonRpcError,
  isJsonRpcPayload: () => isJsonRpcPayload,
  isJsonRpcRequest: () => isJsonRpcRequest,
  isJsonRpcResponse: () => isJsonRpcResponse,
  isJsonRpcResult: () => isJsonRpcResult,
  isJsonRpcValidationInvalid: () => isJsonRpcValidationInvalid,
  isLocalhostUrl: () => isLocalhostUrl,
  isNodeJs: () => isNodeJs,
  isReservedErrorCode: () => isReservedErrorCode,
  isServerErrorCode: () => isServerErrorCode,
  isValidDefaultRoute: () => isValidDefaultRoute,
  isValidErrorCode: () => isValidErrorCode,
  isValidLeadingWildcardRoute: () => isValidLeadingWildcardRoute,
  isValidRoute: () => isValidRoute,
  isValidTrailingWildcardRoute: () => isValidTrailingWildcardRoute,
  isValidWildcardRoute: () => isValidWildcardRoute,
  isWsUrl: () => isWsUrl,
  parseConnectionError: () => parseConnectionError,
  payloadId: () => payloadId,
  validateJsonRpcError: () => validateJsonRpcError
});

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/constants.js
var PARSE_ERROR = "PARSE_ERROR";
var INVALID_REQUEST = "INVALID_REQUEST";
var METHOD_NOT_FOUND = "METHOD_NOT_FOUND";
var INVALID_PARAMS = "INVALID_PARAMS";
var INTERNAL_ERROR = "INTERNAL_ERROR";
var SERVER_ERROR = "SERVER_ERROR";
var RESERVED_ERROR_CODES = [-32700, -32600, -32601, -32602, -32603];
var SERVER_ERROR_CODE_RANGE = [-32e3, -32099];
var STANDARD_ERROR_MAP = {
  [PARSE_ERROR]: { code: -32700, message: "Parse error" },
  [INVALID_REQUEST]: { code: -32600, message: "Invalid Request" },
  [METHOD_NOT_FOUND]: { code: -32601, message: "Method not found" },
  [INVALID_PARAMS]: { code: -32602, message: "Invalid params" },
  [INTERNAL_ERROR]: { code: -32603, message: "Internal error" },
  [SERVER_ERROR]: { code: -32e3, message: "Server error" }
};
var DEFAULT_ERROR = SERVER_ERROR;

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/error.js
function isServerErrorCode(code) {
  return code <= SERVER_ERROR_CODE_RANGE[0] && code >= SERVER_ERROR_CODE_RANGE[1];
}
function isReservedErrorCode(code) {
  return RESERVED_ERROR_CODES.includes(code);
}
function isValidErrorCode(code) {
  return typeof code === "number";
}
function getError(type) {
  if (!Object.keys(STANDARD_ERROR_MAP).includes(type)) {
    return STANDARD_ERROR_MAP[DEFAULT_ERROR];
  }
  return STANDARD_ERROR_MAP[type];
}
function getErrorByCode(code) {
  const match = Object.values(STANDARD_ERROR_MAP).find((e2) => e2.code === code);
  if (!match) {
    return STANDARD_ERROR_MAP[DEFAULT_ERROR];
  }
  return match;
}
function validateJsonRpcError(response) {
  if (typeof response.error.code === "undefined") {
    return { valid: false, error: "Missing code for JSON-RPC error" };
  }
  if (typeof response.error.message === "undefined") {
    return { valid: false, error: "Missing message for JSON-RPC error" };
  }
  if (!isValidErrorCode(response.error.code)) {
    return {
      valid: false,
      error: `Invalid error code type for JSON-RPC: ${response.error.code}`
    };
  }
  if (isReservedErrorCode(response.error.code)) {
    const error = getErrorByCode(response.error.code);
    if (error.message !== STANDARD_ERROR_MAP[DEFAULT_ERROR].message && response.error.message === error.message) {
      return {
        valid: false,
        error: `Invalid error code message for JSON-RPC: ${response.error.code}`
      };
    }
  }
  return { valid: true };
}
function parseConnectionError(e2, url, type) {
  return e2.message.includes("getaddrinfo ENOTFOUND") || e2.message.includes("connect ECONNREFUSED") ? new Error(`Unavailable ${type} RPC url at ${url}`) : e2;
}

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/env.js
var env_exports = {};
__export(env_exports, {
  isNodeJs: () => isNodeJs
});
var import_environment = __toESM(require_cjs4());
__reExport(env_exports, __toESM(require_cjs4()));
var isNodeJs = import_environment.isNode;

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/index.js
__reExport(esm_exports, env_exports);

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/format.js
function payloadId(entropy = 3) {
  const date = Date.now() * Math.pow(10, entropy);
  const extra = Math.floor(Math.random() * Math.pow(10, entropy));
  return date + extra;
}
function getBigIntRpcId(entropy = 6) {
  return BigInt(payloadId(entropy));
}
function formatJsonRpcRequest(method, params, id) {
  return {
    id: id || payloadId(),
    jsonrpc: "2.0",
    method,
    params
  };
}
function formatJsonRpcResult(id, result) {
  return {
    id,
    jsonrpc: "2.0",
    result
  };
}
function formatJsonRpcError(id, error, data) {
  return {
    id,
    jsonrpc: "2.0",
    error: formatErrorMessage(error, data)
  };
}
function formatErrorMessage(error, data) {
  if (typeof error === "undefined") {
    return getError(INTERNAL_ERROR);
  }
  if (typeof error === "string") {
    error = Object.assign(Object.assign({}, getError(SERVER_ERROR)), { message: error });
  }
  if (typeof data !== "undefined") {
    error.data = data;
  }
  if (isReservedErrorCode(error.code)) {
    error = getErrorByCode(error.code);
  }
  return error;
}

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/routing.js
function isValidRoute(route) {
  if (route.includes("*")) {
    return isValidWildcardRoute(route);
  }
  if (/\W/g.test(route)) {
    return false;
  }
  return true;
}
function isValidDefaultRoute(route) {
  return route === "*";
}
function isValidWildcardRoute(route) {
  if (isValidDefaultRoute(route)) {
    return true;
  }
  if (!route.includes("*")) {
    return false;
  }
  if (route.split("*").length !== 2) {
    return false;
  }
  if (route.split("*").filter((x2) => x2.trim() === "").length !== 1) {
    return false;
  }
  return true;
}
function isValidLeadingWildcardRoute(route) {
  return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[0].trim();
}
function isValidTrailingWildcardRoute(route) {
  return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[1].trim();
}

// node_modules/@walletconnect/jsonrpc-types/dist/index.es.js
var e = class {
};
var o2 = class extends e {
  constructor(c5) {
    super();
  }
};
var n3 = class extends e {
  constructor() {
    super();
  }
};
var r2 = class extends n3 {
  constructor(c5) {
    super();
  }
};

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/url.js
var HTTP_REGEX = "^https?:";
var WS_REGEX = "^wss?:";
function getUrlProtocol(url) {
  const matches = url.match(new RegExp(/^\w+:/, "gi"));
  if (!matches || !matches.length)
    return;
  return matches[0];
}
function matchRegexProtocol(url, regex) {
  const protocol = getUrlProtocol(url);
  if (typeof protocol === "undefined")
    return false;
  return new RegExp(regex).test(protocol);
}
function isHttpUrl(url) {
  return matchRegexProtocol(url, HTTP_REGEX);
}
function isWsUrl(url) {
  return matchRegexProtocol(url, WS_REGEX);
}
function isLocalhostUrl(url) {
  return new RegExp("wss?://localhost(:d{2,5})?").test(url);
}

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/validators.js
function isJsonRpcPayload(payload) {
  return typeof payload === "object" && "id" in payload && "jsonrpc" in payload && payload.jsonrpc === "2.0";
}
function isJsonRpcRequest(payload) {
  return isJsonRpcPayload(payload) && "method" in payload;
}
function isJsonRpcResponse(payload) {
  return isJsonRpcPayload(payload) && (isJsonRpcResult(payload) || isJsonRpcError(payload));
}
function isJsonRpcResult(payload) {
  return "result" in payload;
}
function isJsonRpcError(payload) {
  return "error" in payload;
}
function isJsonRpcValidationInvalid(validation) {
  return "error" in validation && validation.valid === false;
}

// node_modules/@walletconnect/jsonrpc-provider/dist/index.es.js
var o3 = class extends r2 {
  constructor(t) {
    super(t), this.events = new import_events5.EventEmitter(), this.hasRegisteredEventListeners = false, this.connection = this.setConnection(t), this.connection.connected && this.registerEventListeners();
  }
  async connect(t = this.connection) {
    await this.open(t);
  }
  async disconnect() {
    await this.close();
  }
  on(t, e2) {
    this.events.on(t, e2);
  }
  once(t, e2) {
    this.events.once(t, e2);
  }
  off(t, e2) {
    this.events.off(t, e2);
  }
  removeListener(t, e2) {
    this.events.removeListener(t, e2);
  }
  async request(t, e2) {
    return this.requestStrict(formatJsonRpcRequest(t.method, t.params || [], t.id || getBigIntRpcId().toString()), e2);
  }
  async requestStrict(t, e2) {
    return new Promise(async (i3, s2) => {
      if (!this.connection.connected) try {
        await this.open();
      } catch (n4) {
        s2(n4);
      }
      this.events.on(`${t.id}`, (n4) => {
        isJsonRpcError(n4) ? s2(n4.error) : i3(n4.result);
      });
      try {
        await this.connection.send(t, e2);
      } catch (n4) {
        s2(n4);
      }
    });
  }
  setConnection(t = this.connection) {
    return t;
  }
  onPayload(t) {
    this.events.emit("payload", t), isJsonRpcResponse(t) ? this.events.emit(`${t.id}`, t) : this.events.emit("message", { type: t.method, data: t.params });
  }
  onClose(t) {
    t && t.code === 3e3 && this.events.emit("error", new Error(`WebSocket connection closed abnormally with code: ${t.code} ${t.reason ? `(${t.reason})` : ""}`)), this.events.emit("disconnect");
  }
  async open(t = this.connection) {
    this.connection === t && this.connection.connected || (this.connection.connected && this.close(), typeof t == "string" && (await this.connection.open(t), t = this.connection), this.connection = this.setConnection(t), await this.connection.open(), this.registerEventListeners(), this.events.emit("connect"));
  }
  async close() {
    await this.connection.close();
  }
  registerEventListeners() {
    this.hasRegisteredEventListeners || (this.connection.on("payload", (t) => this.onPayload(t)), this.connection.on("close", (t) => this.onClose(t)), this.connection.on("error", (t) => this.events.emit("error", t)), this.connection.on("register_error", (t) => this.onClose()), this.hasRegisteredEventListeners = true);
  }
};

// node_modules/@walletconnect/jsonrpc-ws-connection/dist/index.es.js
var import_events6 = __toESM(require_events());
var w2 = () => typeof WebSocket < "u" ? WebSocket : typeof global < "u" && typeof global.WebSocket < "u" ? global.WebSocket : typeof window < "u" && typeof window.WebSocket < "u" ? window.WebSocket : typeof self < "u" && typeof self.WebSocket < "u" ? self.WebSocket : require_browser();
var b2 = () => typeof WebSocket < "u" || typeof global < "u" && typeof global.WebSocket < "u" || typeof window < "u" && typeof window.WebSocket < "u" || typeof self < "u" && typeof self.WebSocket < "u";
var a3 = (c5) => c5.split("?")[0];
var h3 = 10;
var S = w2();
var f = class {
  constructor(e2) {
    if (this.url = e2, this.events = new import_events6.EventEmitter(), this.registering = false, !isWsUrl(e2)) throw new Error(`Provided URL is not compatible with WebSocket connection: ${e2}`);
    this.url = e2;
  }
  get connected() {
    return typeof this.socket < "u";
  }
  get connecting() {
    return this.registering;
  }
  on(e2, t) {
    this.events.on(e2, t);
  }
  once(e2, t) {
    this.events.once(e2, t);
  }
  off(e2, t) {
    this.events.off(e2, t);
  }
  removeListener(e2, t) {
    this.events.removeListener(e2, t);
  }
  async open(e2 = this.url) {
    await this.register(e2);
  }
  async close() {
    return new Promise((e2, t) => {
      if (typeof this.socket > "u") {
        t(new Error("Connection already closed"));
        return;
      }
      this.socket.onclose = (n4) => {
        this.onClose(n4), e2();
      }, this.socket.close();
    });
  }
  async send(e2) {
    typeof this.socket > "u" && (this.socket = await this.register());
    try {
      this.socket.send(safeJsonStringify(e2));
    } catch (t) {
      this.onError(e2.id, t);
    }
  }
  register(e2 = this.url) {
    if (!isWsUrl(e2)) throw new Error(`Provided URL is not compatible with WebSocket connection: ${e2}`);
    if (this.registering) {
      const t = this.events.getMaxListeners();
      return (this.events.listenerCount("register_error") >= t || this.events.listenerCount("open") >= t) && this.events.setMaxListeners(t + 1), new Promise((n4, o5) => {
        this.events.once("register_error", (s2) => {
          this.resetMaxListeners(), o5(s2);
        }), this.events.once("open", () => {
          if (this.resetMaxListeners(), typeof this.socket > "u") return o5(new Error("WebSocket connection is missing or invalid"));
          n4(this.socket);
        });
      });
    }
    return this.url = e2, this.registering = true, new Promise((t, n4) => {
      const o5 = new URLSearchParams(e2).get("origin"), s2 = (0, esm_exports.isReactNative)() ? { headers: { origin: o5 } } : { rejectUnauthorized: !isLocalhostUrl(e2) }, i3 = new S(e2, [], s2);
      b2() ? i3.onerror = (r3) => {
        const l4 = r3;
        n4(this.emitError(l4.error));
      } : i3.on("error", (r3) => {
        n4(this.emitError(r3));
      }), i3.onopen = () => {
        this.onOpen(i3), t(i3);
      };
    });
  }
  onOpen(e2) {
    e2.onmessage = (t) => this.onPayload(t), e2.onclose = (t) => this.onClose(t), this.socket = e2, this.registering = false, this.events.emit("open");
  }
  onClose(e2) {
    this.socket = void 0, this.registering = false, this.events.emit("close", e2);
  }
  onPayload(e2) {
    if (typeof e2.data > "u") return;
    const t = typeof e2.data == "string" ? safeJsonParse(e2.data) : e2.data;
    this.events.emit("payload", t);
  }
  onError(e2, t) {
    const n4 = this.parseError(t), o5 = n4.message || n4.toString(), s2 = formatJsonRpcError(e2, o5);
    this.events.emit("payload", s2);
  }
  parseError(e2, t = this.url) {
    return parseConnectionError(e2, a3(t), "WS");
  }
  resetMaxListeners() {
    this.events.getMaxListeners() > h3 && this.events.setMaxListeners(h3);
  }
  emitError(e2) {
    const t = this.parseError(new Error((e2 == null ? void 0 : e2.message) || `WebSocket connection failed for host: ${a3(this.url)}`));
    return this.events.emit("register_error", t), t;
  }
};

// node_modules/@walletconnect/core/dist/index.es.js
var import_lodash = __toESM(require_lodash());
var import_isomorphic_unfetch = __toESM(require_browser2());
function Hi2(o5, e2) {
  if (o5.length >= 255) throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), i3 = 0; i3 < t.length; i3++) t[i3] = 255;
  for (var s2 = 0; s2 < o5.length; s2++) {
    var r3 = o5.charAt(s2), n4 = r3.charCodeAt(0);
    if (t[n4] !== 255) throw new TypeError(r3 + " is ambiguous");
    t[n4] = s2;
  }
  var a4 = o5.length, h4 = o5.charAt(0), l4 = Math.log(a4) / Math.log(256), d3 = Math.log(256) / Math.log(a4);
  function g4(u4) {
    if (u4 instanceof Uint8Array || (ArrayBuffer.isView(u4) ? u4 = new Uint8Array(u4.buffer, u4.byteOffset, u4.byteLength) : Array.isArray(u4) && (u4 = Uint8Array.from(u4))), !(u4 instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
    if (u4.length === 0) return "";
    for (var p4 = 0, T3 = 0, D4 = 0, P2 = u4.length; D4 !== P2 && u4[D4] === 0; ) D4++, p4++;
    for (var x2 = (P2 - D4) * d3 + 1 >>> 0, w4 = new Uint8Array(x2); D4 !== P2; ) {
      for (var O4 = u4[D4], N3 = 0, _2 = x2 - 1; (O4 !== 0 || N3 < T3) && _2 !== -1; _2--, N3++) O4 += 256 * w4[_2] >>> 0, w4[_2] = O4 % a4 >>> 0, O4 = O4 / a4 >>> 0;
      if (O4 !== 0) throw new Error("Non-zero carry");
      T3 = N3, D4++;
    }
    for (var A4 = x2 - T3; A4 !== x2 && w4[A4] === 0; ) A4++;
    for (var G = h4.repeat(p4); A4 < x2; ++A4) G += o5.charAt(w4[A4]);
    return G;
  }
  function m3(u4) {
    if (typeof u4 != "string") throw new TypeError("Expected String");
    if (u4.length === 0) return new Uint8Array();
    var p4 = 0;
    if (u4[p4] !== " ") {
      for (var T3 = 0, D4 = 0; u4[p4] === h4; ) T3++, p4++;
      for (var P2 = (u4.length - p4) * l4 + 1 >>> 0, x2 = new Uint8Array(P2); u4[p4]; ) {
        var w4 = t[u4.charCodeAt(p4)];
        if (w4 === 255) return;
        for (var O4 = 0, N3 = P2 - 1; (w4 !== 0 || O4 < D4) && N3 !== -1; N3--, O4++) w4 += a4 * x2[N3] >>> 0, x2[N3] = w4 % 256 >>> 0, w4 = w4 / 256 >>> 0;
        if (w4 !== 0) throw new Error("Non-zero carry");
        D4 = O4, p4++;
      }
      if (u4[p4] !== " ") {
        for (var _2 = P2 - D4; _2 !== P2 && x2[_2] === 0; ) _2++;
        for (var A4 = new Uint8Array(T3 + (P2 - _2)), G = T3; _2 !== P2; ) A4[G++] = x2[_2++];
        return A4;
      }
    }
  }
  function L5(u4) {
    var p4 = m3(u4);
    if (p4) return p4;
    throw new Error(`Non-${e2} character`);
  }
  return { encode: g4, decodeUnsafe: m3, decode: L5 };
}
var Ji2 = Hi2;
var Xi2 = Ji2;
var Ue = (o5) => {
  if (o5 instanceof Uint8Array && o5.constructor.name === "Uint8Array") return o5;
  if (o5 instanceof ArrayBuffer) return new Uint8Array(o5);
  if (ArrayBuffer.isView(o5)) return new Uint8Array(o5.buffer, o5.byteOffset, o5.byteLength);
  throw new Error("Unknown type, must be binary type");
};
var Wi2 = (o5) => new TextEncoder().encode(o5);
var Qi2 = (o5) => new TextDecoder().decode(o5);
var Zi2 = class {
  constructor(e2, t, i3) {
    this.name = e2, this.prefix = t, this.baseEncode = i3;
  }
  encode(e2) {
    if (e2 instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e2)}`;
    throw Error("Unknown type, must be binary type");
  }
};
var es2 = class {
  constructor(e2, t, i3) {
    if (this.name = e2, this.prefix = t, t.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
    this.prefixCodePoint = t.codePointAt(0), this.baseDecode = i3;
  }
  decode(e2) {
    if (typeof e2 == "string") {
      if (e2.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e2)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      return this.baseDecode(e2.slice(this.prefix.length));
    } else throw Error("Can only multibase decode strings");
  }
  or(e2) {
    return Fe(this, e2);
  }
};
var ts2 = class {
  constructor(e2) {
    this.decoders = e2;
  }
  or(e2) {
    return Fe(this, e2);
  }
  decode(e2) {
    const t = e2[0], i3 = this.decoders[t];
    if (i3) return i3.decode(e2);
    throw RangeError(`Unable to decode multibase string ${JSON.stringify(e2)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
  }
};
var Fe = (o5, e2) => new ts2({ ...o5.decoders || { [o5.prefix]: o5 }, ...e2.decoders || { [e2.prefix]: e2 } });
var is2 = class {
  constructor(e2, t, i3, s2) {
    this.name = e2, this.prefix = t, this.baseEncode = i3, this.baseDecode = s2, this.encoder = new Zi2(e2, t, i3), this.decoder = new es2(e2, t, s2);
  }
  encode(e2) {
    return this.encoder.encode(e2);
  }
  decode(e2) {
    return this.decoder.decode(e2);
  }
};
var Q2 = ({ name: o5, prefix: e2, encode: t, decode: i3 }) => new is2(o5, e2, t, i3);
var V2 = ({ prefix: o5, name: e2, alphabet: t }) => {
  const { encode: i3, decode: s2 } = Xi2(t, e2);
  return Q2({ prefix: o5, name: e2, encode: i3, decode: (r3) => Ue(s2(r3)) });
};
var ss2 = (o5, e2, t, i3) => {
  const s2 = {};
  for (let d3 = 0; d3 < e2.length; ++d3) s2[e2[d3]] = d3;
  let r3 = o5.length;
  for (; o5[r3 - 1] === "="; ) --r3;
  const n4 = new Uint8Array(r3 * t / 8 | 0);
  let a4 = 0, h4 = 0, l4 = 0;
  for (let d3 = 0; d3 < r3; ++d3) {
    const g4 = s2[o5[d3]];
    if (g4 === void 0) throw new SyntaxError(`Non-${i3} character`);
    h4 = h4 << t | g4, a4 += t, a4 >= 8 && (a4 -= 8, n4[l4++] = 255 & h4 >> a4);
  }
  if (a4 >= t || 255 & h4 << 8 - a4) throw new SyntaxError("Unexpected end of data");
  return n4;
};
var rs2 = (o5, e2, t) => {
  const i3 = e2[e2.length - 1] === "=", s2 = (1 << t) - 1;
  let r3 = "", n4 = 0, a4 = 0;
  for (let h4 = 0; h4 < o5.length; ++h4) for (a4 = a4 << 8 | o5[h4], n4 += 8; n4 > t; ) n4 -= t, r3 += e2[s2 & a4 >> n4];
  if (n4 && (r3 += e2[s2 & a4 << t - n4]), i3) for (; r3.length * t & 7; ) r3 += "=";
  return r3;
};
var y5 = ({ name: o5, prefix: e2, bitsPerChar: t, alphabet: i3 }) => Q2({ prefix: e2, name: o5, encode(s2) {
  return rs2(s2, i3, t);
}, decode(s2) {
  return ss2(s2, i3, t, o5);
} });
var ns2 = Q2({ prefix: "\0", name: "identity", encode: (o5) => Qi2(o5), decode: (o5) => Wi2(o5) });
var os2 = Object.freeze({ __proto__: null, identity: ns2 });
var as2 = y5({ prefix: "0", name: "base2", alphabet: "01", bitsPerChar: 1 });
var hs2 = Object.freeze({ __proto__: null, base2: as2 });
var cs2 = y5({ prefix: "7", name: "base8", alphabet: "01234567", bitsPerChar: 3 });
var ls2 = Object.freeze({ __proto__: null, base8: cs2 });
var us2 = V2({ prefix: "9", name: "base10", alphabet: "0123456789" });
var ds2 = Object.freeze({ __proto__: null, base10: us2 });
var gs2 = y5({ prefix: "f", name: "base16", alphabet: "0123456789abcdef", bitsPerChar: 4 });
var ps2 = y5({ prefix: "F", name: "base16upper", alphabet: "0123456789ABCDEF", bitsPerChar: 4 });
var Ds2 = Object.freeze({ __proto__: null, base16: gs2, base16upper: ps2 });
var ys2 = y5({ prefix: "b", name: "base32", alphabet: "abcdefghijklmnopqrstuvwxyz234567", bitsPerChar: 5 });
var ms2 = y5({ prefix: "B", name: "base32upper", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", bitsPerChar: 5 });
var bs2 = y5({ prefix: "c", name: "base32pad", alphabet: "abcdefghijklmnopqrstuvwxyz234567=", bitsPerChar: 5 });
var fs2 = y5({ prefix: "C", name: "base32padupper", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=", bitsPerChar: 5 });
var Es2 = y5({ prefix: "v", name: "base32hex", alphabet: "0123456789abcdefghijklmnopqrstuv", bitsPerChar: 5 });
var ws2 = y5({ prefix: "V", name: "base32hexupper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV", bitsPerChar: 5 });
var vs2 = y5({ prefix: "t", name: "base32hexpad", alphabet: "0123456789abcdefghijklmnopqrstuv=", bitsPerChar: 5 });
var Is2 = y5({ prefix: "T", name: "base32hexpadupper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=", bitsPerChar: 5 });
var Cs2 = y5({ prefix: "h", name: "base32z", alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769", bitsPerChar: 5 });
var Ts2 = Object.freeze({ __proto__: null, base32: ys2, base32upper: ms2, base32pad: bs2, base32padupper: fs2, base32hex: Es2, base32hexupper: ws2, base32hexpad: vs2, base32hexpadupper: Is2, base32z: Cs2 });
var _s2 = V2({ prefix: "k", name: "base36", alphabet: "0123456789abcdefghijklmnopqrstuvwxyz" });
var Rs2 = V2({ prefix: "K", name: "base36upper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
var Ss2 = Object.freeze({ __proto__: null, base36: _s2, base36upper: Rs2 });
var Ps2 = V2({ name: "base58btc", prefix: "z", alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" });
var xs2 = V2({ name: "base58flickr", prefix: "Z", alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ" });
var Os2 = Object.freeze({ __proto__: null, base58btc: Ps2, base58flickr: xs2 });
var As2 = y5({ prefix: "m", name: "base64", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", bitsPerChar: 6 });
var zs2 = y5({ prefix: "M", name: "base64pad", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", bitsPerChar: 6 });
var Ns2 = y5({ prefix: "u", name: "base64url", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", bitsPerChar: 6 });
var Ls2 = y5({ prefix: "U", name: "base64urlpad", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=", bitsPerChar: 6 });
var Us2 = Object.freeze({ __proto__: null, base64: As2, base64pad: zs2, base64url: Ns2, base64urlpad: Ls2 });
var $e2 = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂");
var Fs2 = $e2.reduce((o5, e2, t) => (o5[t] = e2, o5), []);
var $s2 = $e2.reduce((o5, e2, t) => (o5[e2.codePointAt(0)] = t, o5), []);
function Bs2(o5) {
  return o5.reduce((e2, t) => (e2 += Fs2[t], e2), "");
}
function Ms2(o5) {
  const e2 = [];
  for (const t of o5) {
    const i3 = $s2[t.codePointAt(0)];
    if (i3 === void 0) throw new Error(`Non-base256emoji character: ${t}`);
    e2.push(i3);
  }
  return new Uint8Array(e2);
}
var ks2 = Q2({ prefix: "🚀", name: "base256emoji", encode: Bs2, decode: Ms2 });
var Ks2 = Object.freeze({ __proto__: null, base256emoji: ks2 });
var Vs2 = Me;
var Be2 = 128;
var qs2 = 127;
var js2 = ~qs2;
var Gs2 = Math.pow(2, 31);
function Me(o5, e2, t) {
  e2 = e2 || [], t = t || 0;
  for (var i3 = t; o5 >= Gs2; ) e2[t++] = o5 & 255 | Be2, o5 /= 128;
  for (; o5 & js2; ) e2[t++] = o5 & 255 | Be2, o5 >>>= 7;
  return e2[t] = o5 | 0, Me.bytes = t - i3 + 1, e2;
}
var Ys2 = de2;
var Hs2 = 128;
var ke = 127;
function de2(o5, i3) {
  var t = 0, i3 = i3 || 0, s2 = 0, r3 = i3, n4, a4 = o5.length;
  do {
    if (r3 >= a4) throw de2.bytes = 0, new RangeError("Could not decode varint");
    n4 = o5[r3++], t += s2 < 28 ? (n4 & ke) << s2 : (n4 & ke) * Math.pow(2, s2), s2 += 7;
  } while (n4 >= Hs2);
  return de2.bytes = r3 - i3, t;
}
var Js2 = Math.pow(2, 7);
var Xs2 = Math.pow(2, 14);
var Ws2 = Math.pow(2, 21);
var Qs2 = Math.pow(2, 28);
var Zs2 = Math.pow(2, 35);
var er2 = Math.pow(2, 42);
var tr2 = Math.pow(2, 49);
var ir2 = Math.pow(2, 56);
var sr2 = Math.pow(2, 63);
var rr2 = function(o5) {
  return o5 < Js2 ? 1 : o5 < Xs2 ? 2 : o5 < Ws2 ? 3 : o5 < Qs2 ? 4 : o5 < Zs2 ? 5 : o5 < er2 ? 6 : o5 < tr2 ? 7 : o5 < ir2 ? 8 : o5 < sr2 ? 9 : 10;
};
var nr2 = { encode: Vs2, decode: Ys2, encodingLength: rr2 };
var Ke = nr2;
var Ve = (o5, e2, t = 0) => (Ke.encode(o5, e2, t), e2);
var qe = (o5) => Ke.encodingLength(o5);
var ge2 = (o5, e2) => {
  const t = e2.byteLength, i3 = qe(o5), s2 = i3 + qe(t), r3 = new Uint8Array(s2 + t);
  return Ve(o5, r3, 0), Ve(t, r3, i3), r3.set(e2, s2), new or2(o5, t, e2, r3);
};
var or2 = class {
  constructor(e2, t, i3, s2) {
    this.code = e2, this.size = t, this.digest = i3, this.bytes = s2;
  }
};
var je = ({ name: o5, code: e2, encode: t }) => new ar2(o5, e2, t);
var ar2 = class {
  constructor(e2, t, i3) {
    this.name = e2, this.code = t, this.encode = i3;
  }
  digest(e2) {
    if (e2 instanceof Uint8Array) {
      const t = this.encode(e2);
      return t instanceof Uint8Array ? ge2(this.code, t) : t.then((i3) => ge2(this.code, i3));
    } else throw Error("Unknown type, must be binary type");
  }
};
var Ge = (o5) => async (e2) => new Uint8Array(await crypto.subtle.digest(o5, e2));
var hr2 = je({ name: "sha2-256", code: 18, encode: Ge("SHA-256") });
var cr2 = je({ name: "sha2-512", code: 19, encode: Ge("SHA-512") });
var lr2 = Object.freeze({ __proto__: null, sha256: hr2, sha512: cr2 });
var Ye = 0;
var ur2 = "identity";
var He = Ue;
var dr2 = (o5) => ge2(Ye, He(o5));
var gr2 = { code: Ye, name: ur2, encode: He, digest: dr2 };
var pr2 = Object.freeze({ __proto__: null, identity: gr2 });
new TextEncoder(), new TextDecoder();
var Je = { ...os2, ...hs2, ...ls2, ...ds2, ...Ds2, ...Ts2, ...Ss2, ...Os2, ...Us2, ...Ks2 };
({ ...lr2, ...pr2 });
function Dr2(o5 = 0) {
  return globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null ? globalThis.Buffer.allocUnsafe(o5) : new Uint8Array(o5);
}
function Xe2(o5, e2, t, i3) {
  return { name: o5, prefix: e2, encoder: { name: o5, prefix: e2, encode: t }, decoder: { decode: i3 } };
}
var We2 = Xe2("utf8", "u", (o5) => "u" + new TextDecoder("utf8").decode(o5), (o5) => new TextEncoder().encode(o5.substring(1)));
var pe2 = Xe2("ascii", "a", (o5) => {
  let e2 = "a";
  for (let t = 0; t < o5.length; t++) e2 += String.fromCharCode(o5[t]);
  return e2;
}, (o5) => {
  o5 = o5.substring(1);
  const e2 = Dr2(o5.length);
  for (let t = 0; t < o5.length; t++) e2[t] = o5.charCodeAt(t);
  return e2;
});
var yr2 = { utf8: We2, "utf-8": We2, hex: Je.base16, latin1: pe2, ascii: pe2, binary: pe2, ...Je };
function mr2(o5, e2 = "utf8") {
  const t = yr2[e2];
  if (!t) throw new Error(`Unsupported encoding "${e2}"`);
  return (e2 === "utf8" || e2 === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? globalThis.Buffer.from(o5, "utf8") : t.decoder.decode(`${t.prefix}${o5}`);
}
var De = "wc";
var Qe = 2;
var Z = "core";
var z2 = `${De}@2:${Z}:`;
var Ze2 = { name: Z, logger: "error" };
var et = { database: ":memory:" };
var tt = "crypto";
var ye2 = "client_ed25519_seed";
var it = import_time4.ONE_DAY;
var st = "keychain";
var rt = "0.3";
var nt = "messages";
var ot = "0.3";
var at = import_time4.SIX_HOURS;
var ht = "publisher";
var ct = "irn";
var lt = "error";
var me2 = "wss://relay.walletconnect.com";
var be2 = "wss://relay.walletconnect.org";
var ut = "relayer";
var f2 = { message: "relayer_message", message_ack: "relayer_message_ack", connect: "relayer_connect", disconnect: "relayer_disconnect", error: "relayer_error", connection_stalled: "relayer_connection_stalled", transport_closed: "relayer_transport_closed", publish: "relayer_publish" };
var dt = "_subscription";
var E4 = { payload: "payload", connect: "connect", disconnect: "disconnect", error: "error" };
var gt = import_time4.ONE_SECOND;
var pt = "2.13.0";
var Dt2 = 1e4;
var yt = "0.3";
var mt = "WALLETCONNECT_CLIENT_ID";
var S2 = { created: "subscription_created", deleted: "subscription_deleted", expired: "subscription_expired", disabled: "subscription_disabled", sync: "subscription_sync", resubscribed: "subscription_resubscribed" };
var bt = "subscription";
var ft = "0.3";
var Et = import_time4.FIVE_SECONDS * 1e3;
var wt = "pairing";
var vt = "0.3";
var B = { wc_pairingDelete: { req: { ttl: import_time4.ONE_DAY, prompt: false, tag: 1e3 }, res: { ttl: import_time4.ONE_DAY, prompt: false, tag: 1001 } }, wc_pairingPing: { req: { ttl: import_time4.THIRTY_SECONDS, prompt: false, tag: 1002 }, res: { ttl: import_time4.THIRTY_SECONDS, prompt: false, tag: 1003 } }, unregistered_method: { req: { ttl: import_time4.ONE_DAY, prompt: false, tag: 0 }, res: { ttl: import_time4.ONE_DAY, prompt: false, tag: 0 } } };
var q = { create: "pairing_create", expire: "pairing_expire", delete: "pairing_delete", ping: "pairing_ping" };
var I = { created: "history_created", updated: "history_updated", deleted: "history_deleted", sync: "history_sync" };
var It = "history";
var Ct = "0.3";
var Tt2 = "expirer";
var C2 = { created: "expirer_created", deleted: "expirer_deleted", expired: "expirer_expired", sync: "expirer_sync" };
var _t = "0.3";
var ee = "verify-api";
var M = "https://verify.walletconnect.com";
var te = "https://verify.walletconnect.org";
var Rt = [M, te];
var St = "echo";
var Pt = "https://echo.walletconnect.com";
var xt = class {
  constructor(e2, t) {
    this.core = e2, this.logger = t, this.keychain = /* @__PURE__ */ new Map(), this.name = st, this.version = rt, this.initialized = false, this.storagePrefix = z2, this.init = async () => {
      if (!this.initialized) {
        const i3 = await this.getKeyChain();
        typeof i3 < "u" && (this.keychain = i3), this.initialized = true;
      }
    }, this.has = (i3) => (this.isInitialized(), this.keychain.has(i3)), this.set = async (i3, s2) => {
      this.isInitialized(), this.keychain.set(i3, s2), await this.persist();
    }, this.get = (i3) => {
      this.isInitialized();
      const s2 = this.keychain.get(i3);
      if (typeof s2 > "u") {
        const { message: r3 } = xe("NO_MATCHING_KEY", `${this.name}: ${i3}`);
        throw new Error(r3);
      }
      return s2;
    }, this.del = async (i3) => {
      this.isInitialized(), this.keychain.delete(i3), await this.persist();
    }, this.core = e2, this.logger = E(t, this.name);
  }
  get context() {
    return y(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  async setKeyChain(e2) {
    await this.core.storage.setItem(this.storageKey, i0(e2));
  }
  async getKeyChain() {
    const e2 = await this.core.storage.getItem(this.storageKey);
    return typeof e2 < "u" ? n0(e2) : void 0;
  }
  async persist() {
    await this.setKeyChain(this.keychain);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var Ot2 = class {
  constructor(e2, t, i3) {
    this.core = e2, this.logger = t, this.name = tt, this.initialized = false, this.init = async () => {
      this.initialized || (await this.keychain.init(), this.initialized = true);
    }, this.hasKeys = (s2) => (this.isInitialized(), this.keychain.has(s2)), this.getClientId = async () => {
      this.isInitialized();
      const s2 = await this.getClientSeed(), r3 = generateKeyPair2(s2);
      return encodeIss(r3.publicKey);
    }, this.generateKeyPair = () => {
      this.isInitialized();
      const s2 = mu();
      return this.setPrivateKey(s2.publicKey, s2.privateKey);
    }, this.signJWT = async (s2) => {
      this.isInitialized();
      const r3 = await this.getClientSeed(), n4 = generateKeyPair2(r3), a4 = gu(), h4 = it;
      return await signJWT(a4, s2, h4, n4);
    }, this.generateSharedKey = (s2, r3, n4) => {
      this.isInitialized();
      const a4 = this.getPrivateKey(s2), h4 = Au(a4, r3);
      return this.setSymKey(h4, n4);
    }, this.setSymKey = async (s2, r3) => {
      this.isInitialized();
      const n4 = r3 || bu(s2);
      return await this.keychain.set(n4, s2), n4;
    }, this.deleteKeyPair = async (s2) => {
      this.isInitialized(), await this.keychain.del(s2);
    }, this.deleteSymKey = async (s2) => {
      this.isInitialized(), await this.keychain.del(s2);
    }, this.encode = async (s2, r3, n4) => {
      this.isInitialized();
      const a4 = eo(n4), h4 = safeJsonStringify(r3);
      if (Eu(a4)) {
        const m3 = a4.senderPublicKey, L5 = a4.receiverPublicKey;
        s2 = await this.generateSharedKey(m3, L5);
      }
      const l4 = this.getSymKey(s2), { type: d3, senderPublicKey: g4 } = a4;
      return wu({ type: d3, symKey: l4, message: h4, senderPublicKey: g4 });
    }, this.decode = async (s2, r3, n4) => {
      this.isInitialized();
      const a4 = Mu(r3, n4);
      if (Eu(a4)) {
        const h4 = a4.receiverPublicKey, l4 = a4.senderPublicKey;
        s2 = await this.generateSharedKey(h4, l4);
      }
      try {
        const h4 = this.getSymKey(s2), l4 = xu({ symKey: h4, encoded: r3 });
        return safeJsonParse(l4);
      } catch (h4) {
        this.logger.error(`Failed to decode message from topic: '${s2}', clientId: '${await this.getClientId()}'`), this.logger.error(h4);
      }
    }, this.getPayloadType = (s2) => {
      const r3 = Xi(s2);
      return Mr(r3.type);
    }, this.getPayloadSenderPublicKey = (s2) => {
      const r3 = Xi(s2);
      return r3.senderPublicKey ? toString(r3.senderPublicKey, zt) : void 0;
    }, this.core = e2, this.logger = E(t, this.name), this.keychain = i3 || new xt(this.core, this.logger);
  }
  get context() {
    return y(this.logger);
  }
  async setPrivateKey(e2, t) {
    return await this.keychain.set(e2, t), e2;
  }
  getPrivateKey(e2) {
    return this.keychain.get(e2);
  }
  async getClientSeed() {
    let e2 = "";
    try {
      e2 = this.keychain.get(ye2);
    } catch {
      e2 = gu(), await this.keychain.set(ye2, e2);
    }
    return mr2(e2, "base16");
  }
  getSymKey(e2) {
    return this.keychain.get(e2);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var At = class extends a2 {
  constructor(e2, t) {
    super(e2, t), this.logger = e2, this.core = t, this.messages = /* @__PURE__ */ new Map(), this.name = nt, this.version = ot, this.initialized = false, this.storagePrefix = z2, this.init = async () => {
      if (!this.initialized) {
        this.logger.trace("Initialized");
        try {
          const i3 = await this.getRelayerMessages();
          typeof i3 < "u" && (this.messages = i3), this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({ type: "method", method: "restore", size: this.messages.size });
        } catch (i3) {
          this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(i3);
        } finally {
          this.initialized = true;
        }
      }
    }, this.set = async (i3, s2) => {
      this.isInitialized();
      const r3 = yu(s2);
      let n4 = this.messages.get(i3);
      return typeof n4 > "u" && (n4 = {}), typeof n4[r3] < "u" || (n4[r3] = s2, this.messages.set(i3, n4), await this.persist()), r3;
    }, this.get = (i3) => {
      this.isInitialized();
      let s2 = this.messages.get(i3);
      return typeof s2 > "u" && (s2 = {}), s2;
    }, this.has = (i3, s2) => {
      this.isInitialized();
      const r3 = this.get(i3), n4 = yu(s2);
      return typeof r3[n4] < "u";
    }, this.del = async (i3) => {
      this.isInitialized(), this.messages.delete(i3), await this.persist();
    }, this.logger = E(e2, this.name), this.core = t;
  }
  get context() {
    return y(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  async setRelayerMessages(e2) {
    await this.core.storage.setItem(this.storageKey, i0(e2));
  }
  async getRelayerMessages() {
    const e2 = await this.core.storage.getItem(this.storageKey);
    return typeof e2 < "u" ? n0(e2) : void 0;
  }
  async persist() {
    await this.setRelayerMessages(this.messages);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var vr2 = class extends u {
  constructor(e2, t) {
    super(e2, t), this.relayer = e2, this.logger = t, this.events = new import_events7.EventEmitter(), this.name = ht, this.queue = /* @__PURE__ */ new Map(), this.publishTimeout = (0, import_time4.toMiliseconds)(import_time4.ONE_MINUTE), this.failedPublishTimeout = (0, import_time4.toMiliseconds)(import_time4.ONE_SECOND), this.needsTransportRestart = false, this.publish = async (i3, s2, r3) => {
      var n4;
      this.logger.debug("Publishing Payload"), this.logger.trace({ type: "method", method: "publish", params: { topic: i3, message: s2, opts: r3 } });
      const a4 = (r3 == null ? void 0 : r3.ttl) || at, h4 = Su(r3), l4 = (r3 == null ? void 0 : r3.prompt) || false, d3 = (r3 == null ? void 0 : r3.tag) || 0, g4 = (r3 == null ? void 0 : r3.id) || getBigIntRpcId().toString(), m3 = { topic: i3, message: s2, opts: { ttl: a4, relay: h4, prompt: l4, tag: d3, id: g4 } }, L5 = `Failed to publish payload, please try again. id:${g4} tag:${d3}`, u4 = Date.now();
      let p4, T3 = 1;
      try {
        for (; p4 === void 0; ) {
          if (Date.now() - u4 > this.publishTimeout) throw new Error(L5);
          this.logger.trace({ id: g4, attempts: T3 }, `publisher.publish - attempt ${T3}`), p4 = await await u0(this.rpcPublish(i3, s2, a4, h4, l4, d3, g4).catch((D4) => this.logger.warn(D4)), this.publishTimeout, L5), T3++, p4 || await new Promise((D4) => setTimeout(D4, this.failedPublishTimeout));
        }
        this.relayer.events.emit(f2.publish, m3), this.logger.debug("Successfully Published Payload"), this.logger.trace({ type: "method", method: "publish", params: { id: g4, topic: i3, message: s2, opts: r3 } });
      } catch (D4) {
        if (this.logger.debug("Failed to Publish Payload"), this.logger.error(D4), (n4 = r3 == null ? void 0 : r3.internal) != null && n4.throwOnFailedPublish) throw D4;
        this.queue.set(g4, m3);
      }
    }, this.on = (i3, s2) => {
      this.events.on(i3, s2);
    }, this.once = (i3, s2) => {
      this.events.once(i3, s2);
    }, this.off = (i3, s2) => {
      this.events.off(i3, s2);
    }, this.removeListener = (i3, s2) => {
      this.events.removeListener(i3, s2);
    }, this.relayer = e2, this.logger = E(t, this.name), this.registerEventListeners();
  }
  get context() {
    return y(this.logger);
  }
  rpcPublish(e2, t, i3, s2, r3, n4, a4) {
    var h4, l4, d3, g4;
    const m3 = { method: Nu(s2.protocol).publish, params: { topic: e2, message: t, ttl: i3, prompt: r3, tag: n4 }, id: a4 };
    return Pe((h4 = m3.params) == null ? void 0 : h4.prompt) && ((l4 = m3.params) == null || delete l4.prompt), Pe((d3 = m3.params) == null ? void 0 : d3.tag) && ((g4 = m3.params) == null || delete g4.tag), this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "message", direction: "outgoing", request: m3 }), this.relayer.request(m3);
  }
  removeRequestFromQueue(e2) {
    this.queue.delete(e2);
  }
  checkQueue() {
    this.queue.forEach(async (e2) => {
      const { topic: t, message: i3, opts: s2 } = e2;
      await this.publish(t, i3, s2);
    });
  }
  registerEventListeners() {
    this.relayer.core.heartbeat.on(r.pulse, () => {
      if (this.needsTransportRestart) {
        this.needsTransportRestart = false, this.relayer.events.emit(f2.connection_stalled);
        return;
      }
      this.checkQueue();
    }), this.relayer.on(f2.message_ack, (e2) => {
      this.removeRequestFromQueue(e2.id.toString());
    });
  }
};
var Ir2 = class {
  constructor() {
    this.map = /* @__PURE__ */ new Map(), this.set = (e2, t) => {
      const i3 = this.get(e2);
      this.exists(e2, t) || this.map.set(e2, [...i3, t]);
    }, this.get = (e2) => this.map.get(e2) || [], this.exists = (e2, t) => this.get(e2).includes(t), this.delete = (e2, t) => {
      if (typeof t > "u") {
        this.map.delete(e2);
        return;
      }
      if (!this.map.has(e2)) return;
      const i3 = this.get(e2);
      if (!this.exists(e2, t)) return;
      const s2 = i3.filter((r3) => r3 !== t);
      if (!s2.length) {
        this.map.delete(e2);
        return;
      }
      this.map.set(e2, s2);
    }, this.clear = () => {
      this.map.clear();
    };
  }
  get topics() {
    return Array.from(this.map.keys());
  }
};
var Cr2 = Object.defineProperty;
var Tr2 = Object.defineProperties;
var _r2 = Object.getOwnPropertyDescriptors;
var zt2 = Object.getOwnPropertySymbols;
var Rr2 = Object.prototype.hasOwnProperty;
var Sr2 = Object.prototype.propertyIsEnumerable;
var Nt = (o5, e2, t) => e2 in o5 ? Cr2(o5, e2, { enumerable: true, configurable: true, writable: true, value: t }) : o5[e2] = t;
var j3 = (o5, e2) => {
  for (var t in e2 || (e2 = {})) Rr2.call(e2, t) && Nt(o5, t, e2[t]);
  if (zt2) for (var t of zt2(e2)) Sr2.call(e2, t) && Nt(o5, t, e2[t]);
  return o5;
};
var fe2 = (o5, e2) => Tr2(o5, _r2(e2));
var Lt2 = class extends d {
  constructor(e2, t) {
    super(e2, t), this.relayer = e2, this.logger = t, this.subscriptions = /* @__PURE__ */ new Map(), this.topicMap = new Ir2(), this.events = new import_events7.EventEmitter(), this.name = bt, this.version = ft, this.pending = /* @__PURE__ */ new Map(), this.cached = [], this.initialized = false, this.pendingSubscriptionWatchLabel = "pending_sub_watch_label", this.pollingInterval = 20, this.storagePrefix = z2, this.subscribeTimeout = (0, import_time4.toMiliseconds)(import_time4.ONE_MINUTE), this.restartInProgress = false, this.batchSubscribeTopicsLimit = 500, this.pendingBatchMessages = [], this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), this.registerEventListeners(), this.clientId = await this.relayer.core.crypto.getClientId());
    }, this.subscribe = async (i3, s2) => {
      await this.restartToComplete(), this.isInitialized(), this.logger.debug("Subscribing Topic"), this.logger.trace({ type: "method", method: "subscribe", params: { topic: i3, opts: s2 } });
      try {
        const r3 = Su(s2), n4 = { topic: i3, relay: r3 };
        this.pending.set(i3, n4);
        const a4 = await this.rpcSubscribe(i3, r3);
        return typeof a4 == "string" && (this.onSubscribe(a4, n4), this.logger.debug("Successfully Subscribed Topic"), this.logger.trace({ type: "method", method: "subscribe", params: { topic: i3, opts: s2 } })), a4;
      } catch (r3) {
        throw this.logger.debug("Failed to Subscribe Topic"), this.logger.error(r3), r3;
      }
    }, this.unsubscribe = async (i3, s2) => {
      await this.restartToComplete(), this.isInitialized(), typeof (s2 == null ? void 0 : s2.id) < "u" ? await this.unsubscribeById(i3, s2.id, s2) : await this.unsubscribeByTopic(i3, s2);
    }, this.isSubscribed = async (i3) => {
      if (this.topics.includes(i3)) return true;
      const s2 = `${this.pendingSubscriptionWatchLabel}_${i3}`;
      return await new Promise((r3, n4) => {
        const a4 = new import_time4.Watch();
        a4.start(s2);
        const h4 = setInterval(() => {
          !this.pending.has(i3) && this.topics.includes(i3) && (clearInterval(h4), a4.stop(s2), r3(true)), a4.elapsed(s2) >= Et && (clearInterval(h4), a4.stop(s2), n4(new Error("Subscription resolution timeout")));
        }, this.pollingInterval);
      }).catch(() => false);
    }, this.on = (i3, s2) => {
      this.events.on(i3, s2);
    }, this.once = (i3, s2) => {
      this.events.once(i3, s2);
    }, this.off = (i3, s2) => {
      this.events.off(i3, s2);
    }, this.removeListener = (i3, s2) => {
      this.events.removeListener(i3, s2);
    }, this.start = async () => {
      await this.onConnect();
    }, this.stop = async () => {
      await this.onDisconnect();
    }, this.restart = async () => {
      this.restartInProgress = true, await this.restore(), await this.reset(), this.restartInProgress = false;
    }, this.relayer = e2, this.logger = E(t, this.name), this.clientId = "";
  }
  get context() {
    return y(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.relayer.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.subscriptions.size;
  }
  get ids() {
    return Array.from(this.subscriptions.keys());
  }
  get values() {
    return Array.from(this.subscriptions.values());
  }
  get topics() {
    return this.topicMap.topics;
  }
  hasSubscription(e2, t) {
    let i3 = false;
    try {
      i3 = this.getSubscription(e2).topic === t;
    } catch {
    }
    return i3;
  }
  onEnable() {
    this.cached = [], this.initialized = true;
  }
  onDisable() {
    this.cached = this.values, this.subscriptions.clear(), this.topicMap.clear();
  }
  async unsubscribeByTopic(e2, t) {
    const i3 = this.topicMap.get(e2);
    await Promise.all(i3.map(async (s2) => await this.unsubscribeById(e2, s2, t)));
  }
  async unsubscribeById(e2, t, i3) {
    this.logger.debug("Unsubscribing Topic"), this.logger.trace({ type: "method", method: "unsubscribe", params: { topic: e2, id: t, opts: i3 } });
    try {
      const s2 = Su(i3);
      await this.rpcUnsubscribe(e2, t, s2);
      const r3 = tr("USER_DISCONNECTED", `${this.name}, ${e2}`);
      await this.onUnsubscribe(e2, t, r3), this.logger.debug("Successfully Unsubscribed Topic"), this.logger.trace({ type: "method", method: "unsubscribe", params: { topic: e2, id: t, opts: i3 } });
    } catch (s2) {
      throw this.logger.debug("Failed to Unsubscribe Topic"), this.logger.error(s2), s2;
    }
  }
  async rpcSubscribe(e2, t) {
    const i3 = { method: Nu(t.protocol).subscribe, params: { topic: e2 } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: i3 });
    try {
      return await await u0(this.relayer.request(i3).catch((s2) => this.logger.warn(s2)), this.subscribeTimeout) ? yu(e2 + this.clientId) : null;
    } catch {
      this.logger.debug("Outgoing Relay Subscribe Payload stalled"), this.relayer.events.emit(f2.connection_stalled);
    }
    return null;
  }
  async rpcBatchSubscribe(e2) {
    if (!e2.length) return;
    const t = e2[0].relay, i3 = { method: Nu(t.protocol).batchSubscribe, params: { topics: e2.map((s2) => s2.topic) } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: i3 });
    try {
      return await await u0(this.relayer.request(i3).catch((s2) => this.logger.warn(s2)), this.subscribeTimeout);
    } catch {
      this.relayer.events.emit(f2.connection_stalled);
    }
  }
  async rpcBatchFetchMessages(e2) {
    if (!e2.length) return;
    const t = e2[0].relay, i3 = { method: Nu(t.protocol).batchFetchMessages, params: { topics: e2.map((r3) => r3.topic) } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: i3 });
    let s2;
    try {
      s2 = await await u0(this.relayer.request(i3).catch((r3) => this.logger.warn(r3)), this.subscribeTimeout);
    } catch {
      this.relayer.events.emit(f2.connection_stalled);
    }
    return s2;
  }
  rpcUnsubscribe(e2, t, i3) {
    const s2 = { method: Nu(i3.protocol).unsubscribe, params: { topic: e2, id: t } };
    return this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: s2 }), this.relayer.request(s2);
  }
  onSubscribe(e2, t) {
    this.setSubscription(e2, fe2(j3({}, t), { id: e2 })), this.pending.delete(t.topic);
  }
  onBatchSubscribe(e2) {
    e2.length && e2.forEach((t) => {
      this.setSubscription(t.id, j3({}, t)), this.pending.delete(t.topic);
    });
  }
  async onUnsubscribe(e2, t, i3) {
    this.events.removeAllListeners(t), this.hasSubscription(t, e2) && this.deleteSubscription(t, i3), await this.relayer.messages.del(e2);
  }
  async setRelayerSubscriptions(e2) {
    await this.relayer.core.storage.setItem(this.storageKey, e2);
  }
  async getRelayerSubscriptions() {
    return await this.relayer.core.storage.getItem(this.storageKey);
  }
  setSubscription(e2, t) {
    this.logger.debug("Setting subscription"), this.logger.trace({ type: "method", method: "setSubscription", id: e2, subscription: t }), this.addSubscription(e2, t);
  }
  addSubscription(e2, t) {
    this.subscriptions.set(e2, j3({}, t)), this.topicMap.set(t.topic, e2), this.events.emit(S2.created, t);
  }
  getSubscription(e2) {
    this.logger.debug("Getting subscription"), this.logger.trace({ type: "method", method: "getSubscription", id: e2 });
    const t = this.subscriptions.get(e2);
    if (!t) {
      const { message: i3 } = xe("NO_MATCHING_KEY", `${this.name}: ${e2}`);
      throw new Error(i3);
    }
    return t;
  }
  deleteSubscription(e2, t) {
    this.logger.debug("Deleting subscription"), this.logger.trace({ type: "method", method: "deleteSubscription", id: e2, reason: t });
    const i3 = this.getSubscription(e2);
    this.subscriptions.delete(e2), this.topicMap.delete(i3.topic, e2), this.events.emit(S2.deleted, fe2(j3({}, i3), { reason: t }));
  }
  async persist() {
    await this.setRelayerSubscriptions(this.values), this.events.emit(S2.sync);
  }
  async reset() {
    if (this.cached.length) {
      const e2 = Math.ceil(this.cached.length / this.batchSubscribeTopicsLimit);
      for (let t = 0; t < e2; t++) {
        const i3 = this.cached.splice(0, this.batchSubscribeTopicsLimit);
        await this.batchFetchMessages(i3), await this.batchSubscribe(i3);
      }
    }
    this.events.emit(S2.resubscribed);
  }
  async restore() {
    try {
      const e2 = await this.getRelayerSubscriptions();
      if (typeof e2 > "u" || !e2.length) return;
      if (this.subscriptions.size) {
        const { message: t } = xe("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`), new Error(t);
      }
      this.cached = e2, this.logger.debug(`Successfully Restored subscriptions for ${this.name}`), this.logger.trace({ type: "method", method: "restore", subscriptions: this.values });
    } catch (e2) {
      this.logger.debug(`Failed to Restore subscriptions for ${this.name}`), this.logger.error(e2);
    }
  }
  async batchSubscribe(e2) {
    if (!e2.length) return;
    const t = await this.rpcBatchSubscribe(e2);
    Er(t) && this.onBatchSubscribe(t.map((i3, s2) => fe2(j3({}, e2[s2]), { id: i3 })));
  }
  async batchFetchMessages(e2) {
    if (!e2.length) return;
    this.logger.trace(`Fetching batch messages for ${e2.length} subscriptions`);
    const t = await this.rpcBatchFetchMessages(e2);
    t && t.messages && (this.pendingBatchMessages = this.pendingBatchMessages.concat(t.messages));
  }
  async onConnect() {
    await this.restart(), this.onEnable();
  }
  onDisconnect() {
    this.onDisable();
  }
  async checkPending() {
    if (!this.initialized || !this.relayer.connected) return;
    const e2 = [];
    this.pending.forEach((t) => {
      e2.push(t);
    }), await this.batchSubscribe(e2), this.pendingBatchMessages.length && (await this.relayer.handleBatchMessageEvents(this.pendingBatchMessages), this.pendingBatchMessages = []);
  }
  registerEventListeners() {
    this.relayer.core.heartbeat.on(r.pulse, async () => {
      await this.checkPending();
    }), this.events.on(S2.created, async (e2) => {
      const t = S2.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), await this.persist();
    }), this.events.on(S2.deleted, async (e2) => {
      const t = S2.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), await this.persist();
    });
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
  async restartToComplete() {
    this.restartInProgress && await new Promise((e2) => {
      const t = setInterval(() => {
        this.restartInProgress || (clearInterval(t), e2());
      }, this.pollingInterval);
    });
  }
};
var Pr2 = Object.defineProperty;
var Ut2 = Object.getOwnPropertySymbols;
var xr2 = Object.prototype.hasOwnProperty;
var Or2 = Object.prototype.propertyIsEnumerable;
var Ft2 = (o5, e2, t) => e2 in o5 ? Pr2(o5, e2, { enumerable: true, configurable: true, writable: true, value: t }) : o5[e2] = t;
var Ar2 = (o5, e2) => {
  for (var t in e2 || (e2 = {})) xr2.call(e2, t) && Ft2(o5, t, e2[t]);
  if (Ut2) for (var t of Ut2(e2)) Or2.call(e2, t) && Ft2(o5, t, e2[t]);
  return o5;
};
var $t2 = class extends g {
  constructor(e2) {
    super(e2), this.protocol = "wc", this.version = 2, this.events = new import_events7.EventEmitter(), this.name = ut, this.transportExplicitlyClosed = false, this.initialized = false, this.connectionAttemptInProgress = false, this.connectionStatusPollingInterval = 20, this.staleConnectionErrors = ["socket hang up", "stalled", "interrupted"], this.hasExperiencedNetworkDisruption = false, this.requestsInFlight = /* @__PURE__ */ new Map(), this.heartBeatTimeout = (0, import_time4.toMiliseconds)(import_time4.THIRTY_SECONDS + import_time4.ONE_SECOND), this.request = async (t) => {
      var i3, s2;
      this.logger.debug("Publishing Request Payload");
      const r3 = t.id || getBigIntRpcId().toString();
      await this.toEstablishConnection();
      try {
        const n4 = this.provider.request(t);
        this.requestsInFlight.set(r3, { promise: n4, request: t }), this.logger.trace({ id: r3, method: t.method, topic: (i3 = t.params) == null ? void 0 : i3.topic }, "relayer.request - attempt to publish...");
        const a4 = await new Promise(async (h4, l4) => {
          const d3 = () => {
            l4(new Error(`relayer.request - publish interrupted, id: ${r3}`));
          };
          this.provider.on(E4.disconnect, d3);
          const g4 = await n4;
          this.provider.off(E4.disconnect, d3), h4(g4);
        });
        return this.logger.trace({ id: r3, method: t.method, topic: (s2 = t.params) == null ? void 0 : s2.topic }, "relayer.request - published"), a4;
      } catch (n4) {
        throw this.logger.debug(`Failed to Publish Request: ${r3}`), n4;
      } finally {
        this.requestsInFlight.delete(r3);
      }
    }, this.resetPingTimeout = () => {
      if (pi()) try {
        clearTimeout(this.pingTimeout), this.pingTimeout = setTimeout(() => {
          var t, i3, s2;
          (s2 = (i3 = (t = this.provider) == null ? void 0 : t.connection) == null ? void 0 : i3.socket) == null || s2.terminate();
        }, this.heartBeatTimeout);
      } catch (t) {
        this.logger.warn(t);
      }
    }, this.onPayloadHandler = (t) => {
      this.onProviderPayload(t), this.resetPingTimeout();
    }, this.onConnectHandler = () => {
      this.startPingTimeout(), this.events.emit(f2.connect);
    }, this.onDisconnectHandler = () => {
      this.onProviderDisconnect();
    }, this.onProviderErrorHandler = (t) => {
      this.logger.error(t), this.events.emit(f2.error, t), this.logger.info("Fatal socket error received, closing transport"), this.transportClose();
    }, this.registerProviderListeners = () => {
      this.provider.on(E4.payload, this.onPayloadHandler), this.provider.on(E4.connect, this.onConnectHandler), this.provider.on(E4.disconnect, this.onDisconnectHandler), this.provider.on(E4.error, this.onProviderErrorHandler);
    }, this.core = e2.core, this.logger = typeof e2.logger < "u" && typeof e2.logger != "string" ? E(e2.logger, this.name) : (0, import_pino.default)(k({ level: e2.logger || lt })), this.messages = new At(this.logger, e2.core), this.subscriber = new Lt2(this, this.logger), this.publisher = new vr2(this, this.logger), this.relayUrl = (e2 == null ? void 0 : e2.relayUrl) || me2, this.projectId = e2.projectId, this.bundleId = Wo(), this.provider = {};
  }
  async init() {
    this.logger.trace("Initialized"), this.registerEventListeners(), await Promise.all([this.messages.init(), this.subscriber.init()]);
    try {
      await this.transportOpen();
    } catch {
      this.logger.warn(`Connection via ${this.relayUrl} failed, attempting to connect via failover domain ${be2}...`), await this.restartTransport(be2);
    }
    this.initialized = true, setTimeout(async () => {
      this.subscriber.topics.length === 0 && this.subscriber.pending.size === 0 && (this.logger.info("No topics subscribed to after init, closing transport"), await this.transportClose(), this.transportExplicitlyClosed = false);
    }, Dt2);
  }
  get context() {
    return y(this.logger);
  }
  get connected() {
    var e2, t, i3;
    return ((i3 = (t = (e2 = this.provider) == null ? void 0 : e2.connection) == null ? void 0 : t.socket) == null ? void 0 : i3.readyState) === 1;
  }
  get connecting() {
    var e2, t, i3;
    return ((i3 = (t = (e2 = this.provider) == null ? void 0 : e2.connection) == null ? void 0 : t.socket) == null ? void 0 : i3.readyState) === 0;
  }
  async publish(e2, t, i3) {
    this.isInitialized(), await this.publisher.publish(e2, t, i3), await this.recordMessageEvent({ topic: e2, message: t, publishedAt: Date.now() });
  }
  async subscribe(e2, t) {
    var i3;
    this.isInitialized();
    let s2 = ((i3 = this.subscriber.topicMap.get(e2)) == null ? void 0 : i3[0]) || "", r3;
    const n4 = (a4) => {
      a4.topic === e2 && (this.subscriber.off(S2.created, n4), r3());
    };
    return await Promise.all([new Promise((a4) => {
      r3 = a4, this.subscriber.on(S2.created, n4);
    }), new Promise(async (a4) => {
      s2 = await this.subscriber.subscribe(e2, t) || s2, a4();
    })]), s2;
  }
  async unsubscribe(e2, t) {
    this.isInitialized(), await this.subscriber.unsubscribe(e2, t);
  }
  on(e2, t) {
    this.events.on(e2, t);
  }
  once(e2, t) {
    this.events.once(e2, t);
  }
  off(e2, t) {
    this.events.off(e2, t);
  }
  removeListener(e2, t) {
    this.events.removeListener(e2, t);
  }
  async transportDisconnect() {
    if (!this.hasExperiencedNetworkDisruption && this.connected && this.requestsInFlight.size > 0) try {
      await Promise.all(Array.from(this.requestsInFlight.values()).map((e2) => e2.promise));
    } catch (e2) {
      this.logger.warn(e2);
    }
    this.hasExperiencedNetworkDisruption || this.connected ? await u0(this.provider.disconnect(), 2e3, "provider.disconnect()").catch(() => this.onProviderDisconnect()) : this.onProviderDisconnect();
  }
  async transportClose() {
    this.transportExplicitlyClosed = true, await this.transportDisconnect();
  }
  async transportOpen(e2) {
    await this.confirmOnlineStateOrThrow(), e2 && e2 !== this.relayUrl && (this.relayUrl = e2, await this.transportDisconnect()), await this.createProvider(), this.connectionAttemptInProgress = true, this.transportExplicitlyClosed = false;
    try {
      await new Promise(async (t, i3) => {
        const s2 = () => {
          this.provider.off(E4.disconnect, s2), i3(new Error("Connection interrupted while trying to subscribe"));
        };
        this.provider.on(E4.disconnect, s2), await u0(this.provider.connect(), (0, import_time4.toMiliseconds)(import_time4.ONE_MINUTE), `Socket stalled when trying to connect to ${this.relayUrl}`).catch((r3) => {
          i3(r3);
        }), await this.subscriber.start(), this.hasExperiencedNetworkDisruption = false, t();
      });
    } catch (t) {
      this.logger.error(t);
      const i3 = t;
      if (this.hasExperiencedNetworkDisruption = true, !this.isConnectionStalled(i3.message)) throw t;
    } finally {
      this.connectionAttemptInProgress = false;
    }
  }
  async restartTransport(e2) {
    this.connectionAttemptInProgress || (this.relayUrl = e2 || this.relayUrl, await this.confirmOnlineStateOrThrow(), await this.transportClose(), await this.transportOpen());
  }
  async confirmOnlineStateOrThrow() {
    if (!await hh()) throw new Error("No internet connection detected. Please restart your network and try again.");
  }
  async handleBatchMessageEvents(e2) {
    if ((e2 == null ? void 0 : e2.length) === 0) {
      this.logger.trace("Batch message events is empty. Ignoring...");
      return;
    }
    const t = e2.sort((i3, s2) => i3.publishedAt - s2.publishedAt);
    this.logger.trace(`Batch of ${t.length} message events sorted`);
    for (const i3 of t) try {
      await this.onMessageEvent(i3);
    } catch (s2) {
      this.logger.warn(s2);
    }
    this.logger.trace(`Batch of ${t.length} message events processed`);
  }
  startPingTimeout() {
    var e2, t, i3, s2, r3;
    if (pi()) try {
      (t = (e2 = this.provider) == null ? void 0 : e2.connection) != null && t.socket && ((r3 = (s2 = (i3 = this.provider) == null ? void 0 : i3.connection) == null ? void 0 : s2.socket) == null || r3.once("ping", () => {
        this.resetPingTimeout();
      })), this.resetPingTimeout();
    } catch (n4) {
      this.logger.warn(n4);
    }
  }
  isConnectionStalled(e2) {
    return this.staleConnectionErrors.some((t) => e2.includes(t));
  }
  async createProvider() {
    this.provider.connection && this.unregisterProviderListeners();
    const e2 = await this.core.crypto.signJWT(this.relayUrl);
    this.provider = new o3(new f($o({ sdkVersion: pt, protocol: this.protocol, version: this.version, relayUrl: this.relayUrl, projectId: this.projectId, auth: e2, useOnCloseEvent: true, bundleId: this.bundleId }))), this.registerProviderListeners();
  }
  async recordMessageEvent(e2) {
    const { topic: t, message: i3 } = e2;
    await this.messages.set(t, i3);
  }
  async shouldIgnoreMessageEvent(e2) {
    const { topic: t, message: i3 } = e2;
    if (!i3 || i3.length === 0) return this.logger.debug(`Ignoring invalid/empty message: ${i3}`), true;
    if (!await this.subscriber.isSubscribed(t)) return this.logger.debug(`Ignoring message for non-subscribed topic ${t}`), true;
    const s2 = this.messages.has(t, i3);
    return s2 && this.logger.debug(`Ignoring duplicate message: ${i3}`), s2;
  }
  async onProviderPayload(e2) {
    if (this.logger.debug("Incoming Relay Payload"), this.logger.trace({ type: "payload", direction: "incoming", payload: e2 }), isJsonRpcRequest(e2)) {
      if (!e2.method.endsWith(dt)) return;
      const t = e2.params, { topic: i3, message: s2, publishedAt: r3 } = t.data, n4 = { topic: i3, message: s2, publishedAt: r3 };
      this.logger.debug("Emitting Relayer Payload"), this.logger.trace(Ar2({ type: "event", event: t.id }, n4)), this.events.emit(t.id, n4), await this.acknowledgePayload(e2), await this.onMessageEvent(n4);
    } else isJsonRpcResponse(e2) && this.events.emit(f2.message_ack, e2);
  }
  async onMessageEvent(e2) {
    await this.shouldIgnoreMessageEvent(e2) || (this.events.emit(f2.message, e2), await this.recordMessageEvent(e2));
  }
  async acknowledgePayload(e2) {
    const t = formatJsonRpcResult(e2.id, true);
    await this.provider.connection.send(t);
  }
  unregisterProviderListeners() {
    this.provider.off(E4.payload, this.onPayloadHandler), this.provider.off(E4.connect, this.onConnectHandler), this.provider.off(E4.disconnect, this.onDisconnectHandler), this.provider.off(E4.error, this.onProviderErrorHandler), clearTimeout(this.pingTimeout);
  }
  async registerEventListeners() {
    let e2 = await hh();
    ch(async (t) => {
      e2 !== t && (e2 = t, t ? await this.restartTransport().catch((i3) => this.logger.error(i3)) : (this.hasExperiencedNetworkDisruption = true, await this.transportDisconnect(), this.transportExplicitlyClosed = false));
    });
  }
  async onProviderDisconnect() {
    await this.subscriber.stop(), this.requestsInFlight.clear(), clearTimeout(this.pingTimeout), this.events.emit(f2.disconnect), this.connectionAttemptInProgress = false, !this.transportExplicitlyClosed && setTimeout(async () => {
      await this.transportOpen().catch((e2) => this.logger.error(e2));
    }, (0, import_time4.toMiliseconds)(gt));
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
  async toEstablishConnection() {
    await this.confirmOnlineStateOrThrow(), !this.connected && (this.connectionAttemptInProgress && await new Promise((e2) => {
      const t = setInterval(() => {
        this.connected && (clearInterval(t), e2());
      }, this.connectionStatusPollingInterval);
    }), await this.transportOpen());
  }
};
var zr2 = Object.defineProperty;
var Bt = Object.getOwnPropertySymbols;
var Nr2 = Object.prototype.hasOwnProperty;
var Lr2 = Object.prototype.propertyIsEnumerable;
var Mt = (o5, e2, t) => e2 in o5 ? zr2(o5, e2, { enumerable: true, configurable: true, writable: true, value: t }) : o5[e2] = t;
var kt2 = (o5, e2) => {
  for (var t in e2 || (e2 = {})) Nr2.call(e2, t) && Mt(o5, t, e2[t]);
  if (Bt) for (var t of Bt(e2)) Lr2.call(e2, t) && Mt(o5, t, e2[t]);
  return o5;
};
var Kt2 = class extends p {
  constructor(e2, t, i3, s2 = z2, r3 = void 0) {
    super(e2, t, i3, s2), this.core = e2, this.logger = t, this.name = i3, this.map = /* @__PURE__ */ new Map(), this.version = yt, this.cached = [], this.initialized = false, this.storagePrefix = z2, this.recentlyDeleted = [], this.recentlyDeletedLimit = 200, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((n4) => {
        this.getKey && n4 !== null && !Pe(n4) ? this.map.set(this.getKey(n4), n4) : Gu(n4) ? this.map.set(n4.id, n4) : Yu(n4) && this.map.set(n4.topic, n4);
      }), this.cached = [], this.initialized = true);
    }, this.set = async (n4, a4) => {
      this.isInitialized(), this.map.has(n4) ? await this.update(n4, a4) : (this.logger.debug("Setting value"), this.logger.trace({ type: "method", method: "set", key: n4, value: a4 }), this.map.set(n4, a4), await this.persist());
    }, this.get = (n4) => (this.isInitialized(), this.logger.debug("Getting value"), this.logger.trace({ type: "method", method: "get", key: n4 }), this.getData(n4)), this.getAll = (n4) => (this.isInitialized(), n4 ? this.values.filter((a4) => Object.keys(n4).every((h4) => (0, import_lodash.default)(a4[h4], n4[h4]))) : this.values), this.update = async (n4, a4) => {
      this.isInitialized(), this.logger.debug("Updating value"), this.logger.trace({ type: "method", method: "update", key: n4, update: a4 });
      const h4 = kt2(kt2({}, this.getData(n4)), a4);
      this.map.set(n4, h4), await this.persist();
    }, this.delete = async (n4, a4) => {
      this.isInitialized(), this.map.has(n4) && (this.logger.debug("Deleting value"), this.logger.trace({ type: "method", method: "delete", key: n4, reason: a4 }), this.map.delete(n4), this.addToRecentlyDeleted(n4), await this.persist());
    }, this.logger = E(t, this.name), this.storagePrefix = s2, this.getKey = r3;
  }
  get context() {
    return y(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.map.size;
  }
  get keys() {
    return Array.from(this.map.keys());
  }
  get values() {
    return Array.from(this.map.values());
  }
  addToRecentlyDeleted(e2) {
    this.recentlyDeleted.push(e2), this.recentlyDeleted.length >= this.recentlyDeletedLimit && this.recentlyDeleted.splice(0, this.recentlyDeletedLimit / 2);
  }
  async setDataStore(e2) {
    await this.core.storage.setItem(this.storageKey, e2);
  }
  async getDataStore() {
    return await this.core.storage.getItem(this.storageKey);
  }
  getData(e2) {
    const t = this.map.get(e2);
    if (!t) {
      if (this.recentlyDeleted.includes(e2)) {
        const { message: s2 } = xe("MISSING_OR_INVALID", `Record was recently deleted - ${this.name}: ${e2}`);
        throw this.logger.error(s2), new Error(s2);
      }
      const { message: i3 } = xe("NO_MATCHING_KEY", `${this.name}: ${e2}`);
      throw this.logger.error(i3), new Error(i3);
    }
    return t;
  }
  async persist() {
    await this.setDataStore(this.values);
  }
  async restore() {
    try {
      const e2 = await this.getDataStore();
      if (typeof e2 > "u" || !e2.length) return;
      if (this.map.size) {
        const { message: t } = xe("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e2, this.logger.debug(`Successfully Restored value for ${this.name}`), this.logger.trace({ type: "method", method: "restore", value: this.values });
    } catch (e2) {
      this.logger.debug(`Failed to Restore value for ${this.name}`), this.logger.error(e2);
    }
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var Vt = class {
  constructor(e2, t) {
    this.core = e2, this.logger = t, this.name = wt, this.version = vt, this.events = new import_events7.default(), this.initialized = false, this.storagePrefix = z2, this.ignoredPayloadTypes = [lr], this.registeredMethods = [], this.init = async () => {
      this.initialized || (await this.pairings.init(), await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.initialized = true, this.logger.trace("Initialized"));
    }, this.register = ({ methods: i3 }) => {
      this.isInitialized(), this.registeredMethods = [.../* @__PURE__ */ new Set([...this.registeredMethods, ...i3])];
    }, this.create = async (i3) => {
      this.isInitialized();
      const s2 = gu(), r3 = await this.core.crypto.setSymKey(s2), n4 = d0(import_time4.FIVE_MINUTES), a4 = { protocol: ct }, h4 = { topic: r3, expiry: n4, relay: a4, active: false }, l4 = Du({ protocol: this.core.protocol, version: this.core.version, topic: r3, symKey: s2, relay: a4, expiryTimestamp: n4, methods: i3 == null ? void 0 : i3.methods });
      return this.core.expirer.set(r3, n4), await this.pairings.set(r3, h4), await this.core.relayer.subscribe(r3), { topic: r3, uri: l4 };
    }, this.pair = async (i3) => {
      this.isInitialized(), this.isValidPair(i3);
      const { topic: s2, symKey: r3, relay: n4, expiryTimestamp: a4, methods: h4 } = Pu(i3.uri);
      let l4;
      if (this.pairings.keys.includes(s2) && (l4 = this.pairings.get(s2), l4.active)) throw new Error(`Pairing already exists: ${s2}. Please try again with a new connection URI.`);
      const d3 = a4 || d0(import_time4.FIVE_MINUTES), g4 = { topic: s2, relay: n4, expiry: d3, active: false, methods: h4 };
      return this.core.expirer.set(s2, d3), await this.pairings.set(s2, g4), i3.activatePairing && await this.activate({ topic: s2 }), this.events.emit(q.create, g4), this.core.crypto.keychain.has(s2) || await this.core.crypto.setSymKey(r3, s2), await this.core.relayer.subscribe(s2, { relay: n4 }), g4;
    }, this.activate = async ({ topic: i3 }) => {
      this.isInitialized();
      const s2 = d0(import_time4.THIRTY_DAYS);
      this.core.expirer.set(i3, s2), await this.pairings.update(i3, { active: true, expiry: s2 });
    }, this.ping = async (i3) => {
      this.isInitialized(), await this.isValidPing(i3);
      const { topic: s2 } = i3;
      if (this.pairings.keys.includes(s2)) {
        const r3 = await this.sendRequest(s2, "wc_pairingPing", {}), { done: n4, resolve: a4, reject: h4 } = a0();
        this.events.once(v0("pairing_ping", r3), ({ error: l4 }) => {
          l4 ? h4(l4) : a4();
        }), await n4();
      }
    }, this.updateExpiry = async ({ topic: i3, expiry: s2 }) => {
      this.isInitialized(), await this.pairings.update(i3, { expiry: s2 });
    }, this.updateMetadata = async ({ topic: i3, metadata: s2 }) => {
      this.isInitialized(), await this.pairings.update(i3, { peerMetadata: s2 });
    }, this.getPairings = () => (this.isInitialized(), this.pairings.values), this.disconnect = async (i3) => {
      this.isInitialized(), await this.isValidDisconnect(i3);
      const { topic: s2 } = i3;
      this.pairings.keys.includes(s2) && (await this.sendRequest(s2, "wc_pairingDelete", tr("USER_DISCONNECTED")), await this.deletePairing(s2));
    }, this.sendRequest = async (i3, s2, r3) => {
      const n4 = formatJsonRpcRequest(s2, r3), a4 = await this.core.crypto.encode(i3, n4), h4 = B[s2].req;
      return this.core.history.set(i3, n4), this.core.relayer.publish(i3, a4, h4), n4.id;
    }, this.sendResult = async (i3, s2, r3) => {
      const n4 = formatJsonRpcResult(i3, r3), a4 = await this.core.crypto.encode(s2, n4), h4 = await this.core.history.get(s2, i3), l4 = B[h4.request.method].res;
      await this.core.relayer.publish(s2, a4, l4), await this.core.history.resolve(n4);
    }, this.sendError = async (i3, s2, r3) => {
      const n4 = formatJsonRpcError(i3, r3), a4 = await this.core.crypto.encode(s2, n4), h4 = await this.core.history.get(s2, i3), l4 = B[h4.request.method] ? B[h4.request.method].res : B.unregistered_method.res;
      await this.core.relayer.publish(s2, a4, l4), await this.core.history.resolve(n4);
    }, this.deletePairing = async (i3, s2) => {
      await this.core.relayer.unsubscribe(i3), await Promise.all([this.pairings.delete(i3, tr("USER_DISCONNECTED")), this.core.crypto.deleteSymKey(i3), s2 ? Promise.resolve() : this.core.expirer.del(i3)]);
    }, this.cleanup = async () => {
      const i3 = this.pairings.getAll().filter((s2) => p0(s2.expiry));
      await Promise.all(i3.map((s2) => this.deletePairing(s2.topic)));
    }, this.onRelayEventRequest = (i3) => {
      const { topic: s2, payload: r3 } = i3;
      switch (r3.method) {
        case "wc_pairingPing":
          return this.onPairingPingRequest(s2, r3);
        case "wc_pairingDelete":
          return this.onPairingDeleteRequest(s2, r3);
        default:
          return this.onUnknownRpcMethodRequest(s2, r3);
      }
    }, this.onRelayEventResponse = async (i3) => {
      const { topic: s2, payload: r3 } = i3, n4 = (await this.core.history.get(s2, r3.id)).request.method;
      switch (n4) {
        case "wc_pairingPing":
          return this.onPairingPingResponse(s2, r3);
        default:
          return this.onUnknownRpcMethodResponse(n4);
      }
    }, this.onPairingPingRequest = async (i3, s2) => {
      const { id: r3 } = s2;
      try {
        this.isValidPing({ topic: i3 }), await this.sendResult(r3, i3, true), this.events.emit(q.ping, { id: r3, topic: i3 });
      } catch (n4) {
        await this.sendError(r3, i3, n4), this.logger.error(n4);
      }
    }, this.onPairingPingResponse = (i3, s2) => {
      const { id: r3 } = s2;
      setTimeout(() => {
        isJsonRpcResult(s2) ? this.events.emit(v0("pairing_ping", r3), {}) : isJsonRpcError(s2) && this.events.emit(v0("pairing_ping", r3), { error: s2.error });
      }, 500);
    }, this.onPairingDeleteRequest = async (i3, s2) => {
      const { id: r3 } = s2;
      try {
        this.isValidDisconnect({ topic: i3 }), await this.deletePairing(i3), this.events.emit(q.delete, { id: r3, topic: i3 });
      } catch (n4) {
        await this.sendError(r3, i3, n4), this.logger.error(n4);
      }
    }, this.onUnknownRpcMethodRequest = async (i3, s2) => {
      const { id: r3, method: n4 } = s2;
      try {
        if (this.registeredMethods.includes(n4)) return;
        const a4 = tr("WC_METHOD_UNSUPPORTED", n4);
        await this.sendError(r3, i3, a4), this.logger.error(a4);
      } catch (a4) {
        await this.sendError(r3, i3, a4), this.logger.error(a4);
      }
    }, this.onUnknownRpcMethodResponse = (i3) => {
      this.registeredMethods.includes(i3) || this.logger.error(tr("WC_METHOD_UNSUPPORTED", i3));
    }, this.isValidPair = (i3) => {
      var s2;
      if (!$u(i3)) {
        const { message: n4 } = xe("MISSING_OR_INVALID", `pair() params: ${i3}`);
        throw new Error(n4);
      }
      if (!Ju(i3.uri)) {
        const { message: n4 } = xe("MISSING_OR_INVALID", `pair() uri: ${i3.uri}`);
        throw new Error(n4);
      }
      const r3 = Pu(i3.uri);
      if (!((s2 = r3 == null ? void 0 : r3.relay) != null && s2.protocol)) {
        const { message: n4 } = xe("MISSING_OR_INVALID", "pair() uri#relay-protocol");
        throw new Error(n4);
      }
      if (!(r3 != null && r3.symKey)) {
        const { message: n4 } = xe("MISSING_OR_INVALID", "pair() uri#symKey");
        throw new Error(n4);
      }
      if (r3 != null && r3.expiryTimestamp && (0, import_time4.toMiliseconds)(r3 == null ? void 0 : r3.expiryTimestamp) < Date.now()) {
        const { message: n4 } = xe("EXPIRED", "pair() URI has expired. Please try again with a new connection URI.");
        throw new Error(n4);
      }
    }, this.isValidPing = async (i3) => {
      if (!$u(i3)) {
        const { message: r3 } = xe("MISSING_OR_INVALID", `ping() params: ${i3}`);
        throw new Error(r3);
      }
      const { topic: s2 } = i3;
      await this.isValidPairingTopic(s2);
    }, this.isValidDisconnect = async (i3) => {
      if (!$u(i3)) {
        const { message: r3 } = xe("MISSING_OR_INVALID", `disconnect() params: ${i3}`);
        throw new Error(r3);
      }
      const { topic: s2 } = i3;
      await this.isValidPairingTopic(s2);
    }, this.isValidPairingTopic = async (i3) => {
      if (!Gt(i3, false)) {
        const { message: s2 } = xe("MISSING_OR_INVALID", `pairing topic should be a string: ${i3}`);
        throw new Error(s2);
      }
      if (!this.pairings.keys.includes(i3)) {
        const { message: s2 } = xe("NO_MATCHING_KEY", `pairing topic doesn't exist: ${i3}`);
        throw new Error(s2);
      }
      if (p0(this.pairings.get(i3).expiry)) {
        await this.deletePairing(i3);
        const { message: s2 } = xe("EXPIRED", `pairing topic: ${i3}`);
        throw new Error(s2);
      }
    }, this.core = e2, this.logger = E(t, this.name), this.pairings = new Kt2(this.core, this.logger, this.name, this.storagePrefix);
  }
  get context() {
    return y(this.logger);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
  registerRelayerEvents() {
    this.core.relayer.on(f2.message, async (e2) => {
      const { topic: t, message: i3 } = e2;
      if (!this.pairings.keys.includes(t) || this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(i3))) return;
      const s2 = await this.core.crypto.decode(t, i3);
      try {
        isJsonRpcRequest(s2) ? (this.core.history.set(t, s2), this.onRelayEventRequest({ topic: t, payload: s2 })) : isJsonRpcResponse(s2) && (await this.core.history.resolve(s2), await this.onRelayEventResponse({ topic: t, payload: s2 }), this.core.history.delete(t, s2.id));
      } catch (r3) {
        this.logger.error(r3);
      }
    });
  }
  registerExpirerEvents() {
    this.core.expirer.on(C2.expired, async (e2) => {
      const { topic: t } = l0(e2.target);
      t && this.pairings.keys.includes(t) && (await this.deletePairing(t, true), this.events.emit(q.expire, { topic: t }));
    });
  }
};
var qt2 = class extends h2 {
  constructor(e2, t) {
    super(e2, t), this.core = e2, this.logger = t, this.records = /* @__PURE__ */ new Map(), this.events = new import_events7.EventEmitter(), this.name = It, this.version = Ct, this.cached = [], this.initialized = false, this.storagePrefix = z2, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i3) => this.records.set(i3.id, i3)), this.cached = [], this.registerEventListeners(), this.initialized = true);
    }, this.set = (i3, s2, r3) => {
      if (this.isInitialized(), this.logger.debug("Setting JSON-RPC request history record"), this.logger.trace({ type: "method", method: "set", topic: i3, request: s2, chainId: r3 }), this.records.has(s2.id)) return;
      const n4 = { id: s2.id, topic: i3, request: { method: s2.method, params: s2.params || null }, chainId: r3, expiry: d0(import_time4.THIRTY_DAYS) };
      this.records.set(n4.id, n4), this.persist(), this.events.emit(I.created, n4);
    }, this.resolve = async (i3) => {
      if (this.isInitialized(), this.logger.debug("Updating JSON-RPC response history record"), this.logger.trace({ type: "method", method: "update", response: i3 }), !this.records.has(i3.id)) return;
      const s2 = await this.getRecord(i3.id);
      typeof s2.response > "u" && (s2.response = isJsonRpcError(i3) ? { error: i3.error } : { result: i3.result }, this.records.set(s2.id, s2), this.persist(), this.events.emit(I.updated, s2));
    }, this.get = async (i3, s2) => (this.isInitialized(), this.logger.debug("Getting record"), this.logger.trace({ type: "method", method: "get", topic: i3, id: s2 }), await this.getRecord(s2)), this.delete = (i3, s2) => {
      this.isInitialized(), this.logger.debug("Deleting record"), this.logger.trace({ type: "method", method: "delete", id: s2 }), this.values.forEach((r3) => {
        if (r3.topic === i3) {
          if (typeof s2 < "u" && r3.id !== s2) return;
          this.records.delete(r3.id), this.events.emit(I.deleted, r3);
        }
      }), this.persist();
    }, this.exists = async (i3, s2) => (this.isInitialized(), this.records.has(s2) ? (await this.getRecord(s2)).topic === i3 : false), this.on = (i3, s2) => {
      this.events.on(i3, s2);
    }, this.once = (i3, s2) => {
      this.events.once(i3, s2);
    }, this.off = (i3, s2) => {
      this.events.off(i3, s2);
    }, this.removeListener = (i3, s2) => {
      this.events.removeListener(i3, s2);
    }, this.logger = E(t, this.name);
  }
  get context() {
    return y(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get size() {
    return this.records.size;
  }
  get keys() {
    return Array.from(this.records.keys());
  }
  get values() {
    return Array.from(this.records.values());
  }
  get pending() {
    const e2 = [];
    return this.values.forEach((t) => {
      if (typeof t.response < "u") return;
      const i3 = { topic: t.topic, request: formatJsonRpcRequest(t.request.method, t.request.params, t.id), chainId: t.chainId };
      return e2.push(i3);
    }), e2;
  }
  async setJsonRpcRecords(e2) {
    await this.core.storage.setItem(this.storageKey, e2);
  }
  async getJsonRpcRecords() {
    return await this.core.storage.getItem(this.storageKey);
  }
  getRecord(e2) {
    this.isInitialized();
    const t = this.records.get(e2);
    if (!t) {
      const { message: i3 } = xe("NO_MATCHING_KEY", `${this.name}: ${e2}`);
      throw new Error(i3);
    }
    return t;
  }
  async persist() {
    await this.setJsonRpcRecords(this.values), this.events.emit(I.sync);
  }
  async restore() {
    try {
      const e2 = await this.getJsonRpcRecords();
      if (typeof e2 > "u" || !e2.length) return;
      if (this.records.size) {
        const { message: t } = xe("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e2, this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({ type: "method", method: "restore", records: this.values });
    } catch (e2) {
      this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(e2);
    }
  }
  registerEventListeners() {
    this.events.on(I.created, (e2) => {
      const t = I.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e2 });
    }), this.events.on(I.updated, (e2) => {
      const t = I.updated;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e2 });
    }), this.events.on(I.deleted, (e2) => {
      const t = I.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e2 });
    }), this.core.heartbeat.on(r.pulse, () => {
      this.cleanup();
    });
  }
  cleanup() {
    try {
      this.isInitialized();
      let e2 = false;
      this.records.forEach((t) => {
        (0, import_time4.toMiliseconds)(t.expiry || 0) - Date.now() <= 0 && (this.logger.info(`Deleting expired history log: ${t.id}`), this.records.delete(t.id), this.events.emit(I.deleted, t, false), e2 = true);
      }), e2 && this.persist();
    } catch (e2) {
      this.logger.warn(e2);
    }
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var jt2 = class extends E3 {
  constructor(e2, t) {
    super(e2, t), this.core = e2, this.logger = t, this.expirations = /* @__PURE__ */ new Map(), this.events = new import_events7.EventEmitter(), this.name = Tt2, this.version = _t, this.cached = [], this.initialized = false, this.storagePrefix = z2, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i3) => this.expirations.set(i3.target, i3)), this.cached = [], this.registerEventListeners(), this.initialized = true);
    }, this.has = (i3) => {
      try {
        const s2 = this.formatTarget(i3);
        return typeof this.getExpiration(s2) < "u";
      } catch {
        return false;
      }
    }, this.set = (i3, s2) => {
      this.isInitialized();
      const r3 = this.formatTarget(i3), n4 = { target: r3, expiry: s2 };
      this.expirations.set(r3, n4), this.checkExpiry(r3, n4), this.events.emit(C2.created, { target: r3, expiration: n4 });
    }, this.get = (i3) => {
      this.isInitialized();
      const s2 = this.formatTarget(i3);
      return this.getExpiration(s2);
    }, this.del = (i3) => {
      if (this.isInitialized(), this.has(i3)) {
        const s2 = this.formatTarget(i3), r3 = this.getExpiration(s2);
        this.expirations.delete(s2), this.events.emit(C2.deleted, { target: s2, expiration: r3 });
      }
    }, this.on = (i3, s2) => {
      this.events.on(i3, s2);
    }, this.once = (i3, s2) => {
      this.events.once(i3, s2);
    }, this.off = (i3, s2) => {
      this.events.off(i3, s2);
    }, this.removeListener = (i3, s2) => {
      this.events.removeListener(i3, s2);
    }, this.logger = E(t, this.name);
  }
  get context() {
    return y(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.expirations.size;
  }
  get keys() {
    return Array.from(this.expirations.keys());
  }
  get values() {
    return Array.from(this.expirations.values());
  }
  formatTarget(e2) {
    if (typeof e2 == "string") return h0(e2);
    if (typeof e2 == "number") return c0(e2);
    const { message: t } = xe("UNKNOWN_TYPE", `Target type: ${typeof e2}`);
    throw new Error(t);
  }
  async setExpirations(e2) {
    await this.core.storage.setItem(this.storageKey, e2);
  }
  async getExpirations() {
    return await this.core.storage.getItem(this.storageKey);
  }
  async persist() {
    await this.setExpirations(this.values), this.events.emit(C2.sync);
  }
  async restore() {
    try {
      const e2 = await this.getExpirations();
      if (typeof e2 > "u" || !e2.length) return;
      if (this.expirations.size) {
        const { message: t } = xe("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e2, this.logger.debug(`Successfully Restored expirations for ${this.name}`), this.logger.trace({ type: "method", method: "restore", expirations: this.values });
    } catch (e2) {
      this.logger.debug(`Failed to Restore expirations for ${this.name}`), this.logger.error(e2);
    }
  }
  getExpiration(e2) {
    const t = this.expirations.get(e2);
    if (!t) {
      const { message: i3 } = xe("NO_MATCHING_KEY", `${this.name}: ${e2}`);
      throw this.logger.warn(i3), new Error(i3);
    }
    return t;
  }
  checkExpiry(e2, t) {
    const { expiry: i3 } = t;
    (0, import_time4.toMiliseconds)(i3) - Date.now() <= 0 && this.expire(e2, t);
  }
  expire(e2, t) {
    this.expirations.delete(e2), this.events.emit(C2.expired, { target: e2, expiration: t });
  }
  checkExpirations() {
    this.core.relayer.connected && this.expirations.forEach((e2, t) => this.checkExpiry(t, e2));
  }
  registerEventListeners() {
    this.core.heartbeat.on(r.pulse, () => this.checkExpirations()), this.events.on(C2.created, (e2) => {
      const t = C2.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), this.persist();
    }), this.events.on(C2.expired, (e2) => {
      const t = C2.expired;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), this.persist();
    }), this.events.on(C2.deleted, (e2) => {
      const t = C2.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), this.persist();
    });
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = xe("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var Gt2 = class extends y3 {
  constructor(e2, t) {
    super(e2, t), this.projectId = e2, this.logger = t, this.name = ee, this.initialized = false, this.queue = [], this.verifyDisabled = false, this.init = async (i3) => {
      if (this.verifyDisabled || er() || !pr()) return;
      const s2 = this.getVerifyUrl(i3 == null ? void 0 : i3.verifyUrl);
      this.verifyUrl !== s2 && this.removeIframe(), this.verifyUrl = s2;
      try {
        await this.createIframe();
      } catch (r3) {
        this.logger.info(`Verify iframe failed to load: ${this.verifyUrl}`), this.logger.info(r3);
      }
      if (!this.initialized) {
        this.removeIframe(), this.verifyUrl = te;
        try {
          await this.createIframe();
        } catch (r3) {
          this.logger.info(`Verify iframe failed to load: ${this.verifyUrl}`), this.logger.info(r3), this.verifyDisabled = true;
        }
      }
    }, this.register = async (i3) => {
      this.initialized ? this.sendPost(i3.attestationId) : (this.addToQueue(i3.attestationId), await this.init());
    }, this.resolve = async (i3) => {
      if (this.isDevEnv) return "";
      const s2 = this.getVerifyUrl(i3 == null ? void 0 : i3.verifyUrl);
      let r3;
      try {
        r3 = await this.fetchAttestation(i3.attestationId, s2);
      } catch (n4) {
        this.logger.info(`failed to resolve attestation: ${i3.attestationId} from url: ${s2}`), this.logger.info(n4), r3 = await this.fetchAttestation(i3.attestationId, te);
      }
      return r3;
    }, this.fetchAttestation = async (i3, s2) => {
      this.logger.info(`resolving attestation: ${i3} from url: ${s2}`);
      const r3 = this.startAbortTimer(import_time4.ONE_SECOND * 2), n4 = await fetch(`${s2}/attestation/${i3}`, { signal: this.abortController.signal });
      return clearTimeout(r3), n4.status === 200 ? await n4.json() : void 0;
    }, this.addToQueue = (i3) => {
      this.queue.push(i3);
    }, this.processQueue = () => {
      this.queue.length !== 0 && (this.queue.forEach((i3) => this.sendPost(i3)), this.queue = []);
    }, this.sendPost = (i3) => {
      var s2;
      try {
        if (!this.iframe) return;
        (s2 = this.iframe.contentWindow) == null || s2.postMessage(i3, "*"), this.logger.info(`postMessage sent: ${i3} ${this.verifyUrl}`);
      } catch {
      }
    }, this.createIframe = async () => {
      let i3;
      const s2 = (r3) => {
        r3.data === "verify_ready" && (this.onInit(), window.removeEventListener("message", s2), i3());
      };
      await Promise.race([new Promise((r3) => {
        const n4 = document.getElementById(ee);
        if (n4) return this.iframe = n4, this.onInit(), r3();
        window.addEventListener("message", s2);
        const a4 = document.createElement("iframe");
        a4.id = ee, a4.src = `${this.verifyUrl}/${this.projectId}`, a4.style.display = "none", document.body.append(a4), this.iframe = a4, i3 = r3;
      }), new Promise((r3, n4) => setTimeout(() => {
        window.removeEventListener("message", s2), n4("verify iframe load timeout");
      }, (0, import_time4.toMiliseconds)(import_time4.FIVE_SECONDS)))]);
    }, this.onInit = () => {
      this.initialized = true, this.processQueue();
    }, this.removeIframe = () => {
      this.iframe && (this.iframe.remove(), this.iframe = void 0, this.initialized = false);
    }, this.getVerifyUrl = (i3) => {
      let s2 = i3 || M;
      return Rt.includes(s2) || (this.logger.info(`verify url: ${s2}, not included in trusted list, assigning default: ${M}`), s2 = M), s2;
    }, this.logger = E(t, this.name), this.verifyUrl = M, this.abortController = new AbortController(), this.isDevEnv = pi() && process.env.IS_VITEST;
  }
  get context() {
    return y(this.logger);
  }
  startAbortTimer(e2) {
    return this.abortController = new AbortController(), setTimeout(() => this.abortController.abort(), (0, import_time4.toMiliseconds)(e2));
  }
};
var Yt = class extends v {
  constructor(e2, t) {
    super(e2, t), this.projectId = e2, this.logger = t, this.context = St, this.registerDeviceToken = async (i3) => {
      const { clientId: s2, token: r3, notificationType: n4, enableEncrypted: a4 = false } = i3, h4 = `${Pt}/${this.projectId}/clients`;
      await (0, import_isomorphic_unfetch.default)(h4, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: s2, type: n4, token: r3, always_raw: a4 }) });
    }, this.logger = E(t, this.context);
  }
};
var Ur2 = Object.defineProperty;
var Ht2 = Object.getOwnPropertySymbols;
var Fr2 = Object.prototype.hasOwnProperty;
var $r = Object.prototype.propertyIsEnumerable;
var Jt2 = (o5, e2, t) => e2 in o5 ? Ur2(o5, e2, { enumerable: true, configurable: true, writable: true, value: t }) : o5[e2] = t;
var Xt2 = (o5, e2) => {
  for (var t in e2 || (e2 = {})) Fr2.call(e2, t) && Jt2(o5, t, e2[t]);
  if (Ht2) for (var t of Ht2(e2)) $r.call(e2, t) && Jt2(o5, t, e2[t]);
  return o5;
};
var ie2 = class _ie extends n2 {
  constructor(e2) {
    var t;
    super(e2), this.protocol = De, this.version = Qe, this.name = Z, this.events = new import_events7.EventEmitter(), this.initialized = false, this.on = (n4, a4) => this.events.on(n4, a4), this.once = (n4, a4) => this.events.once(n4, a4), this.off = (n4, a4) => this.events.off(n4, a4), this.removeListener = (n4, a4) => this.events.removeListener(n4, a4), this.projectId = e2 == null ? void 0 : e2.projectId, this.relayUrl = (e2 == null ? void 0 : e2.relayUrl) || me2, this.customStoragePrefix = e2 != null && e2.customStoragePrefix ? `:${e2.customStoragePrefix}` : "";
    const i3 = k({ level: typeof (e2 == null ? void 0 : e2.logger) == "string" && e2.logger ? e2.logger : Ze2.logger }), { logger: s2, chunkLoggerController: r3 } = A({ opts: i3, maxSizeInBytes: e2 == null ? void 0 : e2.maxLogBlobSizeInBytes, loggerOverride: e2 == null ? void 0 : e2.logger });
    this.logChunkController = r3, (t = this.logChunkController) != null && t.downloadLogsBlobInBrowser && (window.downloadLogsBlobInBrowser = async () => {
      var n4, a4;
      (n4 = this.logChunkController) != null && n4.downloadLogsBlobInBrowser && ((a4 = this.logChunkController) == null || a4.downloadLogsBlobInBrowser({ clientId: await this.crypto.getClientId() }));
    }), this.logger = E(s2, this.name), this.heartbeat = new i(), this.crypto = new Ot2(this, this.logger, e2 == null ? void 0 : e2.keychain), this.history = new qt2(this, this.logger), this.expirer = new jt2(this, this.logger), this.storage = e2 != null && e2.storage ? e2.storage : new h(Xt2(Xt2({}, et), e2 == null ? void 0 : e2.storageOptions)), this.relayer = new $t2({ core: this, logger: this.logger, relayUrl: this.relayUrl, projectId: this.projectId }), this.pairing = new Vt(this, this.logger), this.verify = new Gt2(this.projectId || "", this.logger), this.echoClient = new Yt(this.projectId || "", this.logger);
  }
  static async init(e2) {
    const t = new _ie(e2);
    await t.initialize();
    const i3 = await t.crypto.getClientId();
    return await t.storage.setItem(mt, i3), t;
  }
  get context() {
    return y(this.logger);
  }
  async start() {
    this.initialized || await this.initialize();
  }
  async getLogsBlob() {
    var e2;
    return (e2 = this.logChunkController) == null ? void 0 : e2.logsToBlob({ clientId: await this.crypto.getClientId() });
  }
  async initialize() {
    this.logger.trace("Initialized");
    try {
      await this.crypto.init(), await this.history.init(), await this.expirer.init(), await this.relayer.init(), await this.heartbeat.init(), await this.pairing.init(), this.initialized = true, this.logger.info("Core Initialization Success");
    } catch (e2) {
      throw this.logger.warn(`Core Initialization Failure at epoch ${Date.now()}`, e2), this.logger.error(e2.message), e2;
    }
  }
};
var Br = ie2;

// node_modules/@walletconnect/sign-client/dist/index.es.js
var import_events8 = __toESM(require_events());
var import_time5 = __toESM(require_cjs());
var Re2 = "wc";
var Ee = 2;
var Se2 = "client";
var ie3 = `${Re2}@${Ee}:${Se2}:`;
var re2 = { name: Se2, logger: "error", controller: false, relayUrl: "wss://relay.walletconnect.com" };
var _e2 = "WALLETCONNECT_DEEPLINK_CHOICE";
var Ue2 = "proposal";
var Ge2 = "Proposal expired";
var ke2 = "session";
var L2 = import_time5.SEVEN_DAYS;
var Fe2 = "engine";
var f3 = { wc_sessionPropose: { req: { ttl: import_time5.FIVE_MINUTES, prompt: true, tag: 1100 }, res: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1101 } }, wc_sessionSettle: { req: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1102 }, res: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1103 } }, wc_sessionUpdate: { req: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1104 }, res: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1105 } }, wc_sessionExtend: { req: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1106 }, res: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1107 } }, wc_sessionRequest: { req: { ttl: import_time5.FIVE_MINUTES, prompt: true, tag: 1108 }, res: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1109 } }, wc_sessionEvent: { req: { ttl: import_time5.FIVE_MINUTES, prompt: true, tag: 1110 }, res: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1111 } }, wc_sessionDelete: { req: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1112 }, res: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1113 } }, wc_sessionPing: { req: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1114 }, res: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1115 } }, wc_sessionAuthenticate: { req: { ttl: import_time5.ONE_HOUR, prompt: true, tag: 1116 }, res: { ttl: import_time5.ONE_HOUR, prompt: false, tag: 1117 } } };
var ne2 = { min: import_time5.FIVE_MINUTES, max: import_time5.SEVEN_DAYS };
var D2 = { idle: "IDLE", active: "ACTIVE" };
var Qe2 = "request";
var je2 = ["wc_sessionPropose", "wc_sessionRequest", "wc_authRequest"];
var ze = "wc";
var He2 = "auth";
var Ye2 = "authKeys";
var Xe3 = "pairingTopics";
var Je2 = "requests";
var X2 = `${ze}@${1.5}:${He2}:`;
var J = `${X2}:PUB_KEY`;
var Yt2 = Object.defineProperty;
var Xt3 = Object.defineProperties;
var Jt3 = Object.getOwnPropertyDescriptors;
var Be3 = Object.getOwnPropertySymbols;
var Bt2 = Object.prototype.hasOwnProperty;
var Wt3 = Object.prototype.propertyIsEnumerable;
var We3 = (R2, n4, t) => n4 in R2 ? Yt2(R2, n4, { enumerable: true, configurable: true, writable: true, value: t }) : R2[n4] = t;
var y6 = (R2, n4) => {
  for (var t in n4 || (n4 = {})) Bt2.call(n4, t) && We3(R2, t, n4[t]);
  if (Be3) for (var t of Be3(n4)) Wt3.call(n4, t) && We3(R2, t, n4[t]);
  return R2;
};
var M2 = (R2, n4) => Xt3(R2, Jt3(n4));
var Zt2 = class extends w {
  constructor(n4) {
    super(n4), this.name = Fe2, this.events = new import_events8.default(), this.initialized = false, this.requestQueue = { state: D2.idle, queue: [] }, this.sessionRequestQueue = { state: D2.idle, queue: [] }, this.requestQueueDelay = import_time5.ONE_SECOND, this.expectedPairingMethodMap = /* @__PURE__ */ new Map(), this.recentlyDeletedMap = /* @__PURE__ */ new Map(), this.recentlyDeletedLimit = 200, this.init = async () => {
      this.initialized || (await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.registerPairingEvents(), this.client.core.pairing.register({ methods: Object.keys(f3) }), this.initialized = true, setTimeout(() => {
        this.sessionRequestQueue.queue = this.getPendingSessionRequests(), this.processSessionRequestQueue();
      }, (0, import_time5.toMiliseconds)(this.requestQueueDelay)));
    }, this.connect = async (t) => {
      await this.isInitialized();
      const e2 = M2(y6({}, t), { requiredNamespaces: t.requiredNamespaces || {}, optionalNamespaces: t.optionalNamespaces || {} });
      await this.isValidConnect(e2);
      const { pairingTopic: s2, requiredNamespaces: i3, optionalNamespaces: r3, sessionProperties: o5, relays: a4 } = e2;
      let c5 = s2, h4, p4 = false;
      try {
        c5 && (p4 = this.client.core.pairing.pairings.get(c5).active);
      } catch (P2) {
        throw this.client.logger.error(`connect() -> pairing.get(${c5}) failed`), P2;
      }
      if (!c5 || !p4) {
        const { topic: P2, uri: v4 } = await this.client.core.pairing.create();
        c5 = P2, h4 = v4;
      }
      if (!c5) {
        const { message: P2 } = xe("NO_MATCHING_KEY", `connect() pairing topic: ${c5}`);
        throw new Error(P2);
      }
      const g4 = await this.client.core.crypto.generateKeyPair(), d3 = f3.wc_sessionPropose.req.ttl || import_time5.FIVE_MINUTES, w4 = d0(d3), m3 = y6({ requiredNamespaces: i3, optionalNamespaces: r3, relays: a4 ?? [{ protocol: ct }], proposer: { publicKey: g4, metadata: this.client.metadata }, expiryTimestamp: w4 }, o5 && { sessionProperties: o5 }), { reject: E7, resolve: O4, done: S4 } = a0(d3, Ge2);
      this.events.once(v0("session_connect"), async ({ error: P2, session: v4 }) => {
        if (P2) E7(P2);
        else if (v4) {
          v4.self.publicKey = g4;
          const B2 = M2(y6({}, v4), { requiredNamespaces: m3.requiredNamespaces, optionalNamespaces: m3.optionalNamespaces });
          await this.client.session.set(v4.topic, B2), await this.setExpiry(v4.topic, v4.expiry), c5 && await this.client.core.pairing.updateMetadata({ topic: c5, metadata: v4.peer.metadata }), O4(B2);
        }
      });
      const N3 = await this.sendRequest({ topic: c5, method: "wc_sessionPropose", params: m3, throwOnFailedPublish: true });
      return await this.setProposal(N3, y6({ id: N3 }, m3)), { uri: h4, approval: S4 };
    }, this.pair = async (t) => {
      await this.isInitialized();
      try {
        return await this.client.core.pairing.pair(t);
      } catch (e2) {
        throw this.client.logger.error("pair() failed"), e2;
      }
    }, this.approve = async (t) => {
      await this.isInitialized();
      try {
        await this.isValidApprove(t);
      } catch (S4) {
        throw this.client.logger.error("approve() -> isValidApprove() failed"), S4;
      }
      const { id: e2, relayProtocol: s2, namespaces: i3, sessionProperties: r3, sessionConfig: o5 } = t;
      let a4;
      try {
        a4 = this.client.proposal.get(e2);
      } catch (S4) {
        throw this.client.logger.error(`approve() -> proposal.get(${e2}) failed`), S4;
      }
      let { pairingTopic: c5, proposer: h4, requiredNamespaces: p4, optionalNamespaces: g4 } = a4;
      c5 = c5 || "";
      const d3 = await this.client.core.crypto.generateKeyPair(), w4 = h4.publicKey, m3 = await this.client.core.crypto.generateSharedKey(d3, w4), E7 = y6(y6({ relay: { protocol: s2 ?? "irn" }, namespaces: i3, pairingTopic: c5, controller: { publicKey: d3, metadata: this.client.metadata }, expiry: d0(L2) }, r3 && { sessionProperties: r3 }), o5 && { sessionConfig: o5 });
      await this.client.core.relayer.subscribe(m3);
      const O4 = M2(y6({}, E7), { topic: m3, requiredNamespaces: p4, optionalNamespaces: g4, pairingTopic: c5, acknowledged: false, self: E7.controller, peer: { publicKey: h4.publicKey, metadata: h4.metadata }, controller: d3 });
      await this.client.session.set(m3, O4);
      try {
        await this.sendResult({ id: e2, topic: c5, result: { relay: { protocol: s2 ?? "irn" }, responderPublicKey: d3 }, throwOnFailedPublish: true }), await this.sendRequest({ topic: m3, method: "wc_sessionSettle", params: E7, throwOnFailedPublish: true });
      } catch (S4) {
        throw this.client.logger.error(S4), this.client.session.delete(m3, tr("USER_DISCONNECTED")), await this.client.core.relayer.unsubscribe(m3), S4;
      }
      return await this.client.core.pairing.updateMetadata({ topic: c5, metadata: h4.metadata }), await this.client.proposal.delete(e2, tr("USER_DISCONNECTED")), await this.client.core.pairing.activate({ topic: c5 }), await this.setExpiry(m3, d0(L2)), { topic: m3, acknowledged: () => new Promise((S4) => setTimeout(() => S4(this.client.session.get(m3)), 500)) };
    }, this.reject = async (t) => {
      await this.isInitialized();
      try {
        await this.isValidReject(t);
      } catch (r3) {
        throw this.client.logger.error("reject() -> isValidReject() failed"), r3;
      }
      const { id: e2, reason: s2 } = t;
      let i3;
      try {
        i3 = this.client.proposal.get(e2).pairingTopic;
      } catch (r3) {
        throw this.client.logger.error(`reject() -> proposal.get(${e2}) failed`), r3;
      }
      i3 && (await this.sendError({ id: e2, topic: i3, error: s2 }), await this.client.proposal.delete(e2, tr("USER_DISCONNECTED")));
    }, this.update = async (t) => {
      await this.isInitialized();
      try {
        await this.isValidUpdate(t);
      } catch (p4) {
        throw this.client.logger.error("update() -> isValidUpdate() failed"), p4;
      }
      const { topic: e2, namespaces: s2 } = t, { done: i3, resolve: r3, reject: o5 } = a0(), a4 = payloadId(), c5 = getBigIntRpcId().toString(), h4 = this.client.session.get(e2).namespaces;
      return this.events.once(v0("session_update", a4), ({ error: p4 }) => {
        p4 ? o5(p4) : r3();
      }), await this.client.session.update(e2, { namespaces: s2 }), await this.sendRequest({ topic: e2, method: "wc_sessionUpdate", params: { namespaces: s2 }, throwOnFailedPublish: true, clientRpcId: a4, relayRpcId: c5 }).catch((p4) => {
        this.client.logger.error(p4), this.client.session.update(e2, { namespaces: h4 }), o5(p4);
      }), { acknowledged: i3 };
    }, this.extend = async (t) => {
      await this.isInitialized();
      try {
        await this.isValidExtend(t);
      } catch (a4) {
        throw this.client.logger.error("extend() -> isValidExtend() failed"), a4;
      }
      const { topic: e2 } = t, s2 = payloadId(), { done: i3, resolve: r3, reject: o5 } = a0();
      return this.events.once(v0("session_extend", s2), ({ error: a4 }) => {
        a4 ? o5(a4) : r3();
      }), await this.setExpiry(e2, d0(L2)), this.sendRequest({ topic: e2, method: "wc_sessionExtend", params: {}, clientRpcId: s2, throwOnFailedPublish: true }).catch((a4) => {
        o5(a4);
      }), { acknowledged: i3 };
    }, this.request = async (t) => {
      await this.isInitialized();
      try {
        await this.isValidRequest(t);
      } catch (d3) {
        throw this.client.logger.error("request() -> isValidRequest() failed"), d3;
      }
      const { chainId: e2, request: s2, topic: i3, expiry: r3 = f3.wc_sessionRequest.req.ttl } = t, o5 = this.client.session.get(i3), a4 = payloadId(), c5 = getBigIntRpcId().toString(), { done: h4, resolve: p4, reject: g4 } = a0(r3, "Request expired. Please try again.");
      return this.events.once(v0("session_request", a4), ({ error: d3, result: w4 }) => {
        d3 ? g4(d3) : p4(w4);
      }), await Promise.all([new Promise(async (d3) => {
        await this.sendRequest({ clientRpcId: a4, relayRpcId: c5, topic: i3, method: "wc_sessionRequest", params: { request: M2(y6({}, s2), { expiryTimestamp: d0(r3) }), chainId: e2 }, expiry: r3, throwOnFailedPublish: true }).catch((w4) => g4(w4)), this.client.events.emit("session_request_sent", { topic: i3, request: s2, chainId: e2, id: a4 }), d3();
      }), new Promise(async (d3) => {
        var w4;
        if (!((w4 = o5.sessionConfig) != null && w4.disableDeepLink)) {
          const m3 = await g0(this.client.core.storage, _e2);
          m0({ id: a4, topic: i3, wcDeepLink: m3 });
        }
        d3();
      }), h4()]).then((d3) => d3[2]);
    }, this.respond = async (t) => {
      await this.isInitialized(), await this.isValidRespond(t);
      const { topic: e2, response: s2 } = t, { id: i3 } = s2;
      isJsonRpcResult(s2) ? await this.sendResult({ id: i3, topic: e2, result: s2.result, throwOnFailedPublish: true }) : isJsonRpcError(s2) && await this.sendError({ id: i3, topic: e2, error: s2.error }), this.cleanupAfterResponse(t);
    }, this.ping = async (t) => {
      await this.isInitialized();
      try {
        await this.isValidPing(t);
      } catch (s2) {
        throw this.client.logger.error("ping() -> isValidPing() failed"), s2;
      }
      const { topic: e2 } = t;
      if (this.client.session.keys.includes(e2)) {
        const s2 = payloadId(), i3 = getBigIntRpcId().toString(), { done: r3, resolve: o5, reject: a4 } = a0();
        this.events.once(v0("session_ping", s2), ({ error: c5 }) => {
          c5 ? a4(c5) : o5();
        }), await Promise.all([this.sendRequest({ topic: e2, method: "wc_sessionPing", params: {}, throwOnFailedPublish: true, clientRpcId: s2, relayRpcId: i3 }), r3()]);
      } else this.client.core.pairing.pairings.keys.includes(e2) && await this.client.core.pairing.ping({ topic: e2 });
    }, this.emit = async (t) => {
      await this.isInitialized(), await this.isValidEmit(t);
      const { topic: e2, event: s2, chainId: i3 } = t, r3 = getBigIntRpcId().toString();
      await this.sendRequest({ topic: e2, method: "wc_sessionEvent", params: { event: s2, chainId: i3 }, throwOnFailedPublish: true, relayRpcId: r3 });
    }, this.disconnect = async (t) => {
      await this.isInitialized(), await this.isValidDisconnect(t);
      const { topic: e2 } = t;
      if (this.client.session.keys.includes(e2)) await this.sendRequest({ topic: e2, method: "wc_sessionDelete", params: tr("USER_DISCONNECTED"), throwOnFailedPublish: true }), await this.deleteSession({ topic: e2, emitEvent: false });
      else if (this.client.core.pairing.pairings.keys.includes(e2)) await this.client.core.pairing.disconnect({ topic: e2 });
      else {
        const { message: s2 } = xe("MISMATCHED_TOPIC", `Session or pairing topic not found: ${e2}`);
        throw new Error(s2);
      }
    }, this.find = (t) => (this.isInitialized(), this.client.session.getAll().filter((e2) => Qu(e2, t))), this.getPendingSessionRequests = () => this.client.pendingRequest.getAll(), this.authenticate = async (t) => {
      this.isInitialized(), this.isValidAuthenticate(t);
      const { chains: e2, statement: s2 = "", uri: i3, domain: r3, nonce: o5, type: a4, exp: c5, nbf: h4, methods: p4 = [], expiry: g4 } = t, d3 = [...t.resources || []], { topic: w4, uri: m3 } = await this.client.core.pairing.create({ methods: ["wc_sessionAuthenticate"] });
      this.client.logger.info({ message: "Generated new pairing", pairing: { topic: w4, uri: m3 } });
      const E7 = await this.client.core.crypto.generateKeyPair(), O4 = bu(E7);
      if (await Promise.all([this.client.auth.authKeys.set(J, { responseTopic: O4, publicKey: E7 }), this.client.auth.pairingTopics.set(O4, { topic: O4, pairingTopic: w4 })]), await this.client.core.relayer.subscribe(O4), this.client.logger.info(`sending request to new pairing topic: ${w4}`), p4.length > 0) {
        const { namespace: T3 } = dn(e2[0]);
        let _2 = cu(T3, "request", p4);
        Qr(d3) && (_2 = lu(_2, d3.pop())), d3.push(_2);
      }
      const S4 = g4 && g4 > f3.wc_sessionAuthenticate.req.ttl ? g4 : f3.wc_sessionAuthenticate.req.ttl, N3 = { authPayload: { type: a4 ?? "caip122", chains: e2, statement: s2, aud: i3, domain: r3, version: "1", nonce: o5, iat: (/* @__PURE__ */ new Date()).toISOString(), exp: c5, nbf: h4, resources: d3 }, requester: { publicKey: E7, metadata: this.client.metadata }, expiryTimestamp: d0(S4) }, P2 = { eip155: { chains: e2, methods: [.../* @__PURE__ */ new Set(["personal_sign", ...p4])], events: ["chainChanged", "accountsChanged"] } }, v4 = { requiredNamespaces: {}, optionalNamespaces: P2, relays: [{ protocol: "irn" }], proposer: { publicKey: E7, metadata: this.client.metadata }, expiryTimestamp: d0(f3.wc_sessionPropose.req.ttl) }, { done: B2, resolve: Ie, reject: ae2 } = a0(S4, "Request expired"), W2 = async ({ error: T3, session: _2 }) => {
        if (this.events.off(v0("session_request", K3), ce2), T3) ae2(T3);
        else if (_2) {
          _2.self.publicKey = E7, await this.client.session.set(_2.topic, _2), await this.setExpiry(_2.topic, _2.expiry), w4 && await this.client.core.pairing.updateMetadata({ topic: w4, metadata: _2.peer.metadata });
          const j6 = this.client.session.get(_2.topic);
          await this.deleteProposal(Q4), Ie({ session: j6 });
        }
      }, ce2 = async (T3) => {
        if (await this.deletePendingAuthRequest(K3, { message: "fulfilled", code: 0 }), T3.error) {
          const z5 = tr("WC_METHOD_UNSUPPORTED", "wc_sessionAuthenticate");
          return T3.error.code === z5.code ? void 0 : (this.events.off(v0("session_connect"), W2), ae2(T3.error.message));
        }
        await this.deleteProposal(Q4), this.events.off(v0("session_connect"), W2);
        const { cacaos: _2, responder: j6 } = T3.result, le3 = [], fe3 = [];
        for (const z5 of _2) {
          await ou({ cacao: z5, projectId: this.client.core.projectId }) || (this.client.logger.error(z5, "Signature verification failed"), ae2(tr("SESSION_SETTLEMENT_FAILED", "Signature verification failed")));
          const { p: he2 } = z5, pe3 = Qr(he2.resources), qe2 = [fu(he2.iss)], et2 = Li(he2.iss);
          if (pe3) {
            const de3 = du(pe3), tt2 = pu(pe3);
            le3.push(...de3), qe2.push(...tt2);
          }
          for (const de3 of qe2) fe3.push(`${de3}:${et2}`);
        }
        const Z2 = await this.client.core.crypto.generateSharedKey(E7, j6.publicKey);
        let ee2;
        le3.length > 0 && (ee2 = { topic: Z2, acknowledged: true, self: { publicKey: E7, metadata: this.client.metadata }, peer: j6, controller: j6.publicKey, expiry: d0(L2), requiredNamespaces: {}, optionalNamespaces: {}, relay: { protocol: "irn" }, pairingTopic: w4, namespaces: ju([...new Set(le3)], [...new Set(fe3)]) }, await this.client.core.relayer.subscribe(Z2), await this.client.session.set(Z2, ee2), ee2 = this.client.session.get(Z2)), Ie({ auths: _2, session: ee2 });
      }, K3 = payloadId(), Q4 = payloadId();
      this.events.once(v0("session_connect"), W2), this.events.once(v0("session_request", K3), ce2);
      try {
        await Promise.all([this.sendRequest({ topic: w4, method: "wc_sessionAuthenticate", params: N3, expiry: t.expiry, throwOnFailedPublish: true, clientRpcId: K3 }), this.sendRequest({ topic: w4, method: "wc_sessionPropose", params: v4, expiry: f3.wc_sessionPropose.req.ttl, throwOnFailedPublish: true, clientRpcId: Q4 })]);
      } catch (T3) {
        throw this.events.off(v0("session_connect"), W2), this.events.off(v0("session_request", K3), ce2), T3;
      }
      return await this.setProposal(Q4, y6({ id: Q4 }, v4)), await this.setAuthRequest(K3, { request: M2(y6({}, N3), { verifyContext: {} }), pairingTopic: w4 }), { uri: m3, response: B2 };
    }, this.approveSessionAuthenticate = async (t) => {
      this.isInitialized();
      const { id: e2, auths: s2 } = t, i3 = this.getPendingAuthRequest(e2);
      if (!i3) throw new Error(`Could not find pending auth request with id ${e2}`);
      const r3 = i3.requester.publicKey, o5 = await this.client.core.crypto.generateKeyPair(), a4 = bu(r3), c5 = { type: lr, receiverPublicKey: r3, senderPublicKey: o5 }, h4 = [], p4 = [];
      for (const w4 of s2) {
        if (!await ou({ cacao: w4, projectId: this.client.core.projectId })) {
          const N3 = tr("SESSION_SETTLEMENT_FAILED", "Signature verification failed");
          throw await this.sendError({ id: e2, topic: a4, error: N3, encodeOpts: c5 }), new Error(N3.message);
        }
        const { p: m3 } = w4, E7 = Qr(m3.resources), O4 = [fu(m3.iss)], S4 = Li(m3.iss);
        if (E7) {
          const N3 = du(E7), P2 = pu(E7);
          h4.push(...N3), O4.push(...P2);
        }
        for (const N3 of O4) p4.push(`${N3}:${S4}`);
      }
      const g4 = await this.client.core.crypto.generateSharedKey(o5, r3);
      let d3;
      return (h4 == null ? void 0 : h4.length) > 0 && (d3 = { topic: g4, acknowledged: true, self: { publicKey: o5, metadata: this.client.metadata }, peer: { publicKey: r3, metadata: i3.requester.metadata }, controller: r3, expiry: d0(L2), authentication: s2, requiredNamespaces: {}, optionalNamespaces: {}, relay: { protocol: "irn" }, pairingTopic: "", namespaces: ju([...new Set(h4)], [...new Set(p4)]) }, await this.client.core.relayer.subscribe(g4), await this.client.session.set(g4, d3)), await this.sendResult({ topic: a4, id: e2, result: { cacaos: s2, responder: { publicKey: o5, metadata: this.client.metadata } }, encodeOpts: c5, throwOnFailedPublish: true }), await this.client.auth.requests.delete(e2, { message: "fullfilled", code: 0 }), await this.client.core.pairing.activate({ topic: i3.pairingTopic }), { session: d3 };
    }, this.rejectSessionAuthenticate = async (t) => {
      await this.isInitialized();
      const { id: e2, reason: s2 } = t, i3 = this.getPendingAuthRequest(e2);
      if (!i3) throw new Error(`Could not find pending auth request with id ${e2}`);
      const r3 = i3.requester.publicKey, o5 = await this.client.core.crypto.generateKeyPair(), a4 = bu(r3), c5 = { type: lr, receiverPublicKey: r3, senderPublicKey: o5 };
      await this.sendError({ id: e2, topic: a4, error: s2, encodeOpts: c5 }), await this.client.auth.requests.delete(e2, { message: "rejected", code: 0 }), await this.client.proposal.delete(e2, tr("USER_DISCONNECTED"));
    }, this.formatAuthMessage = (t) => {
      this.isInitialized();
      const { request: e2, iss: s2 } = t;
      return zf(e2, s2);
    }, this.cleanupDuplicatePairings = async (t) => {
      if (t.pairingTopic) try {
        const e2 = this.client.core.pairing.pairings.get(t.pairingTopic), s2 = this.client.core.pairing.pairings.getAll().filter((i3) => {
          var r3, o5;
          return ((r3 = i3.peerMetadata) == null ? void 0 : r3.url) && ((o5 = i3.peerMetadata) == null ? void 0 : o5.url) === t.peer.metadata.url && i3.topic && i3.topic !== e2.topic;
        });
        if (s2.length === 0) return;
        this.client.logger.info(`Cleaning up ${s2.length} duplicate pairing(s)`), await Promise.all(s2.map((i3) => this.client.core.pairing.disconnect({ topic: i3.topic }))), this.client.logger.info("Duplicate pairings clean up finished");
      } catch (e2) {
        this.client.logger.error(e2);
      }
    }, this.deleteSession = async (t) => {
      const { topic: e2, expirerHasDeleted: s2 = false, emitEvent: i3 = true, id: r3 = 0 } = t, { self: o5 } = this.client.session.get(e2);
      await this.client.core.relayer.unsubscribe(e2), await this.client.session.delete(e2, tr("USER_DISCONNECTED")), this.addToRecentlyDeleted(e2, "session"), this.client.core.crypto.keychain.has(o5.publicKey) && await this.client.core.crypto.deleteKeyPair(o5.publicKey), this.client.core.crypto.keychain.has(e2) && await this.client.core.crypto.deleteSymKey(e2), s2 || this.client.core.expirer.del(e2), this.client.core.storage.removeItem(_e2).catch((a4) => this.client.logger.warn(a4)), this.getPendingSessionRequests().forEach((a4) => {
        a4.topic === e2 && this.deletePendingSessionRequest(a4.id, tr("USER_DISCONNECTED"));
      }), i3 && this.client.events.emit("session_delete", { id: r3, topic: e2 });
    }, this.deleteProposal = async (t, e2) => {
      await Promise.all([this.client.proposal.delete(t, tr("USER_DISCONNECTED")), e2 ? Promise.resolve() : this.client.core.expirer.del(t)]), this.addToRecentlyDeleted(t, "proposal");
    }, this.deletePendingSessionRequest = async (t, e2, s2 = false) => {
      await Promise.all([this.client.pendingRequest.delete(t, e2), s2 ? Promise.resolve() : this.client.core.expirer.del(t)]), this.addToRecentlyDeleted(t, "request"), this.sessionRequestQueue.queue = this.sessionRequestQueue.queue.filter((i3) => i3.id !== t), s2 && (this.sessionRequestQueue.state = D2.idle, this.client.events.emit("session_request_expire", { id: t }));
    }, this.deletePendingAuthRequest = async (t, e2, s2 = false) => {
      await Promise.all([this.client.auth.requests.delete(t, e2), s2 ? Promise.resolve() : this.client.core.expirer.del(t)]);
    }, this.setExpiry = async (t, e2) => {
      this.client.session.keys.includes(t) && (this.client.core.expirer.set(t, e2), await this.client.session.update(t, { expiry: e2 }));
    }, this.setProposal = async (t, e2) => {
      this.client.core.expirer.set(t, d0(f3.wc_sessionPropose.req.ttl)), await this.client.proposal.set(t, e2);
    }, this.setAuthRequest = async (t, e2) => {
      const { request: s2, pairingTopic: i3 } = e2;
      this.client.core.expirer.set(t, s2.expiryTimestamp), await this.client.auth.requests.set(t, { authPayload: s2.authPayload, requester: s2.requester, expiryTimestamp: s2.expiryTimestamp, id: t, pairingTopic: i3, verifyContext: s2.verifyContext });
    }, this.setPendingSessionRequest = async (t) => {
      const { id: e2, topic: s2, params: i3, verifyContext: r3 } = t, o5 = i3.request.expiryTimestamp || d0(f3.wc_sessionRequest.req.ttl);
      this.client.core.expirer.set(e2, o5), await this.client.pendingRequest.set(e2, { id: e2, topic: s2, params: i3, verifyContext: r3 });
    }, this.sendRequest = async (t) => {
      const { topic: e2, method: s2, params: i3, expiry: r3, relayRpcId: o5, clientRpcId: a4, throwOnFailedPublish: c5 } = t, h4 = formatJsonRpcRequest(s2, i3, a4);
      if (pr() && je2.includes(s2)) {
        const d3 = yu(JSON.stringify(h4));
        this.client.core.verify.register({ attestationId: d3 });
      }
      let p4;
      try {
        p4 = await this.client.core.crypto.encode(e2, h4);
      } catch (d3) {
        throw await this.cleanup(), this.client.logger.error(`sendRequest() -> core.crypto.encode() for topic ${e2} failed`), d3;
      }
      const g4 = f3[s2].req;
      return r3 && (g4.ttl = r3), o5 && (g4.id = o5), this.client.core.history.set(e2, h4), c5 ? (g4.internal = M2(y6({}, g4.internal), { throwOnFailedPublish: true }), await this.client.core.relayer.publish(e2, p4, g4)) : this.client.core.relayer.publish(e2, p4, g4).catch((d3) => this.client.logger.error(d3)), h4.id;
    }, this.sendResult = async (t) => {
      const { id: e2, topic: s2, result: i3, throwOnFailedPublish: r3, encodeOpts: o5 } = t, a4 = formatJsonRpcResult(e2, i3);
      let c5;
      try {
        c5 = await this.client.core.crypto.encode(s2, a4, o5);
      } catch (g4) {
        throw await this.cleanup(), this.client.logger.error(`sendResult() -> core.crypto.encode() for topic ${s2} failed`), g4;
      }
      let h4;
      try {
        h4 = await this.client.core.history.get(s2, e2);
      } catch (g4) {
        throw this.client.logger.error(`sendResult() -> history.get(${s2}, ${e2}) failed`), g4;
      }
      const p4 = f3[h4.request.method].res;
      r3 ? (p4.internal = M2(y6({}, p4.internal), { throwOnFailedPublish: true }), await this.client.core.relayer.publish(s2, c5, p4)) : this.client.core.relayer.publish(s2, c5, p4).catch((g4) => this.client.logger.error(g4)), await this.client.core.history.resolve(a4);
    }, this.sendError = async (t) => {
      const { id: e2, topic: s2, error: i3, encodeOpts: r3 } = t, o5 = formatJsonRpcError(e2, i3);
      let a4;
      try {
        a4 = await this.client.core.crypto.encode(s2, o5, r3);
      } catch (p4) {
        throw await this.cleanup(), this.client.logger.error(`sendError() -> core.crypto.encode() for topic ${s2} failed`), p4;
      }
      let c5;
      try {
        c5 = await this.client.core.history.get(s2, e2);
      } catch (p4) {
        throw this.client.logger.error(`sendError() -> history.get(${s2}, ${e2}) failed`), p4;
      }
      const h4 = f3[c5.request.method].res;
      this.client.core.relayer.publish(s2, a4, h4), await this.client.core.history.resolve(o5);
    }, this.cleanup = async () => {
      const t = [], e2 = [];
      this.client.session.getAll().forEach((s2) => {
        let i3 = false;
        p0(s2.expiry) && (i3 = true), this.client.core.crypto.keychain.has(s2.topic) || (i3 = true), i3 && t.push(s2.topic);
      }), this.client.proposal.getAll().forEach((s2) => {
        p0(s2.expiryTimestamp) && e2.push(s2.id);
      }), await Promise.all([...t.map((s2) => this.deleteSession({ topic: s2 })), ...e2.map((s2) => this.deleteProposal(s2))]);
    }, this.onRelayEventRequest = async (t) => {
      this.requestQueue.queue.push(t), await this.processRequestsQueue();
    }, this.processRequestsQueue = async () => {
      if (this.requestQueue.state === D2.active) {
        this.client.logger.info("Request queue already active, skipping...");
        return;
      }
      for (this.client.logger.info(`Request queue starting with ${this.requestQueue.queue.length} requests`); this.requestQueue.queue.length > 0; ) {
        this.requestQueue.state = D2.active;
        const t = this.requestQueue.queue.shift();
        if (t) try {
          this.processRequest(t), await new Promise((e2) => setTimeout(e2, 300));
        } catch (e2) {
          this.client.logger.warn(e2);
        }
      }
      this.requestQueue.state = D2.idle;
    }, this.processRequest = (t) => {
      const { topic: e2, payload: s2 } = t, i3 = s2.method;
      if (!this.shouldIgnorePairingRequest({ topic: e2, requestMethod: i3 })) switch (i3) {
        case "wc_sessionPropose":
          return this.onSessionProposeRequest(e2, s2);
        case "wc_sessionSettle":
          return this.onSessionSettleRequest(e2, s2);
        case "wc_sessionUpdate":
          return this.onSessionUpdateRequest(e2, s2);
        case "wc_sessionExtend":
          return this.onSessionExtendRequest(e2, s2);
        case "wc_sessionPing":
          return this.onSessionPingRequest(e2, s2);
        case "wc_sessionDelete":
          return this.onSessionDeleteRequest(e2, s2);
        case "wc_sessionRequest":
          return this.onSessionRequest(e2, s2);
        case "wc_sessionEvent":
          return this.onSessionEventRequest(e2, s2);
        case "wc_sessionAuthenticate":
          return this.onSessionAuthenticateRequest(e2, s2);
        default:
          return this.client.logger.info(`Unsupported request method ${i3}`);
      }
    }, this.onRelayEventResponse = async (t) => {
      const { topic: e2, payload: s2 } = t, i3 = (await this.client.core.history.get(e2, s2.id)).request.method;
      switch (i3) {
        case "wc_sessionPropose":
          return this.onSessionProposeResponse(e2, s2);
        case "wc_sessionSettle":
          return this.onSessionSettleResponse(e2, s2);
        case "wc_sessionUpdate":
          return this.onSessionUpdateResponse(e2, s2);
        case "wc_sessionExtend":
          return this.onSessionExtendResponse(e2, s2);
        case "wc_sessionPing":
          return this.onSessionPingResponse(e2, s2);
        case "wc_sessionRequest":
          return this.onSessionRequestResponse(e2, s2);
        case "wc_sessionAuthenticate":
          return this.onSessionAuthenticateResponse(e2, s2);
        default:
          return this.client.logger.info(`Unsupported response method ${i3}`);
      }
    }, this.onRelayEventUnknownPayload = (t) => {
      const { topic: e2 } = t, { message: s2 } = xe("MISSING_OR_INVALID", `Decoded payload on topic ${e2} is not identifiable as a JSON-RPC request or a response.`);
      throw new Error(s2);
    }, this.shouldIgnorePairingRequest = (t) => {
      const { topic: e2, requestMethod: s2 } = t, i3 = this.expectedPairingMethodMap.get(e2);
      return !i3 || i3.includes(s2) ? false : !!(i3.includes("wc_sessionAuthenticate") && this.client.events.listenerCount("session_authenticate") > 0);
    }, this.onSessionProposeRequest = async (t, e2) => {
      const { params: s2, id: i3 } = e2;
      try {
        this.isValidConnect(y6({}, e2.params));
        const r3 = s2.expiryTimestamp || d0(f3.wc_sessionPropose.req.ttl), o5 = y6({ id: i3, pairingTopic: t, expiryTimestamp: r3 }, s2);
        await this.setProposal(i3, o5);
        const a4 = yu(JSON.stringify(e2)), c5 = await this.getVerifyContext(a4, o5.proposer.metadata);
        this.client.events.emit("session_proposal", { id: i3, params: o5, verifyContext: c5 });
      } catch (r3) {
        await this.sendError({ id: i3, topic: t, error: r3 }), this.client.logger.error(r3);
      }
    }, this.onSessionProposeResponse = async (t, e2) => {
      const { id: s2 } = e2;
      if (isJsonRpcResult(e2)) {
        const { result: i3 } = e2;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", result: i3 });
        const r3 = this.client.proposal.get(s2);
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", proposal: r3 });
        const o5 = r3.proposer.publicKey;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", selfPublicKey: o5 });
        const a4 = i3.responderPublicKey;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", peerPublicKey: a4 });
        const c5 = await this.client.core.crypto.generateSharedKey(o5, a4);
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", sessionTopic: c5 });
        const h4 = await this.client.core.relayer.subscribe(c5);
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", subscriptionId: h4 }), await this.client.core.pairing.activate({ topic: t });
      } else if (isJsonRpcError(e2)) {
        await this.client.proposal.delete(s2, tr("USER_DISCONNECTED"));
        const i3 = v0("session_connect");
        if (this.events.listenerCount(i3) === 0) throw new Error(`emitting ${i3} without any listeners, 954`);
        this.events.emit(v0("session_connect"), { error: e2.error });
      }
    }, this.onSessionSettleRequest = async (t, e2) => {
      const { id: s2, params: i3 } = e2;
      try {
        this.isValidSessionSettleRequest(i3);
        const { relay: r3, controller: o5, expiry: a4, namespaces: c5, sessionProperties: h4, pairingTopic: p4, sessionConfig: g4 } = e2.params, d3 = y6(y6({ topic: t, relay: r3, expiry: a4, namespaces: c5, acknowledged: true, pairingTopic: p4, requiredNamespaces: {}, optionalNamespaces: {}, controller: o5.publicKey, self: { publicKey: "", metadata: this.client.metadata }, peer: { publicKey: o5.publicKey, metadata: o5.metadata } }, h4 && { sessionProperties: h4 }), g4 && { sessionConfig: g4 });
        await this.sendResult({ id: e2.id, topic: t, result: true, throwOnFailedPublish: true });
        const w4 = v0("session_connect");
        if (this.events.listenerCount(w4) === 0) throw new Error(`emitting ${w4} without any listeners 997`);
        this.events.emit(v0("session_connect"), { session: d3 }), this.cleanupDuplicatePairings(d3);
      } catch (r3) {
        await this.sendError({ id: s2, topic: t, error: r3 }), this.client.logger.error(r3);
      }
    }, this.onSessionSettleResponse = async (t, e2) => {
      const { id: s2 } = e2;
      isJsonRpcResult(e2) ? (await this.client.session.update(t, { acknowledged: true }), this.events.emit(v0("session_approve", s2), {})) : isJsonRpcError(e2) && (await this.client.session.delete(t, tr("USER_DISCONNECTED")), this.events.emit(v0("session_approve", s2), { error: e2.error }));
    }, this.onSessionUpdateRequest = async (t, e2) => {
      const { params: s2, id: i3 } = e2;
      try {
        const r3 = `${t}_session_update`, o5 = lh.get(r3);
        if (o5 && this.isRequestOutOfSync(o5, i3)) {
          this.client.logger.info(`Discarding out of sync request - ${i3}`), this.sendError({ id: i3, topic: t, error: tr("INVALID_UPDATE_REQUEST") });
          return;
        }
        this.isValidUpdate(y6({ topic: t }, s2));
        try {
          lh.set(r3, i3), await this.client.session.update(t, { namespaces: s2.namespaces }), await this.sendResult({ id: i3, topic: t, result: true, throwOnFailedPublish: true });
        } catch (a4) {
          throw lh.delete(r3), a4;
        }
        this.client.events.emit("session_update", { id: i3, topic: t, params: s2 });
      } catch (r3) {
        await this.sendError({ id: i3, topic: t, error: r3 }), this.client.logger.error(r3);
      }
    }, this.isRequestOutOfSync = (t, e2) => parseInt(e2.toString().slice(0, -3)) <= parseInt(t.toString().slice(0, -3)), this.onSessionUpdateResponse = (t, e2) => {
      const { id: s2 } = e2, i3 = v0("session_update", s2);
      if (this.events.listenerCount(i3) === 0) throw new Error(`emitting ${i3} without any listeners`);
      isJsonRpcResult(e2) ? this.events.emit(v0("session_update", s2), {}) : isJsonRpcError(e2) && this.events.emit(v0("session_update", s2), { error: e2.error });
    }, this.onSessionExtendRequest = async (t, e2) => {
      const { id: s2 } = e2;
      try {
        this.isValidExtend({ topic: t }), await this.setExpiry(t, d0(L2)), await this.sendResult({ id: s2, topic: t, result: true, throwOnFailedPublish: true }), this.client.events.emit("session_extend", { id: s2, topic: t });
      } catch (i3) {
        await this.sendError({ id: s2, topic: t, error: i3 }), this.client.logger.error(i3);
      }
    }, this.onSessionExtendResponse = (t, e2) => {
      const { id: s2 } = e2, i3 = v0("session_extend", s2);
      if (this.events.listenerCount(i3) === 0) throw new Error(`emitting ${i3} without any listeners`);
      isJsonRpcResult(e2) ? this.events.emit(v0("session_extend", s2), {}) : isJsonRpcError(e2) && this.events.emit(v0("session_extend", s2), { error: e2.error });
    }, this.onSessionPingRequest = async (t, e2) => {
      const { id: s2 } = e2;
      try {
        this.isValidPing({ topic: t }), await this.sendResult({ id: s2, topic: t, result: true, throwOnFailedPublish: true }), this.client.events.emit("session_ping", { id: s2, topic: t });
      } catch (i3) {
        await this.sendError({ id: s2, topic: t, error: i3 }), this.client.logger.error(i3);
      }
    }, this.onSessionPingResponse = (t, e2) => {
      const { id: s2 } = e2, i3 = v0("session_ping", s2);
      if (this.events.listenerCount(i3) === 0) throw new Error(`emitting ${i3} without any listeners`);
      setTimeout(() => {
        isJsonRpcResult(e2) ? this.events.emit(v0("session_ping", s2), {}) : isJsonRpcError(e2) && this.events.emit(v0("session_ping", s2), { error: e2.error });
      }, 500);
    }, this.onSessionDeleteRequest = async (t, e2) => {
      const { id: s2 } = e2;
      try {
        this.isValidDisconnect({ topic: t, reason: e2.params }), await Promise.all([new Promise((i3) => {
          this.client.core.relayer.once(f2.publish, async () => {
            i3(await this.deleteSession({ topic: t, id: s2 }));
          });
        }), this.sendResult({ id: s2, topic: t, result: true, throwOnFailedPublish: true }), this.cleanupPendingSentRequestsForTopic({ topic: t, error: tr("USER_DISCONNECTED") })]);
      } catch (i3) {
        this.client.logger.error(i3);
      }
    }, this.onSessionRequest = async (t, e2) => {
      var s2;
      const { id: i3, params: r3 } = e2;
      try {
        await this.isValidRequest(y6({ topic: t }, r3));
        const o5 = yu(JSON.stringify(formatJsonRpcRequest("wc_sessionRequest", r3, i3))), a4 = this.client.session.get(t), c5 = await this.getVerifyContext(o5, a4.peer.metadata), h4 = { id: i3, topic: t, params: r3, verifyContext: c5 };
        await this.setPendingSessionRequest(h4), (s2 = this.client.signConfig) != null && s2.disableRequestQueue ? this.emitSessionRequest(h4) : (this.addSessionRequestToSessionRequestQueue(h4), this.processSessionRequestQueue());
      } catch (o5) {
        await this.sendError({ id: i3, topic: t, error: o5 }), this.client.logger.error(o5);
      }
    }, this.onSessionRequestResponse = (t, e2) => {
      const { id: s2 } = e2, i3 = v0("session_request", s2);
      if (this.events.listenerCount(i3) === 0) throw new Error(`emitting ${i3} without any listeners`);
      isJsonRpcResult(e2) ? this.events.emit(v0("session_request", s2), { result: e2.result }) : isJsonRpcError(e2) && this.events.emit(v0("session_request", s2), { error: e2.error });
    }, this.onSessionEventRequest = async (t, e2) => {
      const { id: s2, params: i3 } = e2;
      try {
        const r3 = `${t}_session_event_${i3.event.name}`, o5 = lh.get(r3);
        if (o5 && this.isRequestOutOfSync(o5, s2)) {
          this.client.logger.info(`Discarding out of sync request - ${s2}`);
          return;
        }
        this.isValidEmit(y6({ topic: t }, i3)), this.client.events.emit("session_event", { id: s2, topic: t, params: i3 }), lh.set(r3, s2);
      } catch (r3) {
        await this.sendError({ id: s2, topic: t, error: r3 }), this.client.logger.error(r3);
      }
    }, this.onSessionAuthenticateResponse = (t, e2) => {
      const { id: s2 } = e2;
      this.client.logger.trace({ type: "method", method: "onSessionAuthenticateResponse", topic: t, payload: e2 }), isJsonRpcResult(e2) ? this.events.emit(v0("session_request", s2), { result: e2.result }) : isJsonRpcError(e2) && this.events.emit(v0("session_request", s2), { error: e2.error });
    }, this.onSessionAuthenticateRequest = async (t, e2) => {
      const { requester: s2, authPayload: i3, expiryTimestamp: r3 } = e2.params, o5 = yu(JSON.stringify(e2)), a4 = await this.getVerifyContext(o5, this.client.metadata), c5 = { requester: s2, pairingTopic: t, id: e2.id, authPayload: i3, verifyContext: a4, expiryTimestamp: r3 };
      await this.setAuthRequest(e2.id, { request: c5, pairingTopic: t }), this.client.events.emit("session_authenticate", { topic: t, params: e2.params, id: e2.id });
    }, this.addSessionRequestToSessionRequestQueue = (t) => {
      this.sessionRequestQueue.queue.push(t);
    }, this.cleanupAfterResponse = (t) => {
      this.deletePendingSessionRequest(t.response.id, { message: "fulfilled", code: 0 }), setTimeout(() => {
        this.sessionRequestQueue.state = D2.idle, this.processSessionRequestQueue();
      }, (0, import_time5.toMiliseconds)(this.requestQueueDelay));
    }, this.cleanupPendingSentRequestsForTopic = ({ topic: t, error: e2 }) => {
      const s2 = this.client.core.history.pending;
      s2.length > 0 && s2.filter((i3) => i3.topic === t && i3.request.method === "wc_sessionRequest").forEach((i3) => {
        const r3 = i3.request.id, o5 = v0("session_request", r3);
        if (this.events.listenerCount(o5) === 0) throw new Error(`emitting ${o5} without any listeners`);
        this.events.emit(v0("session_request", i3.request.id), { error: e2 });
      });
    }, this.processSessionRequestQueue = () => {
      if (this.sessionRequestQueue.state === D2.active) {
        this.client.logger.info("session request queue is already active.");
        return;
      }
      const t = this.sessionRequestQueue.queue[0];
      if (!t) {
        this.client.logger.info("session request queue is empty.");
        return;
      }
      try {
        this.sessionRequestQueue.state = D2.active, this.emitSessionRequest(t);
      } catch (e2) {
        this.client.logger.error(e2);
      }
    }, this.emitSessionRequest = (t) => {
      this.client.events.emit("session_request", t);
    }, this.onPairingCreated = (t) => {
      if (t.methods && this.expectedPairingMethodMap.set(t.topic, t.methods), t.active) return;
      const e2 = this.client.proposal.getAll().find((s2) => s2.pairingTopic === t.topic);
      e2 && this.onSessionProposeRequest(t.topic, formatJsonRpcRequest("wc_sessionPropose", { requiredNamespaces: e2.requiredNamespaces, optionalNamespaces: e2.optionalNamespaces, relays: e2.relays, proposer: e2.proposer, sessionProperties: e2.sessionProperties }, e2.id));
    }, this.isValidConnect = async (t) => {
      if (!$u(t)) {
        const { message: a4 } = xe("MISSING_OR_INVALID", `connect() params: ${JSON.stringify(t)}`);
        throw new Error(a4);
      }
      const { pairingTopic: e2, requiredNamespaces: s2, optionalNamespaces: i3, sessionProperties: r3, relays: o5 } = t;
      if (Pe(e2) || await this.isValidPairingTopic(e2), !Xu(o5, true)) {
        const { message: a4 } = xe("MISSING_OR_INVALID", `connect() relays: ${o5}`);
        throw new Error(a4);
      }
      !Pe(s2) && Yr(s2) !== 0 && this.validateNamespaces(s2, "requiredNamespaces"), !Pe(i3) && Yr(i3) !== 0 && this.validateNamespaces(i3, "optionalNamespaces"), Pe(r3) || this.validateSessionProps(r3, "sessionProperties");
    }, this.validateNamespaces = (t, e2) => {
      const s2 = Wu(t, "connect()", e2);
      if (s2) throw new Error(s2.message);
    }, this.isValidApprove = async (t) => {
      if (!$u(t)) throw new Error(xe("MISSING_OR_INVALID", `approve() params: ${t}`).message);
      const { id: e2, namespaces: s2, relayProtocol: i3, sessionProperties: r3 } = t;
      this.checkRecentlyDeleted(e2), await this.isValidProposalId(e2);
      const o5 = this.client.proposal.get(e2), a4 = So(s2, "approve()");
      if (a4) throw new Error(a4.message);
      const c5 = Io(o5.requiredNamespaces, s2, "approve()");
      if (c5) throw new Error(c5.message);
      if (!Gt(i3, true)) {
        const { message: h4 } = xe("MISSING_OR_INVALID", `approve() relayProtocol: ${i3}`);
        throw new Error(h4);
      }
      Pe(r3) || this.validateSessionProps(r3, "sessionProperties");
    }, this.isValidReject = async (t) => {
      if (!$u(t)) {
        const { message: i3 } = xe("MISSING_OR_INVALID", `reject() params: ${t}`);
        throw new Error(i3);
      }
      const { id: e2, reason: s2 } = t;
      if (this.checkRecentlyDeleted(e2), await this.isValidProposalId(e2), !th(s2)) {
        const { message: i3 } = xe("MISSING_OR_INVALID", `reject() reason: ${JSON.stringify(s2)}`);
        throw new Error(i3);
      }
    }, this.isValidSessionSettleRequest = (t) => {
      if (!$u(t)) {
        const { message: c5 } = xe("MISSING_OR_INVALID", `onSessionSettleRequest() params: ${t}`);
        throw new Error(c5);
      }
      const { relay: e2, controller: s2, namespaces: i3, expiry: r3 } = t;
      if (!No(e2)) {
        const { message: c5 } = xe("MISSING_OR_INVALID", "onSessionSettleRequest() relay protocol should be a string");
        throw new Error(c5);
      }
      const o5 = Vu(s2, "onSessionSettleRequest()");
      if (o5) throw new Error(o5.message);
      const a4 = So(i3, "onSessionSettleRequest()");
      if (a4) throw new Error(a4.message);
      if (p0(r3)) {
        const { message: c5 } = xe("EXPIRED", "onSessionSettleRequest()");
        throw new Error(c5);
      }
    }, this.isValidUpdate = async (t) => {
      if (!$u(t)) {
        const { message: a4 } = xe("MISSING_OR_INVALID", `update() params: ${t}`);
        throw new Error(a4);
      }
      const { topic: e2, namespaces: s2 } = t;
      this.checkRecentlyDeleted(e2), await this.isValidSessionTopic(e2);
      const i3 = this.client.session.get(e2), r3 = So(s2, "update()");
      if (r3) throw new Error(r3.message);
      const o5 = Io(i3.requiredNamespaces, s2, "update()");
      if (o5) throw new Error(o5.message);
    }, this.isValidExtend = async (t) => {
      if (!$u(t)) {
        const { message: s2 } = xe("MISSING_OR_INVALID", `extend() params: ${t}`);
        throw new Error(s2);
      }
      const { topic: e2 } = t;
      this.checkRecentlyDeleted(e2), await this.isValidSessionTopic(e2);
    }, this.isValidRequest = async (t) => {
      if (!$u(t)) {
        const { message: a4 } = xe("MISSING_OR_INVALID", `request() params: ${t}`);
        throw new Error(a4);
      }
      const { topic: e2, request: s2, chainId: i3, expiry: r3 } = t;
      this.checkRecentlyDeleted(e2), await this.isValidSessionTopic(e2);
      const { namespaces: o5 } = this.client.session.get(e2);
      if (!nh(o5, i3)) {
        const { message: a4 } = xe("MISSING_OR_INVALID", `request() chainId: ${i3}`);
        throw new Error(a4);
      }
      if (!eh(s2)) {
        const { message: a4 } = xe("MISSING_OR_INVALID", `request() ${JSON.stringify(s2)}`);
        throw new Error(a4);
      }
      if (!fh(o5, i3, s2.method)) {
        const { message: a4 } = xe("MISSING_OR_INVALID", `request() method: ${s2.method}`);
        throw new Error(a4);
      }
      if (r3 && !uh(r3, ne2)) {
        const { message: a4 } = xe("MISSING_OR_INVALID", `request() expiry: ${r3}. Expiry must be a number (in seconds) between ${ne2.min} and ${ne2.max}`);
        throw new Error(a4);
      }
    }, this.isValidRespond = async (t) => {
      var e2;
      if (!$u(t)) {
        const { message: r3 } = xe("MISSING_OR_INVALID", `respond() params: ${t}`);
        throw new Error(r3);
      }
      const { topic: s2, response: i3 } = t;
      try {
        await this.isValidSessionTopic(s2);
      } catch (r3) {
        throw (e2 = t == null ? void 0 : t.response) != null && e2.id && this.cleanupAfterResponse(t), r3;
      }
      if (!rh(i3)) {
        const { message: r3 } = xe("MISSING_OR_INVALID", `respond() response: ${JSON.stringify(i3)}`);
        throw new Error(r3);
      }
    }, this.isValidPing = async (t) => {
      if (!$u(t)) {
        const { message: s2 } = xe("MISSING_OR_INVALID", `ping() params: ${t}`);
        throw new Error(s2);
      }
      const { topic: e2 } = t;
      await this.isValidSessionOrPairingTopic(e2);
    }, this.isValidEmit = async (t) => {
      if (!$u(t)) {
        const { message: o5 } = xe("MISSING_OR_INVALID", `emit() params: ${t}`);
        throw new Error(o5);
      }
      const { topic: e2, event: s2, chainId: i3 } = t;
      await this.isValidSessionTopic(e2);
      const { namespaces: r3 } = this.client.session.get(e2);
      if (!nh(r3, i3)) {
        const { message: o5 } = xe("MISSING_OR_INVALID", `emit() chainId: ${i3}`);
        throw new Error(o5);
      }
      if (!ih(s2)) {
        const { message: o5 } = xe("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(s2)}`);
        throw new Error(o5);
      }
      if (!oh(r3, i3, s2.name)) {
        const { message: o5 } = xe("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(s2)}`);
        throw new Error(o5);
      }
    }, this.isValidDisconnect = async (t) => {
      if (!$u(t)) {
        const { message: s2 } = xe("MISSING_OR_INVALID", `disconnect() params: ${t}`);
        throw new Error(s2);
      }
      const { topic: e2 } = t;
      await this.isValidSessionOrPairingTopic(e2);
    }, this.isValidAuthenticate = (t) => {
      const { chains: e2, uri: s2, domain: i3, nonce: r3 } = t;
      if (!Array.isArray(e2) || e2.length === 0) throw new Error("chains is required and must be a non-empty array");
      if (!Gt(s2, false)) throw new Error("uri is required parameter");
      if (!Gt(i3, false)) throw new Error("domain is required parameter");
      if (!Gt(r3, false)) throw new Error("nonce is required parameter");
      if ([...new Set(e2.map((a4) => dn(a4).namespace))].length > 1) throw new Error("Multi-namespace requests are not supported. Please request single namespace only.");
      const { namespace: o5 } = dn(e2[0]);
      if (o5 !== "eip155") throw new Error("Only eip155 namespace is supported for authenticated sessions. Please use .connect() for non-eip155 chains.");
    }, this.getVerifyContext = async (t, e2) => {
      const s2 = { verified: { verifyUrl: e2.verifyUrl || M, validation: "UNKNOWN", origin: e2.url || "" } };
      try {
        const i3 = await this.client.core.verify.resolve({ attestationId: t, verifyUrl: e2.verifyUrl });
        i3 && (s2.verified.origin = i3.origin, s2.verified.isScam = i3.isScam, s2.verified.validation = i3.origin === new URL(e2.url).origin ? "VALID" : "INVALID");
      } catch (i3) {
        this.client.logger.info(i3);
      }
      return this.client.logger.info(`Verify context: ${JSON.stringify(s2)}`), s2;
    }, this.validateSessionProps = (t, e2) => {
      Object.values(t).forEach((s2) => {
        if (!Gt(s2, false)) {
          const { message: i3 } = xe("MISSING_OR_INVALID", `${e2} must be in Record<string, string> format. Received: ${JSON.stringify(s2)}`);
          throw new Error(i3);
        }
      });
    }, this.getPendingAuthRequest = (t) => {
      const e2 = this.client.auth.requests.get(t);
      return typeof e2 == "object" ? e2 : void 0;
    }, this.addToRecentlyDeleted = (t, e2) => {
      if (this.recentlyDeletedMap.set(t, e2), this.recentlyDeletedMap.size >= this.recentlyDeletedLimit) {
        let s2 = 0;
        const i3 = this.recentlyDeletedLimit / 2;
        for (const r3 of this.recentlyDeletedMap.keys()) {
          if (s2++ >= i3) break;
          this.recentlyDeletedMap.delete(r3);
        }
      }
    }, this.checkRecentlyDeleted = (t) => {
      const e2 = this.recentlyDeletedMap.get(t);
      if (e2) {
        const { message: s2 } = xe("MISSING_OR_INVALID", `Record was recently deleted - ${e2}: ${t}`);
        throw new Error(s2);
      }
    };
  }
  async isInitialized() {
    if (!this.initialized) {
      const { message: n4 } = xe("NOT_INITIALIZED", this.name);
      throw new Error(n4);
    }
    await this.client.core.relayer.confirmOnlineStateOrThrow();
  }
  registerRelayerEvents() {
    this.client.core.relayer.on(f2.message, async (n4) => {
      const { topic: t, message: e2 } = n4, { publicKey: s2 } = this.client.auth.authKeys.keys.includes(J) ? this.client.auth.authKeys.get(J) : { responseTopic: void 0, publicKey: void 0 }, i3 = await this.client.core.crypto.decode(t, e2, { receiverPublicKey: s2 });
      try {
        isJsonRpcRequest(i3) ? (this.client.core.history.set(t, i3), this.onRelayEventRequest({ topic: t, payload: i3 })) : isJsonRpcResponse(i3) ? (await this.client.core.history.resolve(i3), await this.onRelayEventResponse({ topic: t, payload: i3 }), this.client.core.history.delete(t, i3.id)) : this.onRelayEventUnknownPayload({ topic: t, payload: i3 });
      } catch (r3) {
        this.client.logger.error(r3);
      }
    });
  }
  registerExpirerEvents() {
    this.client.core.expirer.on(C2.expired, async (n4) => {
      const { topic: t, id: e2 } = l0(n4.target);
      if (e2 && this.client.pendingRequest.keys.includes(e2)) return await this.deletePendingSessionRequest(e2, xe("EXPIRED"), true);
      if (e2 && this.client.auth.requests.keys.includes(e2)) return await this.deletePendingAuthRequest(e2, xe("EXPIRED"), true);
      t ? this.client.session.keys.includes(t) && (await this.deleteSession({ topic: t, expirerHasDeleted: true }), this.client.events.emit("session_expire", { topic: t })) : e2 && (await this.deleteProposal(e2, true), this.client.events.emit("proposal_expire", { id: e2 }));
    });
  }
  registerPairingEvents() {
    this.client.core.pairing.events.on(q.create, (n4) => this.onPairingCreated(n4)), this.client.core.pairing.events.on(q.delete, (n4) => {
      this.addToRecentlyDeleted(n4.topic, "pairing");
    });
  }
  isValidPairingTopic(n4) {
    if (!Gt(n4, false)) {
      const { message: t } = xe("MISSING_OR_INVALID", `pairing topic should be a string: ${n4}`);
      throw new Error(t);
    }
    if (!this.client.core.pairing.pairings.keys.includes(n4)) {
      const { message: t } = xe("NO_MATCHING_KEY", `pairing topic doesn't exist: ${n4}`);
      throw new Error(t);
    }
    if (p0(this.client.core.pairing.pairings.get(n4).expiry)) {
      const { message: t } = xe("EXPIRED", `pairing topic: ${n4}`);
      throw new Error(t);
    }
  }
  async isValidSessionTopic(n4) {
    if (!Gt(n4, false)) {
      const { message: t } = xe("MISSING_OR_INVALID", `session topic should be a string: ${n4}`);
      throw new Error(t);
    }
    if (this.checkRecentlyDeleted(n4), !this.client.session.keys.includes(n4)) {
      const { message: t } = xe("NO_MATCHING_KEY", `session topic doesn't exist: ${n4}`);
      throw new Error(t);
    }
    if (p0(this.client.session.get(n4).expiry)) {
      await this.deleteSession({ topic: n4 });
      const { message: t } = xe("EXPIRED", `session topic: ${n4}`);
      throw new Error(t);
    }
    if (!this.client.core.crypto.keychain.has(n4)) {
      const { message: t } = xe("MISSING_OR_INVALID", `session topic does not exist in keychain: ${n4}`);
      throw await this.deleteSession({ topic: n4 }), new Error(t);
    }
  }
  async isValidSessionOrPairingTopic(n4) {
    if (this.checkRecentlyDeleted(n4), this.client.session.keys.includes(n4)) await this.isValidSessionTopic(n4);
    else if (this.client.core.pairing.pairings.keys.includes(n4)) this.isValidPairingTopic(n4);
    else if (Gt(n4, false)) {
      const { message: t } = xe("NO_MATCHING_KEY", `session or pairing topic doesn't exist: ${n4}`);
      throw new Error(t);
    } else {
      const { message: t } = xe("MISSING_OR_INVALID", `session or pairing topic should be a string: ${n4}`);
      throw new Error(t);
    }
  }
  async isValidProposalId(n4) {
    if (!Zu(n4)) {
      const { message: t } = xe("MISSING_OR_INVALID", `proposal id should be a number: ${n4}`);
      throw new Error(t);
    }
    if (!this.client.proposal.keys.includes(n4)) {
      const { message: t } = xe("NO_MATCHING_KEY", `proposal id doesn't exist: ${n4}`);
      throw new Error(t);
    }
    if (p0(this.client.proposal.get(n4).expiryTimestamp)) {
      await this.deleteProposal(n4);
      const { message: t } = xe("EXPIRED", `proposal id: ${n4}`);
      throw new Error(t);
    }
  }
};
var es3 = class extends Kt2 {
  constructor(n4, t) {
    super(n4, t, Ue2, ie3), this.core = n4, this.logger = t;
  }
};
var Ze3 = class extends Kt2 {
  constructor(n4, t) {
    super(n4, t, ke2, ie3), this.core = n4, this.logger = t;
  }
};
var ts3 = class extends Kt2 {
  constructor(n4, t) {
    super(n4, t, Qe2, ie3, (e2) => e2.id), this.core = n4, this.logger = t;
  }
};
var ss3 = class extends Kt2 {
  constructor(n4, t) {
    super(n4, t, Ye2, X2, () => J), this.core = n4, this.logger = t;
  }
};
var is3 = class extends Kt2 {
  constructor(n4, t) {
    super(n4, t, Xe3, X2), this.core = n4, this.logger = t;
  }
};
var rs3 = class extends Kt2 {
  constructor(n4, t) {
    super(n4, t, Je2, X2, (e2) => e2.id), this.core = n4, this.logger = t;
  }
};
var ns3 = class {
  constructor(n4, t) {
    this.core = n4, this.logger = t, this.authKeys = new ss3(this.core, this.logger), this.pairingTopics = new is3(this.core, this.logger), this.requests = new rs3(this.core, this.logger);
  }
  async init() {
    await this.authKeys.init(), await this.pairingTopics.init(), await this.requests.init();
  }
};
var oe2 = class _oe extends b {
  constructor(n4) {
    super(n4), this.protocol = Re2, this.version = Ee, this.name = re2.name, this.events = new import_events8.EventEmitter(), this.on = (e2, s2) => this.events.on(e2, s2), this.once = (e2, s2) => this.events.once(e2, s2), this.off = (e2, s2) => this.events.off(e2, s2), this.removeListener = (e2, s2) => this.events.removeListener(e2, s2), this.removeAllListeners = (e2) => this.events.removeAllListeners(e2), this.connect = async (e2) => {
      try {
        return await this.engine.connect(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.pair = async (e2) => {
      try {
        return await this.engine.pair(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.approve = async (e2) => {
      try {
        return await this.engine.approve(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.reject = async (e2) => {
      try {
        return await this.engine.reject(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.update = async (e2) => {
      try {
        return await this.engine.update(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.extend = async (e2) => {
      try {
        return await this.engine.extend(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.request = async (e2) => {
      try {
        return await this.engine.request(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.respond = async (e2) => {
      try {
        return await this.engine.respond(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.ping = async (e2) => {
      try {
        return await this.engine.ping(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.emit = async (e2) => {
      try {
        return await this.engine.emit(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.disconnect = async (e2) => {
      try {
        return await this.engine.disconnect(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.find = (e2) => {
      try {
        return this.engine.find(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.getPendingSessionRequests = () => {
      try {
        return this.engine.getPendingSessionRequests();
      } catch (e2) {
        throw this.logger.error(e2.message), e2;
      }
    }, this.authenticate = async (e2) => {
      try {
        return await this.engine.authenticate(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.formatAuthMessage = (e2) => {
      try {
        return this.engine.formatAuthMessage(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.approveSessionAuthenticate = async (e2) => {
      try {
        return await this.engine.approveSessionAuthenticate(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.rejectSessionAuthenticate = async (e2) => {
      try {
        return await this.engine.rejectSessionAuthenticate(e2);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.name = (n4 == null ? void 0 : n4.name) || re2.name, this.metadata = (n4 == null ? void 0 : n4.metadata) || Xo(), this.signConfig = n4 == null ? void 0 : n4.signConfig;
    const t = typeof (n4 == null ? void 0 : n4.logger) < "u" && typeof (n4 == null ? void 0 : n4.logger) != "string" ? n4.logger : (0, import_pino.default)(k({ level: (n4 == null ? void 0 : n4.logger) || re2.logger }));
    this.core = (n4 == null ? void 0 : n4.core) || new Br(n4), this.logger = E(t, this.name), this.session = new Ze3(this.core, this.logger), this.proposal = new es3(this.core, this.logger), this.pendingRequest = new ts3(this.core, this.logger), this.engine = new Zt2(this), this.auth = new ns3(this.core, this.logger);
  }
  static async init(n4) {
    const t = new _oe(n4);
    return await t.initialize(), t;
  }
  get context() {
    return y(this.logger);
  }
  get pairing() {
    return this.core.pairing.pairings;
  }
  async initialize() {
    this.logger.trace("Initialized");
    try {
      await this.core.start(), await this.session.init(), await this.proposal.init(), await this.pendingRequest.init(), await this.engine.init(), await this.auth.init(), this.core.verify.init({ verifyUrl: this.metadata.verifyUrl }), this.logger.info("SignClient Initialization Success");
    } catch (n4) {
      throw this.logger.info("SignClient Initialization Failure"), this.logger.error(n4.message), n4;
    }
  }
};

// node_modules/@walletconnect/jsonrpc-http-connection/dist/index.es.js
var import_events9 = __toESM(require_events());
var import_cross_fetch = __toESM(require_browser_ponyfill());
var P = Object.defineProperty;
var w3 = Object.defineProperties;
var E5 = Object.getOwnPropertyDescriptors;
var c4 = Object.getOwnPropertySymbols;
var L3 = Object.prototype.hasOwnProperty;
var O2 = Object.prototype.propertyIsEnumerable;
var l3 = (r3, t, e2) => t in r3 ? P(r3, t, { enumerable: true, configurable: true, writable: true, value: e2 }) : r3[t] = e2;
var p2 = (r3, t) => {
  for (var e2 in t || (t = {})) L3.call(t, e2) && l3(r3, e2, t[e2]);
  if (c4) for (var e2 of c4(t)) O2.call(t, e2) && l3(r3, e2, t[e2]);
  return r3;
};
var v2 = (r3, t) => w3(r3, E5(t));
var j4 = { Accept: "application/json", "Content-Type": "application/json" };
var T = "POST";
var d2 = { headers: j4, method: T };
var g2 = 10;
var f4 = class {
  constructor(t, e2 = false) {
    if (this.url = t, this.disableProviderPing = e2, this.events = new import_events9.EventEmitter(), this.isAvailable = false, this.registering = false, !isHttpUrl(t)) throw new Error(`Provided URL is not compatible with HTTP connection: ${t}`);
    this.url = t, this.disableProviderPing = e2;
  }
  get connected() {
    return this.isAvailable;
  }
  get connecting() {
    return this.registering;
  }
  on(t, e2) {
    this.events.on(t, e2);
  }
  once(t, e2) {
    this.events.once(t, e2);
  }
  off(t, e2) {
    this.events.off(t, e2);
  }
  removeListener(t, e2) {
    this.events.removeListener(t, e2);
  }
  async open(t = this.url) {
    await this.register(t);
  }
  async close() {
    if (!this.isAvailable) throw new Error("Connection already closed");
    this.onClose();
  }
  async send(t) {
    this.isAvailable || await this.register();
    try {
      const e2 = safeJsonStringify(t), s2 = await (await (0, import_cross_fetch.default)(this.url, v2(p2({}, d2), { body: e2 }))).json();
      this.onPayload({ data: s2 });
    } catch (e2) {
      this.onError(t.id, e2);
    }
  }
  async register(t = this.url) {
    if (!isHttpUrl(t)) throw new Error(`Provided URL is not compatible with HTTP connection: ${t}`);
    if (this.registering) {
      const e2 = this.events.getMaxListeners();
      return (this.events.listenerCount("register_error") >= e2 || this.events.listenerCount("open") >= e2) && this.events.setMaxListeners(e2 + 1), new Promise((s2, i3) => {
        this.events.once("register_error", (n4) => {
          this.resetMaxListeners(), i3(n4);
        }), this.events.once("open", () => {
          if (this.resetMaxListeners(), typeof this.isAvailable > "u") return i3(new Error("HTTP connection is missing or invalid"));
          s2();
        });
      });
    }
    this.url = t, this.registering = true;
    try {
      if (!this.disableProviderPing) {
        const e2 = safeJsonStringify({ id: 1, jsonrpc: "2.0", method: "test", params: [] });
        await (0, import_cross_fetch.default)(t, v2(p2({}, d2), { body: e2 }));
      }
      this.onOpen();
    } catch (e2) {
      const s2 = this.parseError(e2);
      throw this.events.emit("register_error", s2), this.onClose(), s2;
    }
  }
  onOpen() {
    this.isAvailable = true, this.registering = false, this.events.emit("open");
  }
  onClose() {
    this.isAvailable = false, this.registering = false, this.events.emit("close");
  }
  onPayload(t) {
    if (typeof t.data > "u") return;
    const e2 = typeof t.data == "string" ? safeJsonParse(t.data) : t.data;
    this.events.emit("payload", e2);
  }
  onError(t, e2) {
    const s2 = this.parseError(e2), i3 = s2.message || s2.toString(), n4 = formatJsonRpcError(t, i3);
    this.events.emit("payload", n4);
  }
  parseError(t, e2 = this.url) {
    return parseConnectionError(t, e2, "HTTP");
  }
  resetMaxListeners() {
    this.events.getMaxListeners() > g2 && this.events.setMaxListeners(g2);
  }
};

// node_modules/@walletconnect/universal-provider/dist/index.es.js
var import_events10 = __toESM(require_events());
var xa2 = "error";
var Mg = "wss://relay.walletconnect.com";
var qg = "wc";
var Bg = "universal_provider";
var Ea2 = `${qg}@2:${Bg}:`;
var Gg = "https://rpc.walletconnect.com/v1/";
var Vn2 = { DEFAULT_CHAIN_CHANGED: "default_chain_changed" };
var ge3 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
var Ui2 = { exports: {} };
(function(A4, u4) {
  (function() {
    var i3, p4 = "4.17.21", w4 = 200, b4 = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", D4 = "Expected a function", En2 = "Invalid `variable` option passed into `_.template`", zt3 = "__lodash_hash_undefined__", pr3 = 500, It2 = "__lodash_placeholder__", Ln2 = 1, Fn2 = 2, xt2 = 4, Et2 = 1, ve2 = 2, vn = 1, ct2 = 2, Bi2 = 4, Dn2 = 8, yt2 = 16, Nn2 = 32, St2 = 64, Mn = 128, Kt3 = 256, dr3 = 512, Na2 = 30, Ha2 = "...", $a2 = 800, Ua2 = 16, Gi3 = 1, Wa2 = 2, Fa2 = 3, ht2 = 1 / 0, kn2 = 9007199254740991, Ma2 = 17976931348623157e292, _e3 = 0 / 0, Hn2 = 4294967295, qa2 = Hn2 - 1, Ba2 = Hn2 >>> 1, Ga2 = [["ary", Mn], ["bind", vn], ["bindKey", ct2], ["curry", Dn2], ["curryRight", yt2], ["flip", dr3], ["partial", Nn2], ["partialRight", St2], ["rearg", Kt3]], Ot3 = "[object Arguments]", me3 = "[object Array]", za2 = "[object AsyncFunction]", Yt3 = "[object Boolean]", Zt3 = "[object Date]", Ka2 = "[object DOMException]", we2 = "[object Error]", Pe3 = "[object Function]", zi2 = "[object GeneratorFunction]", yn2 = "[object Map]", Jt4 = "[object Number]", Ya2 = "[object Null]", qn2 = "[object Object]", Ki2 = "[object Promise]", Za2 = "[object Proxy]", Xt4 = "[object RegExp]", Sn2 = "[object Set]", Qt2 = "[object String]", Ae2 = "[object Symbol]", Ja2 = "[object Undefined]", Vt3 = "[object WeakMap]", Xa2 = "[object WeakSet]", kt3 = "[object ArrayBuffer]", Rt2 = "[object DataView]", gr3 = "[object Float32Array]", vr3 = "[object Float64Array]", _r3 = "[object Int8Array]", mr3 = "[object Int16Array]", wr2 = "[object Int32Array]", Pr3 = "[object Uint8Array]", Ar3 = "[object Uint8ClampedArray]", Cr3 = "[object Uint16Array]", Ir3 = "[object Uint32Array]", Qa2 = /\b__p \+= '';/g, Va2 = /\b(__p \+=) '' \+/g, ka2 = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Yi3 = /&(?:amp|lt|gt|quot|#39);/g, Zi3 = /[&<>"']/g, ja2 = RegExp(Yi3.source), no2 = RegExp(Zi3.source), to2 = /<%-([\s\S]+?)%>/g, eo2 = /<%([\s\S]+?)%>/g, Ji3 = /<%=([\s\S]+?)%>/g, ro2 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, io2 = /^\w*$/, so2 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, xr3 = /[\\^$.*+?()[\]{}|]/g, uo = RegExp(xr3.source), Er2 = /^\s+/, ao2 = /\s/, oo2 = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, fo2 = /\{\n\/\* \[wrapped with (.+)\] \*/, co2 = /,? & /, ho = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, lo2 = /[()=,{}\[\]\/\s]/, po2 = /\\(\\)?/g, go2 = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Xi3 = /\w*$/, vo2 = /^[-+]0x[0-9a-f]+$/i, _o2 = /^0b[01]+$/i, mo2 = /^\[object .+?Constructor\]$/, wo2 = /^0o[0-7]+$/i, Po2 = /^(?:0|[1-9]\d*)$/, Ao2 = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, Ce2 = /($^)/, Co2 = /['\n\r\u2028\u2029\\]/g, Ie = "\\ud800-\\udfff", Io2 = "\\u0300-\\u036f", xo2 = "\\ufe20-\\ufe2f", Eo2 = "\\u20d0-\\u20ff", Qi3 = Io2 + xo2 + Eo2, Vi2 = "\\u2700-\\u27bf", ki3 = "a-z\\xdf-\\xf6\\xf8-\\xff", yo2 = "\\xac\\xb1\\xd7\\xf7", So2 = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", Oo2 = "\\u2000-\\u206f", Ro2 = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", ji2 = "A-Z\\xc0-\\xd6\\xd8-\\xde", ns4 = "\\ufe0e\\ufe0f", ts4 = yo2 + So2 + Oo2 + Ro2, yr3 = "['’]", bo2 = "[" + Ie + "]", es4 = "[" + ts4 + "]", xe2 = "[" + Qi3 + "]", rs4 = "\\d+", To2 = "[" + Vi2 + "]", is4 = "[" + ki3 + "]", ss4 = "[^" + Ie + ts4 + rs4 + Vi2 + ki3 + ji2 + "]", Sr3 = "\\ud83c[\\udffb-\\udfff]", Lo = "(?:" + xe2 + "|" + Sr3 + ")", us3 = "[^" + Ie + "]", Or3 = "(?:\\ud83c[\\udde6-\\uddff]){2}", Rr3 = "[\\ud800-\\udbff][\\udc00-\\udfff]", bt3 = "[" + ji2 + "]", as3 = "\\u200d", os3 = "(?:" + is4 + "|" + ss4 + ")", Do = "(?:" + bt3 + "|" + ss4 + ")", fs3 = "(?:" + yr3 + "(?:d|ll|m|re|s|t|ve))?", cs3 = "(?:" + yr3 + "(?:D|LL|M|RE|S|T|VE))?", hs3 = Lo + "?", ls3 = "[" + ns4 + "]?", No2 = "(?:" + as3 + "(?:" + [us3, Or3, Rr3].join("|") + ")" + ls3 + hs3 + ")*", Ho = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", $o2 = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", ps3 = ls3 + hs3 + No2, Uo2 = "(?:" + [To2, Or3, Rr3].join("|") + ")" + ps3, Wo2 = "(?:" + [us3 + xe2 + "?", xe2, Or3, Rr3, bo2].join("|") + ")", Fo2 = RegExp(yr3, "g"), Mo2 = RegExp(xe2, "g"), br2 = RegExp(Sr3 + "(?=" + Sr3 + ")|" + Wo2 + ps3, "g"), qo = RegExp([bt3 + "?" + is4 + "+" + fs3 + "(?=" + [es4, bt3, "$"].join("|") + ")", Do + "+" + cs3 + "(?=" + [es4, bt3 + os3, "$"].join("|") + ")", bt3 + "?" + os3 + "+" + fs3, bt3 + "+" + cs3, $o2, Ho, rs4, Uo2].join("|"), "g"), Bo2 = RegExp("[" + as3 + Ie + Qi3 + ns4 + "]"), Go2 = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, zo2 = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"], Ko = -1, B2 = {};
    B2[gr3] = B2[vr3] = B2[_r3] = B2[mr3] = B2[wr2] = B2[Pr3] = B2[Ar3] = B2[Cr3] = B2[Ir3] = true, B2[Ot3] = B2[me3] = B2[kt3] = B2[Yt3] = B2[Rt2] = B2[Zt3] = B2[we2] = B2[Pe3] = B2[yn2] = B2[Jt4] = B2[qn2] = B2[Xt4] = B2[Sn2] = B2[Qt2] = B2[Vt3] = false;
    var q3 = {};
    q3[Ot3] = q3[me3] = q3[kt3] = q3[Rt2] = q3[Yt3] = q3[Zt3] = q3[gr3] = q3[vr3] = q3[_r3] = q3[mr3] = q3[wr2] = q3[yn2] = q3[Jt4] = q3[qn2] = q3[Xt4] = q3[Sn2] = q3[Qt2] = q3[Ae2] = q3[Pr3] = q3[Ar3] = q3[Cr3] = q3[Ir3] = true, q3[we2] = q3[Pe3] = q3[Vt3] = false;
    var Yo = { À: "A", Á: "A", Â: "A", Ã: "A", Ä: "A", Å: "A", à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a", Ç: "C", ç: "c", Ð: "D", ð: "d", È: "E", É: "E", Ê: "E", Ë: "E", è: "e", é: "e", ê: "e", ë: "e", Ì: "I", Í: "I", Î: "I", Ï: "I", ì: "i", í: "i", î: "i", ï: "i", Ñ: "N", ñ: "n", Ò: "O", Ó: "O", Ô: "O", Õ: "O", Ö: "O", Ø: "O", ò: "o", ó: "o", ô: "o", õ: "o", ö: "o", ø: "o", Ù: "U", Ú: "U", Û: "U", Ü: "U", ù: "u", ú: "u", û: "u", ü: "u", Ý: "Y", ý: "y", ÿ: "y", Æ: "Ae", æ: "ae", Þ: "Th", þ: "th", ß: "ss", Ā: "A", Ă: "A", Ą: "A", ā: "a", ă: "a", ą: "a", Ć: "C", Ĉ: "C", Ċ: "C", Č: "C", ć: "c", ĉ: "c", ċ: "c", č: "c", Ď: "D", Đ: "D", ď: "d", đ: "d", Ē: "E", Ĕ: "E", Ė: "E", Ę: "E", Ě: "E", ē: "e", ĕ: "e", ė: "e", ę: "e", ě: "e", Ĝ: "G", Ğ: "G", Ġ: "G", Ģ: "G", ĝ: "g", ğ: "g", ġ: "g", ģ: "g", Ĥ: "H", Ħ: "H", ĥ: "h", ħ: "h", Ĩ: "I", Ī: "I", Ĭ: "I", Į: "I", İ: "I", ĩ: "i", ī: "i", ĭ: "i", į: "i", ı: "i", Ĵ: "J", ĵ: "j", Ķ: "K", ķ: "k", ĸ: "k", Ĺ: "L", Ļ: "L", Ľ: "L", Ŀ: "L", Ł: "L", ĺ: "l", ļ: "l", ľ: "l", ŀ: "l", ł: "l", Ń: "N", Ņ: "N", Ň: "N", Ŋ: "N", ń: "n", ņ: "n", ň: "n", ŋ: "n", Ō: "O", Ŏ: "O", Ő: "O", ō: "o", ŏ: "o", ő: "o", Ŕ: "R", Ŗ: "R", Ř: "R", ŕ: "r", ŗ: "r", ř: "r", Ś: "S", Ŝ: "S", Ş: "S", Š: "S", ś: "s", ŝ: "s", ş: "s", š: "s", Ţ: "T", Ť: "T", Ŧ: "T", ţ: "t", ť: "t", ŧ: "t", Ũ: "U", Ū: "U", Ŭ: "U", Ů: "U", Ű: "U", Ų: "U", ũ: "u", ū: "u", ŭ: "u", ů: "u", ű: "u", ų: "u", Ŵ: "W", ŵ: "w", Ŷ: "Y", ŷ: "y", Ÿ: "Y", Ź: "Z", Ż: "Z", Ž: "Z", ź: "z", ż: "z", ž: "z", Ĳ: "IJ", ĳ: "ij", Œ: "Oe", œ: "oe", ŉ: "'n", ſ: "s" }, Zo = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Jo2 = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" }, Xo2 = { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" }, Qo2 = parseFloat, Vo = parseInt, ds3 = typeof ge3 == "object" && ge3 && ge3.Object === Object && ge3, ko2 = typeof self == "object" && self && self.Object === Object && self, k3 = ds3 || ko2 || Function("return this")(), Tr3 = u4 && !u4.nodeType && u4, lt2 = Tr3 && true && A4 && !A4.nodeType && A4, gs3 = lt2 && lt2.exports === Tr3, Lr3 = gs3 && ds3.process, _n2 = function() {
      try {
        var h4 = lt2 && lt2.require && lt2.require("util").types;
        return h4 || Lr3 && Lr3.binding && Lr3.binding("util");
      } catch {
      }
    }(), vs3 = _n2 && _n2.isArrayBuffer, _s3 = _n2 && _n2.isDate, ms3 = _n2 && _n2.isMap, ws3 = _n2 && _n2.isRegExp, Ps3 = _n2 && _n2.isSet, As3 = _n2 && _n2.isTypedArray;
    function cn2(h4, g4, d3) {
      switch (d3.length) {
        case 0:
          return h4.call(g4);
        case 1:
          return h4.call(g4, d3[0]);
        case 2:
          return h4.call(g4, d3[0], d3[1]);
        case 3:
          return h4.call(g4, d3[0], d3[1], d3[2]);
      }
      return h4.apply(g4, d3);
    }
    function jo(h4, g4, d3, C4) {
      for (var S4 = -1, U4 = h4 == null ? 0 : h4.length; ++S4 < U4; ) {
        var X3 = h4[S4];
        g4(C4, X3, d3(X3), h4);
      }
      return C4;
    }
    function mn(h4, g4) {
      for (var d3 = -1, C4 = h4 == null ? 0 : h4.length; ++d3 < C4 && g4(h4[d3], d3, h4) !== false; ) ;
      return h4;
    }
    function nf2(h4, g4) {
      for (var d3 = h4 == null ? 0 : h4.length; d3-- && g4(h4[d3], d3, h4) !== false; ) ;
      return h4;
    }
    function Cs3(h4, g4) {
      for (var d3 = -1, C4 = h4 == null ? 0 : h4.length; ++d3 < C4; ) if (!g4(h4[d3], d3, h4)) return false;
      return true;
    }
    function jn2(h4, g4) {
      for (var d3 = -1, C4 = h4 == null ? 0 : h4.length, S4 = 0, U4 = []; ++d3 < C4; ) {
        var X3 = h4[d3];
        g4(X3, d3, h4) && (U4[S4++] = X3);
      }
      return U4;
    }
    function Ee2(h4, g4) {
      var d3 = h4 == null ? 0 : h4.length;
      return !!d3 && Tt3(h4, g4, 0) > -1;
    }
    function Dr3(h4, g4, d3) {
      for (var C4 = -1, S4 = h4 == null ? 0 : h4.length; ++C4 < S4; ) if (d3(g4, h4[C4])) return true;
      return false;
    }
    function G(h4, g4) {
      for (var d3 = -1, C4 = h4 == null ? 0 : h4.length, S4 = Array(C4); ++d3 < C4; ) S4[d3] = g4(h4[d3], d3, h4);
      return S4;
    }
    function nt2(h4, g4) {
      for (var d3 = -1, C4 = g4.length, S4 = h4.length; ++d3 < C4; ) h4[S4 + d3] = g4[d3];
      return h4;
    }
    function Nr3(h4, g4, d3, C4) {
      var S4 = -1, U4 = h4 == null ? 0 : h4.length;
      for (C4 && U4 && (d3 = h4[++S4]); ++S4 < U4; ) d3 = g4(d3, h4[S4], S4, h4);
      return d3;
    }
    function tf2(h4, g4, d3, C4) {
      var S4 = h4 == null ? 0 : h4.length;
      for (C4 && S4 && (d3 = h4[--S4]); S4--; ) d3 = g4(d3, h4[S4], S4, h4);
      return d3;
    }
    function Hr2(h4, g4) {
      for (var d3 = -1, C4 = h4 == null ? 0 : h4.length; ++d3 < C4; ) if (g4(h4[d3], d3, h4)) return true;
      return false;
    }
    var ef2 = $r2("length");
    function rf2(h4) {
      return h4.split("");
    }
    function sf2(h4) {
      return h4.match(ho) || [];
    }
    function Is3(h4, g4, d3) {
      var C4;
      return d3(h4, function(S4, U4, X3) {
        if (g4(S4, U4, X3)) return C4 = U4, false;
      }), C4;
    }
    function ye3(h4, g4, d3, C4) {
      for (var S4 = h4.length, U4 = d3 + (C4 ? 1 : -1); C4 ? U4-- : ++U4 < S4; ) if (g4(h4[U4], U4, h4)) return U4;
      return -1;
    }
    function Tt3(h4, g4, d3) {
      return g4 === g4 ? _f2(h4, g4, d3) : ye3(h4, xs3, d3);
    }
    function uf2(h4, g4, d3, C4) {
      for (var S4 = d3 - 1, U4 = h4.length; ++S4 < U4; ) if (C4(h4[S4], g4)) return S4;
      return -1;
    }
    function xs3(h4) {
      return h4 !== h4;
    }
    function Es3(h4, g4) {
      var d3 = h4 == null ? 0 : h4.length;
      return d3 ? Wr(h4, g4) / d3 : _e3;
    }
    function $r2(h4) {
      return function(g4) {
        return g4 == null ? i3 : g4[h4];
      };
    }
    function Ur3(h4) {
      return function(g4) {
        return h4 == null ? i3 : h4[g4];
      };
    }
    function ys3(h4, g4, d3, C4, S4) {
      return S4(h4, function(U4, X3, M4) {
        d3 = C4 ? (C4 = false, U4) : g4(d3, U4, X3, M4);
      }), d3;
    }
    function af2(h4, g4) {
      var d3 = h4.length;
      for (h4.sort(g4); d3--; ) h4[d3] = h4[d3].value;
      return h4;
    }
    function Wr(h4, g4) {
      for (var d3, C4 = -1, S4 = h4.length; ++C4 < S4; ) {
        var U4 = g4(h4[C4]);
        U4 !== i3 && (d3 = d3 === i3 ? U4 : d3 + U4);
      }
      return d3;
    }
    function Fr3(h4, g4) {
      for (var d3 = -1, C4 = Array(h4); ++d3 < h4; ) C4[d3] = g4(d3);
      return C4;
    }
    function of2(h4, g4) {
      return G(g4, function(d3) {
        return [d3, h4[d3]];
      });
    }
    function Ss3(h4) {
      return h4 && h4.slice(0, Ts3(h4) + 1).replace(Er2, "");
    }
    function hn2(h4) {
      return function(g4) {
        return h4(g4);
      };
    }
    function Mr2(h4, g4) {
      return G(g4, function(d3) {
        return h4[d3];
      });
    }
    function jt3(h4, g4) {
      return h4.has(g4);
    }
    function Os3(h4, g4) {
      for (var d3 = -1, C4 = h4.length; ++d3 < C4 && Tt3(g4, h4[d3], 0) > -1; ) ;
      return d3;
    }
    function Rs3(h4, g4) {
      for (var d3 = h4.length; d3-- && Tt3(g4, h4[d3], 0) > -1; ) ;
      return d3;
    }
    function ff2(h4, g4) {
      for (var d3 = h4.length, C4 = 0; d3--; ) h4[d3] === g4 && ++C4;
      return C4;
    }
    var cf2 = Ur3(Yo), hf2 = Ur3(Zo);
    function lf2(h4) {
      return "\\" + Xo2[h4];
    }
    function pf2(h4, g4) {
      return h4 == null ? i3 : h4[g4];
    }
    function Lt3(h4) {
      return Bo2.test(h4);
    }
    function df2(h4) {
      return Go2.test(h4);
    }
    function gf2(h4) {
      for (var g4, d3 = []; !(g4 = h4.next()).done; ) d3.push(g4.value);
      return d3;
    }
    function qr2(h4) {
      var g4 = -1, d3 = Array(h4.size);
      return h4.forEach(function(C4, S4) {
        d3[++g4] = [S4, C4];
      }), d3;
    }
    function bs3(h4, g4) {
      return function(d3) {
        return h4(g4(d3));
      };
    }
    function tt2(h4, g4) {
      for (var d3 = -1, C4 = h4.length, S4 = 0, U4 = []; ++d3 < C4; ) {
        var X3 = h4[d3];
        (X3 === g4 || X3 === It2) && (h4[d3] = It2, U4[S4++] = d3);
      }
      return U4;
    }
    function Se3(h4) {
      var g4 = -1, d3 = Array(h4.size);
      return h4.forEach(function(C4) {
        d3[++g4] = C4;
      }), d3;
    }
    function vf2(h4) {
      var g4 = -1, d3 = Array(h4.size);
      return h4.forEach(function(C4) {
        d3[++g4] = [C4, C4];
      }), d3;
    }
    function _f2(h4, g4, d3) {
      for (var C4 = d3 - 1, S4 = h4.length; ++C4 < S4; ) if (h4[C4] === g4) return C4;
      return -1;
    }
    function mf2(h4, g4, d3) {
      for (var C4 = d3 + 1; C4--; ) if (h4[C4] === g4) return C4;
      return C4;
    }
    function Dt3(h4) {
      return Lt3(h4) ? Pf2(h4) : ef2(h4);
    }
    function On2(h4) {
      return Lt3(h4) ? Af2(h4) : rf2(h4);
    }
    function Ts3(h4) {
      for (var g4 = h4.length; g4-- && ao2.test(h4.charAt(g4)); ) ;
      return g4;
    }
    var wf2 = Ur3(Jo2);
    function Pf2(h4) {
      for (var g4 = br2.lastIndex = 0; br2.test(h4); ) ++g4;
      return g4;
    }
    function Af2(h4) {
      return h4.match(br2) || [];
    }
    function Cf2(h4) {
      return h4.match(qo) || [];
    }
    var If2 = function h4(g4) {
      g4 = g4 == null ? k3 : Nt2.defaults(k3.Object(), g4, Nt2.pick(k3, zo2));
      var d3 = g4.Array, C4 = g4.Date, S4 = g4.Error, U4 = g4.Function, X3 = g4.Math, M4 = g4.Object, Br2 = g4.RegExp, xf2 = g4.String, wn2 = g4.TypeError, Oe2 = d3.prototype, Ef2 = U4.prototype, Ht3 = M4.prototype, Re3 = g4["__core-js_shared__"], be3 = Ef2.toString, F = Ht3.hasOwnProperty, yf2 = 0, Ls3 = function() {
        var n4 = /[^.]+$/.exec(Re3 && Re3.keys && Re3.keys.IE_PROTO || "");
        return n4 ? "Symbol(src)_1." + n4 : "";
      }(), Te = Ht3.toString, Sf2 = be3.call(M4), Of2 = k3._, Rf2 = Br2("^" + be3.call(F).replace(xr3, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), Le2 = gs3 ? g4.Buffer : i3, et2 = g4.Symbol, De2 = g4.Uint8Array, Ds3 = Le2 ? Le2.allocUnsafe : i3, Ne = bs3(M4.getPrototypeOf, M4), Ns3 = M4.create, Hs3 = Ht3.propertyIsEnumerable, He3 = Oe2.splice, $s3 = et2 ? et2.isConcatSpreadable : i3, ne3 = et2 ? et2.iterator : i3, pt2 = et2 ? et2.toStringTag : i3, $e3 = function() {
        try {
          var n4 = mt2(M4, "defineProperty");
          return n4({}, "", {}), n4;
        } catch {
        }
      }(), bf2 = g4.clearTimeout !== k3.clearTimeout && g4.clearTimeout, Tf2 = C4 && C4.now !== k3.Date.now && C4.now, Lf = g4.setTimeout !== k3.setTimeout && g4.setTimeout, Ue3 = X3.ceil, We4 = X3.floor, Gr2 = M4.getOwnPropertySymbols, Df2 = Le2 ? Le2.isBuffer : i3, Us3 = g4.isFinite, Nf2 = Oe2.join, Hf2 = bs3(M4.keys, M4), Q4 = X3.max, nn2 = X3.min, $f2 = C4.now, Uf2 = g4.parseInt, Ws3 = X3.random, Wf2 = Oe2.reverse, zr3 = mt2(g4, "DataView"), te2 = mt2(g4, "Map"), Kr2 = mt2(g4, "Promise"), $t4 = mt2(g4, "Set"), ee2 = mt2(g4, "WeakMap"), re3 = mt2(M4, "create"), Fe3 = ee2 && new ee2(), Ut3 = {}, Ff2 = wt2(zr3), Mf2 = wt2(te2), qf2 = wt2(Kr2), Bf2 = wt2($t4), Gf2 = wt2(ee2), Me3 = et2 ? et2.prototype : i3, ie4 = Me3 ? Me3.valueOf : i3, Fs3 = Me3 ? Me3.toString : i3;
      function a4(n4) {
        if (Y(n4) && !O4(n4) && !(n4 instanceof H)) {
          if (n4 instanceof Pn2) return n4;
          if (F.call(n4, "__wrapped__")) return Mu2(n4);
        }
        return new Pn2(n4);
      }
      var Wt4 = /* @__PURE__ */ function() {
        function n4() {
        }
        return function(t) {
          if (!K3(t)) return {};
          if (Ns3) return Ns3(t);
          n4.prototype = t;
          var e2 = new n4();
          return n4.prototype = i3, e2;
        };
      }();
      function qe2() {
      }
      function Pn2(n4, t) {
        this.__wrapped__ = n4, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = i3;
      }
      a4.templateSettings = { escape: to2, evaluate: eo2, interpolate: Ji3, variable: "", imports: { _: a4 } }, a4.prototype = qe2.prototype, a4.prototype.constructor = a4, Pn2.prototype = Wt4(qe2.prototype), Pn2.prototype.constructor = Pn2;
      function H(n4) {
        this.__wrapped__ = n4, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = Hn2, this.__views__ = [];
      }
      function zf2() {
        var n4 = new H(this.__wrapped__);
        return n4.__actions__ = un2(this.__actions__), n4.__dir__ = this.__dir__, n4.__filtered__ = this.__filtered__, n4.__iteratees__ = un2(this.__iteratees__), n4.__takeCount__ = this.__takeCount__, n4.__views__ = un2(this.__views__), n4;
      }
      function Kf2() {
        if (this.__filtered__) {
          var n4 = new H(this);
          n4.__dir__ = -1, n4.__filtered__ = true;
        } else n4 = this.clone(), n4.__dir__ *= -1;
        return n4;
      }
      function Yf2() {
        var n4 = this.__wrapped__.value(), t = this.__dir__, e2 = O4(n4), r3 = t < 0, s2 = e2 ? n4.length : 0, o5 = ih2(0, s2, this.__views__), f5 = o5.start, c5 = o5.end, l4 = c5 - f5, v4 = r3 ? c5 : f5 - 1, _2 = this.__iteratees__, m3 = _2.length, P2 = 0, I2 = nn2(l4, this.__takeCount__);
        if (!e2 || !r3 && s2 == l4 && I2 == l4) return fu2(n4, this.__actions__);
        var E7 = [];
        n: for (; l4-- && P2 < I2; ) {
          v4 += t;
          for (var T3 = -1, y8 = n4[v4]; ++T3 < m3; ) {
            var N3 = _2[T3], $3 = N3.iteratee, dn2 = N3.type, sn2 = $3(y8);
            if (dn2 == Wa2) y8 = sn2;
            else if (!sn2) {
              if (dn2 == Gi3) continue n;
              break n;
            }
          }
          E7[P2++] = y8;
        }
        return E7;
      }
      H.prototype = Wt4(qe2.prototype), H.prototype.constructor = H;
      function dt2(n4) {
        var t = -1, e2 = n4 == null ? 0 : n4.length;
        for (this.clear(); ++t < e2; ) {
          var r3 = n4[t];
          this.set(r3[0], r3[1]);
        }
      }
      function Zf2() {
        this.__data__ = re3 ? re3(null) : {}, this.size = 0;
      }
      function Jf2(n4) {
        var t = this.has(n4) && delete this.__data__[n4];
        return this.size -= t ? 1 : 0, t;
      }
      function Xf(n4) {
        var t = this.__data__;
        if (re3) {
          var e2 = t[n4];
          return e2 === zt3 ? i3 : e2;
        }
        return F.call(t, n4) ? t[n4] : i3;
      }
      function Qf(n4) {
        var t = this.__data__;
        return re3 ? t[n4] !== i3 : F.call(t, n4);
      }
      function Vf(n4, t) {
        var e2 = this.__data__;
        return this.size += this.has(n4) ? 0 : 1, e2[n4] = re3 && t === i3 ? zt3 : t, this;
      }
      dt2.prototype.clear = Zf2, dt2.prototype.delete = Jf2, dt2.prototype.get = Xf, dt2.prototype.has = Qf, dt2.prototype.set = Vf;
      function Bn(n4) {
        var t = -1, e2 = n4 == null ? 0 : n4.length;
        for (this.clear(); ++t < e2; ) {
          var r3 = n4[t];
          this.set(r3[0], r3[1]);
        }
      }
      function kf2() {
        this.__data__ = [], this.size = 0;
      }
      function jf(n4) {
        var t = this.__data__, e2 = Be4(t, n4);
        if (e2 < 0) return false;
        var r3 = t.length - 1;
        return e2 == r3 ? t.pop() : He3.call(t, e2, 1), --this.size, true;
      }
      function nc(n4) {
        var t = this.__data__, e2 = Be4(t, n4);
        return e2 < 0 ? i3 : t[e2][1];
      }
      function tc(n4) {
        return Be4(this.__data__, n4) > -1;
      }
      function ec(n4, t) {
        var e2 = this.__data__, r3 = Be4(e2, n4);
        return r3 < 0 ? (++this.size, e2.push([n4, t])) : e2[r3][1] = t, this;
      }
      Bn.prototype.clear = kf2, Bn.prototype.delete = jf, Bn.prototype.get = nc, Bn.prototype.has = tc, Bn.prototype.set = ec;
      function Gn2(n4) {
        var t = -1, e2 = n4 == null ? 0 : n4.length;
        for (this.clear(); ++t < e2; ) {
          var r3 = n4[t];
          this.set(r3[0], r3[1]);
        }
      }
      function rc() {
        this.size = 0, this.__data__ = { hash: new dt2(), map: new (te2 || Bn)(), string: new dt2() };
      }
      function ic(n4) {
        var t = nr3(this, n4).delete(n4);
        return this.size -= t ? 1 : 0, t;
      }
      function sc(n4) {
        return nr3(this, n4).get(n4);
      }
      function uc(n4) {
        return nr3(this, n4).has(n4);
      }
      function ac(n4, t) {
        var e2 = nr3(this, n4), r3 = e2.size;
        return e2.set(n4, t), this.size += e2.size == r3 ? 0 : 1, this;
      }
      Gn2.prototype.clear = rc, Gn2.prototype.delete = ic, Gn2.prototype.get = sc, Gn2.prototype.has = uc, Gn2.prototype.set = ac;
      function gt2(n4) {
        var t = -1, e2 = n4 == null ? 0 : n4.length;
        for (this.__data__ = new Gn2(); ++t < e2; ) this.add(n4[t]);
      }
      function oc(n4) {
        return this.__data__.set(n4, zt3), this;
      }
      function fc(n4) {
        return this.__data__.has(n4);
      }
      gt2.prototype.add = gt2.prototype.push = oc, gt2.prototype.has = fc;
      function Rn(n4) {
        var t = this.__data__ = new Bn(n4);
        this.size = t.size;
      }
      function cc() {
        this.__data__ = new Bn(), this.size = 0;
      }
      function hc(n4) {
        var t = this.__data__, e2 = t.delete(n4);
        return this.size = t.size, e2;
      }
      function lc(n4) {
        return this.__data__.get(n4);
      }
      function pc(n4) {
        return this.__data__.has(n4);
      }
      function dc(n4, t) {
        var e2 = this.__data__;
        if (e2 instanceof Bn) {
          var r3 = e2.__data__;
          if (!te2 || r3.length < w4 - 1) return r3.push([n4, t]), this.size = ++e2.size, this;
          e2 = this.__data__ = new Gn2(r3);
        }
        return e2.set(n4, t), this.size = e2.size, this;
      }
      Rn.prototype.clear = cc, Rn.prototype.delete = hc, Rn.prototype.get = lc, Rn.prototype.has = pc, Rn.prototype.set = dc;
      function Ms3(n4, t) {
        var e2 = O4(n4), r3 = !e2 && Pt2(n4), s2 = !e2 && !r3 && at2(n4), o5 = !e2 && !r3 && !s2 && Bt3(n4), f5 = e2 || r3 || s2 || o5, c5 = f5 ? Fr3(n4.length, xf2) : [], l4 = c5.length;
        for (var v4 in n4) (t || F.call(n4, v4)) && !(f5 && (v4 == "length" || s2 && (v4 == "offset" || v4 == "parent") || o5 && (v4 == "buffer" || v4 == "byteLength" || v4 == "byteOffset") || Zn2(v4, l4))) && c5.push(v4);
        return c5;
      }
      function qs3(n4) {
        var t = n4.length;
        return t ? n4[ei(0, t - 1)] : i3;
      }
      function gc(n4, t) {
        return tr3(un2(n4), vt2(t, 0, n4.length));
      }
      function vc(n4) {
        return tr3(un2(n4));
      }
      function Yr2(n4, t, e2) {
        (e2 !== i3 && !bn2(n4[t], e2) || e2 === i3 && !(t in n4)) && zn2(n4, t, e2);
      }
      function se2(n4, t, e2) {
        var r3 = n4[t];
        (!(F.call(n4, t) && bn2(r3, e2)) || e2 === i3 && !(t in n4)) && zn2(n4, t, e2);
      }
      function Be4(n4, t) {
        for (var e2 = n4.length; e2--; ) if (bn2(n4[e2][0], t)) return e2;
        return -1;
      }
      function _c(n4, t, e2, r3) {
        return rt2(n4, function(s2, o5, f5) {
          t(r3, s2, e2(s2), f5);
        }), r3;
      }
      function Bs3(n4, t) {
        return n4 && Un2(t, V4(t), n4);
      }
      function mc(n4, t) {
        return n4 && Un2(t, on2(t), n4);
      }
      function zn2(n4, t, e2) {
        t == "__proto__" && $e3 ? $e3(n4, t, { configurable: true, enumerable: true, value: e2, writable: true }) : n4[t] = e2;
      }
      function Zr(n4, t) {
        for (var e2 = -1, r3 = t.length, s2 = d3(r3), o5 = n4 == null; ++e2 < r3; ) s2[e2] = o5 ? i3 : Si2(n4, t[e2]);
        return s2;
      }
      function vt2(n4, t, e2) {
        return n4 === n4 && (e2 !== i3 && (n4 = n4 <= e2 ? n4 : e2), t !== i3 && (n4 = n4 >= t ? n4 : t)), n4;
      }
      function An(n4, t, e2, r3, s2, o5) {
        var f5, c5 = t & Ln2, l4 = t & Fn2, v4 = t & xt2;
        if (e2 && (f5 = s2 ? e2(n4, r3, s2, o5) : e2(n4)), f5 !== i3) return f5;
        if (!K3(n4)) return n4;
        var _2 = O4(n4);
        if (_2) {
          if (f5 = uh2(n4), !c5) return un2(n4, f5);
        } else {
          var m3 = tn2(n4), P2 = m3 == Pe3 || m3 == zi2;
          if (at2(n4)) return lu2(n4, c5);
          if (m3 == qn2 || m3 == Ot3 || P2 && !s2) {
            if (f5 = l4 || P2 ? {} : Tu(n4), !c5) return l4 ? Xc(n4, mc(f5, n4)) : Jc(n4, Bs3(f5, n4));
          } else {
            if (!q3[m3]) return s2 ? n4 : {};
            f5 = ah2(n4, m3, c5);
          }
        }
        o5 || (o5 = new Rn());
        var I2 = o5.get(n4);
        if (I2) return I2;
        o5.set(n4, f5), ua2(n4) ? n4.forEach(function(y8) {
          f5.add(An(y8, t, e2, y8, n4, o5));
        }) : ia2(n4) && n4.forEach(function(y8, N3) {
          f5.set(N3, An(y8, t, e2, N3, n4, o5));
        });
        var E7 = v4 ? l4 ? pi2 : li : l4 ? on2 : V4, T3 = _2 ? i3 : E7(n4);
        return mn(T3 || n4, function(y8, N3) {
          T3 && (N3 = y8, y8 = n4[N3]), se2(f5, N3, An(y8, t, e2, N3, n4, o5));
        }), f5;
      }
      function wc(n4) {
        var t = V4(n4);
        return function(e2) {
          return Gs3(e2, n4, t);
        };
      }
      function Gs3(n4, t, e2) {
        var r3 = e2.length;
        if (n4 == null) return !r3;
        for (n4 = M4(n4); r3--; ) {
          var s2 = e2[r3], o5 = t[s2], f5 = n4[s2];
          if (f5 === i3 && !(s2 in n4) || !o5(f5)) return false;
        }
        return true;
      }
      function zs3(n4, t, e2) {
        if (typeof n4 != "function") throw new wn2(D4);
        return le3(function() {
          n4.apply(i3, e2);
        }, t);
      }
      function ue3(n4, t, e2, r3) {
        var s2 = -1, o5 = Ee2, f5 = true, c5 = n4.length, l4 = [], v4 = t.length;
        if (!c5) return l4;
        e2 && (t = G(t, hn2(e2))), r3 ? (o5 = Dr3, f5 = false) : t.length >= w4 && (o5 = jt3, f5 = false, t = new gt2(t));
        n: for (; ++s2 < c5; ) {
          var _2 = n4[s2], m3 = e2 == null ? _2 : e2(_2);
          if (_2 = r3 || _2 !== 0 ? _2 : 0, f5 && m3 === m3) {
            for (var P2 = v4; P2--; ) if (t[P2] === m3) continue n;
            l4.push(_2);
          } else o5(t, m3, r3) || l4.push(_2);
        }
        return l4;
      }
      var rt2 = _u2($n2), Ks3 = _u2(Xr, true);
      function Pc(n4, t) {
        var e2 = true;
        return rt2(n4, function(r3, s2, o5) {
          return e2 = !!t(r3, s2, o5), e2;
        }), e2;
      }
      function Ge3(n4, t, e2) {
        for (var r3 = -1, s2 = n4.length; ++r3 < s2; ) {
          var o5 = n4[r3], f5 = t(o5);
          if (f5 != null && (c5 === i3 ? f5 === f5 && !pn(f5) : e2(f5, c5))) var c5 = f5, l4 = o5;
        }
        return l4;
      }
      function Ac(n4, t, e2, r3) {
        var s2 = n4.length;
        for (e2 = R2(e2), e2 < 0 && (e2 = -e2 > s2 ? 0 : s2 + e2), r3 = r3 === i3 || r3 > s2 ? s2 : R2(r3), r3 < 0 && (r3 += s2), r3 = e2 > r3 ? 0 : oa2(r3); e2 < r3; ) n4[e2++] = t;
        return n4;
      }
      function Ys3(n4, t) {
        var e2 = [];
        return rt2(n4, function(r3, s2, o5) {
          t(r3, s2, o5) && e2.push(r3);
        }), e2;
      }
      function j6(n4, t, e2, r3, s2) {
        var o5 = -1, f5 = n4.length;
        for (e2 || (e2 = fh2), s2 || (s2 = []); ++o5 < f5; ) {
          var c5 = n4[o5];
          t > 0 && e2(c5) ? t > 1 ? j6(c5, t - 1, e2, r3, s2) : nt2(s2, c5) : r3 || (s2[s2.length] = c5);
        }
        return s2;
      }
      var Jr2 = mu2(), Zs3 = mu2(true);
      function $n2(n4, t) {
        return n4 && Jr2(n4, t, V4);
      }
      function Xr(n4, t) {
        return n4 && Zs3(n4, t, V4);
      }
      function ze2(n4, t) {
        return jn2(t, function(e2) {
          return Jn2(n4[e2]);
        });
      }
      function _t2(n4, t) {
        t = st2(t, n4);
        for (var e2 = 0, r3 = t.length; n4 != null && e2 < r3; ) n4 = n4[Wn2(t[e2++])];
        return e2 && e2 == r3 ? n4 : i3;
      }
      function Js3(n4, t, e2) {
        var r3 = t(n4);
        return O4(n4) ? r3 : nt2(r3, e2(n4));
      }
      function en2(n4) {
        return n4 == null ? n4 === i3 ? Ja2 : Ya2 : pt2 && pt2 in M4(n4) ? rh2(n4) : vh(n4);
      }
      function Qr2(n4, t) {
        return n4 > t;
      }
      function Cc(n4, t) {
        return n4 != null && F.call(n4, t);
      }
      function Ic(n4, t) {
        return n4 != null && t in M4(n4);
      }
      function xc(n4, t, e2) {
        return n4 >= nn2(t, e2) && n4 < Q4(t, e2);
      }
      function Vr2(n4, t, e2) {
        for (var r3 = e2 ? Dr3 : Ee2, s2 = n4[0].length, o5 = n4.length, f5 = o5, c5 = d3(o5), l4 = 1 / 0, v4 = []; f5--; ) {
          var _2 = n4[f5];
          f5 && t && (_2 = G(_2, hn2(t))), l4 = nn2(_2.length, l4), c5[f5] = !e2 && (t || s2 >= 120 && _2.length >= 120) ? new gt2(f5 && _2) : i3;
        }
        _2 = n4[0];
        var m3 = -1, P2 = c5[0];
        n: for (; ++m3 < s2 && v4.length < l4; ) {
          var I2 = _2[m3], E7 = t ? t(I2) : I2;
          if (I2 = e2 || I2 !== 0 ? I2 : 0, !(P2 ? jt3(P2, E7) : r3(v4, E7, e2))) {
            for (f5 = o5; --f5; ) {
              var T3 = c5[f5];
              if (!(T3 ? jt3(T3, E7) : r3(n4[f5], E7, e2))) continue n;
            }
            P2 && P2.push(E7), v4.push(I2);
          }
        }
        return v4;
      }
      function Ec(n4, t, e2, r3) {
        return $n2(n4, function(s2, o5, f5) {
          t(r3, e2(s2), o5, f5);
        }), r3;
      }
      function ae2(n4, t, e2) {
        t = st2(t, n4), n4 = Hu(n4, t);
        var r3 = n4 == null ? n4 : n4[Wn2(In2(t))];
        return r3 == null ? i3 : cn2(r3, n4, e2);
      }
      function Xs3(n4) {
        return Y(n4) && en2(n4) == Ot3;
      }
      function yc(n4) {
        return Y(n4) && en2(n4) == kt3;
      }
      function Sc(n4) {
        return Y(n4) && en2(n4) == Zt3;
      }
      function oe3(n4, t, e2, r3, s2) {
        return n4 === t ? true : n4 == null || t == null || !Y(n4) && !Y(t) ? n4 !== n4 && t !== t : Oc(n4, t, e2, r3, oe3, s2);
      }
      function Oc(n4, t, e2, r3, s2, o5) {
        var f5 = O4(n4), c5 = O4(t), l4 = f5 ? me3 : tn2(n4), v4 = c5 ? me3 : tn2(t);
        l4 = l4 == Ot3 ? qn2 : l4, v4 = v4 == Ot3 ? qn2 : v4;
        var _2 = l4 == qn2, m3 = v4 == qn2, P2 = l4 == v4;
        if (P2 && at2(n4)) {
          if (!at2(t)) return false;
          f5 = true, _2 = false;
        }
        if (P2 && !_2) return o5 || (o5 = new Rn()), f5 || Bt3(n4) ? Ou2(n4, t, e2, r3, s2, o5) : th2(n4, t, l4, e2, r3, s2, o5);
        if (!(e2 & Et2)) {
          var I2 = _2 && F.call(n4, "__wrapped__"), E7 = m3 && F.call(t, "__wrapped__");
          if (I2 || E7) {
            var T3 = I2 ? n4.value() : n4, y8 = E7 ? t.value() : t;
            return o5 || (o5 = new Rn()), s2(T3, y8, e2, r3, o5);
          }
        }
        return P2 ? (o5 || (o5 = new Rn()), eh2(n4, t, e2, r3, s2, o5)) : false;
      }
      function Rc(n4) {
        return Y(n4) && tn2(n4) == yn2;
      }
      function kr2(n4, t, e2, r3) {
        var s2 = e2.length, o5 = s2, f5 = !r3;
        if (n4 == null) return !o5;
        for (n4 = M4(n4); s2--; ) {
          var c5 = e2[s2];
          if (f5 && c5[2] ? c5[1] !== n4[c5[0]] : !(c5[0] in n4)) return false;
        }
        for (; ++s2 < o5; ) {
          c5 = e2[s2];
          var l4 = c5[0], v4 = n4[l4], _2 = c5[1];
          if (f5 && c5[2]) {
            if (v4 === i3 && !(l4 in n4)) return false;
          } else {
            var m3 = new Rn();
            if (r3) var P2 = r3(v4, _2, l4, n4, t, m3);
            if (!(P2 === i3 ? oe3(_2, v4, Et2 | ve2, r3, m3) : P2)) return false;
          }
        }
        return true;
      }
      function Qs3(n4) {
        if (!K3(n4) || hh2(n4)) return false;
        var t = Jn2(n4) ? Rf2 : mo2;
        return t.test(wt2(n4));
      }
      function bc(n4) {
        return Y(n4) && en2(n4) == Xt4;
      }
      function Tc(n4) {
        return Y(n4) && tn2(n4) == Sn2;
      }
      function Lc(n4) {
        return Y(n4) && ar3(n4.length) && !!B2[en2(n4)];
      }
      function Vs3(n4) {
        return typeof n4 == "function" ? n4 : n4 == null ? fn2 : typeof n4 == "object" ? O4(n4) ? nu2(n4[0], n4[1]) : js3(n4) : wa2(n4);
      }
      function jr2(n4) {
        if (!he2(n4)) return Hf2(n4);
        var t = [];
        for (var e2 in M4(n4)) F.call(n4, e2) && e2 != "constructor" && t.push(e2);
        return t;
      }
      function Dc(n4) {
        if (!K3(n4)) return gh(n4);
        var t = he2(n4), e2 = [];
        for (var r3 in n4) r3 == "constructor" && (t || !F.call(n4, r3)) || e2.push(r3);
        return e2;
      }
      function ni(n4, t) {
        return n4 < t;
      }
      function ks3(n4, t) {
        var e2 = -1, r3 = an2(n4) ? d3(n4.length) : [];
        return rt2(n4, function(s2, o5, f5) {
          r3[++e2] = t(s2, o5, f5);
        }), r3;
      }
      function js3(n4) {
        var t = gi2(n4);
        return t.length == 1 && t[0][2] ? Du2(t[0][0], t[0][1]) : function(e2) {
          return e2 === n4 || kr2(e2, n4, t);
        };
      }
      function nu2(n4, t) {
        return _i2(n4) && Lu(t) ? Du2(Wn2(n4), t) : function(e2) {
          var r3 = Si2(e2, n4);
          return r3 === i3 && r3 === t ? Oi2(e2, n4) : oe3(t, r3, Et2 | ve2);
        };
      }
      function Ke3(n4, t, e2, r3, s2) {
        n4 !== t && Jr2(t, function(o5, f5) {
          if (s2 || (s2 = new Rn()), K3(o5)) Nc(n4, t, f5, e2, Ke3, r3, s2);
          else {
            var c5 = r3 ? r3(wi2(n4, f5), o5, f5 + "", n4, t, s2) : i3;
            c5 === i3 && (c5 = o5), Yr2(n4, f5, c5);
          }
        }, on2);
      }
      function Nc(n4, t, e2, r3, s2, o5, f5) {
        var c5 = wi2(n4, e2), l4 = wi2(t, e2), v4 = f5.get(l4);
        if (v4) {
          Yr2(n4, e2, v4);
          return;
        }
        var _2 = o5 ? o5(c5, l4, e2 + "", n4, t, f5) : i3, m3 = _2 === i3;
        if (m3) {
          var P2 = O4(l4), I2 = !P2 && at2(l4), E7 = !P2 && !I2 && Bt3(l4);
          _2 = l4, P2 || I2 || E7 ? O4(c5) ? _2 = c5 : Z2(c5) ? _2 = un2(c5) : I2 ? (m3 = false, _2 = lu2(l4, true)) : E7 ? (m3 = false, _2 = pu2(l4, true)) : _2 = [] : pe3(l4) || Pt2(l4) ? (_2 = c5, Pt2(c5) ? _2 = fa2(c5) : (!K3(c5) || Jn2(c5)) && (_2 = Tu(l4))) : m3 = false;
        }
        m3 && (f5.set(l4, _2), s2(_2, l4, r3, o5, f5), f5.delete(l4)), Yr2(n4, e2, _2);
      }
      function tu2(n4, t) {
        var e2 = n4.length;
        if (e2) return t += t < 0 ? e2 : 0, Zn2(t, e2) ? n4[t] : i3;
      }
      function eu2(n4, t, e2) {
        t.length ? t = G(t, function(o5) {
          return O4(o5) ? function(f5) {
            return _t2(f5, o5.length === 1 ? o5[0] : o5);
          } : o5;
        }) : t = [fn2];
        var r3 = -1;
        t = G(t, hn2(x2()));
        var s2 = ks3(n4, function(o5, f5, c5) {
          var l4 = G(t, function(v4) {
            return v4(o5);
          });
          return { criteria: l4, index: ++r3, value: o5 };
        });
        return af2(s2, function(o5, f5) {
          return Zc(o5, f5, e2);
        });
      }
      function Hc(n4, t) {
        return ru2(n4, t, function(e2, r3) {
          return Oi2(n4, r3);
        });
      }
      function ru2(n4, t, e2) {
        for (var r3 = -1, s2 = t.length, o5 = {}; ++r3 < s2; ) {
          var f5 = t[r3], c5 = _t2(n4, f5);
          e2(c5, f5) && fe3(o5, st2(f5, n4), c5);
        }
        return o5;
      }
      function $c(n4) {
        return function(t) {
          return _t2(t, n4);
        };
      }
      function ti(n4, t, e2, r3) {
        var s2 = r3 ? uf2 : Tt3, o5 = -1, f5 = t.length, c5 = n4;
        for (n4 === t && (t = un2(t)), e2 && (c5 = G(n4, hn2(e2))); ++o5 < f5; ) for (var l4 = 0, v4 = t[o5], _2 = e2 ? e2(v4) : v4; (l4 = s2(c5, _2, l4, r3)) > -1; ) c5 !== n4 && He3.call(c5, l4, 1), He3.call(n4, l4, 1);
        return n4;
      }
      function iu2(n4, t) {
        for (var e2 = n4 ? t.length : 0, r3 = e2 - 1; e2--; ) {
          var s2 = t[e2];
          if (e2 == r3 || s2 !== o5) {
            var o5 = s2;
            Zn2(s2) ? He3.call(n4, s2, 1) : si(n4, s2);
          }
        }
        return n4;
      }
      function ei(n4, t) {
        return n4 + We4(Ws3() * (t - n4 + 1));
      }
      function Uc(n4, t, e2, r3) {
        for (var s2 = -1, o5 = Q4(Ue3((t - n4) / (e2 || 1)), 0), f5 = d3(o5); o5--; ) f5[r3 ? o5 : ++s2] = n4, n4 += e2;
        return f5;
      }
      function ri(n4, t) {
        var e2 = "";
        if (!n4 || t < 1 || t > kn2) return e2;
        do
          t % 2 && (e2 += n4), t = We4(t / 2), t && (n4 += n4);
        while (t);
        return e2;
      }
      function L5(n4, t) {
        return Pi2(Nu2(n4, t, fn2), n4 + "");
      }
      function Wc(n4) {
        return qs3(Gt3(n4));
      }
      function Fc(n4, t) {
        var e2 = Gt3(n4);
        return tr3(e2, vt2(t, 0, e2.length));
      }
      function fe3(n4, t, e2, r3) {
        if (!K3(n4)) return n4;
        t = st2(t, n4);
        for (var s2 = -1, o5 = t.length, f5 = o5 - 1, c5 = n4; c5 != null && ++s2 < o5; ) {
          var l4 = Wn2(t[s2]), v4 = e2;
          if (l4 === "__proto__" || l4 === "constructor" || l4 === "prototype") return n4;
          if (s2 != f5) {
            var _2 = c5[l4];
            v4 = r3 ? r3(_2, l4, c5) : i3, v4 === i3 && (v4 = K3(_2) ? _2 : Zn2(t[s2 + 1]) ? [] : {});
          }
          se2(c5, l4, v4), c5 = c5[l4];
        }
        return n4;
      }
      var su = Fe3 ? function(n4, t) {
        return Fe3.set(n4, t), n4;
      } : fn2, Mc = $e3 ? function(n4, t) {
        return $e3(n4, "toString", { configurable: true, enumerable: false, value: bi2(t), writable: true });
      } : fn2;
      function qc(n4) {
        return tr3(Gt3(n4));
      }
      function Cn(n4, t, e2) {
        var r3 = -1, s2 = n4.length;
        t < 0 && (t = -t > s2 ? 0 : s2 + t), e2 = e2 > s2 ? s2 : e2, e2 < 0 && (e2 += s2), s2 = t > e2 ? 0 : e2 - t >>> 0, t >>>= 0;
        for (var o5 = d3(s2); ++r3 < s2; ) o5[r3] = n4[r3 + t];
        return o5;
      }
      function Bc(n4, t) {
        var e2;
        return rt2(n4, function(r3, s2, o5) {
          return e2 = t(r3, s2, o5), !e2;
        }), !!e2;
      }
      function Ye3(n4, t, e2) {
        var r3 = 0, s2 = n4 == null ? r3 : n4.length;
        if (typeof t == "number" && t === t && s2 <= Ba2) {
          for (; r3 < s2; ) {
            var o5 = r3 + s2 >>> 1, f5 = n4[o5];
            f5 !== null && !pn(f5) && (e2 ? f5 <= t : f5 < t) ? r3 = o5 + 1 : s2 = o5;
          }
          return s2;
        }
        return ii(n4, t, fn2, e2);
      }
      function ii(n4, t, e2, r3) {
        var s2 = 0, o5 = n4 == null ? 0 : n4.length;
        if (o5 === 0) return 0;
        t = e2(t);
        for (var f5 = t !== t, c5 = t === null, l4 = pn(t), v4 = t === i3; s2 < o5; ) {
          var _2 = We4((s2 + o5) / 2), m3 = e2(n4[_2]), P2 = m3 !== i3, I2 = m3 === null, E7 = m3 === m3, T3 = pn(m3);
          if (f5) var y8 = r3 || E7;
          else v4 ? y8 = E7 && (r3 || P2) : c5 ? y8 = E7 && P2 && (r3 || !I2) : l4 ? y8 = E7 && P2 && !I2 && (r3 || !T3) : I2 || T3 ? y8 = false : y8 = r3 ? m3 <= t : m3 < t;
          y8 ? s2 = _2 + 1 : o5 = _2;
        }
        return nn2(o5, qa2);
      }
      function uu(n4, t) {
        for (var e2 = -1, r3 = n4.length, s2 = 0, o5 = []; ++e2 < r3; ) {
          var f5 = n4[e2], c5 = t ? t(f5) : f5;
          if (!e2 || !bn2(c5, l4)) {
            var l4 = c5;
            o5[s2++] = f5 === 0 ? 0 : f5;
          }
        }
        return o5;
      }
      function au(n4) {
        return typeof n4 == "number" ? n4 : pn(n4) ? _e3 : +n4;
      }
      function ln(n4) {
        if (typeof n4 == "string") return n4;
        if (O4(n4)) return G(n4, ln) + "";
        if (pn(n4)) return Fs3 ? Fs3.call(n4) : "";
        var t = n4 + "";
        return t == "0" && 1 / n4 == -ht2 ? "-0" : t;
      }
      function it2(n4, t, e2) {
        var r3 = -1, s2 = Ee2, o5 = n4.length, f5 = true, c5 = [], l4 = c5;
        if (e2) f5 = false, s2 = Dr3;
        else if (o5 >= w4) {
          var v4 = t ? null : jc(n4);
          if (v4) return Se3(v4);
          f5 = false, s2 = jt3, l4 = new gt2();
        } else l4 = t ? [] : c5;
        n: for (; ++r3 < o5; ) {
          var _2 = n4[r3], m3 = t ? t(_2) : _2;
          if (_2 = e2 || _2 !== 0 ? _2 : 0, f5 && m3 === m3) {
            for (var P2 = l4.length; P2--; ) if (l4[P2] === m3) continue n;
            t && l4.push(m3), c5.push(_2);
          } else s2(l4, m3, e2) || (l4 !== c5 && l4.push(m3), c5.push(_2));
        }
        return c5;
      }
      function si(n4, t) {
        return t = st2(t, n4), n4 = Hu(n4, t), n4 == null || delete n4[Wn2(In2(t))];
      }
      function ou2(n4, t, e2, r3) {
        return fe3(n4, t, e2(_t2(n4, t)), r3);
      }
      function Ze4(n4, t, e2, r3) {
        for (var s2 = n4.length, o5 = r3 ? s2 : -1; (r3 ? o5-- : ++o5 < s2) && t(n4[o5], o5, n4); ) ;
        return e2 ? Cn(n4, r3 ? 0 : o5, r3 ? o5 + 1 : s2) : Cn(n4, r3 ? o5 + 1 : 0, r3 ? s2 : o5);
      }
      function fu2(n4, t) {
        var e2 = n4;
        return e2 instanceof H && (e2 = e2.value()), Nr3(t, function(r3, s2) {
          return s2.func.apply(s2.thisArg, nt2([r3], s2.args));
        }, e2);
      }
      function ui(n4, t, e2) {
        var r3 = n4.length;
        if (r3 < 2) return r3 ? it2(n4[0]) : [];
        for (var s2 = -1, o5 = d3(r3); ++s2 < r3; ) for (var f5 = n4[s2], c5 = -1; ++c5 < r3; ) c5 != s2 && (o5[s2] = ue3(o5[s2] || f5, n4[c5], t, e2));
        return it2(j6(o5, 1), t, e2);
      }
      function cu2(n4, t, e2) {
        for (var r3 = -1, s2 = n4.length, o5 = t.length, f5 = {}; ++r3 < s2; ) {
          var c5 = r3 < o5 ? t[r3] : i3;
          e2(f5, n4[r3], c5);
        }
        return f5;
      }
      function ai(n4) {
        return Z2(n4) ? n4 : [];
      }
      function oi(n4) {
        return typeof n4 == "function" ? n4 : fn2;
      }
      function st2(n4, t) {
        return O4(n4) ? n4 : _i2(n4, t) ? [n4] : Fu(W2(n4));
      }
      var Gc = L5;
      function ut2(n4, t, e2) {
        var r3 = n4.length;
        return e2 = e2 === i3 ? r3 : e2, !t && e2 >= r3 ? n4 : Cn(n4, t, e2);
      }
      var hu = bf2 || function(n4) {
        return k3.clearTimeout(n4);
      };
      function lu2(n4, t) {
        if (t) return n4.slice();
        var e2 = n4.length, r3 = Ds3 ? Ds3(e2) : new n4.constructor(e2);
        return n4.copy(r3), r3;
      }
      function fi(n4) {
        var t = new n4.constructor(n4.byteLength);
        return new De2(t).set(new De2(n4)), t;
      }
      function zc(n4, t) {
        var e2 = t ? fi(n4.buffer) : n4.buffer;
        return new n4.constructor(e2, n4.byteOffset, n4.byteLength);
      }
      function Kc(n4) {
        var t = new n4.constructor(n4.source, Xi3.exec(n4));
        return t.lastIndex = n4.lastIndex, t;
      }
      function Yc(n4) {
        return ie4 ? M4(ie4.call(n4)) : {};
      }
      function pu2(n4, t) {
        var e2 = t ? fi(n4.buffer) : n4.buffer;
        return new n4.constructor(e2, n4.byteOffset, n4.length);
      }
      function du2(n4, t) {
        if (n4 !== t) {
          var e2 = n4 !== i3, r3 = n4 === null, s2 = n4 === n4, o5 = pn(n4), f5 = t !== i3, c5 = t === null, l4 = t === t, v4 = pn(t);
          if (!c5 && !v4 && !o5 && n4 > t || o5 && f5 && l4 && !c5 && !v4 || r3 && f5 && l4 || !e2 && l4 || !s2) return 1;
          if (!r3 && !o5 && !v4 && n4 < t || v4 && e2 && s2 && !r3 && !o5 || c5 && e2 && s2 || !f5 && s2 || !l4) return -1;
        }
        return 0;
      }
      function Zc(n4, t, e2) {
        for (var r3 = -1, s2 = n4.criteria, o5 = t.criteria, f5 = s2.length, c5 = e2.length; ++r3 < f5; ) {
          var l4 = du2(s2[r3], o5[r3]);
          if (l4) {
            if (r3 >= c5) return l4;
            var v4 = e2[r3];
            return l4 * (v4 == "desc" ? -1 : 1);
          }
        }
        return n4.index - t.index;
      }
      function gu2(n4, t, e2, r3) {
        for (var s2 = -1, o5 = n4.length, f5 = e2.length, c5 = -1, l4 = t.length, v4 = Q4(o5 - f5, 0), _2 = d3(l4 + v4), m3 = !r3; ++c5 < l4; ) _2[c5] = t[c5];
        for (; ++s2 < f5; ) (m3 || s2 < o5) && (_2[e2[s2]] = n4[s2]);
        for (; v4--; ) _2[c5++] = n4[s2++];
        return _2;
      }
      function vu2(n4, t, e2, r3) {
        for (var s2 = -1, o5 = n4.length, f5 = -1, c5 = e2.length, l4 = -1, v4 = t.length, _2 = Q4(o5 - c5, 0), m3 = d3(_2 + v4), P2 = !r3; ++s2 < _2; ) m3[s2] = n4[s2];
        for (var I2 = s2; ++l4 < v4; ) m3[I2 + l4] = t[l4];
        for (; ++f5 < c5; ) (P2 || s2 < o5) && (m3[I2 + e2[f5]] = n4[s2++]);
        return m3;
      }
      function un2(n4, t) {
        var e2 = -1, r3 = n4.length;
        for (t || (t = d3(r3)); ++e2 < r3; ) t[e2] = n4[e2];
        return t;
      }
      function Un2(n4, t, e2, r3) {
        var s2 = !e2;
        e2 || (e2 = {});
        for (var o5 = -1, f5 = t.length; ++o5 < f5; ) {
          var c5 = t[o5], l4 = r3 ? r3(e2[c5], n4[c5], c5, e2, n4) : i3;
          l4 === i3 && (l4 = n4[c5]), s2 ? zn2(e2, c5, l4) : se2(e2, c5, l4);
        }
        return e2;
      }
      function Jc(n4, t) {
        return Un2(n4, vi2(n4), t);
      }
      function Xc(n4, t) {
        return Un2(n4, Ru2(n4), t);
      }
      function Je3(n4, t) {
        return function(e2, r3) {
          var s2 = O4(e2) ? jo : _c, o5 = t ? t() : {};
          return s2(e2, n4, x2(r3, 2), o5);
        };
      }
      function Ft3(n4) {
        return L5(function(t, e2) {
          var r3 = -1, s2 = e2.length, o5 = s2 > 1 ? e2[s2 - 1] : i3, f5 = s2 > 2 ? e2[2] : i3;
          for (o5 = n4.length > 3 && typeof o5 == "function" ? (s2--, o5) : i3, f5 && rn2(e2[0], e2[1], f5) && (o5 = s2 < 3 ? i3 : o5, s2 = 1), t = M4(t); ++r3 < s2; ) {
            var c5 = e2[r3];
            c5 && n4(t, c5, r3, o5);
          }
          return t;
        });
      }
      function _u2(n4, t) {
        return function(e2, r3) {
          if (e2 == null) return e2;
          if (!an2(e2)) return n4(e2, r3);
          for (var s2 = e2.length, o5 = t ? s2 : -1, f5 = M4(e2); (t ? o5-- : ++o5 < s2) && r3(f5[o5], o5, f5) !== false; ) ;
          return e2;
        };
      }
      function mu2(n4) {
        return function(t, e2, r3) {
          for (var s2 = -1, o5 = M4(t), f5 = r3(t), c5 = f5.length; c5--; ) {
            var l4 = f5[n4 ? c5 : ++s2];
            if (e2(o5[l4], l4, o5) === false) break;
          }
          return t;
        };
      }
      function Qc(n4, t, e2) {
        var r3 = t & vn, s2 = ce2(n4);
        function o5() {
          var f5 = this && this !== k3 && this instanceof o5 ? s2 : n4;
          return f5.apply(r3 ? e2 : this, arguments);
        }
        return o5;
      }
      function wu2(n4) {
        return function(t) {
          t = W2(t);
          var e2 = Lt3(t) ? On2(t) : i3, r3 = e2 ? e2[0] : t.charAt(0), s2 = e2 ? ut2(e2, 1).join("") : t.slice(1);
          return r3[n4]() + s2;
        };
      }
      function Mt2(n4) {
        return function(t) {
          return Nr3(_a2(va2(t).replace(Fo2, "")), n4, "");
        };
      }
      function ce2(n4) {
        return function() {
          var t = arguments;
          switch (t.length) {
            case 0:
              return new n4();
            case 1:
              return new n4(t[0]);
            case 2:
              return new n4(t[0], t[1]);
            case 3:
              return new n4(t[0], t[1], t[2]);
            case 4:
              return new n4(t[0], t[1], t[2], t[3]);
            case 5:
              return new n4(t[0], t[1], t[2], t[3], t[4]);
            case 6:
              return new n4(t[0], t[1], t[2], t[3], t[4], t[5]);
            case 7:
              return new n4(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
          }
          var e2 = Wt4(n4.prototype), r3 = n4.apply(e2, t);
          return K3(r3) ? r3 : e2;
        };
      }
      function Vc(n4, t, e2) {
        var r3 = ce2(n4);
        function s2() {
          for (var o5 = arguments.length, f5 = d3(o5), c5 = o5, l4 = qt3(s2); c5--; ) f5[c5] = arguments[c5];
          var v4 = o5 < 3 && f5[0] !== l4 && f5[o5 - 1] !== l4 ? [] : tt2(f5, l4);
          if (o5 -= v4.length, o5 < e2) return xu2(n4, t, Xe4, s2.placeholder, i3, f5, v4, i3, i3, e2 - o5);
          var _2 = this && this !== k3 && this instanceof s2 ? r3 : n4;
          return cn2(_2, this, f5);
        }
        return s2;
      }
      function Pu2(n4) {
        return function(t, e2, r3) {
          var s2 = M4(t);
          if (!an2(t)) {
            var o5 = x2(e2, 3);
            t = V4(t), e2 = function(c5) {
              return o5(s2[c5], c5, s2);
            };
          }
          var f5 = n4(t, e2, r3);
          return f5 > -1 ? s2[o5 ? t[f5] : f5] : i3;
        };
      }
      function Au2(n4) {
        return Yn2(function(t) {
          var e2 = t.length, r3 = e2, s2 = Pn2.prototype.thru;
          for (n4 && t.reverse(); r3--; ) {
            var o5 = t[r3];
            if (typeof o5 != "function") throw new wn2(D4);
            if (s2 && !f5 && je3(o5) == "wrapper") var f5 = new Pn2([], true);
          }
          for (r3 = f5 ? r3 : e2; ++r3 < e2; ) {
            o5 = t[r3];
            var c5 = je3(o5), l4 = c5 == "wrapper" ? di(o5) : i3;
            l4 && mi(l4[0]) && l4[1] == (Mn | Dn2 | Nn2 | Kt3) && !l4[4].length && l4[9] == 1 ? f5 = f5[je3(l4[0])].apply(f5, l4[3]) : f5 = o5.length == 1 && mi(o5) ? f5[c5]() : f5.thru(o5);
          }
          return function() {
            var v4 = arguments, _2 = v4[0];
            if (f5 && v4.length == 1 && O4(_2)) return f5.plant(_2).value();
            for (var m3 = 0, P2 = e2 ? t[m3].apply(this, v4) : _2; ++m3 < e2; ) P2 = t[m3].call(this, P2);
            return P2;
          };
        });
      }
      function Xe4(n4, t, e2, r3, s2, o5, f5, c5, l4, v4) {
        var _2 = t & Mn, m3 = t & vn, P2 = t & ct2, I2 = t & (Dn2 | yt2), E7 = t & dr3, T3 = P2 ? i3 : ce2(n4);
        function y8() {
          for (var N3 = arguments.length, $3 = d3(N3), dn2 = N3; dn2--; ) $3[dn2] = arguments[dn2];
          if (I2) var sn2 = qt3(y8), gn = ff2($3, sn2);
          if (r3 && ($3 = gu2($3, r3, s2, I2)), o5 && ($3 = vu2($3, o5, f5, I2)), N3 -= gn, I2 && N3 < v4) {
            var J2 = tt2($3, sn2);
            return xu2(n4, t, Xe4, y8.placeholder, e2, $3, J2, c5, l4, v4 - N3);
          }
          var Tn2 = m3 ? e2 : this, Qn2 = P2 ? Tn2[n4] : n4;
          return N3 = $3.length, c5 ? $3 = _h($3, c5) : E7 && N3 > 1 && $3.reverse(), _2 && l4 < N3 && ($3.length = l4), this && this !== k3 && this instanceof y8 && (Qn2 = T3 || ce2(Qn2)), Qn2.apply(Tn2, $3);
        }
        return y8;
      }
      function Cu2(n4, t) {
        return function(e2, r3) {
          return Ec(e2, n4, t(r3), {});
        };
      }
      function Qe3(n4, t) {
        return function(e2, r3) {
          var s2;
          if (e2 === i3 && r3 === i3) return t;
          if (e2 !== i3 && (s2 = e2), r3 !== i3) {
            if (s2 === i3) return r3;
            typeof e2 == "string" || typeof r3 == "string" ? (e2 = ln(e2), r3 = ln(r3)) : (e2 = au(e2), r3 = au(r3)), s2 = n4(e2, r3);
          }
          return s2;
        };
      }
      function ci(n4) {
        return Yn2(function(t) {
          return t = G(t, hn2(x2())), L5(function(e2) {
            var r3 = this;
            return n4(t, function(s2) {
              return cn2(s2, r3, e2);
            });
          });
        });
      }
      function Ve2(n4, t) {
        t = t === i3 ? " " : ln(t);
        var e2 = t.length;
        if (e2 < 2) return e2 ? ri(t, n4) : t;
        var r3 = ri(t, Ue3(n4 / Dt3(t)));
        return Lt3(t) ? ut2(On2(r3), 0, n4).join("") : r3.slice(0, n4);
      }
      function kc(n4, t, e2, r3) {
        var s2 = t & vn, o5 = ce2(n4);
        function f5() {
          for (var c5 = -1, l4 = arguments.length, v4 = -1, _2 = r3.length, m3 = d3(_2 + l4), P2 = this && this !== k3 && this instanceof f5 ? o5 : n4; ++v4 < _2; ) m3[v4] = r3[v4];
          for (; l4--; ) m3[v4++] = arguments[++c5];
          return cn2(P2, s2 ? e2 : this, m3);
        }
        return f5;
      }
      function Iu2(n4) {
        return function(t, e2, r3) {
          return r3 && typeof r3 != "number" && rn2(t, e2, r3) && (e2 = r3 = i3), t = Xn2(t), e2 === i3 ? (e2 = t, t = 0) : e2 = Xn2(e2), r3 = r3 === i3 ? t < e2 ? 1 : -1 : Xn2(r3), Uc(t, e2, r3, n4);
        };
      }
      function ke3(n4) {
        return function(t, e2) {
          return typeof t == "string" && typeof e2 == "string" || (t = xn2(t), e2 = xn2(e2)), n4(t, e2);
        };
      }
      function xu2(n4, t, e2, r3, s2, o5, f5, c5, l4, v4) {
        var _2 = t & Dn2, m3 = _2 ? f5 : i3, P2 = _2 ? i3 : f5, I2 = _2 ? o5 : i3, E7 = _2 ? i3 : o5;
        t |= _2 ? Nn2 : St2, t &= ~(_2 ? St2 : Nn2), t & Bi2 || (t &= ~(vn | ct2));
        var T3 = [n4, t, s2, I2, m3, E7, P2, c5, l4, v4], y8 = e2.apply(i3, T3);
        return mi(n4) && $u2(y8, T3), y8.placeholder = r3, Uu(y8, n4, t);
      }
      function hi2(n4) {
        var t = X3[n4];
        return function(e2, r3) {
          if (e2 = xn2(e2), r3 = r3 == null ? 0 : nn2(R2(r3), 292), r3 && Us3(e2)) {
            var s2 = (W2(e2) + "e").split("e"), o5 = t(s2[0] + "e" + (+s2[1] + r3));
            return s2 = (W2(o5) + "e").split("e"), +(s2[0] + "e" + (+s2[1] - r3));
          }
          return t(e2);
        };
      }
      var jc = $t4 && 1 / Se3(new $t4([, -0]))[1] == ht2 ? function(n4) {
        return new $t4(n4);
      } : Di2;
      function Eu2(n4) {
        return function(t) {
          var e2 = tn2(t);
          return e2 == yn2 ? qr2(t) : e2 == Sn2 ? vf2(t) : of2(t, n4(t));
        };
      }
      function Kn2(n4, t, e2, r3, s2, o5, f5, c5) {
        var l4 = t & ct2;
        if (!l4 && typeof n4 != "function") throw new wn2(D4);
        var v4 = r3 ? r3.length : 0;
        if (v4 || (t &= ~(Nn2 | St2), r3 = s2 = i3), f5 = f5 === i3 ? f5 : Q4(R2(f5), 0), c5 = c5 === i3 ? c5 : R2(c5), v4 -= s2 ? s2.length : 0, t & St2) {
          var _2 = r3, m3 = s2;
          r3 = s2 = i3;
        }
        var P2 = l4 ? i3 : di(n4), I2 = [n4, t, e2, r3, s2, _2, m3, o5, f5, c5];
        if (P2 && dh(I2, P2), n4 = I2[0], t = I2[1], e2 = I2[2], r3 = I2[3], s2 = I2[4], c5 = I2[9] = I2[9] === i3 ? l4 ? 0 : n4.length : Q4(I2[9] - v4, 0), !c5 && t & (Dn2 | yt2) && (t &= ~(Dn2 | yt2)), !t || t == vn) var E7 = Qc(n4, t, e2);
        else t == Dn2 || t == yt2 ? E7 = Vc(n4, t, c5) : (t == Nn2 || t == (vn | Nn2)) && !s2.length ? E7 = kc(n4, t, e2, r3) : E7 = Xe4.apply(i3, I2);
        var T3 = P2 ? su : $u2;
        return Uu(T3(E7, I2), n4, t);
      }
      function yu2(n4, t, e2, r3) {
        return n4 === i3 || bn2(n4, Ht3[e2]) && !F.call(r3, e2) ? t : n4;
      }
      function Su2(n4, t, e2, r3, s2, o5) {
        return K3(n4) && K3(t) && (o5.set(t, n4), Ke3(n4, t, i3, Su2, o5), o5.delete(t)), n4;
      }
      function nh2(n4) {
        return pe3(n4) ? i3 : n4;
      }
      function Ou2(n4, t, e2, r3, s2, o5) {
        var f5 = e2 & Et2, c5 = n4.length, l4 = t.length;
        if (c5 != l4 && !(f5 && l4 > c5)) return false;
        var v4 = o5.get(n4), _2 = o5.get(t);
        if (v4 && _2) return v4 == t && _2 == n4;
        var m3 = -1, P2 = true, I2 = e2 & ve2 ? new gt2() : i3;
        for (o5.set(n4, t), o5.set(t, n4); ++m3 < c5; ) {
          var E7 = n4[m3], T3 = t[m3];
          if (r3) var y8 = f5 ? r3(T3, E7, m3, t, n4, o5) : r3(E7, T3, m3, n4, t, o5);
          if (y8 !== i3) {
            if (y8) continue;
            P2 = false;
            break;
          }
          if (I2) {
            if (!Hr2(t, function(N3, $3) {
              if (!jt3(I2, $3) && (E7 === N3 || s2(E7, N3, e2, r3, o5))) return I2.push($3);
            })) {
              P2 = false;
              break;
            }
          } else if (!(E7 === T3 || s2(E7, T3, e2, r3, o5))) {
            P2 = false;
            break;
          }
        }
        return o5.delete(n4), o5.delete(t), P2;
      }
      function th2(n4, t, e2, r3, s2, o5, f5) {
        switch (e2) {
          case Rt2:
            if (n4.byteLength != t.byteLength || n4.byteOffset != t.byteOffset) return false;
            n4 = n4.buffer, t = t.buffer;
          case kt3:
            return !(n4.byteLength != t.byteLength || !o5(new De2(n4), new De2(t)));
          case Yt3:
          case Zt3:
          case Jt4:
            return bn2(+n4, +t);
          case we2:
            return n4.name == t.name && n4.message == t.message;
          case Xt4:
          case Qt2:
            return n4 == t + "";
          case yn2:
            var c5 = qr2;
          case Sn2:
            var l4 = r3 & Et2;
            if (c5 || (c5 = Se3), n4.size != t.size && !l4) return false;
            var v4 = f5.get(n4);
            if (v4) return v4 == t;
            r3 |= ve2, f5.set(n4, t);
            var _2 = Ou2(c5(n4), c5(t), r3, s2, o5, f5);
            return f5.delete(n4), _2;
          case Ae2:
            if (ie4) return ie4.call(n4) == ie4.call(t);
        }
        return false;
      }
      function eh2(n4, t, e2, r3, s2, o5) {
        var f5 = e2 & Et2, c5 = li(n4), l4 = c5.length, v4 = li(t), _2 = v4.length;
        if (l4 != _2 && !f5) return false;
        for (var m3 = l4; m3--; ) {
          var P2 = c5[m3];
          if (!(f5 ? P2 in t : F.call(t, P2))) return false;
        }
        var I2 = o5.get(n4), E7 = o5.get(t);
        if (I2 && E7) return I2 == t && E7 == n4;
        var T3 = true;
        o5.set(n4, t), o5.set(t, n4);
        for (var y8 = f5; ++m3 < l4; ) {
          P2 = c5[m3];
          var N3 = n4[P2], $3 = t[P2];
          if (r3) var dn2 = f5 ? r3($3, N3, P2, t, n4, o5) : r3(N3, $3, P2, n4, t, o5);
          if (!(dn2 === i3 ? N3 === $3 || s2(N3, $3, e2, r3, o5) : dn2)) {
            T3 = false;
            break;
          }
          y8 || (y8 = P2 == "constructor");
        }
        if (T3 && !y8) {
          var sn2 = n4.constructor, gn = t.constructor;
          sn2 != gn && "constructor" in n4 && "constructor" in t && !(typeof sn2 == "function" && sn2 instanceof sn2 && typeof gn == "function" && gn instanceof gn) && (T3 = false);
        }
        return o5.delete(n4), o5.delete(t), T3;
      }
      function Yn2(n4) {
        return Pi2(Nu2(n4, i3, Gu2), n4 + "");
      }
      function li(n4) {
        return Js3(n4, V4, vi2);
      }
      function pi2(n4) {
        return Js3(n4, on2, Ru2);
      }
      var di = Fe3 ? function(n4) {
        return Fe3.get(n4);
      } : Di2;
      function je3(n4) {
        for (var t = n4.name + "", e2 = Ut3[t], r3 = F.call(Ut3, t) ? e2.length : 0; r3--; ) {
          var s2 = e2[r3], o5 = s2.func;
          if (o5 == null || o5 == n4) return s2.name;
        }
        return t;
      }
      function qt3(n4) {
        var t = F.call(a4, "placeholder") ? a4 : n4;
        return t.placeholder;
      }
      function x2() {
        var n4 = a4.iteratee || Ti2;
        return n4 = n4 === Ti2 ? Vs3 : n4, arguments.length ? n4(arguments[0], arguments[1]) : n4;
      }
      function nr3(n4, t) {
        var e2 = n4.__data__;
        return ch2(t) ? e2[typeof t == "string" ? "string" : "hash"] : e2.map;
      }
      function gi2(n4) {
        for (var t = V4(n4), e2 = t.length; e2--; ) {
          var r3 = t[e2], s2 = n4[r3];
          t[e2] = [r3, s2, Lu(s2)];
        }
        return t;
      }
      function mt2(n4, t) {
        var e2 = pf2(n4, t);
        return Qs3(e2) ? e2 : i3;
      }
      function rh2(n4) {
        var t = F.call(n4, pt2), e2 = n4[pt2];
        try {
          n4[pt2] = i3;
          var r3 = true;
        } catch {
        }
        var s2 = Te.call(n4);
        return r3 && (t ? n4[pt2] = e2 : delete n4[pt2]), s2;
      }
      var vi2 = Gr2 ? function(n4) {
        return n4 == null ? [] : (n4 = M4(n4), jn2(Gr2(n4), function(t) {
          return Hs3.call(n4, t);
        }));
      } : Ni2, Ru2 = Gr2 ? function(n4) {
        for (var t = []; n4; ) nt2(t, vi2(n4)), n4 = Ne(n4);
        return t;
      } : Ni2, tn2 = en2;
      (zr3 && tn2(new zr3(new ArrayBuffer(1))) != Rt2 || te2 && tn2(new te2()) != yn2 || Kr2 && tn2(Kr2.resolve()) != Ki2 || $t4 && tn2(new $t4()) != Sn2 || ee2 && tn2(new ee2()) != Vt3) && (tn2 = function(n4) {
        var t = en2(n4), e2 = t == qn2 ? n4.constructor : i3, r3 = e2 ? wt2(e2) : "";
        if (r3) switch (r3) {
          case Ff2:
            return Rt2;
          case Mf2:
            return yn2;
          case qf2:
            return Ki2;
          case Bf2:
            return Sn2;
          case Gf2:
            return Vt3;
        }
        return t;
      });
      function ih2(n4, t, e2) {
        for (var r3 = -1, s2 = e2.length; ++r3 < s2; ) {
          var o5 = e2[r3], f5 = o5.size;
          switch (o5.type) {
            case "drop":
              n4 += f5;
              break;
            case "dropRight":
              t -= f5;
              break;
            case "take":
              t = nn2(t, n4 + f5);
              break;
            case "takeRight":
              n4 = Q4(n4, t - f5);
              break;
          }
        }
        return { start: n4, end: t };
      }
      function sh2(n4) {
        var t = n4.match(fo2);
        return t ? t[1].split(co2) : [];
      }
      function bu2(n4, t, e2) {
        t = st2(t, n4);
        for (var r3 = -1, s2 = t.length, o5 = false; ++r3 < s2; ) {
          var f5 = Wn2(t[r3]);
          if (!(o5 = n4 != null && e2(n4, f5))) break;
          n4 = n4[f5];
        }
        return o5 || ++r3 != s2 ? o5 : (s2 = n4 == null ? 0 : n4.length, !!s2 && ar3(s2) && Zn2(f5, s2) && (O4(n4) || Pt2(n4)));
      }
      function uh2(n4) {
        var t = n4.length, e2 = new n4.constructor(t);
        return t && typeof n4[0] == "string" && F.call(n4, "index") && (e2.index = n4.index, e2.input = n4.input), e2;
      }
      function Tu(n4) {
        return typeof n4.constructor == "function" && !he2(n4) ? Wt4(Ne(n4)) : {};
      }
      function ah2(n4, t, e2) {
        var r3 = n4.constructor;
        switch (t) {
          case kt3:
            return fi(n4);
          case Yt3:
          case Zt3:
            return new r3(+n4);
          case Rt2:
            return zc(n4, e2);
          case gr3:
          case vr3:
          case _r3:
          case mr3:
          case wr2:
          case Pr3:
          case Ar3:
          case Cr3:
          case Ir3:
            return pu2(n4, e2);
          case yn2:
            return new r3();
          case Jt4:
          case Qt2:
            return new r3(n4);
          case Xt4:
            return Kc(n4);
          case Sn2:
            return new r3();
          case Ae2:
            return Yc(n4);
        }
      }
      function oh2(n4, t) {
        var e2 = t.length;
        if (!e2) return n4;
        var r3 = e2 - 1;
        return t[r3] = (e2 > 1 ? "& " : "") + t[r3], t = t.join(e2 > 2 ? ", " : " "), n4.replace(oo2, `{
/* [wrapped with ` + t + `] */
`);
      }
      function fh2(n4) {
        return O4(n4) || Pt2(n4) || !!($s3 && n4 && n4[$s3]);
      }
      function Zn2(n4, t) {
        var e2 = typeof n4;
        return t = t ?? kn2, !!t && (e2 == "number" || e2 != "symbol" && Po2.test(n4)) && n4 > -1 && n4 % 1 == 0 && n4 < t;
      }
      function rn2(n4, t, e2) {
        if (!K3(e2)) return false;
        var r3 = typeof t;
        return (r3 == "number" ? an2(e2) && Zn2(t, e2.length) : r3 == "string" && t in e2) ? bn2(e2[t], n4) : false;
      }
      function _i2(n4, t) {
        if (O4(n4)) return false;
        var e2 = typeof n4;
        return e2 == "number" || e2 == "symbol" || e2 == "boolean" || n4 == null || pn(n4) ? true : io2.test(n4) || !ro2.test(n4) || t != null && n4 in M4(t);
      }
      function ch2(n4) {
        var t = typeof n4;
        return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? n4 !== "__proto__" : n4 === null;
      }
      function mi(n4) {
        var t = je3(n4), e2 = a4[t];
        if (typeof e2 != "function" || !(t in H.prototype)) return false;
        if (n4 === e2) return true;
        var r3 = di(e2);
        return !!r3 && n4 === r3[0];
      }
      function hh2(n4) {
        return !!Ls3 && Ls3 in n4;
      }
      var lh2 = Re3 ? Jn2 : Hi3;
      function he2(n4) {
        var t = n4 && n4.constructor, e2 = typeof t == "function" && t.prototype || Ht3;
        return n4 === e2;
      }
      function Lu(n4) {
        return n4 === n4 && !K3(n4);
      }
      function Du2(n4, t) {
        return function(e2) {
          return e2 == null ? false : e2[n4] === t && (t !== i3 || n4 in M4(e2));
        };
      }
      function ph(n4) {
        var t = sr3(n4, function(r3) {
          return e2.size === pr3 && e2.clear(), r3;
        }), e2 = t.cache;
        return t;
      }
      function dh(n4, t) {
        var e2 = n4[1], r3 = t[1], s2 = e2 | r3, o5 = s2 < (vn | ct2 | Mn), f5 = r3 == Mn && e2 == Dn2 || r3 == Mn && e2 == Kt3 && n4[7].length <= t[8] || r3 == (Mn | Kt3) && t[7].length <= t[8] && e2 == Dn2;
        if (!(o5 || f5)) return n4;
        r3 & vn && (n4[2] = t[2], s2 |= e2 & vn ? 0 : Bi2);
        var c5 = t[3];
        if (c5) {
          var l4 = n4[3];
          n4[3] = l4 ? gu2(l4, c5, t[4]) : c5, n4[4] = l4 ? tt2(n4[3], It2) : t[4];
        }
        return c5 = t[5], c5 && (l4 = n4[5], n4[5] = l4 ? vu2(l4, c5, t[6]) : c5, n4[6] = l4 ? tt2(n4[5], It2) : t[6]), c5 = t[7], c5 && (n4[7] = c5), r3 & Mn && (n4[8] = n4[8] == null ? t[8] : nn2(n4[8], t[8])), n4[9] == null && (n4[9] = t[9]), n4[0] = t[0], n4[1] = s2, n4;
      }
      function gh(n4) {
        var t = [];
        if (n4 != null) for (var e2 in M4(n4)) t.push(e2);
        return t;
      }
      function vh(n4) {
        return Te.call(n4);
      }
      function Nu2(n4, t, e2) {
        return t = Q4(t === i3 ? n4.length - 1 : t, 0), function() {
          for (var r3 = arguments, s2 = -1, o5 = Q4(r3.length - t, 0), f5 = d3(o5); ++s2 < o5; ) f5[s2] = r3[t + s2];
          s2 = -1;
          for (var c5 = d3(t + 1); ++s2 < t; ) c5[s2] = r3[s2];
          return c5[t] = e2(f5), cn2(n4, this, c5);
        };
      }
      function Hu(n4, t) {
        return t.length < 2 ? n4 : _t2(n4, Cn(t, 0, -1));
      }
      function _h(n4, t) {
        for (var e2 = n4.length, r3 = nn2(t.length, e2), s2 = un2(n4); r3--; ) {
          var o5 = t[r3];
          n4[r3] = Zn2(o5, e2) ? s2[o5] : i3;
        }
        return n4;
      }
      function wi2(n4, t) {
        if (!(t === "constructor" && typeof n4[t] == "function") && t != "__proto__") return n4[t];
      }
      var $u2 = Wu2(su), le3 = Lf || function(n4, t) {
        return k3.setTimeout(n4, t);
      }, Pi2 = Wu2(Mc);
      function Uu(n4, t, e2) {
        var r3 = t + "";
        return Pi2(n4, oh2(r3, mh(sh2(r3), e2)));
      }
      function Wu2(n4) {
        var t = 0, e2 = 0;
        return function() {
          var r3 = $f2(), s2 = Ua2 - (r3 - e2);
          if (e2 = r3, s2 > 0) {
            if (++t >= $a2) return arguments[0];
          } else t = 0;
          return n4.apply(i3, arguments);
        };
      }
      function tr3(n4, t) {
        var e2 = -1, r3 = n4.length, s2 = r3 - 1;
        for (t = t === i3 ? r3 : t; ++e2 < t; ) {
          var o5 = ei(e2, s2), f5 = n4[o5];
          n4[o5] = n4[e2], n4[e2] = f5;
        }
        return n4.length = t, n4;
      }
      var Fu = ph(function(n4) {
        var t = [];
        return n4.charCodeAt(0) === 46 && t.push(""), n4.replace(so2, function(e2, r3, s2, o5) {
          t.push(s2 ? o5.replace(po2, "$1") : r3 || e2);
        }), t;
      });
      function Wn2(n4) {
        if (typeof n4 == "string" || pn(n4)) return n4;
        var t = n4 + "";
        return t == "0" && 1 / n4 == -ht2 ? "-0" : t;
      }
      function wt2(n4) {
        if (n4 != null) {
          try {
            return be3.call(n4);
          } catch {
          }
          try {
            return n4 + "";
          } catch {
          }
        }
        return "";
      }
      function mh(n4, t) {
        return mn(Ga2, function(e2) {
          var r3 = "_." + e2[0];
          t & e2[1] && !Ee2(n4, r3) && n4.push(r3);
        }), n4.sort();
      }
      function Mu2(n4) {
        if (n4 instanceof H) return n4.clone();
        var t = new Pn2(n4.__wrapped__, n4.__chain__);
        return t.__actions__ = un2(n4.__actions__), t.__index__ = n4.__index__, t.__values__ = n4.__values__, t;
      }
      function wh(n4, t, e2) {
        (e2 ? rn2(n4, t, e2) : t === i3) ? t = 1 : t = Q4(R2(t), 0);
        var r3 = n4 == null ? 0 : n4.length;
        if (!r3 || t < 1) return [];
        for (var s2 = 0, o5 = 0, f5 = d3(Ue3(r3 / t)); s2 < r3; ) f5[o5++] = Cn(n4, s2, s2 += t);
        return f5;
      }
      function Ph(n4) {
        for (var t = -1, e2 = n4 == null ? 0 : n4.length, r3 = 0, s2 = []; ++t < e2; ) {
          var o5 = n4[t];
          o5 && (s2[r3++] = o5);
        }
        return s2;
      }
      function Ah() {
        var n4 = arguments.length;
        if (!n4) return [];
        for (var t = d3(n4 - 1), e2 = arguments[0], r3 = n4; r3--; ) t[r3 - 1] = arguments[r3];
        return nt2(O4(e2) ? un2(e2) : [e2], j6(t, 1));
      }
      var Ch = L5(function(n4, t) {
        return Z2(n4) ? ue3(n4, j6(t, 1, Z2, true)) : [];
      }), Ih = L5(function(n4, t) {
        var e2 = In2(t);
        return Z2(e2) && (e2 = i3), Z2(n4) ? ue3(n4, j6(t, 1, Z2, true), x2(e2, 2)) : [];
      }), xh = L5(function(n4, t) {
        var e2 = In2(t);
        return Z2(e2) && (e2 = i3), Z2(n4) ? ue3(n4, j6(t, 1, Z2, true), i3, e2) : [];
      });
      function Eh(n4, t, e2) {
        var r3 = n4 == null ? 0 : n4.length;
        return r3 ? (t = e2 || t === i3 ? 1 : R2(t), Cn(n4, t < 0 ? 0 : t, r3)) : [];
      }
      function yh(n4, t, e2) {
        var r3 = n4 == null ? 0 : n4.length;
        return r3 ? (t = e2 || t === i3 ? 1 : R2(t), t = r3 - t, Cn(n4, 0, t < 0 ? 0 : t)) : [];
      }
      function Sh(n4, t) {
        return n4 && n4.length ? Ze4(n4, x2(t, 3), true, true) : [];
      }
      function Oh(n4, t) {
        return n4 && n4.length ? Ze4(n4, x2(t, 3), true) : [];
      }
      function Rh(n4, t, e2, r3) {
        var s2 = n4 == null ? 0 : n4.length;
        return s2 ? (e2 && typeof e2 != "number" && rn2(n4, t, e2) && (e2 = 0, r3 = s2), Ac(n4, t, e2, r3)) : [];
      }
      function qu(n4, t, e2) {
        var r3 = n4 == null ? 0 : n4.length;
        if (!r3) return -1;
        var s2 = e2 == null ? 0 : R2(e2);
        return s2 < 0 && (s2 = Q4(r3 + s2, 0)), ye3(n4, x2(t, 3), s2);
      }
      function Bu2(n4, t, e2) {
        var r3 = n4 == null ? 0 : n4.length;
        if (!r3) return -1;
        var s2 = r3 - 1;
        return e2 !== i3 && (s2 = R2(e2), s2 = e2 < 0 ? Q4(r3 + s2, 0) : nn2(s2, r3 - 1)), ye3(n4, x2(t, 3), s2, true);
      }
      function Gu2(n4) {
        var t = n4 == null ? 0 : n4.length;
        return t ? j6(n4, 1) : [];
      }
      function bh(n4) {
        var t = n4 == null ? 0 : n4.length;
        return t ? j6(n4, ht2) : [];
      }
      function Th(n4, t) {
        var e2 = n4 == null ? 0 : n4.length;
        return e2 ? (t = t === i3 ? 1 : R2(t), j6(n4, t)) : [];
      }
      function Lh(n4) {
        for (var t = -1, e2 = n4 == null ? 0 : n4.length, r3 = {}; ++t < e2; ) {
          var s2 = n4[t];
          r3[s2[0]] = s2[1];
        }
        return r3;
      }
      function zu(n4) {
        return n4 && n4.length ? n4[0] : i3;
      }
      function Dh(n4, t, e2) {
        var r3 = n4 == null ? 0 : n4.length;
        if (!r3) return -1;
        var s2 = e2 == null ? 0 : R2(e2);
        return s2 < 0 && (s2 = Q4(r3 + s2, 0)), Tt3(n4, t, s2);
      }
      function Nh(n4) {
        var t = n4 == null ? 0 : n4.length;
        return t ? Cn(n4, 0, -1) : [];
      }
      var Hh = L5(function(n4) {
        var t = G(n4, ai);
        return t.length && t[0] === n4[0] ? Vr2(t) : [];
      }), $h = L5(function(n4) {
        var t = In2(n4), e2 = G(n4, ai);
        return t === In2(e2) ? t = i3 : e2.pop(), e2.length && e2[0] === n4[0] ? Vr2(e2, x2(t, 2)) : [];
      }), Uh = L5(function(n4) {
        var t = In2(n4), e2 = G(n4, ai);
        return t = typeof t == "function" ? t : i3, t && e2.pop(), e2.length && e2[0] === n4[0] ? Vr2(e2, i3, t) : [];
      });
      function Wh(n4, t) {
        return n4 == null ? "" : Nf2.call(n4, t);
      }
      function In2(n4) {
        var t = n4 == null ? 0 : n4.length;
        return t ? n4[t - 1] : i3;
      }
      function Fh(n4, t, e2) {
        var r3 = n4 == null ? 0 : n4.length;
        if (!r3) return -1;
        var s2 = r3;
        return e2 !== i3 && (s2 = R2(e2), s2 = s2 < 0 ? Q4(r3 + s2, 0) : nn2(s2, r3 - 1)), t === t ? mf2(n4, t, s2) : ye3(n4, xs3, s2, true);
      }
      function Mh(n4, t) {
        return n4 && n4.length ? tu2(n4, R2(t)) : i3;
      }
      var qh = L5(Ku);
      function Ku(n4, t) {
        return n4 && n4.length && t && t.length ? ti(n4, t) : n4;
      }
      function Bh(n4, t, e2) {
        return n4 && n4.length && t && t.length ? ti(n4, t, x2(e2, 2)) : n4;
      }
      function Gh(n4, t, e2) {
        return n4 && n4.length && t && t.length ? ti(n4, t, i3, e2) : n4;
      }
      var zh = Yn2(function(n4, t) {
        var e2 = n4 == null ? 0 : n4.length, r3 = Zr(n4, t);
        return iu2(n4, G(t, function(s2) {
          return Zn2(s2, e2) ? +s2 : s2;
        }).sort(du2)), r3;
      });
      function Kh(n4, t) {
        var e2 = [];
        if (!(n4 && n4.length)) return e2;
        var r3 = -1, s2 = [], o5 = n4.length;
        for (t = x2(t, 3); ++r3 < o5; ) {
          var f5 = n4[r3];
          t(f5, r3, n4) && (e2.push(f5), s2.push(r3));
        }
        return iu2(n4, s2), e2;
      }
      function Ai2(n4) {
        return n4 == null ? n4 : Wf2.call(n4);
      }
      function Yh(n4, t, e2) {
        var r3 = n4 == null ? 0 : n4.length;
        return r3 ? (e2 && typeof e2 != "number" && rn2(n4, t, e2) ? (t = 0, e2 = r3) : (t = t == null ? 0 : R2(t), e2 = e2 === i3 ? r3 : R2(e2)), Cn(n4, t, e2)) : [];
      }
      function Zh(n4, t) {
        return Ye3(n4, t);
      }
      function Jh(n4, t, e2) {
        return ii(n4, t, x2(e2, 2));
      }
      function Xh(n4, t) {
        var e2 = n4 == null ? 0 : n4.length;
        if (e2) {
          var r3 = Ye3(n4, t);
          if (r3 < e2 && bn2(n4[r3], t)) return r3;
        }
        return -1;
      }
      function Qh(n4, t) {
        return Ye3(n4, t, true);
      }
      function Vh(n4, t, e2) {
        return ii(n4, t, x2(e2, 2), true);
      }
      function kh(n4, t) {
        var e2 = n4 == null ? 0 : n4.length;
        if (e2) {
          var r3 = Ye3(n4, t, true) - 1;
          if (bn2(n4[r3], t)) return r3;
        }
        return -1;
      }
      function jh(n4) {
        return n4 && n4.length ? uu(n4) : [];
      }
      function nl(n4, t) {
        return n4 && n4.length ? uu(n4, x2(t, 2)) : [];
      }
      function tl(n4) {
        var t = n4 == null ? 0 : n4.length;
        return t ? Cn(n4, 1, t) : [];
      }
      function el(n4, t, e2) {
        return n4 && n4.length ? (t = e2 || t === i3 ? 1 : R2(t), Cn(n4, 0, t < 0 ? 0 : t)) : [];
      }
      function rl(n4, t, e2) {
        var r3 = n4 == null ? 0 : n4.length;
        return r3 ? (t = e2 || t === i3 ? 1 : R2(t), t = r3 - t, Cn(n4, t < 0 ? 0 : t, r3)) : [];
      }
      function il(n4, t) {
        return n4 && n4.length ? Ze4(n4, x2(t, 3), false, true) : [];
      }
      function sl(n4, t) {
        return n4 && n4.length ? Ze4(n4, x2(t, 3)) : [];
      }
      var ul = L5(function(n4) {
        return it2(j6(n4, 1, Z2, true));
      }), al = L5(function(n4) {
        var t = In2(n4);
        return Z2(t) && (t = i3), it2(j6(n4, 1, Z2, true), x2(t, 2));
      }), ol = L5(function(n4) {
        var t = In2(n4);
        return t = typeof t == "function" ? t : i3, it2(j6(n4, 1, Z2, true), i3, t);
      });
      function fl(n4) {
        return n4 && n4.length ? it2(n4) : [];
      }
      function cl(n4, t) {
        return n4 && n4.length ? it2(n4, x2(t, 2)) : [];
      }
      function hl(n4, t) {
        return t = typeof t == "function" ? t : i3, n4 && n4.length ? it2(n4, i3, t) : [];
      }
      function Ci2(n4) {
        if (!(n4 && n4.length)) return [];
        var t = 0;
        return n4 = jn2(n4, function(e2) {
          if (Z2(e2)) return t = Q4(e2.length, t), true;
        }), Fr3(t, function(e2) {
          return G(n4, $r2(e2));
        });
      }
      function Yu2(n4, t) {
        if (!(n4 && n4.length)) return [];
        var e2 = Ci2(n4);
        return t == null ? e2 : G(e2, function(r3) {
          return cn2(t, i3, r3);
        });
      }
      var ll = L5(function(n4, t) {
        return Z2(n4) ? ue3(n4, t) : [];
      }), pl = L5(function(n4) {
        return ui(jn2(n4, Z2));
      }), dl = L5(function(n4) {
        var t = In2(n4);
        return Z2(t) && (t = i3), ui(jn2(n4, Z2), x2(t, 2));
      }), gl = L5(function(n4) {
        var t = In2(n4);
        return t = typeof t == "function" ? t : i3, ui(jn2(n4, Z2), i3, t);
      }), vl = L5(Ci2);
      function _l(n4, t) {
        return cu2(n4 || [], t || [], se2);
      }
      function ml(n4, t) {
        return cu2(n4 || [], t || [], fe3);
      }
      var wl = L5(function(n4) {
        var t = n4.length, e2 = t > 1 ? n4[t - 1] : i3;
        return e2 = typeof e2 == "function" ? (n4.pop(), e2) : i3, Yu2(n4, e2);
      });
      function Zu2(n4) {
        var t = a4(n4);
        return t.__chain__ = true, t;
      }
      function Pl(n4, t) {
        return t(n4), n4;
      }
      function er3(n4, t) {
        return t(n4);
      }
      var Al = Yn2(function(n4) {
        var t = n4.length, e2 = t ? n4[0] : 0, r3 = this.__wrapped__, s2 = function(o5) {
          return Zr(o5, n4);
        };
        return t > 1 || this.__actions__.length || !(r3 instanceof H) || !Zn2(e2) ? this.thru(s2) : (r3 = r3.slice(e2, +e2 + (t ? 1 : 0)), r3.__actions__.push({ func: er3, args: [s2], thisArg: i3 }), new Pn2(r3, this.__chain__).thru(function(o5) {
          return t && !o5.length && o5.push(i3), o5;
        }));
      });
      function Cl() {
        return Zu2(this);
      }
      function Il() {
        return new Pn2(this.value(), this.__chain__);
      }
      function xl() {
        this.__values__ === i3 && (this.__values__ = aa2(this.value()));
        var n4 = this.__index__ >= this.__values__.length, t = n4 ? i3 : this.__values__[this.__index__++];
        return { done: n4, value: t };
      }
      function El() {
        return this;
      }
      function yl(n4) {
        for (var t, e2 = this; e2 instanceof qe2; ) {
          var r3 = Mu2(e2);
          r3.__index__ = 0, r3.__values__ = i3, t ? s2.__wrapped__ = r3 : t = r3;
          var s2 = r3;
          e2 = e2.__wrapped__;
        }
        return s2.__wrapped__ = n4, t;
      }
      function Sl() {
        var n4 = this.__wrapped__;
        if (n4 instanceof H) {
          var t = n4;
          return this.__actions__.length && (t = new H(this)), t = t.reverse(), t.__actions__.push({ func: er3, args: [Ai2], thisArg: i3 }), new Pn2(t, this.__chain__);
        }
        return this.thru(Ai2);
      }
      function Ol() {
        return fu2(this.__wrapped__, this.__actions__);
      }
      var Rl = Je3(function(n4, t, e2) {
        F.call(n4, e2) ? ++n4[e2] : zn2(n4, e2, 1);
      });
      function bl(n4, t, e2) {
        var r3 = O4(n4) ? Cs3 : Pc;
        return e2 && rn2(n4, t, e2) && (t = i3), r3(n4, x2(t, 3));
      }
      function Tl(n4, t) {
        var e2 = O4(n4) ? jn2 : Ys3;
        return e2(n4, x2(t, 3));
      }
      var Ll = Pu2(qu), Dl = Pu2(Bu2);
      function Nl(n4, t) {
        return j6(rr3(n4, t), 1);
      }
      function Hl(n4, t) {
        return j6(rr3(n4, t), ht2);
      }
      function $l(n4, t, e2) {
        return e2 = e2 === i3 ? 1 : R2(e2), j6(rr3(n4, t), e2);
      }
      function Ju2(n4, t) {
        var e2 = O4(n4) ? mn : rt2;
        return e2(n4, x2(t, 3));
      }
      function Xu2(n4, t) {
        var e2 = O4(n4) ? nf2 : Ks3;
        return e2(n4, x2(t, 3));
      }
      var Ul = Je3(function(n4, t, e2) {
        F.call(n4, e2) ? n4[e2].push(t) : zn2(n4, e2, [t]);
      });
      function Wl(n4, t, e2, r3) {
        n4 = an2(n4) ? n4 : Gt3(n4), e2 = e2 && !r3 ? R2(e2) : 0;
        var s2 = n4.length;
        return e2 < 0 && (e2 = Q4(s2 + e2, 0)), or3(n4) ? e2 <= s2 && n4.indexOf(t, e2) > -1 : !!s2 && Tt3(n4, t, e2) > -1;
      }
      var Fl = L5(function(n4, t, e2) {
        var r3 = -1, s2 = typeof t == "function", o5 = an2(n4) ? d3(n4.length) : [];
        return rt2(n4, function(f5) {
          o5[++r3] = s2 ? cn2(t, f5, e2) : ae2(f5, t, e2);
        }), o5;
      }), Ml = Je3(function(n4, t, e2) {
        zn2(n4, e2, t);
      });
      function rr3(n4, t) {
        var e2 = O4(n4) ? G : ks3;
        return e2(n4, x2(t, 3));
      }
      function ql(n4, t, e2, r3) {
        return n4 == null ? [] : (O4(t) || (t = t == null ? [] : [t]), e2 = r3 ? i3 : e2, O4(e2) || (e2 = e2 == null ? [] : [e2]), eu2(n4, t, e2));
      }
      var Bl = Je3(function(n4, t, e2) {
        n4[e2 ? 0 : 1].push(t);
      }, function() {
        return [[], []];
      });
      function Gl(n4, t, e2) {
        var r3 = O4(n4) ? Nr3 : ys3, s2 = arguments.length < 3;
        return r3(n4, x2(t, 4), e2, s2, rt2);
      }
      function zl(n4, t, e2) {
        var r3 = O4(n4) ? tf2 : ys3, s2 = arguments.length < 3;
        return r3(n4, x2(t, 4), e2, s2, Ks3);
      }
      function Kl(n4, t) {
        var e2 = O4(n4) ? jn2 : Ys3;
        return e2(n4, ur3(x2(t, 3)));
      }
      function Yl(n4) {
        var t = O4(n4) ? qs3 : Wc;
        return t(n4);
      }
      function Zl(n4, t, e2) {
        (e2 ? rn2(n4, t, e2) : t === i3) ? t = 1 : t = R2(t);
        var r3 = O4(n4) ? gc : Fc;
        return r3(n4, t);
      }
      function Jl(n4) {
        var t = O4(n4) ? vc : qc;
        return t(n4);
      }
      function Xl(n4) {
        if (n4 == null) return 0;
        if (an2(n4)) return or3(n4) ? Dt3(n4) : n4.length;
        var t = tn2(n4);
        return t == yn2 || t == Sn2 ? n4.size : jr2(n4).length;
      }
      function Ql(n4, t, e2) {
        var r3 = O4(n4) ? Hr2 : Bc;
        return e2 && rn2(n4, t, e2) && (t = i3), r3(n4, x2(t, 3));
      }
      var Vl = L5(function(n4, t) {
        if (n4 == null) return [];
        var e2 = t.length;
        return e2 > 1 && rn2(n4, t[0], t[1]) ? t = [] : e2 > 2 && rn2(t[0], t[1], t[2]) && (t = [t[0]]), eu2(n4, j6(t, 1), []);
      }), ir3 = Tf2 || function() {
        return k3.Date.now();
      };
      function kl(n4, t) {
        if (typeof t != "function") throw new wn2(D4);
        return n4 = R2(n4), function() {
          if (--n4 < 1) return t.apply(this, arguments);
        };
      }
      function Qu2(n4, t, e2) {
        return t = e2 ? i3 : t, t = n4 && t == null ? n4.length : t, Kn2(n4, Mn, i3, i3, i3, i3, t);
      }
      function Vu2(n4, t) {
        var e2;
        if (typeof t != "function") throw new wn2(D4);
        return n4 = R2(n4), function() {
          return --n4 > 0 && (e2 = t.apply(this, arguments)), n4 <= 1 && (t = i3), e2;
        };
      }
      var Ii2 = L5(function(n4, t, e2) {
        var r3 = vn;
        if (e2.length) {
          var s2 = tt2(e2, qt3(Ii2));
          r3 |= Nn2;
        }
        return Kn2(n4, r3, t, e2, s2);
      }), ku = L5(function(n4, t, e2) {
        var r3 = vn | ct2;
        if (e2.length) {
          var s2 = tt2(e2, qt3(ku));
          r3 |= Nn2;
        }
        return Kn2(t, r3, n4, e2, s2);
      });
      function ju2(n4, t, e2) {
        t = e2 ? i3 : t;
        var r3 = Kn2(n4, Dn2, i3, i3, i3, i3, i3, t);
        return r3.placeholder = ju2.placeholder, r3;
      }
      function na2(n4, t, e2) {
        t = e2 ? i3 : t;
        var r3 = Kn2(n4, yt2, i3, i3, i3, i3, i3, t);
        return r3.placeholder = na2.placeholder, r3;
      }
      function ta2(n4, t, e2) {
        var r3, s2, o5, f5, c5, l4, v4 = 0, _2 = false, m3 = false, P2 = true;
        if (typeof n4 != "function") throw new wn2(D4);
        t = xn2(t) || 0, K3(e2) && (_2 = !!e2.leading, m3 = "maxWait" in e2, o5 = m3 ? Q4(xn2(e2.maxWait) || 0, t) : o5, P2 = "trailing" in e2 ? !!e2.trailing : P2);
        function I2(J2) {
          var Tn2 = r3, Qn2 = s2;
          return r3 = s2 = i3, v4 = J2, f5 = n4.apply(Qn2, Tn2), f5;
        }
        function E7(J2) {
          return v4 = J2, c5 = le3(N3, t), _2 ? I2(J2) : f5;
        }
        function T3(J2) {
          var Tn2 = J2 - l4, Qn2 = J2 - v4, Pa2 = t - Tn2;
          return m3 ? nn2(Pa2, o5 - Qn2) : Pa2;
        }
        function y8(J2) {
          var Tn2 = J2 - l4, Qn2 = J2 - v4;
          return l4 === i3 || Tn2 >= t || Tn2 < 0 || m3 && Qn2 >= o5;
        }
        function N3() {
          var J2 = ir3();
          if (y8(J2)) return $3(J2);
          c5 = le3(N3, T3(J2));
        }
        function $3(J2) {
          return c5 = i3, P2 && r3 ? I2(J2) : (r3 = s2 = i3, f5);
        }
        function dn2() {
          c5 !== i3 && hu(c5), v4 = 0, r3 = l4 = s2 = c5 = i3;
        }
        function sn2() {
          return c5 === i3 ? f5 : $3(ir3());
        }
        function gn() {
          var J2 = ir3(), Tn2 = y8(J2);
          if (r3 = arguments, s2 = this, l4 = J2, Tn2) {
            if (c5 === i3) return E7(l4);
            if (m3) return hu(c5), c5 = le3(N3, t), I2(l4);
          }
          return c5 === i3 && (c5 = le3(N3, t)), f5;
        }
        return gn.cancel = dn2, gn.flush = sn2, gn;
      }
      var jl = L5(function(n4, t) {
        return zs3(n4, 1, t);
      }), np = L5(function(n4, t, e2) {
        return zs3(n4, xn2(t) || 0, e2);
      });
      function tp(n4) {
        return Kn2(n4, dr3);
      }
      function sr3(n4, t) {
        if (typeof n4 != "function" || t != null && typeof t != "function") throw new wn2(D4);
        var e2 = function() {
          var r3 = arguments, s2 = t ? t.apply(this, r3) : r3[0], o5 = e2.cache;
          if (o5.has(s2)) return o5.get(s2);
          var f5 = n4.apply(this, r3);
          return e2.cache = o5.set(s2, f5) || o5, f5;
        };
        return e2.cache = new (sr3.Cache || Gn2)(), e2;
      }
      sr3.Cache = Gn2;
      function ur3(n4) {
        if (typeof n4 != "function") throw new wn2(D4);
        return function() {
          var t = arguments;
          switch (t.length) {
            case 0:
              return !n4.call(this);
            case 1:
              return !n4.call(this, t[0]);
            case 2:
              return !n4.call(this, t[0], t[1]);
            case 3:
              return !n4.call(this, t[0], t[1], t[2]);
          }
          return !n4.apply(this, t);
        };
      }
      function ep(n4) {
        return Vu2(2, n4);
      }
      var rp = Gc(function(n4, t) {
        t = t.length == 1 && O4(t[0]) ? G(t[0], hn2(x2())) : G(j6(t, 1), hn2(x2()));
        var e2 = t.length;
        return L5(function(r3) {
          for (var s2 = -1, o5 = nn2(r3.length, e2); ++s2 < o5; ) r3[s2] = t[s2].call(this, r3[s2]);
          return cn2(n4, this, r3);
        });
      }), xi2 = L5(function(n4, t) {
        var e2 = tt2(t, qt3(xi2));
        return Kn2(n4, Nn2, i3, t, e2);
      }), ea2 = L5(function(n4, t) {
        var e2 = tt2(t, qt3(ea2));
        return Kn2(n4, St2, i3, t, e2);
      }), ip = Yn2(function(n4, t) {
        return Kn2(n4, Kt3, i3, i3, i3, t);
      });
      function sp(n4, t) {
        if (typeof n4 != "function") throw new wn2(D4);
        return t = t === i3 ? t : R2(t), L5(n4, t);
      }
      function up(n4, t) {
        if (typeof n4 != "function") throw new wn2(D4);
        return t = t == null ? 0 : Q4(R2(t), 0), L5(function(e2) {
          var r3 = e2[t], s2 = ut2(e2, 0, t);
          return r3 && nt2(s2, r3), cn2(n4, this, s2);
        });
      }
      function ap(n4, t, e2) {
        var r3 = true, s2 = true;
        if (typeof n4 != "function") throw new wn2(D4);
        return K3(e2) && (r3 = "leading" in e2 ? !!e2.leading : r3, s2 = "trailing" in e2 ? !!e2.trailing : s2), ta2(n4, t, { leading: r3, maxWait: t, trailing: s2 });
      }
      function op(n4) {
        return Qu2(n4, 1);
      }
      function fp(n4, t) {
        return xi2(oi(t), n4);
      }
      function cp() {
        if (!arguments.length) return [];
        var n4 = arguments[0];
        return O4(n4) ? n4 : [n4];
      }
      function hp(n4) {
        return An(n4, xt2);
      }
      function lp(n4, t) {
        return t = typeof t == "function" ? t : i3, An(n4, xt2, t);
      }
      function pp(n4) {
        return An(n4, Ln2 | xt2);
      }
      function dp(n4, t) {
        return t = typeof t == "function" ? t : i3, An(n4, Ln2 | xt2, t);
      }
      function gp(n4, t) {
        return t == null || Gs3(n4, t, V4(t));
      }
      function bn2(n4, t) {
        return n4 === t || n4 !== n4 && t !== t;
      }
      var vp = ke3(Qr2), _p = ke3(function(n4, t) {
        return n4 >= t;
      }), Pt2 = Xs3(/* @__PURE__ */ function() {
        return arguments;
      }()) ? Xs3 : function(n4) {
        return Y(n4) && F.call(n4, "callee") && !Hs3.call(n4, "callee");
      }, O4 = d3.isArray, mp = vs3 ? hn2(vs3) : yc;
      function an2(n4) {
        return n4 != null && ar3(n4.length) && !Jn2(n4);
      }
      function Z2(n4) {
        return Y(n4) && an2(n4);
      }
      function wp(n4) {
        return n4 === true || n4 === false || Y(n4) && en2(n4) == Yt3;
      }
      var at2 = Df2 || Hi3, Pp = _s3 ? hn2(_s3) : Sc;
      function Ap(n4) {
        return Y(n4) && n4.nodeType === 1 && !pe3(n4);
      }
      function Cp(n4) {
        if (n4 == null) return true;
        if (an2(n4) && (O4(n4) || typeof n4 == "string" || typeof n4.splice == "function" || at2(n4) || Bt3(n4) || Pt2(n4))) return !n4.length;
        var t = tn2(n4);
        if (t == yn2 || t == Sn2) return !n4.size;
        if (he2(n4)) return !jr2(n4).length;
        for (var e2 in n4) if (F.call(n4, e2)) return false;
        return true;
      }
      function Ip(n4, t) {
        return oe3(n4, t);
      }
      function xp(n4, t, e2) {
        e2 = typeof e2 == "function" ? e2 : i3;
        var r3 = e2 ? e2(n4, t) : i3;
        return r3 === i3 ? oe3(n4, t, i3, e2) : !!r3;
      }
      function Ei2(n4) {
        if (!Y(n4)) return false;
        var t = en2(n4);
        return t == we2 || t == Ka2 || typeof n4.message == "string" && typeof n4.name == "string" && !pe3(n4);
      }
      function Ep(n4) {
        return typeof n4 == "number" && Us3(n4);
      }
      function Jn2(n4) {
        if (!K3(n4)) return false;
        var t = en2(n4);
        return t == Pe3 || t == zi2 || t == za2 || t == Za2;
      }
      function ra2(n4) {
        return typeof n4 == "number" && n4 == R2(n4);
      }
      function ar3(n4) {
        return typeof n4 == "number" && n4 > -1 && n4 % 1 == 0 && n4 <= kn2;
      }
      function K3(n4) {
        var t = typeof n4;
        return n4 != null && (t == "object" || t == "function");
      }
      function Y(n4) {
        return n4 != null && typeof n4 == "object";
      }
      var ia2 = ms3 ? hn2(ms3) : Rc;
      function yp(n4, t) {
        return n4 === t || kr2(n4, t, gi2(t));
      }
      function Sp(n4, t, e2) {
        return e2 = typeof e2 == "function" ? e2 : i3, kr2(n4, t, gi2(t), e2);
      }
      function Op(n4) {
        return sa2(n4) && n4 != +n4;
      }
      function Rp(n4) {
        if (lh2(n4)) throw new S4(b4);
        return Qs3(n4);
      }
      function bp(n4) {
        return n4 === null;
      }
      function Tp(n4) {
        return n4 == null;
      }
      function sa2(n4) {
        return typeof n4 == "number" || Y(n4) && en2(n4) == Jt4;
      }
      function pe3(n4) {
        if (!Y(n4) || en2(n4) != qn2) return false;
        var t = Ne(n4);
        if (t === null) return true;
        var e2 = F.call(t, "constructor") && t.constructor;
        return typeof e2 == "function" && e2 instanceof e2 && be3.call(e2) == Sf2;
      }
      var yi2 = ws3 ? hn2(ws3) : bc;
      function Lp(n4) {
        return ra2(n4) && n4 >= -kn2 && n4 <= kn2;
      }
      var ua2 = Ps3 ? hn2(Ps3) : Tc;
      function or3(n4) {
        return typeof n4 == "string" || !O4(n4) && Y(n4) && en2(n4) == Qt2;
      }
      function pn(n4) {
        return typeof n4 == "symbol" || Y(n4) && en2(n4) == Ae2;
      }
      var Bt3 = As3 ? hn2(As3) : Lc;
      function Dp(n4) {
        return n4 === i3;
      }
      function Np(n4) {
        return Y(n4) && tn2(n4) == Vt3;
      }
      function Hp(n4) {
        return Y(n4) && en2(n4) == Xa2;
      }
      var $p = ke3(ni), Up = ke3(function(n4, t) {
        return n4 <= t;
      });
      function aa2(n4) {
        if (!n4) return [];
        if (an2(n4)) return or3(n4) ? On2(n4) : un2(n4);
        if (ne3 && n4[ne3]) return gf2(n4[ne3]());
        var t = tn2(n4), e2 = t == yn2 ? qr2 : t == Sn2 ? Se3 : Gt3;
        return e2(n4);
      }
      function Xn2(n4) {
        if (!n4) return n4 === 0 ? n4 : 0;
        if (n4 = xn2(n4), n4 === ht2 || n4 === -ht2) {
          var t = n4 < 0 ? -1 : 1;
          return t * Ma2;
        }
        return n4 === n4 ? n4 : 0;
      }
      function R2(n4) {
        var t = Xn2(n4), e2 = t % 1;
        return t === t ? e2 ? t - e2 : t : 0;
      }
      function oa2(n4) {
        return n4 ? vt2(R2(n4), 0, Hn2) : 0;
      }
      function xn2(n4) {
        if (typeof n4 == "number") return n4;
        if (pn(n4)) return _e3;
        if (K3(n4)) {
          var t = typeof n4.valueOf == "function" ? n4.valueOf() : n4;
          n4 = K3(t) ? t + "" : t;
        }
        if (typeof n4 != "string") return n4 === 0 ? n4 : +n4;
        n4 = Ss3(n4);
        var e2 = _o2.test(n4);
        return e2 || wo2.test(n4) ? Vo(n4.slice(2), e2 ? 2 : 8) : vo2.test(n4) ? _e3 : +n4;
      }
      function fa2(n4) {
        return Un2(n4, on2(n4));
      }
      function Wp(n4) {
        return n4 ? vt2(R2(n4), -kn2, kn2) : n4 === 0 ? n4 : 0;
      }
      function W2(n4) {
        return n4 == null ? "" : ln(n4);
      }
      var Fp = Ft3(function(n4, t) {
        if (he2(t) || an2(t)) {
          Un2(t, V4(t), n4);
          return;
        }
        for (var e2 in t) F.call(t, e2) && se2(n4, e2, t[e2]);
      }), ca2 = Ft3(function(n4, t) {
        Un2(t, on2(t), n4);
      }), fr2 = Ft3(function(n4, t, e2, r3) {
        Un2(t, on2(t), n4, r3);
      }), Mp = Ft3(function(n4, t, e2, r3) {
        Un2(t, V4(t), n4, r3);
      }), qp = Yn2(Zr);
      function Bp(n4, t) {
        var e2 = Wt4(n4);
        return t == null ? e2 : Bs3(e2, t);
      }
      var Gp = L5(function(n4, t) {
        n4 = M4(n4);
        var e2 = -1, r3 = t.length, s2 = r3 > 2 ? t[2] : i3;
        for (s2 && rn2(t[0], t[1], s2) && (r3 = 1); ++e2 < r3; ) for (var o5 = t[e2], f5 = on2(o5), c5 = -1, l4 = f5.length; ++c5 < l4; ) {
          var v4 = f5[c5], _2 = n4[v4];
          (_2 === i3 || bn2(_2, Ht3[v4]) && !F.call(n4, v4)) && (n4[v4] = o5[v4]);
        }
        return n4;
      }), zp = L5(function(n4) {
        return n4.push(i3, Su2), cn2(ha2, i3, n4);
      });
      function Kp(n4, t) {
        return Is3(n4, x2(t, 3), $n2);
      }
      function Yp(n4, t) {
        return Is3(n4, x2(t, 3), Xr);
      }
      function Zp(n4, t) {
        return n4 == null ? n4 : Jr2(n4, x2(t, 3), on2);
      }
      function Jp(n4, t) {
        return n4 == null ? n4 : Zs3(n4, x2(t, 3), on2);
      }
      function Xp(n4, t) {
        return n4 && $n2(n4, x2(t, 3));
      }
      function Qp(n4, t) {
        return n4 && Xr(n4, x2(t, 3));
      }
      function Vp(n4) {
        return n4 == null ? [] : ze2(n4, V4(n4));
      }
      function kp(n4) {
        return n4 == null ? [] : ze2(n4, on2(n4));
      }
      function Si2(n4, t, e2) {
        var r3 = n4 == null ? i3 : _t2(n4, t);
        return r3 === i3 ? e2 : r3;
      }
      function jp(n4, t) {
        return n4 != null && bu2(n4, t, Cc);
      }
      function Oi2(n4, t) {
        return n4 != null && bu2(n4, t, Ic);
      }
      var nd = Cu2(function(n4, t, e2) {
        t != null && typeof t.toString != "function" && (t = Te.call(t)), n4[t] = e2;
      }, bi2(fn2)), td = Cu2(function(n4, t, e2) {
        t != null && typeof t.toString != "function" && (t = Te.call(t)), F.call(n4, t) ? n4[t].push(e2) : n4[t] = [e2];
      }, x2), ed = L5(ae2);
      function V4(n4) {
        return an2(n4) ? Ms3(n4) : jr2(n4);
      }
      function on2(n4) {
        return an2(n4) ? Ms3(n4, true) : Dc(n4);
      }
      function rd(n4, t) {
        var e2 = {};
        return t = x2(t, 3), $n2(n4, function(r3, s2, o5) {
          zn2(e2, t(r3, s2, o5), r3);
        }), e2;
      }
      function id(n4, t) {
        var e2 = {};
        return t = x2(t, 3), $n2(n4, function(r3, s2, o5) {
          zn2(e2, s2, t(r3, s2, o5));
        }), e2;
      }
      var sd = Ft3(function(n4, t, e2) {
        Ke3(n4, t, e2);
      }), ha2 = Ft3(function(n4, t, e2, r3) {
        Ke3(n4, t, e2, r3);
      }), ud = Yn2(function(n4, t) {
        var e2 = {};
        if (n4 == null) return e2;
        var r3 = false;
        t = G(t, function(o5) {
          return o5 = st2(o5, n4), r3 || (r3 = o5.length > 1), o5;
        }), Un2(n4, pi2(n4), e2), r3 && (e2 = An(e2, Ln2 | Fn2 | xt2, nh2));
        for (var s2 = t.length; s2--; ) si(e2, t[s2]);
        return e2;
      });
      function ad(n4, t) {
        return la2(n4, ur3(x2(t)));
      }
      var od = Yn2(function(n4, t) {
        return n4 == null ? {} : Hc(n4, t);
      });
      function la2(n4, t) {
        if (n4 == null) return {};
        var e2 = G(pi2(n4), function(r3) {
          return [r3];
        });
        return t = x2(t), ru2(n4, e2, function(r3, s2) {
          return t(r3, s2[0]);
        });
      }
      function fd(n4, t, e2) {
        t = st2(t, n4);
        var r3 = -1, s2 = t.length;
        for (s2 || (s2 = 1, n4 = i3); ++r3 < s2; ) {
          var o5 = n4 == null ? i3 : n4[Wn2(t[r3])];
          o5 === i3 && (r3 = s2, o5 = e2), n4 = Jn2(o5) ? o5.call(n4) : o5;
        }
        return n4;
      }
      function cd(n4, t, e2) {
        return n4 == null ? n4 : fe3(n4, t, e2);
      }
      function hd(n4, t, e2, r3) {
        return r3 = typeof r3 == "function" ? r3 : i3, n4 == null ? n4 : fe3(n4, t, e2, r3);
      }
      var pa2 = Eu2(V4), da2 = Eu2(on2);
      function ld(n4, t, e2) {
        var r3 = O4(n4), s2 = r3 || at2(n4) || Bt3(n4);
        if (t = x2(t, 4), e2 == null) {
          var o5 = n4 && n4.constructor;
          s2 ? e2 = r3 ? new o5() : [] : K3(n4) ? e2 = Jn2(o5) ? Wt4(Ne(n4)) : {} : e2 = {};
        }
        return (s2 ? mn : $n2)(n4, function(f5, c5, l4) {
          return t(e2, f5, c5, l4);
        }), e2;
      }
      function pd(n4, t) {
        return n4 == null ? true : si(n4, t);
      }
      function dd(n4, t, e2) {
        return n4 == null ? n4 : ou2(n4, t, oi(e2));
      }
      function gd(n4, t, e2, r3) {
        return r3 = typeof r3 == "function" ? r3 : i3, n4 == null ? n4 : ou2(n4, t, oi(e2), r3);
      }
      function Gt3(n4) {
        return n4 == null ? [] : Mr2(n4, V4(n4));
      }
      function vd(n4) {
        return n4 == null ? [] : Mr2(n4, on2(n4));
      }
      function _d(n4, t, e2) {
        return e2 === i3 && (e2 = t, t = i3), e2 !== i3 && (e2 = xn2(e2), e2 = e2 === e2 ? e2 : 0), t !== i3 && (t = xn2(t), t = t === t ? t : 0), vt2(xn2(n4), t, e2);
      }
      function md(n4, t, e2) {
        return t = Xn2(t), e2 === i3 ? (e2 = t, t = 0) : e2 = Xn2(e2), n4 = xn2(n4), xc(n4, t, e2);
      }
      function wd(n4, t, e2) {
        if (e2 && typeof e2 != "boolean" && rn2(n4, t, e2) && (t = e2 = i3), e2 === i3 && (typeof t == "boolean" ? (e2 = t, t = i3) : typeof n4 == "boolean" && (e2 = n4, n4 = i3)), n4 === i3 && t === i3 ? (n4 = 0, t = 1) : (n4 = Xn2(n4), t === i3 ? (t = n4, n4 = 0) : t = Xn2(t)), n4 > t) {
          var r3 = n4;
          n4 = t, t = r3;
        }
        if (e2 || n4 % 1 || t % 1) {
          var s2 = Ws3();
          return nn2(n4 + s2 * (t - n4 + Qo2("1e-" + ((s2 + "").length - 1))), t);
        }
        return ei(n4, t);
      }
      var Pd = Mt2(function(n4, t, e2) {
        return t = t.toLowerCase(), n4 + (e2 ? ga2(t) : t);
      });
      function ga2(n4) {
        return Ri2(W2(n4).toLowerCase());
      }
      function va2(n4) {
        return n4 = W2(n4), n4 && n4.replace(Ao2, cf2).replace(Mo2, "");
      }
      function Ad(n4, t, e2) {
        n4 = W2(n4), t = ln(t);
        var r3 = n4.length;
        e2 = e2 === i3 ? r3 : vt2(R2(e2), 0, r3);
        var s2 = e2;
        return e2 -= t.length, e2 >= 0 && n4.slice(e2, s2) == t;
      }
      function Cd(n4) {
        return n4 = W2(n4), n4 && no2.test(n4) ? n4.replace(Zi3, hf2) : n4;
      }
      function Id(n4) {
        return n4 = W2(n4), n4 && uo.test(n4) ? n4.replace(xr3, "\\$&") : n4;
      }
      var xd = Mt2(function(n4, t, e2) {
        return n4 + (e2 ? "-" : "") + t.toLowerCase();
      }), Ed = Mt2(function(n4, t, e2) {
        return n4 + (e2 ? " " : "") + t.toLowerCase();
      }), yd = wu2("toLowerCase");
      function Sd(n4, t, e2) {
        n4 = W2(n4), t = R2(t);
        var r3 = t ? Dt3(n4) : 0;
        if (!t || r3 >= t) return n4;
        var s2 = (t - r3) / 2;
        return Ve2(We4(s2), e2) + n4 + Ve2(Ue3(s2), e2);
      }
      function Od(n4, t, e2) {
        n4 = W2(n4), t = R2(t);
        var r3 = t ? Dt3(n4) : 0;
        return t && r3 < t ? n4 + Ve2(t - r3, e2) : n4;
      }
      function Rd(n4, t, e2) {
        n4 = W2(n4), t = R2(t);
        var r3 = t ? Dt3(n4) : 0;
        return t && r3 < t ? Ve2(t - r3, e2) + n4 : n4;
      }
      function bd(n4, t, e2) {
        return e2 || t == null ? t = 0 : t && (t = +t), Uf2(W2(n4).replace(Er2, ""), t || 0);
      }
      function Td(n4, t, e2) {
        return (e2 ? rn2(n4, t, e2) : t === i3) ? t = 1 : t = R2(t), ri(W2(n4), t);
      }
      function Ld() {
        var n4 = arguments, t = W2(n4[0]);
        return n4.length < 3 ? t : t.replace(n4[1], n4[2]);
      }
      var Dd = Mt2(function(n4, t, e2) {
        return n4 + (e2 ? "_" : "") + t.toLowerCase();
      });
      function Nd(n4, t, e2) {
        return e2 && typeof e2 != "number" && rn2(n4, t, e2) && (t = e2 = i3), e2 = e2 === i3 ? Hn2 : e2 >>> 0, e2 ? (n4 = W2(n4), n4 && (typeof t == "string" || t != null && !yi2(t)) && (t = ln(t), !t && Lt3(n4)) ? ut2(On2(n4), 0, e2) : n4.split(t, e2)) : [];
      }
      var Hd = Mt2(function(n4, t, e2) {
        return n4 + (e2 ? " " : "") + Ri2(t);
      });
      function $d(n4, t, e2) {
        return n4 = W2(n4), e2 = e2 == null ? 0 : vt2(R2(e2), 0, n4.length), t = ln(t), n4.slice(e2, e2 + t.length) == t;
      }
      function Ud(n4, t, e2) {
        var r3 = a4.templateSettings;
        e2 && rn2(n4, t, e2) && (t = i3), n4 = W2(n4), t = fr2({}, t, r3, yu2);
        var s2 = fr2({}, t.imports, r3.imports, yu2), o5 = V4(s2), f5 = Mr2(s2, o5), c5, l4, v4 = 0, _2 = t.interpolate || Ce2, m3 = "__p += '", P2 = Br2((t.escape || Ce2).source + "|" + _2.source + "|" + (_2 === Ji3 ? go2 : Ce2).source + "|" + (t.evaluate || Ce2).source + "|$", "g"), I2 = "//# sourceURL=" + (F.call(t, "sourceURL") ? (t.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Ko + "]") + `
`;
        n4.replace(P2, function(y8, N3, $3, dn2, sn2, gn) {
          return $3 || ($3 = dn2), m3 += n4.slice(v4, gn).replace(Co2, lf2), N3 && (c5 = true, m3 += `' +
__e(` + N3 + `) +
'`), sn2 && (l4 = true, m3 += `';
` + sn2 + `;
__p += '`), $3 && (m3 += `' +
((__t = (` + $3 + `)) == null ? '' : __t) +
'`), v4 = gn + y8.length, y8;
        }), m3 += `';
`;
        var E7 = F.call(t, "variable") && t.variable;
        if (!E7) m3 = `with (obj) {
` + m3 + `
}
`;
        else if (lo2.test(E7)) throw new S4(En2);
        m3 = (l4 ? m3.replace(Qa2, "") : m3).replace(Va2, "$1").replace(ka2, "$1;"), m3 = "function(" + (E7 || "obj") + `) {
` + (E7 ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (c5 ? ", __e = _.escape" : "") + (l4 ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + m3 + `return __p
}`;
        var T3 = ma2(function() {
          return U4(o5, I2 + "return " + m3).apply(i3, f5);
        });
        if (T3.source = m3, Ei2(T3)) throw T3;
        return T3;
      }
      function Wd(n4) {
        return W2(n4).toLowerCase();
      }
      function Fd(n4) {
        return W2(n4).toUpperCase();
      }
      function Md(n4, t, e2) {
        if (n4 = W2(n4), n4 && (e2 || t === i3)) return Ss3(n4);
        if (!n4 || !(t = ln(t))) return n4;
        var r3 = On2(n4), s2 = On2(t), o5 = Os3(r3, s2), f5 = Rs3(r3, s2) + 1;
        return ut2(r3, o5, f5).join("");
      }
      function qd(n4, t, e2) {
        if (n4 = W2(n4), n4 && (e2 || t === i3)) return n4.slice(0, Ts3(n4) + 1);
        if (!n4 || !(t = ln(t))) return n4;
        var r3 = On2(n4), s2 = Rs3(r3, On2(t)) + 1;
        return ut2(r3, 0, s2).join("");
      }
      function Bd(n4, t, e2) {
        if (n4 = W2(n4), n4 && (e2 || t === i3)) return n4.replace(Er2, "");
        if (!n4 || !(t = ln(t))) return n4;
        var r3 = On2(n4), s2 = Os3(r3, On2(t));
        return ut2(r3, s2).join("");
      }
      function Gd(n4, t) {
        var e2 = Na2, r3 = Ha2;
        if (K3(t)) {
          var s2 = "separator" in t ? t.separator : s2;
          e2 = "length" in t ? R2(t.length) : e2, r3 = "omission" in t ? ln(t.omission) : r3;
        }
        n4 = W2(n4);
        var o5 = n4.length;
        if (Lt3(n4)) {
          var f5 = On2(n4);
          o5 = f5.length;
        }
        if (e2 >= o5) return n4;
        var c5 = e2 - Dt3(r3);
        if (c5 < 1) return r3;
        var l4 = f5 ? ut2(f5, 0, c5).join("") : n4.slice(0, c5);
        if (s2 === i3) return l4 + r3;
        if (f5 && (c5 += l4.length - c5), yi2(s2)) {
          if (n4.slice(c5).search(s2)) {
            var v4, _2 = l4;
            for (s2.global || (s2 = Br2(s2.source, W2(Xi3.exec(s2)) + "g")), s2.lastIndex = 0; v4 = s2.exec(_2); ) var m3 = v4.index;
            l4 = l4.slice(0, m3 === i3 ? c5 : m3);
          }
        } else if (n4.indexOf(ln(s2), c5) != c5) {
          var P2 = l4.lastIndexOf(s2);
          P2 > -1 && (l4 = l4.slice(0, P2));
        }
        return l4 + r3;
      }
      function zd(n4) {
        return n4 = W2(n4), n4 && ja2.test(n4) ? n4.replace(Yi3, wf2) : n4;
      }
      var Kd = Mt2(function(n4, t, e2) {
        return n4 + (e2 ? " " : "") + t.toUpperCase();
      }), Ri2 = wu2("toUpperCase");
      function _a2(n4, t, e2) {
        return n4 = W2(n4), t = e2 ? i3 : t, t === i3 ? df2(n4) ? Cf2(n4) : sf2(n4) : n4.match(t) || [];
      }
      var ma2 = L5(function(n4, t) {
        try {
          return cn2(n4, i3, t);
        } catch (e2) {
          return Ei2(e2) ? e2 : new S4(e2);
        }
      }), Yd = Yn2(function(n4, t) {
        return mn(t, function(e2) {
          e2 = Wn2(e2), zn2(n4, e2, Ii2(n4[e2], n4));
        }), n4;
      });
      function Zd(n4) {
        var t = n4 == null ? 0 : n4.length, e2 = x2();
        return n4 = t ? G(n4, function(r3) {
          if (typeof r3[1] != "function") throw new wn2(D4);
          return [e2(r3[0]), r3[1]];
        }) : [], L5(function(r3) {
          for (var s2 = -1; ++s2 < t; ) {
            var o5 = n4[s2];
            if (cn2(o5[0], this, r3)) return cn2(o5[1], this, r3);
          }
        });
      }
      function Jd(n4) {
        return wc(An(n4, Ln2));
      }
      function bi2(n4) {
        return function() {
          return n4;
        };
      }
      function Xd(n4, t) {
        return n4 == null || n4 !== n4 ? t : n4;
      }
      var Qd = Au2(), Vd = Au2(true);
      function fn2(n4) {
        return n4;
      }
      function Ti2(n4) {
        return Vs3(typeof n4 == "function" ? n4 : An(n4, Ln2));
      }
      function kd(n4) {
        return js3(An(n4, Ln2));
      }
      function jd(n4, t) {
        return nu2(n4, An(t, Ln2));
      }
      var ng = L5(function(n4, t) {
        return function(e2) {
          return ae2(e2, n4, t);
        };
      }), tg = L5(function(n4, t) {
        return function(e2) {
          return ae2(n4, e2, t);
        };
      });
      function Li2(n4, t, e2) {
        var r3 = V4(t), s2 = ze2(t, r3);
        e2 == null && !(K3(t) && (s2.length || !r3.length)) && (e2 = t, t = n4, n4 = this, s2 = ze2(t, V4(t)));
        var o5 = !(K3(e2) && "chain" in e2) || !!e2.chain, f5 = Jn2(n4);
        return mn(s2, function(c5) {
          var l4 = t[c5];
          n4[c5] = l4, f5 && (n4.prototype[c5] = function() {
            var v4 = this.__chain__;
            if (o5 || v4) {
              var _2 = n4(this.__wrapped__), m3 = _2.__actions__ = un2(this.__actions__);
              return m3.push({ func: l4, args: arguments, thisArg: n4 }), _2.__chain__ = v4, _2;
            }
            return l4.apply(n4, nt2([this.value()], arguments));
          });
        }), n4;
      }
      function eg() {
        return k3._ === this && (k3._ = Of2), this;
      }
      function Di2() {
      }
      function rg(n4) {
        return n4 = R2(n4), L5(function(t) {
          return tu2(t, n4);
        });
      }
      var ig = ci(G), sg = ci(Cs3), ug = ci(Hr2);
      function wa2(n4) {
        return _i2(n4) ? $r2(Wn2(n4)) : $c(n4);
      }
      function ag(n4) {
        return function(t) {
          return n4 == null ? i3 : _t2(n4, t);
        };
      }
      var og = Iu2(), fg = Iu2(true);
      function Ni2() {
        return [];
      }
      function Hi3() {
        return false;
      }
      function cg() {
        return {};
      }
      function hg() {
        return "";
      }
      function lg() {
        return true;
      }
      function pg(n4, t) {
        if (n4 = R2(n4), n4 < 1 || n4 > kn2) return [];
        var e2 = Hn2, r3 = nn2(n4, Hn2);
        t = x2(t), n4 -= Hn2;
        for (var s2 = Fr3(r3, t); ++e2 < n4; ) t(e2);
        return s2;
      }
      function dg(n4) {
        return O4(n4) ? G(n4, Wn2) : pn(n4) ? [n4] : un2(Fu(W2(n4)));
      }
      function gg(n4) {
        var t = ++yf2;
        return W2(n4) + t;
      }
      var vg = Qe3(function(n4, t) {
        return n4 + t;
      }, 0), _g = hi2("ceil"), mg = Qe3(function(n4, t) {
        return n4 / t;
      }, 1), wg = hi2("floor");
      function Pg(n4) {
        return n4 && n4.length ? Ge3(n4, fn2, Qr2) : i3;
      }
      function Ag(n4, t) {
        return n4 && n4.length ? Ge3(n4, x2(t, 2), Qr2) : i3;
      }
      function Cg(n4) {
        return Es3(n4, fn2);
      }
      function Ig(n4, t) {
        return Es3(n4, x2(t, 2));
      }
      function xg(n4) {
        return n4 && n4.length ? Ge3(n4, fn2, ni) : i3;
      }
      function Eg(n4, t) {
        return n4 && n4.length ? Ge3(n4, x2(t, 2), ni) : i3;
      }
      var yg = Qe3(function(n4, t) {
        return n4 * t;
      }, 1), Sg = hi2("round"), Og = Qe3(function(n4, t) {
        return n4 - t;
      }, 0);
      function Rg(n4) {
        return n4 && n4.length ? Wr(n4, fn2) : 0;
      }
      function bg(n4, t) {
        return n4 && n4.length ? Wr(n4, x2(t, 2)) : 0;
      }
      return a4.after = kl, a4.ary = Qu2, a4.assign = Fp, a4.assignIn = ca2, a4.assignInWith = fr2, a4.assignWith = Mp, a4.at = qp, a4.before = Vu2, a4.bind = Ii2, a4.bindAll = Yd, a4.bindKey = ku, a4.castArray = cp, a4.chain = Zu2, a4.chunk = wh, a4.compact = Ph, a4.concat = Ah, a4.cond = Zd, a4.conforms = Jd, a4.constant = bi2, a4.countBy = Rl, a4.create = Bp, a4.curry = ju2, a4.curryRight = na2, a4.debounce = ta2, a4.defaults = Gp, a4.defaultsDeep = zp, a4.defer = jl, a4.delay = np, a4.difference = Ch, a4.differenceBy = Ih, a4.differenceWith = xh, a4.drop = Eh, a4.dropRight = yh, a4.dropRightWhile = Sh, a4.dropWhile = Oh, a4.fill = Rh, a4.filter = Tl, a4.flatMap = Nl, a4.flatMapDeep = Hl, a4.flatMapDepth = $l, a4.flatten = Gu2, a4.flattenDeep = bh, a4.flattenDepth = Th, a4.flip = tp, a4.flow = Qd, a4.flowRight = Vd, a4.fromPairs = Lh, a4.functions = Vp, a4.functionsIn = kp, a4.groupBy = Ul, a4.initial = Nh, a4.intersection = Hh, a4.intersectionBy = $h, a4.intersectionWith = Uh, a4.invert = nd, a4.invertBy = td, a4.invokeMap = Fl, a4.iteratee = Ti2, a4.keyBy = Ml, a4.keys = V4, a4.keysIn = on2, a4.map = rr3, a4.mapKeys = rd, a4.mapValues = id, a4.matches = kd, a4.matchesProperty = jd, a4.memoize = sr3, a4.merge = sd, a4.mergeWith = ha2, a4.method = ng, a4.methodOf = tg, a4.mixin = Li2, a4.negate = ur3, a4.nthArg = rg, a4.omit = ud, a4.omitBy = ad, a4.once = ep, a4.orderBy = ql, a4.over = ig, a4.overArgs = rp, a4.overEvery = sg, a4.overSome = ug, a4.partial = xi2, a4.partialRight = ea2, a4.partition = Bl, a4.pick = od, a4.pickBy = la2, a4.property = wa2, a4.propertyOf = ag, a4.pull = qh, a4.pullAll = Ku, a4.pullAllBy = Bh, a4.pullAllWith = Gh, a4.pullAt = zh, a4.range = og, a4.rangeRight = fg, a4.rearg = ip, a4.reject = Kl, a4.remove = Kh, a4.rest = sp, a4.reverse = Ai2, a4.sampleSize = Zl, a4.set = cd, a4.setWith = hd, a4.shuffle = Jl, a4.slice = Yh, a4.sortBy = Vl, a4.sortedUniq = jh, a4.sortedUniqBy = nl, a4.split = Nd, a4.spread = up, a4.tail = tl, a4.take = el, a4.takeRight = rl, a4.takeRightWhile = il, a4.takeWhile = sl, a4.tap = Pl, a4.throttle = ap, a4.thru = er3, a4.toArray = aa2, a4.toPairs = pa2, a4.toPairsIn = da2, a4.toPath = dg, a4.toPlainObject = fa2, a4.transform = ld, a4.unary = op, a4.union = ul, a4.unionBy = al, a4.unionWith = ol, a4.uniq = fl, a4.uniqBy = cl, a4.uniqWith = hl, a4.unset = pd, a4.unzip = Ci2, a4.unzipWith = Yu2, a4.update = dd, a4.updateWith = gd, a4.values = Gt3, a4.valuesIn = vd, a4.without = ll, a4.words = _a2, a4.wrap = fp, a4.xor = pl, a4.xorBy = dl, a4.xorWith = gl, a4.zip = vl, a4.zipObject = _l, a4.zipObjectDeep = ml, a4.zipWith = wl, a4.entries = pa2, a4.entriesIn = da2, a4.extend = ca2, a4.extendWith = fr2, Li2(a4, a4), a4.add = vg, a4.attempt = ma2, a4.camelCase = Pd, a4.capitalize = ga2, a4.ceil = _g, a4.clamp = _d, a4.clone = hp, a4.cloneDeep = pp, a4.cloneDeepWith = dp, a4.cloneWith = lp, a4.conformsTo = gp, a4.deburr = va2, a4.defaultTo = Xd, a4.divide = mg, a4.endsWith = Ad, a4.eq = bn2, a4.escape = Cd, a4.escapeRegExp = Id, a4.every = bl, a4.find = Ll, a4.findIndex = qu, a4.findKey = Kp, a4.findLast = Dl, a4.findLastIndex = Bu2, a4.findLastKey = Yp, a4.floor = wg, a4.forEach = Ju2, a4.forEachRight = Xu2, a4.forIn = Zp, a4.forInRight = Jp, a4.forOwn = Xp, a4.forOwnRight = Qp, a4.get = Si2, a4.gt = vp, a4.gte = _p, a4.has = jp, a4.hasIn = Oi2, a4.head = zu, a4.identity = fn2, a4.includes = Wl, a4.indexOf = Dh, a4.inRange = md, a4.invoke = ed, a4.isArguments = Pt2, a4.isArray = O4, a4.isArrayBuffer = mp, a4.isArrayLike = an2, a4.isArrayLikeObject = Z2, a4.isBoolean = wp, a4.isBuffer = at2, a4.isDate = Pp, a4.isElement = Ap, a4.isEmpty = Cp, a4.isEqual = Ip, a4.isEqualWith = xp, a4.isError = Ei2, a4.isFinite = Ep, a4.isFunction = Jn2, a4.isInteger = ra2, a4.isLength = ar3, a4.isMap = ia2, a4.isMatch = yp, a4.isMatchWith = Sp, a4.isNaN = Op, a4.isNative = Rp, a4.isNil = Tp, a4.isNull = bp, a4.isNumber = sa2, a4.isObject = K3, a4.isObjectLike = Y, a4.isPlainObject = pe3, a4.isRegExp = yi2, a4.isSafeInteger = Lp, a4.isSet = ua2, a4.isString = or3, a4.isSymbol = pn, a4.isTypedArray = Bt3, a4.isUndefined = Dp, a4.isWeakMap = Np, a4.isWeakSet = Hp, a4.join = Wh, a4.kebabCase = xd, a4.last = In2, a4.lastIndexOf = Fh, a4.lowerCase = Ed, a4.lowerFirst = yd, a4.lt = $p, a4.lte = Up, a4.max = Pg, a4.maxBy = Ag, a4.mean = Cg, a4.meanBy = Ig, a4.min = xg, a4.minBy = Eg, a4.stubArray = Ni2, a4.stubFalse = Hi3, a4.stubObject = cg, a4.stubString = hg, a4.stubTrue = lg, a4.multiply = yg, a4.nth = Mh, a4.noConflict = eg, a4.noop = Di2, a4.now = ir3, a4.pad = Sd, a4.padEnd = Od, a4.padStart = Rd, a4.parseInt = bd, a4.random = wd, a4.reduce = Gl, a4.reduceRight = zl, a4.repeat = Td, a4.replace = Ld, a4.result = fd, a4.round = Sg, a4.runInContext = h4, a4.sample = Yl, a4.size = Xl, a4.snakeCase = Dd, a4.some = Ql, a4.sortedIndex = Zh, a4.sortedIndexBy = Jh, a4.sortedIndexOf = Xh, a4.sortedLastIndex = Qh, a4.sortedLastIndexBy = Vh, a4.sortedLastIndexOf = kh, a4.startCase = Hd, a4.startsWith = $d, a4.subtract = Og, a4.sum = Rg, a4.sumBy = bg, a4.template = Ud, a4.times = pg, a4.toFinite = Xn2, a4.toInteger = R2, a4.toLength = oa2, a4.toLower = Wd, a4.toNumber = xn2, a4.toSafeInteger = Wp, a4.toString = W2, a4.toUpper = Fd, a4.trim = Md, a4.trimEnd = qd, a4.trimStart = Bd, a4.truncate = Gd, a4.unescape = zd, a4.uniqueId = gg, a4.upperCase = Kd, a4.upperFirst = Ri2, a4.each = Ju2, a4.eachRight = Xu2, a4.first = zu, Li2(a4, function() {
        var n4 = {};
        return $n2(a4, function(t, e2) {
          F.call(a4.prototype, e2) || (n4[e2] = t);
        }), n4;
      }(), { chain: false }), a4.VERSION = p4, mn(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(n4) {
        a4[n4].placeholder = a4;
      }), mn(["drop", "take"], function(n4, t) {
        H.prototype[n4] = function(e2) {
          e2 = e2 === i3 ? 1 : Q4(R2(e2), 0);
          var r3 = this.__filtered__ && !t ? new H(this) : this.clone();
          return r3.__filtered__ ? r3.__takeCount__ = nn2(e2, r3.__takeCount__) : r3.__views__.push({ size: nn2(e2, Hn2), type: n4 + (r3.__dir__ < 0 ? "Right" : "") }), r3;
        }, H.prototype[n4 + "Right"] = function(e2) {
          return this.reverse()[n4](e2).reverse();
        };
      }), mn(["filter", "map", "takeWhile"], function(n4, t) {
        var e2 = t + 1, r3 = e2 == Gi3 || e2 == Fa2;
        H.prototype[n4] = function(s2) {
          var o5 = this.clone();
          return o5.__iteratees__.push({ iteratee: x2(s2, 3), type: e2 }), o5.__filtered__ = o5.__filtered__ || r3, o5;
        };
      }), mn(["head", "last"], function(n4, t) {
        var e2 = "take" + (t ? "Right" : "");
        H.prototype[n4] = function() {
          return this[e2](1).value()[0];
        };
      }), mn(["initial", "tail"], function(n4, t) {
        var e2 = "drop" + (t ? "" : "Right");
        H.prototype[n4] = function() {
          return this.__filtered__ ? new H(this) : this[e2](1);
        };
      }), H.prototype.compact = function() {
        return this.filter(fn2);
      }, H.prototype.find = function(n4) {
        return this.filter(n4).head();
      }, H.prototype.findLast = function(n4) {
        return this.reverse().find(n4);
      }, H.prototype.invokeMap = L5(function(n4, t) {
        return typeof n4 == "function" ? new H(this) : this.map(function(e2) {
          return ae2(e2, n4, t);
        });
      }), H.prototype.reject = function(n4) {
        return this.filter(ur3(x2(n4)));
      }, H.prototype.slice = function(n4, t) {
        n4 = R2(n4);
        var e2 = this;
        return e2.__filtered__ && (n4 > 0 || t < 0) ? new H(e2) : (n4 < 0 ? e2 = e2.takeRight(-n4) : n4 && (e2 = e2.drop(n4)), t !== i3 && (t = R2(t), e2 = t < 0 ? e2.dropRight(-t) : e2.take(t - n4)), e2);
      }, H.prototype.takeRightWhile = function(n4) {
        return this.reverse().takeWhile(n4).reverse();
      }, H.prototype.toArray = function() {
        return this.take(Hn2);
      }, $n2(H.prototype, function(n4, t) {
        var e2 = /^(?:filter|find|map|reject)|While$/.test(t), r3 = /^(?:head|last)$/.test(t), s2 = a4[r3 ? "take" + (t == "last" ? "Right" : "") : t], o5 = r3 || /^find/.test(t);
        s2 && (a4.prototype[t] = function() {
          var f5 = this.__wrapped__, c5 = r3 ? [1] : arguments, l4 = f5 instanceof H, v4 = c5[0], _2 = l4 || O4(f5), m3 = function(N3) {
            var $3 = s2.apply(a4, nt2([N3], c5));
            return r3 && P2 ? $3[0] : $3;
          };
          _2 && e2 && typeof v4 == "function" && v4.length != 1 && (l4 = _2 = false);
          var P2 = this.__chain__, I2 = !!this.__actions__.length, E7 = o5 && !P2, T3 = l4 && !I2;
          if (!o5 && _2) {
            f5 = T3 ? f5 : new H(this);
            var y8 = n4.apply(f5, c5);
            return y8.__actions__.push({ func: er3, args: [m3], thisArg: i3 }), new Pn2(y8, P2);
          }
          return E7 && T3 ? n4.apply(this, c5) : (y8 = this.thru(m3), E7 ? r3 ? y8.value()[0] : y8.value() : y8);
        });
      }), mn(["pop", "push", "shift", "sort", "splice", "unshift"], function(n4) {
        var t = Oe2[n4], e2 = /^(?:push|sort|unshift)$/.test(n4) ? "tap" : "thru", r3 = /^(?:pop|shift)$/.test(n4);
        a4.prototype[n4] = function() {
          var s2 = arguments;
          if (r3 && !this.__chain__) {
            var o5 = this.value();
            return t.apply(O4(o5) ? o5 : [], s2);
          }
          return this[e2](function(f5) {
            return t.apply(O4(f5) ? f5 : [], s2);
          });
        };
      }), $n2(H.prototype, function(n4, t) {
        var e2 = a4[t];
        if (e2) {
          var r3 = e2.name + "";
          F.call(Ut3, r3) || (Ut3[r3] = []), Ut3[r3].push({ name: t, func: e2 });
        }
      }), Ut3[Xe4(i3, ct2).name] = [{ name: "wrapper", func: i3 }], H.prototype.clone = zf2, H.prototype.reverse = Kf2, H.prototype.value = Yf2, a4.prototype.at = Al, a4.prototype.chain = Cl, a4.prototype.commit = Il, a4.prototype.next = xl, a4.prototype.plant = yl, a4.prototype.reverse = Sl, a4.prototype.toJSON = a4.prototype.valueOf = a4.prototype.value = Ol, a4.prototype.first = a4.prototype.head, ne3 && (a4.prototype[ne3] = El), a4;
    }, Nt2 = If2();
    lt2 ? ((lt2.exports = Nt2)._ = Nt2, Tr3._ = Nt2) : k3._ = Nt2;
  }).call(ge3);
})(Ui2, Ui2.exports);
var zg = Object.defineProperty;
var Kg = Object.defineProperties;
var Yg = Object.getOwnPropertyDescriptors;
var ya2 = Object.getOwnPropertySymbols;
var Zg = Object.prototype.hasOwnProperty;
var Jg = Object.prototype.propertyIsEnumerable;
var Sa2 = (A4, u4, i3) => u4 in A4 ? zg(A4, u4, { enumerable: true, configurable: true, writable: true, value: i3 }) : A4[u4] = i3;
var cr3 = (A4, u4) => {
  for (var i3 in u4 || (u4 = {})) Zg.call(u4, i3) && Sa2(A4, i3, u4[i3]);
  if (ya2) for (var i3 of ya2(u4)) Jg.call(u4, i3) && Sa2(A4, i3, u4[i3]);
  return A4;
};
var Xg = (A4, u4) => Kg(A4, Yg(u4));
function ft2(A4, u4, i3) {
  var p4;
  const w4 = dn(A4);
  return ((p4 = u4.rpcMap) == null ? void 0 : p4[w4.reference]) || `${Gg}?chainId=${w4.namespace}:${w4.reference}&projectId=${i3}`;
}
function Ct3(A4) {
  return A4.includes(":") ? A4.split(":")[1] : A4;
}
function Oa2(A4) {
  return A4.map((u4) => `${u4.split(":")[0]}:${u4.split(":")[1]}`);
}
function Qg(A4, u4) {
  const i3 = Object.keys(u4.namespaces).filter((w4) => w4.includes(A4));
  if (!i3.length) return [];
  const p4 = [];
  return i3.forEach((w4) => {
    const b4 = u4.namespaces[w4].accounts;
    p4.push(...b4);
  }), p4;
}
function Wi3(A4 = {}, u4 = {}) {
  const i3 = Ra2(A4), p4 = Ra2(u4);
  return Ui2.exports.merge(i3, p4);
}
function Ra2(A4) {
  var u4, i3, p4, w4;
  const b4 = {};
  if (!Yr(A4)) return b4;
  for (const [D4, En2] of Object.entries(A4)) {
    const zt3 = Zi(D4) ? [D4] : En2.chains, pr3 = En2.methods || [], It2 = En2.events || [], Ln2 = En2.rpcMap || {}, Fn2 = vo(D4);
    b4[Fn2] = Xg(cr3(cr3({}, b4[Fn2]), En2), { chains: ge(zt3, (u4 = b4[Fn2]) == null ? void 0 : u4.chains), methods: ge(pr3, (i3 = b4[Fn2]) == null ? void 0 : i3.methods), events: ge(It2, (p4 = b4[Fn2]) == null ? void 0 : p4.events), rpcMap: cr3(cr3({}, Ln2), (w4 = b4[Fn2]) == null ? void 0 : w4.rpcMap) });
  }
  return b4;
}
function Vg(A4) {
  return A4.includes(":") ? A4.split(":")[2] : A4;
}
function ba2(A4) {
  const u4 = {};
  for (const [i3, p4] of Object.entries(A4)) {
    const w4 = p4.methods || [], b4 = p4.events || [], D4 = p4.accounts || [], En2 = Zi(i3) ? [i3] : p4.chains ? p4.chains : Oa2(p4.accounts);
    u4[i3] = { chains: En2, methods: w4, events: b4, accounts: D4 };
  }
  return u4;
}
function Fi2(A4) {
  return typeof A4 == "number" ? A4 : A4.includes("0x") ? parseInt(A4, 16) : (A4 = A4.includes(":") ? A4.split(":")[1] : A4, isNaN(Number(A4)) ? A4 : Number(A4));
}
var Ta2 = {};
var z3 = (A4) => Ta2[A4];
var Mi3 = (A4, u4) => {
  Ta2[A4] = u4;
};
var kg = class {
  constructor(u4) {
    this.name = "polkadot", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(u4, i3), this.chainId = u4, this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${u4}`);
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]) || [] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var p4;
      const w4 = Ct3(i3);
      u4[w4] = this.createHttpProvider(w4, (p4 = this.namespace.rpcMap) == null ? void 0 : p4[i3]);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  setHttpProvider(u4, i3) {
    const p4 = this.createHttpProvider(u4, i3);
    p4 && (this.httpProviders[u4] = p4);
  }
  createHttpProvider(u4, i3) {
    const p4 = i3 || ft2(u4, this.namespace, this.client.core.projectId);
    if (!p4) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new o3(new f4(p4, z3("disableProviderPing")));
  }
};
var jg = class {
  constructor(u4) {
    this.name = "eip155", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.httpProviders = this.createHttpProviders(), this.chainId = parseInt(this.getDefaultChain());
  }
  async request(u4) {
    switch (u4.request.method) {
      case "eth_requestAccounts":
        return this.getAccounts();
      case "eth_accounts":
        return this.getAccounts();
      case "wallet_switchEthereumChain":
        return await this.handleSwitchChain(u4);
      case "eth_chainId":
        return parseInt(this.getDefaultChain());
    }
    return this.namespace.methods.includes(u4.request.method) ? await this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(parseInt(u4), i3), this.chainId = parseInt(u4), this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${u4}`);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId.toString();
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  createHttpProvider(u4, i3) {
    const p4 = i3 || ft2(`${this.name}:${u4}`, this.namespace, this.client.core.projectId);
    if (!p4) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new o3(new f4(p4, z3("disableProviderPing")));
  }
  setHttpProvider(u4, i3) {
    const p4 = this.createHttpProvider(u4, i3);
    p4 && (this.httpProviders[u4] = p4);
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var p4;
      const w4 = parseInt(Ct3(i3));
      u4[w4] = this.createHttpProvider(w4, (p4 = this.namespace.rpcMap) == null ? void 0 : p4[i3]);
    }), u4;
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? [...new Set(u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]))] : [];
  }
  getHttpProvider() {
    const u4 = this.chainId, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  async handleSwitchChain(u4) {
    var i3, p4;
    let w4 = u4.request.params ? (i3 = u4.request.params[0]) == null ? void 0 : i3.chainId : "0x0";
    w4 = w4.startsWith("0x") ? w4 : `0x${w4}`;
    const b4 = parseInt(w4, 16);
    if (this.isChainApproved(b4)) this.setDefaultChain(`${b4}`);
    else if (this.namespace.methods.includes("wallet_switchEthereumChain")) await this.client.request({ topic: u4.topic, request: { method: u4.request.method, params: [{ chainId: w4 }] }, chainId: (p4 = this.namespace.chains) == null ? void 0 : p4[0] }), this.setDefaultChain(`${b4}`);
    else throw new Error(`Failed to switch to chain 'eip155:${b4}'. The chain is not approved or the wallet does not support 'wallet_switchEthereumChain' method.`);
    return null;
  }
  isChainApproved(u4) {
    return this.namespace.chains.includes(`${this.name}:${u4}`);
  }
};
var nv = class {
  constructor(u4) {
    this.name = "solana", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(u4, i3), this.chainId = u4, this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${u4}`);
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? [...new Set(u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var p4;
      const w4 = Ct3(i3);
      u4[w4] = this.createHttpProvider(w4, (p4 = this.namespace.rpcMap) == null ? void 0 : p4[i3]);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  setHttpProvider(u4, i3) {
    const p4 = this.createHttpProvider(u4, i3);
    p4 && (this.httpProviders[u4] = p4);
  }
  createHttpProvider(u4, i3) {
    const p4 = i3 || ft2(u4, this.namespace, this.client.core.projectId);
    if (!p4) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new o3(new f4(p4, z3("disableProviderPing")));
  }
};
var tv = class {
  constructor(u4) {
    this.name = "cosmos", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(u4, i3), this.chainId = u4, this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? [...new Set(u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var p4;
      const w4 = Ct3(i3);
      u4[w4] = this.createHttpProvider(w4, (p4 = this.namespace.rpcMap) == null ? void 0 : p4[i3]);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  setHttpProvider(u4, i3) {
    const p4 = this.createHttpProvider(u4, i3);
    p4 && (this.httpProviders[u4] = p4);
  }
  createHttpProvider(u4, i3) {
    const p4 = i3 || ft2(u4, this.namespace, this.client.core.projectId);
    if (!p4) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new o3(new f4(p4, z3("disableProviderPing")));
  }
};
var ev = class {
  constructor(u4) {
    this.name = "cip34", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(u4, i3), this.chainId = u4, this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? [...new Set(u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      const p4 = this.getCardanoRPCUrl(i3), w4 = Ct3(i3);
      u4[w4] = this.createHttpProvider(w4, p4);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  getCardanoRPCUrl(u4) {
    const i3 = this.namespace.rpcMap;
    if (i3) return i3[u4];
  }
  setHttpProvider(u4, i3) {
    const p4 = this.createHttpProvider(u4, i3);
    p4 && (this.httpProviders[u4] = p4);
  }
  createHttpProvider(u4, i3) {
    const p4 = i3 || this.getCardanoRPCUrl(u4);
    if (!p4) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new o3(new f4(p4, z3("disableProviderPing")));
  }
};
var rv = class {
  constructor(u4) {
    this.name = "elrond", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(u4, i3), this.chainId = u4, this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${u4}`);
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? [...new Set(u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var p4;
      const w4 = Ct3(i3);
      u4[w4] = this.createHttpProvider(w4, (p4 = this.namespace.rpcMap) == null ? void 0 : p4[i3]);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  setHttpProvider(u4, i3) {
    const p4 = this.createHttpProvider(u4, i3);
    p4 && (this.httpProviders[u4] = p4);
  }
  createHttpProvider(u4, i3) {
    const p4 = i3 || ft2(u4, this.namespace, this.client.core.projectId);
    if (!p4) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new o3(new f4(p4, z3("disableProviderPing")));
  }
};
var iv = class {
  constructor(u4) {
    this.name = "multiversx", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(u4, i3), this.chainId = u4, this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${u4}`);
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? [...new Set(u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var p4;
      const w4 = Ct3(i3);
      u4[w4] = this.createHttpProvider(w4, (p4 = this.namespace.rpcMap) == null ? void 0 : p4[i3]);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  setHttpProvider(u4, i3) {
    const p4 = this.createHttpProvider(u4, i3);
    p4 && (this.httpProviders[u4] = p4);
  }
  createHttpProvider(u4, i3) {
    const p4 = i3 || ft2(u4, this.namespace, this.client.core.projectId);
    if (!p4) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new o3(new f4(p4, z3("disableProviderPing")));
  }
};
var sv = class {
  constructor(u4) {
    this.name = "near", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    if (this.chainId = u4, !this.httpProviders[u4]) {
      const p4 = i3 || ft2(`${this.name}:${u4}`, this.namespace);
      if (!p4) throw new Error(`No RPC url provided for chainId: ${u4}`);
      this.setHttpProvider(u4, p4);
    }
    this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]) || [] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var p4;
      u4[i3] = this.createHttpProvider(i3, (p4 = this.namespace.rpcMap) == null ? void 0 : p4[i3]);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  setHttpProvider(u4, i3) {
    const p4 = this.createHttpProvider(u4, i3);
    p4 && (this.httpProviders[u4] = p4);
  }
  createHttpProvider(u4, i3) {
    const p4 = i3 || ft2(u4, this.namespace);
    return typeof p4 > "u" ? void 0 : new o3(new f4(p4, z3("disableProviderPing")));
  }
};
var uv = Object.defineProperty;
var av = Object.defineProperties;
var ov = Object.getOwnPropertyDescriptors;
var La2 = Object.getOwnPropertySymbols;
var fv = Object.prototype.hasOwnProperty;
var cv = Object.prototype.propertyIsEnumerable;
var Da2 = (A4, u4, i3) => u4 in A4 ? uv(A4, u4, { enumerable: true, configurable: true, writable: true, value: i3 }) : A4[u4] = i3;
var hr3 = (A4, u4) => {
  for (var i3 in u4 || (u4 = {})) fv.call(u4, i3) && Da2(A4, i3, u4[i3]);
  if (La2) for (var i3 of La2(u4)) cv.call(u4, i3) && Da2(A4, i3, u4[i3]);
  return A4;
};
var qi2 = (A4, u4) => av(A4, ov(u4));
var lr3 = class _lr {
  constructor(u4) {
    this.events = new import_events10.default(), this.rpcProviders = {}, this.shouldAbortPairingAttempt = false, this.maxPairingAttempts = 10, this.disableProviderPing = false, this.providerOpts = u4, this.logger = typeof (u4 == null ? void 0 : u4.logger) < "u" && typeof (u4 == null ? void 0 : u4.logger) != "string" ? u4.logger : (0, import_pino.default)(k({ level: (u4 == null ? void 0 : u4.logger) || xa2 })), this.disableProviderPing = (u4 == null ? void 0 : u4.disableProviderPing) || false;
  }
  static async init(u4) {
    const i3 = new _lr(u4);
    return await i3.initialize(), i3;
  }
  async request(u4, i3, p4) {
    const [w4, b4] = this.validateChain(i3);
    if (!this.session) throw new Error("Please call connect() before request()");
    return await this.getProvider(w4).request({ request: hr3({}, u4), chainId: `${w4}:${b4}`, topic: this.session.topic, expiry: p4 });
  }
  sendAsync(u4, i3, p4, w4) {
    const b4 = (/* @__PURE__ */ new Date()).getTime();
    this.request(u4, p4, w4).then((D4) => i3(null, formatJsonRpcResult(b4, D4))).catch((D4) => i3(D4, void 0));
  }
  async enable() {
    if (!this.client) throw new Error("Sign Client not initialized");
    return this.session || await this.connect({ namespaces: this.namespaces, optionalNamespaces: this.optionalNamespaces, sessionProperties: this.sessionProperties }), await this.requestAccounts();
  }
  async disconnect() {
    var u4;
    if (!this.session) throw new Error("Please call connect() before enable()");
    await this.client.disconnect({ topic: (u4 = this.session) == null ? void 0 : u4.topic, reason: tr("USER_DISCONNECTED") }), await this.cleanup();
  }
  async connect(u4) {
    if (!this.client) throw new Error("Sign Client not initialized");
    if (this.setNamespaces(u4), await this.cleanupPendingPairings(), !u4.skipPairing) return await this.pair(u4.pairingTopic);
  }
  async authenticate(u4) {
    if (!this.client) throw new Error("Sign Client not initialized");
    this.setNamespaces(u4), await this.cleanupPendingPairings();
    const { uri: i3, response: p4 } = await this.client.authenticate(u4);
    i3 && (this.uri = i3, this.events.emit("display_uri", i3));
    const w4 = await p4();
    if (this.session = w4.session, this.session) {
      const b4 = ba2(this.session.namespaces);
      this.namespaces = Wi3(this.namespaces, b4), this.persist("namespaces", this.namespaces), this.onConnect();
    }
    return w4;
  }
  on(u4, i3) {
    this.events.on(u4, i3);
  }
  once(u4, i3) {
    this.events.once(u4, i3);
  }
  removeListener(u4, i3) {
    this.events.removeListener(u4, i3);
  }
  off(u4, i3) {
    this.events.off(u4, i3);
  }
  get isWalletConnect() {
    return true;
  }
  async pair(u4) {
    this.shouldAbortPairingAttempt = false;
    let i3 = 0;
    do {
      if (this.shouldAbortPairingAttempt) throw new Error("Pairing aborted");
      if (i3 >= this.maxPairingAttempts) throw new Error("Max auto pairing attempts reached");
      const { uri: p4, approval: w4 } = await this.client.connect({ pairingTopic: u4, requiredNamespaces: this.namespaces, optionalNamespaces: this.optionalNamespaces, sessionProperties: this.sessionProperties });
      p4 && (this.uri = p4, this.events.emit("display_uri", p4)), await w4().then((b4) => {
        this.session = b4;
        const D4 = ba2(b4.namespaces);
        this.namespaces = Wi3(this.namespaces, D4), this.persist("namespaces", this.namespaces);
      }).catch((b4) => {
        if (b4.message !== Ge2) throw b4;
        i3++;
      });
    } while (!this.session);
    return this.onConnect(), this.session;
  }
  setDefaultChain(u4, i3) {
    try {
      if (!this.session) return;
      const [p4, w4] = this.validateChain(u4);
      this.getProvider(p4).setDefaultChain(w4, i3);
    } catch (p4) {
      if (!/Please call connect/.test(p4.message)) throw p4;
    }
  }
  async cleanupPendingPairings(u4 = {}) {
    this.logger.info("Cleaning up inactive pairings...");
    const i3 = this.client.pairing.getAll();
    if (Er(i3)) {
      for (const p4 of i3) u4.deletePairings ? this.client.core.expirer.set(p4.topic, 0) : await this.client.core.relayer.subscriber.unsubscribe(p4.topic);
      this.logger.info(`Inactive pairings cleared: ${i3.length}`);
    }
  }
  abortPairingAttempt() {
    this.shouldAbortPairingAttempt = true;
  }
  async checkStorage() {
    if (this.namespaces = await this.getFromStore("namespaces"), this.optionalNamespaces = await this.getFromStore("optionalNamespaces") || {}, this.client.session.length) {
      const u4 = this.client.session.keys.length - 1;
      this.session = this.client.session.get(this.client.session.keys[u4]), this.createProviders();
    }
  }
  async initialize() {
    this.logger.trace("Initialized"), await this.createClient(), await this.checkStorage(), this.registerEventListeners();
  }
  async createClient() {
    this.client = this.providerOpts.client || await oe2.init({ logger: this.providerOpts.logger || xa2, relayUrl: this.providerOpts.relayUrl || Mg, projectId: this.providerOpts.projectId, metadata: this.providerOpts.metadata, storageOptions: this.providerOpts.storageOptions, storage: this.providerOpts.storage, name: this.providerOpts.name }), this.logger.trace("SignClient Initialized");
  }
  createProviders() {
    if (!this.client) throw new Error("Sign Client not initialized");
    if (!this.session) throw new Error("Session not initialized. Please call connect() before enable()");
    const u4 = [...new Set(Object.keys(this.session.namespaces).map((i3) => vo(i3)))];
    Mi3("client", this.client), Mi3("events", this.events), Mi3("disableProviderPing", this.disableProviderPing), u4.forEach((i3) => {
      if (!this.session) return;
      const p4 = Qg(i3, this.session), w4 = Oa2(p4), b4 = Wi3(this.namespaces, this.optionalNamespaces), D4 = qi2(hr3({}, b4[i3]), { accounts: p4, chains: w4 });
      switch (i3) {
        case "eip155":
          this.rpcProviders[i3] = new jg({ namespace: D4 });
          break;
        case "solana":
          this.rpcProviders[i3] = new nv({ namespace: D4 });
          break;
        case "cosmos":
          this.rpcProviders[i3] = new tv({ namespace: D4 });
          break;
        case "polkadot":
          this.rpcProviders[i3] = new kg({ namespace: D4 });
          break;
        case "cip34":
          this.rpcProviders[i3] = new ev({ namespace: D4 });
          break;
        case "elrond":
          this.rpcProviders[i3] = new rv({ namespace: D4 });
          break;
        case "multiversx":
          this.rpcProviders[i3] = new iv({ namespace: D4 });
          break;
        case "near":
          this.rpcProviders[i3] = new sv({ namespace: D4 });
          break;
      }
    });
  }
  registerEventListeners() {
    if (typeof this.client > "u") throw new Error("Sign Client is not initialized");
    this.client.on("session_ping", (u4) => {
      this.events.emit("session_ping", u4);
    }), this.client.on("session_event", (u4) => {
      const { params: i3 } = u4, { event: p4 } = i3;
      if (p4.name === "accountsChanged") {
        const w4 = p4.data;
        w4 && Er(w4) && this.events.emit("accountsChanged", w4.map(Vg));
      } else if (p4.name === "chainChanged") {
        const w4 = i3.chainId, b4 = i3.event.data, D4 = vo(w4), En2 = Fi2(w4) !== Fi2(b4) ? `${D4}:${Fi2(b4)}` : w4;
        this.onChainChanged(En2);
      } else this.events.emit(p4.name, p4.data);
      this.events.emit("session_event", u4);
    }), this.client.on("session_update", ({ topic: u4, params: i3 }) => {
      var p4;
      const { namespaces: w4 } = i3, b4 = (p4 = this.client) == null ? void 0 : p4.session.get(u4);
      this.session = qi2(hr3({}, b4), { namespaces: w4 }), this.onSessionUpdate(), this.events.emit("session_update", { topic: u4, params: i3 });
    }), this.client.on("session_delete", async (u4) => {
      await this.cleanup(), this.events.emit("session_delete", u4), this.events.emit("disconnect", qi2(hr3({}, tr("USER_DISCONNECTED")), { data: u4.topic }));
    }), this.on(Vn2.DEFAULT_CHAIN_CHANGED, (u4) => {
      this.onChainChanged(u4, true);
    });
  }
  getProvider(u4) {
    if (!this.rpcProviders[u4]) throw new Error(`Provider not found: ${u4}`);
    return this.rpcProviders[u4];
  }
  onSessionUpdate() {
    Object.keys(this.rpcProviders).forEach((u4) => {
      var i3;
      this.getProvider(u4).updateNamespace((i3 = this.session) == null ? void 0 : i3.namespaces[u4]);
    });
  }
  setNamespaces(u4) {
    const { namespaces: i3, optionalNamespaces: p4, sessionProperties: w4 } = u4;
    i3 && Object.keys(i3).length && (this.namespaces = i3), p4 && Object.keys(p4).length && (this.optionalNamespaces = p4), this.sessionProperties = w4, this.persist("namespaces", i3), this.persist("optionalNamespaces", p4);
  }
  validateChain(u4) {
    const [i3, p4] = (u4 == null ? void 0 : u4.split(":")) || ["", ""];
    if (!this.namespaces || !Object.keys(this.namespaces).length) return [i3, p4];
    if (i3 && !Object.keys(this.namespaces || {}).map((D4) => vo(D4)).includes(i3)) throw new Error(`Namespace '${i3}' is not configured. Please call connect() first with namespace config.`);
    if (i3 && p4) return [i3, p4];
    const w4 = vo(Object.keys(this.namespaces)[0]), b4 = this.rpcProviders[w4].getDefaultChain();
    return [w4, b4];
  }
  async requestAccounts() {
    const [u4] = this.validateChain();
    return await this.getProvider(u4).requestAccounts();
  }
  onChainChanged(u4, i3 = false) {
    if (!this.namespaces) return;
    const [p4, w4] = this.validateChain(u4);
    w4 && (i3 || this.getProvider(p4).setDefaultChain(w4), this.namespaces[p4] ? this.namespaces[p4].defaultChain = w4 : this.namespaces[`${p4}:${w4}`] ? this.namespaces[`${p4}:${w4}`].defaultChain = w4 : this.namespaces[`${p4}:${w4}`] = { defaultChain: w4 }, this.persist("namespaces", this.namespaces), this.events.emit("chainChanged", w4));
  }
  onConnect() {
    this.createProviders(), this.events.emit("connect", { session: this.session });
  }
  async cleanup() {
    this.session = void 0, this.namespaces = void 0, this.optionalNamespaces = void 0, this.sessionProperties = void 0, this.persist("namespaces", void 0), this.persist("optionalNamespaces", void 0), this.persist("sessionProperties", void 0), await this.cleanupPendingPairings({ deletePairings: true });
  }
  persist(u4, i3) {
    this.client.core.storage.setItem(`${Ea2}/${u4}`, i3);
  }
  async getFromStore(u4) {
    return await this.client.core.storage.getItem(`${Ea2}/${u4}`);
  }
};
var hv = lr3;

// node_modules/@walletconnect/ethereum-provider/dist/index.es.js
var T2 = "wc";
var S3 = "ethereum_provider";
var $2 = `${T2}@2:${S3}:`;
var j5 = "https://rpc.walletconnect.com/v1/";
var u3 = ["eth_sendTransaction", "personal_sign"];
var y7 = ["eth_accounts", "eth_requestAccounts", "eth_sendRawTransaction", "eth_sign", "eth_signTransaction", "eth_signTypedData", "eth_signTypedData_v3", "eth_signTypedData_v4", "eth_sendTransaction", "personal_sign", "wallet_switchEthereumChain", "wallet_addEthereumChain", "wallet_getPermissions", "wallet_requestPermissions", "wallet_registerOnboarding", "wallet_watchAsset", "wallet_scanQRCode", "wallet_sendCalls", "wallet_getCapabilities", "wallet_getCallsStatus", "wallet_showCallsStatus"];
var g3 = ["chainChanged", "accountsChanged"];
var M3 = ["chainChanged", "accountsChanged", "message", "disconnect", "connect"];
var q2 = Object.defineProperty;
var N2 = Object.defineProperties;
var D3 = Object.getOwnPropertyDescriptors;
var O3 = Object.getOwnPropertySymbols;
var U3 = Object.prototype.hasOwnProperty;
var Q3 = Object.prototype.propertyIsEnumerable;
var b3 = (a4, t, s2) => t in a4 ? q2(a4, t, { enumerable: true, configurable: true, writable: true, value: s2 }) : a4[t] = s2;
var p3 = (a4, t) => {
  for (var s2 in t || (t = {})) U3.call(t, s2) && b3(a4, s2, t[s2]);
  if (O3) for (var s2 of O3(t)) Q3.call(t, s2) && b3(a4, s2, t[s2]);
  return a4;
};
var E6 = (a4, t) => N2(a4, D3(t));
function m2(a4) {
  return Number(a4[0].split(":")[1]);
}
function v3(a4) {
  return `0x${a4.toString(16)}`;
}
function L4(a4) {
  const { chains: t, optionalChains: s2, methods: i3, optionalMethods: e2, events: n4, optionalEvents: o5, rpcMap: r3 } = a4;
  if (!Er(t)) throw new Error("Invalid chains");
  const c5 = { chains: t, methods: i3 || u3, events: n4 || g3, rpcMap: p3({}, t.length ? { [m2(t)]: r3[m2(t)] } : {}) }, h4 = n4 == null ? void 0 : n4.filter((l4) => !g3.includes(l4)), d3 = i3 == null ? void 0 : i3.filter((l4) => !u3.includes(l4));
  if (!s2 && !o5 && !e2 && !(h4 != null && h4.length) && !(d3 != null && d3.length)) return { required: t.length ? c5 : void 0 };
  const w4 = (h4 == null ? void 0 : h4.length) && (d3 == null ? void 0 : d3.length) || !s2, I2 = { chains: [...new Set(w4 ? c5.chains.concat(s2 || []) : s2)], methods: [...new Set(c5.methods.concat(e2 != null && e2.length ? e2 : y7))], events: [...new Set(c5.events.concat(o5 != null && o5.length ? o5 : M3))], rpcMap: r3 };
  return { required: t.length ? c5 : void 0, optional: s2.length ? I2 : void 0 };
}
var C3 = class _C {
  constructor() {
    this.events = new import_events11.EventEmitter(), this.namespace = "eip155", this.accounts = [], this.chainId = 1, this.STORAGE_KEY = $2, this.on = (t, s2) => (this.events.on(t, s2), this), this.once = (t, s2) => (this.events.once(t, s2), this), this.removeListener = (t, s2) => (this.events.removeListener(t, s2), this), this.off = (t, s2) => (this.events.off(t, s2), this), this.parseAccount = (t) => this.isCompatibleChainId(t) ? this.parseAccountId(t).address : t, this.signer = {}, this.rpc = {};
  }
  static async init(t) {
    const s2 = new _C();
    return await s2.initialize(t), s2;
  }
  async request(t, s2) {
    return await this.signer.request(t, this.formatChainId(this.chainId), s2);
  }
  sendAsync(t, s2, i3) {
    this.signer.sendAsync(t, s2, this.formatChainId(this.chainId), i3);
  }
  get connected() {
    return this.signer.client ? this.signer.client.core.relayer.connected : false;
  }
  get connecting() {
    return this.signer.client ? this.signer.client.core.relayer.connecting : false;
  }
  async enable() {
    return this.session || await this.connect(), await this.request({ method: "eth_requestAccounts" });
  }
  async connect(t) {
    if (!this.signer.client) throw new Error("Provider not initialized. Call init() first");
    this.loadConnectOpts(t);
    const { required: s2, optional: i3 } = L4(this.rpc);
    try {
      const e2 = await new Promise(async (o5, r3) => {
        var c5;
        this.rpc.showQrModal && ((c5 = this.modal) == null || c5.subscribeModal((h4) => {
          !h4.open && !this.signer.session && (this.signer.abortPairingAttempt(), r3(new Error("Connection request reset. Please try again.")));
        })), await this.signer.connect(E6(p3({ namespaces: p3({}, s2 && { [this.namespace]: s2 }) }, i3 && { optionalNamespaces: { [this.namespace]: i3 } }), { pairingTopic: t == null ? void 0 : t.pairingTopic })).then((h4) => {
          o5(h4);
        }).catch((h4) => {
          r3(new Error(h4.message));
        });
      });
      if (!e2) return;
      const n4 = zo(e2.namespaces, [this.namespace]);
      this.setChainIds(this.rpc.chains.length ? this.rpc.chains : n4), this.setAccounts(n4), this.events.emit("connect", { chainId: v3(this.chainId) });
    } catch (e2) {
      throw this.signer.logger.error(e2), e2;
    } finally {
      this.modal && this.modal.closeModal();
    }
  }
  async authenticate(t) {
    if (!this.signer.client) throw new Error("Provider not initialized. Call init() first");
    this.loadConnectOpts({ chains: t == null ? void 0 : t.chains });
    try {
      const s2 = await new Promise(async (e2, n4) => {
        var o5;
        this.rpc.showQrModal && ((o5 = this.modal) == null || o5.subscribeModal((r3) => {
          !r3.open && !this.signer.session && (this.signer.abortPairingAttempt(), n4(new Error("Connection request reset. Please try again.")));
        })), await this.signer.authenticate(E6(p3({}, t), { chains: this.rpc.chains })).then((r3) => {
          e2(r3);
        }).catch((r3) => {
          n4(new Error(r3.message));
        });
      }), i3 = s2.session;
      if (i3) {
        const e2 = zo(i3.namespaces, [this.namespace]);
        this.setChainIds(this.rpc.chains.length ? this.rpc.chains : e2), this.setAccounts(e2), this.events.emit("connect", { chainId: v3(this.chainId) });
      }
      return s2;
    } catch (s2) {
      throw this.signer.logger.error(s2), s2;
    } finally {
      this.modal && this.modal.closeModal();
    }
  }
  async disconnect() {
    this.session && await this.signer.disconnect(), this.reset();
  }
  get isWalletConnect() {
    return true;
  }
  get session() {
    return this.signer.session;
  }
  registerEventListeners() {
    this.signer.on("session_event", (t) => {
      const { params: s2 } = t, { event: i3 } = s2;
      i3.name === "accountsChanged" ? (this.accounts = this.parseAccounts(i3.data), this.events.emit("accountsChanged", this.accounts)) : i3.name === "chainChanged" ? this.setChainId(this.formatChainId(i3.data)) : this.events.emit(i3.name, i3.data), this.events.emit("session_event", t);
    }), this.signer.on("chainChanged", (t) => {
      const s2 = parseInt(t);
      this.chainId = s2, this.events.emit("chainChanged", v3(this.chainId)), this.persist();
    }), this.signer.on("session_update", (t) => {
      this.events.emit("session_update", t);
    }), this.signer.on("session_delete", (t) => {
      this.reset(), this.events.emit("session_delete", t), this.events.emit("disconnect", E6(p3({}, tr("USER_DISCONNECTED")), { data: t.topic, name: "USER_DISCONNECTED" }));
    }), this.signer.on("display_uri", (t) => {
      var s2, i3;
      this.rpc.showQrModal && ((s2 = this.modal) == null || s2.closeModal(), (i3 = this.modal) == null || i3.openModal({ uri: t })), this.events.emit("display_uri", t);
    });
  }
  switchEthereumChain(t) {
    this.request({ method: "wallet_switchEthereumChain", params: [{ chainId: t.toString(16) }] });
  }
  isCompatibleChainId(t) {
    return typeof t == "string" ? t.startsWith(`${this.namespace}:`) : false;
  }
  formatChainId(t) {
    return `${this.namespace}:${t}`;
  }
  parseChainId(t) {
    return Number(t.split(":")[1]);
  }
  setChainIds(t) {
    const s2 = t.filter((i3) => this.isCompatibleChainId(i3)).map((i3) => this.parseChainId(i3));
    s2.length && (this.chainId = s2[0], this.events.emit("chainChanged", v3(this.chainId)), this.persist());
  }
  setChainId(t) {
    if (this.isCompatibleChainId(t)) {
      const s2 = this.parseChainId(t);
      this.chainId = s2, this.switchEthereumChain(s2);
    }
  }
  parseAccountId(t) {
    const [s2, i3, e2] = t.split(":");
    return { chainId: `${s2}:${i3}`, address: e2 };
  }
  setAccounts(t) {
    this.accounts = t.filter((s2) => this.parseChainId(this.parseAccountId(s2).chainId) === this.chainId).map((s2) => this.parseAccountId(s2).address), this.events.emit("accountsChanged", this.accounts);
  }
  getRpcConfig(t) {
    var s2, i3;
    const e2 = (s2 = t == null ? void 0 : t.chains) != null ? s2 : [], n4 = (i3 = t == null ? void 0 : t.optionalChains) != null ? i3 : [], o5 = e2.concat(n4);
    if (!o5.length) throw new Error("No chains specified in either `chains` or `optionalChains`");
    const r3 = e2.length ? (t == null ? void 0 : t.methods) || u3 : [], c5 = e2.length ? (t == null ? void 0 : t.events) || g3 : [], h4 = (t == null ? void 0 : t.optionalMethods) || [], d3 = (t == null ? void 0 : t.optionalEvents) || [], w4 = (t == null ? void 0 : t.rpcMap) || this.buildRpcMap(o5, t.projectId), I2 = (t == null ? void 0 : t.qrModalOptions) || void 0;
    return { chains: e2 == null ? void 0 : e2.map((l4) => this.formatChainId(l4)), optionalChains: n4.map((l4) => this.formatChainId(l4)), methods: r3, events: c5, optionalMethods: h4, optionalEvents: d3, rpcMap: w4, showQrModal: !!(t != null && t.showQrModal), qrModalOptions: I2, projectId: t.projectId, metadata: t.metadata };
  }
  buildRpcMap(t, s2) {
    const i3 = {};
    return t.forEach((e2) => {
      i3[e2] = this.getRpcUrl(e2, s2);
    }), i3;
  }
  async initialize(t) {
    if (this.rpc = this.getRpcConfig(t), this.chainId = this.rpc.chains.length ? m2(this.rpc.chains) : m2(this.rpc.optionalChains), this.signer = await hv.init({ projectId: this.rpc.projectId, metadata: this.rpc.metadata, disableProviderPing: t.disableProviderPing, relayUrl: t.relayUrl, storageOptions: t.storageOptions }), this.registerEventListeners(), await this.loadPersistedSession(), this.rpc.showQrModal) {
      let s2;
      try {
        const { WalletConnectModal: i3 } = await import("./dist-Y5YAUXO2.js");
        s2 = i3;
      } catch {
        throw new Error("To use QR modal, please install @walletconnect/modal package");
      }
      if (s2) try {
        this.modal = new s2(p3({ projectId: this.rpc.projectId }, this.rpc.qrModalOptions));
      } catch (i3) {
        throw this.signer.logger.error(i3), new Error("Could not generate WalletConnectModal Instance");
      }
    }
  }
  loadConnectOpts(t) {
    if (!t) return;
    const { chains: s2, optionalChains: i3, rpcMap: e2 } = t;
    s2 && Er(s2) && (this.rpc.chains = s2.map((n4) => this.formatChainId(n4)), s2.forEach((n4) => {
      this.rpc.rpcMap[n4] = (e2 == null ? void 0 : e2[n4]) || this.getRpcUrl(n4);
    })), i3 && Er(i3) && (this.rpc.optionalChains = [], this.rpc.optionalChains = i3 == null ? void 0 : i3.map((n4) => this.formatChainId(n4)), i3.forEach((n4) => {
      this.rpc.rpcMap[n4] = (e2 == null ? void 0 : e2[n4]) || this.getRpcUrl(n4);
    }));
  }
  getRpcUrl(t, s2) {
    var i3;
    return ((i3 = this.rpc.rpcMap) == null ? void 0 : i3[t]) || `${j5}?chainId=eip155:${t}&projectId=${s2 || this.rpc.projectId}`;
  }
  async loadPersistedSession() {
    if (this.session) try {
      const t = await this.signer.client.core.storage.getItem(`${this.STORAGE_KEY}/chainId`), s2 = this.session.namespaces[`${this.namespace}:${t}`] ? this.session.namespaces[`${this.namespace}:${t}`] : this.session.namespaces[this.namespace];
      this.setChainIds(t ? [this.formatChainId(t)] : s2 == null ? void 0 : s2.accounts), this.setAccounts(s2 == null ? void 0 : s2.accounts);
    } catch (t) {
      this.signer.logger.error("Failed to load persisted session, clearing state..."), this.signer.logger.error(t), await this.disconnect().catch((s2) => this.signer.logger.warn(s2));
    }
  }
  reset() {
    this.chainId = 1, this.accounts = [];
  }
  persist() {
    this.session && this.signer.client.core.storage.setItem(`${this.STORAGE_KEY}/chainId`, this.chainId);
  }
  parseAccounts(t) {
    return typeof t == "string" || t instanceof String ? [this.parseAccount(t)] : t.map((s2) => this.parseAccount(s2));
  }
};
var z4 = C3;

export {
  u3 as u,
  y7 as y,
  g3 as g,
  M3 as M,
  C3 as C,
  z4 as z
};
/*! Bundled license information:

@walletconnect/utils/dist/index.es.js:
  (**
  * [js-sha3]{@link https://github.com/emn178/js-sha3}
  *
  * @version 0.8.0
  * @author Chen, Yi-Cyuan [emn178@gmail.com]
  * @copyright Chen, Yi-Cyuan 2015-2018
  * @license MIT
  *)

@walletconnect/universal-provider/dist/index.es.js:
  (**
  * @license
  * Lodash <https://lodash.com/>
  * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
  * Released under MIT license <https://lodash.com/license>
  * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
  * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
  *)
*/
//# sourceMappingURL=chunk-5Y7BR324.js.map
