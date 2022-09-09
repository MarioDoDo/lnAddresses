const {bech32} = require('bech32');

const isLnurl = (str) => {
    try {
        let p = str.split(/[:=]/)
        string = p.length === 2 ? p[1] : str;
        let d = bech32.decode(str, 1500)
        let b = bech32.fromWords(d.words)
        return Buffer.from(b).toString()
    } catch (e) {
        return false;
    }
};

const decodeLnurl = (lnurl) => {
    let p = lnurl.split(/[:=]/)
    lnurl = p.length === 2 ? p[1] : lnurl
    let d = bech32.decode(lnurl, 1500)
    let b = bech32.fromWords(d.words)
    return Buffer.from(b).toString()
}

module.exports = {isLnurl, decodeLnurl};