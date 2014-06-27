var Thug    = require('thug');
var redis   = require('redis');
var client  = redis.createClient();
var uuid    = require('uuid');

var validate = require('./validations');
var helpers = require('./helpers');

var namespace = 'comments';

module.exports = new Thug({
  // Write
  write: function (id, comment, cb) {
    var contextUrl, list_key, comment_key;
    
    if (!id) comment.id = uuid.v4();
    contextUrl = helpers.getUrlKey(comment.url);
    list_key = [namespace, contextUrl].join(":");
    comment_key = ["comment", comment.id].join(":");
    
    client
      .multi()
      .hmset(comment_key, comment)
      .sadd(list_key, comment.id)
      .exec(function (err, replies) {
        cb(comment);
      });
  },
  // Read
  read: function (id, cb) {
    var comment_key = ["comment", id].join(":");
    client.hgetall(comment_key, function (err, obj) {
      cb(obj);
    });
  },
  // Remove
  remove: function (id, cb) {
    var key = "comment:" + id;
    this.get(id, function (comment) {
      var list_key = [namespace, helpers.getUrlKey(comment.url)].join(":");
      client
        .multi()
        .del(key)
        .srem(list_key, id)
        .exec(function (err, rep) {
          if (!err && rep[0] && rep[1]) cb(null);
          else cb("Something went wrong");
        });
    })
  },
  filters: {
    in: [],
    beforeValidate: [],
    beforeWrite: [],
    out: []
  },
  validations: {
    url: [validate.exists, validate.isURL],
    authorAvatarUrl: [validate.exists, validate.isURL],
    authorName: [validate.notEmpty],
    comment: [validate.notEmpty]
  },
  methods: {
    addComment: function (data, cb) {
      this.set(data, function (err, obj) {
        cb(err, obj);
      });
    },
    removeComment: function (id, cb) {
      this.remove(id, cb);
    },
    getByUrl: function (url, cb) {
      var key = [namespace, helpers.getUrlKey(url)].join(":");
      var results = [], count = 0;
      client.smembers(key, function (err, comments) {
        var total = 0;
        if (!err && comments.length > 0) {
          total = comments.length;
          for (var i in comments) {
            var comment_id = comments[i];
            client.hgetall("comment:" + comment_id, function (err, obj) {
              if (!err) {
                results.push(obj);
              }
              if (++count >= total) {
                cb(results);
              }
            });
          }
        } else {
          cb(results);
        }
      });
    }
  }
});