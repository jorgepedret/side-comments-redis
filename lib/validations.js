module.exports = {
  isURL: function (field, record, errors, cb) {
    var reg = /^(https?):\/\//;
    if (!reg.test(record[field])) errors.push("must be a valid URL");
    cb();
  },
  exists: function (field, record, errors, cb) {
    if (typeof record[field] == "undefined") errors.push("must be present");
    cb();
  },
  notEmpty: function (field, record, errors, cb) {
    if (typeof record[field] == "undefined" && record[field] !== "") {
      errors.push("cannot be empty");
    }
    cb();
  }
}