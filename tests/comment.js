var should  = require("should");
var Comments = require("../lib/comments");

var comment_id = null;

describe('Comments', function () {
  
  describe('Add', function () {
    
    it("should not add comment with invalid user", function (done) {
      Comments.addComment({
        url: "http://jorgepedret.com/posts/harp-project-hub",
        section: 5,
        comment: "This is awesome!",
        user_ip: "127.0.0.1",
        user_agent: "Mozilla",
        referrer: "http://jorgepedret.com"
      }, function (err, comment) {
        err.should.be.instanceOf(Object);
        err.messages[0].should.eql("authorAvatarUrl must be present");
        err.messages[1].should.eql("authorName cannot be empty");
        done();
      });
    });

    it("should not add comment with invalid url", function (done) {
      Comments.addComment({
        url: "123",
        section: 5,
        comment: "This is awesome!",
        authorId: 1,
        authorName: "Jorge",
        authorAvatarUrl: "http://avatar.jpg",
        user_ip: "127.0.0.1",
        user_agent: "Mozilla",
        referrer: "http://jorgepedret.com"
      }, function (err, comment) {
        err.should.be.instanceOf(Object);
        err.should.have.property("messages");
        err.messages[0].should.eql("url must be a valid URL");
        done();
      });
    });
    
    it("should add comment", function (done) {
      Comments.addComment({
        url: "http://jorgepedret.com/posts/harp-project-hub",
        section: 5,
        comment: "This is awesome!",
        authorId: 1,
        authorName: "Jorge",
        authorAvatarUrl: "http://avatar.jpg",
        user_ip: "127.0.0.1",
        user_agent: "Mozilla",
        referrer: "http://jorgepedret.com"
      }, function (err, comment) {
        comment.should.not.be.empty;
        comment.should.have.property("authorName", "Jorge");
        comment_id = comment.id;
        done();
      });
    });
  });

  describe("Reading", function () {

    it("should get comments by url", function (done) {
      var postUrl = "http://jorgepedret.com/posts/harp-project-hub";
      Comments.getByUrl(postUrl, function (comments) {
        comments.should.be.instanceOf(Array);
        comments.length.should.be.greaterThan(0);
        done();
      });
    });
  });
  
  describe("Deleting", function () {
    
    it("should remove comment by id", function (done) {
      Comments.remove(comment_id, function (errors) {
        should.not.exist(errors);
        done();
      })
    })
  });
});