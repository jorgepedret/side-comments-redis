var Url     = require('url');

module.exports = {
  getUrlKey: function (url) {
    var u = Url.parse(url, true);
    return [u.host, u.path, u.hash].join("");
  }
}