/*
    This file was not modified. for license see https://github.com/amark/gun/blob/master/LICENSE.md
*/
; (function () {
    function Radix() {
        const radix = function (key, val, t) {
            radix.unit = 0;
            if (!t && u !== val) {
                if ('' + key > radix.last) {
                    radix.last = '' + key;
                }
                delete (radix.$ || {})[_];
            }
            t = t || radix.$ || (radix.$ = {})
            if (!key && Object.keys(t).length) { return t }
            key = '' + key
            let i = 0; const l = key.length - 1; let k = key[i]; let at; let tmp
            while (!(at = t[k]) && i < l) {
                k += key[++i]
            }
            if (!at) {
                if (!each(t, function (r, s) {
                    let ii = 0; let kk = ''
                    if ((s || '').length) {
                        while (s[ii] == key[ii]) {
                            kk += s[ii++]
                        }
                    }
                    if (kk) {
                        if (u === val) {
                            if (ii <= l) { return }
                            (tmp || (tmp = {}))[s.slice(ii)] = r
                            return r
                        }
                        const __ = {}
                        __[s.slice(ii)] = r
                        ii = key.slice(ii);
                        (ii === '') ? (__[''] = val) : ((__[ii] = {})[''] = val)
                        t[kk] = __
                        if (Radix.debug && '' + kk === 'undefined') { console.log(0, kk); debugger }
                        delete t[s]
                        return true
                    }
                })) {
                    if (u === val) { return }
                    (t[k] || (t[k] = {}))[''] = val
                    if (Radix.debug && '' + k === 'undefined') { console.log(1, k); debugger }
                }
                if (u === val) {
                    return tmp
                }
            } else
                if (i == l) {
                    if (u === val) {
                        if (u === (tmp = at[''])) {
                            return at;
                        } else {
                            return ((radix.unit = 1) && tmp);
                        }
                    }
                    at[''] = val
                } else {
                    if (u !== val) { delete at[_] };
                    return radix(key.slice(++i), val, at || (at = {}))
                }
        }
        return radix
    };

    Radix.map = function rap(radix, cb, opt, pre) {
        try {
            pre = pre || [] // TODO: BUG: most out-of-memory crashes come from here.
            const t = (typeof radix === 'function') ? radix.$ || {} : radix
            //! opt && console.log("WHAT IS T?", JSON.stringify(t).length);
            if (!t) { return }
            if (typeof t === 'string') { if (Radix.debug) { throw new Error(['BUG:', radix, cb, opt, pre]) } return }
            let keys = (t[_] || no).sort || (t[_] = (function $() { $.sort = Object.keys(t).sort(); return $ }())).sort; let rev // ONLY 17% of ops are pre-sorted!
            // var keys = Object.keys(t).sort();
            opt = (opt === true) ? { branch: true } : (opt || {})
            if (rev = opt.reverse) { keys = keys.slice(0).reverse() }
            const start = opt.start; const end = opt.end; const END = '\uffff'
            let i = 0; const l = keys.length
            for (; i < l; i++) {
                const key = keys[i]; const tree = t[key]; var tmp; var p; var pt
                if (!tree || key === '' || _ === key || key === 'undefined') { continue }
                p = pre.slice(0); p.push(key)
                pt = p.join('')
                if (u !== start && pt < (start || '').slice(0, pt.length)) { continue }
                if (u !== end && (end || END) < pt) { continue }
                if (rev) { // children must be checked first when going in reverse.
                    tmp = rap(tree, cb, opt, p)
                    if (u !== tmp) { return tmp }
                }
                if (u !== (tmp = tree[''])) {
                    let yes = 1
                    if (u !== start && pt < (start || '')) { yes = 0 }
                    if (u !== end && pt > (end || END)) { yes = 0 }
                    if (yes) {
                        tmp = cb(tmp, pt, key, pre)
                        if (u !== tmp) { return tmp }
                    }
                } else
                    if (opt.branch) {
                        tmp = cb(u, pt, key, pre)
                        if (u !== tmp) { return tmp }
                    }
                pre = p
                if (!rev) {
                    tmp = rap(tree, cb, opt, pre)
                    if (u !== tmp) { return tmp }
                }
                pre.pop()
            }
        } catch (e) { console.error(e) }
    }

    try { module.exports = Radix } catch (e) { };
    var each = Radix.object = function (o, f, r) {
        for (const k in o) {
            if (!o.hasOwnProperty(k)) { continue }
            if ((r = f(o[k], k)) !== u) { return r }
        }
    }; var no = {}; let u
    var _ = String.fromCharCode(24)
}())