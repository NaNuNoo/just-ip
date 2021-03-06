"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var endian_1 = require("./endian");
var RE_IPV4 = /^\s*(\d{1,3})\s*\.\s*(\d{1,3})\s*\.\s*(\d{1,3})\s*\.\s*(\d{1,3})\s*$/;
function castIpV4(ip) {
    if (typeof ip === 'string') {
        return IpV4.fromString(ip);
    }
    else if (typeof ip === 'number') {
        return IpV4.fromInt(ip);
    }
    else if (ip instanceof IpV4) {
        return ip;
    }
    else if (Array.isArray(ip)) {
        return IpV4.fromArray(ip);
    }
    else {
        throw new util_1.IPV4Error();
    }
}
exports.castIpV4 = castIpV4;
var IpV4 = (function () {
    function IpV4() {
        this._b1 = 0;
        this._b2 = 0;
        this._b3 = 0;
        this._b4 = 0;
        this._int = 0;
    }
    IpV4.fromString = function (str) {
        var ip = IpV4.tryString(str);
        if (!ip) {
            throw new util_1.IPV4Error();
        }
        return ip;
    };
    IpV4.tryString = function (str) {
        var match = RE_IPV4.exec(str);
        if (!match) {
            return null;
        }
        var ip = new IpV4();
        ip._b1 = parseInt(match[1]);
        ip._b2 = parseInt(match[2]);
        ip._b3 = parseInt(match[3]);
        ip._b4 = parseInt(match[4]);
        if (ip._b1 > 255 || ip._b2 > 255 || ip._b3 > 255 || ip._b4 > 255) {
            return null;
        }
        ip._int = endian_1.bs2he(ip._b1, ip._b2, ip._b3, ip._b4);
        return ip;
    };
    IpV4.fromInt = function (int) {
        var ip = IpV4.tryInt(int);
        if (!ip) {
            throw new util_1.IPV4Error();
        }
        return ip;
    };
    IpV4.tryInt = function (int) {
        if (int < -0x80000000 || 0xFFFFFFFF < int) {
            return null;
        }
        int = int >>> 0;
        var ip = new IpV4();
        var bytes = endian_1.he2bs(int);
        ip._b1 = bytes[0];
        ip._b2 = bytes[1];
        ip._b3 = bytes[2];
        ip._b4 = bytes[3];
        ip._int = int;
        return ip;
    };
    IpV4.fromIntBe = function (int) {
        var ip = IpV4.tryIntBe(int);
        if (!ip) {
            throw new util_1.IPV4Error();
        }
        return ip;
    };
    IpV4.tryIntBe = function (int) {
        if (int < -0x80000000 || 0xFFFFFFFF < int) {
            return null;
        }
        int = int >>> 0;
        var ip = new IpV4();
        var bytes = endian_1.be2bs(int);
        ip._b1 = bytes[0];
        ip._b2 = bytes[1];
        ip._b3 = bytes[2];
        ip._b4 = bytes[3];
        ip._int = endian_1.be2he(int);
        return ip;
    };
    IpV4.fromIntLe = function (int) {
        var ip = IpV4.tryIntLe(int);
        if (!ip) {
            throw new util_1.IPV4Error();
        }
        return ip;
    };
    IpV4.tryIntLe = function (int) {
        if (int < -0x80000000 || 0xFFFFFFFF < int) {
            return null;
        }
        int = int >>> 0;
        var ip = new IpV4();
        var bytes = endian_1.le2bs(int);
        ip._b1 = bytes[0];
        ip._b2 = bytes[1];
        ip._b3 = bytes[2];
        ip._b4 = bytes[3];
        ip._int = endian_1.le2he(int);
        return ip;
    };
    IpV4.fromBytes = function (b1, b2, b3, b4) {
        var ip = IpV4.tryBytes(b1, b2, b3, b4);
        if (!ip) {
            throw new util_1.IPV4Error();
        }
        return ip;
    };
    IpV4.tryBytes = function (b1, b2, b3, b4) {
        if ((b1 < 0 || 255 < b1) ||
            (b2 < 0 || 255 < b2) ||
            (b3 < 0 || 255 < b3) ||
            (b4 < 0 || 255 < b4)) {
            return null;
        }
        var ip = new IpV4();
        ip._b1 = b1;
        ip._b2 = b2;
        ip._b3 = b3;
        ip._b4 = b4;
        ip._int = endian_1.bs2he(b1, b2, b3, b4);
        return ip;
    };
    IpV4.fromArray = function (array) {
        return IpV4.fromBytes(array[0], array[1], array[2], array[3]);
    };
    IpV4.tryArray = function (array) {
        return IpV4.tryBytes(array[0], array[1], array[2], array[3]);
    };
    IpV4.prototype.toString = function () {
        return this._b1 + "." + this._b2 + "." + this._b3 + "." + this._b4;
    };
    IpV4.prototype.toInt = function () {
        return this._int;
    };
    IpV4.prototype.toIntBe = function () {
        return endian_1.he2be(this._int);
    };
    IpV4.prototype.toIntLe = function () {
        return endian_1.le2he(this._int);
    };
    IpV4.prototype.toArray = function () {
        return [this._b1, this._b2, this._b3, this._b4];
    };
    IpV4.prototype.equal = function (ip) {
        return this._int === ip._int;
    };
    IpV4.equal = function (ip1, ip2) {
        return castIpV4(ip1).equal(castIpV4(ip2));
    };
    IpV4.prototype.isUnspecified = function () {
        return this._int === 0;
    };
    IpV4.isUnspecified = function (ip) {
        return castIpV4(ip).isUnspecified();
    };
    IpV4.prototype.isLoopback = function () {
        return (this._int >>> 8) === 0x7F0000;
    };
    IpV4.isLoopback = function (ip) {
        return castIpV4(ip).isLoopback();
    };
    IpV4.prototype.isPrivate = function () {
        return (this._int >>> 24) === 0x0A ||
            (this._int >>> 20) === 0xAC1 ||
            (this._int >>> 16) === 0xC0A8;
    };
    IpV4.isPrivate = function (ip) {
        return castIpV4(ip).isPrivate();
    };
    IpV4.prototype.isLinkLocal = function () {
        return (this._int >>> 16) === 0xA9FE;
    };
    IpV4.isLinkLocal = function (ip) {
        return castIpV4(ip).isLinkLocal();
    };
    IpV4.prototype.isMulticast = function () {
        return (this._int >>> 28) === 0xE;
    };
    IpV4.isMulticast = function (ip) {
        return castIpV4(ip).isMulticast();
    };
    IpV4.prototype.isBroadcast = function () {
        return this._int === 0xFFFFFFFF;
    };
    IpV4.isBroadcast = function (ip) {
        return castIpV4(ip).isBroadcast();
    };
    IpV4.prototype.isDocumentation = function () {
        return (this._int >>> 8) === 0xC00002 ||
            (this._int >>> 8) === 0xC63364 ||
            (this._int >>> 8) === 0xCB0071;
    };
    IpV4.isDocumentation = function (ip) {
        return castIpV4(ip).isDocumentation();
    };
    IpV4.prototype.isGlobal = function () {
        return !this.isPrivate() &&
            !this.isLoopback() &&
            !this.isLinkLocal() &&
            !this.isBroadcast() &&
            !this.isDocumentation() &&
            !this.isUnspecified();
    };
    IpV4.isGlobal = function (ip) {
        return castIpV4(ip).isGlobal();
    };
    return IpV4;
}());
exports.IpV4 = IpV4;
//# sourceMappingURL=ipv4.js.map