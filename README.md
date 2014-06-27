# Redis storage for SideComments.js

A simple Node.js library to help you store in Redis comments with a format compatible with [SideComments.js](http://aroc.github.io/side-comments-demo/).

It doesn't make decisions about the users, so that part is up to the person implementing it.

## Getting started

Run this comment to __install__ the library in your project:

    npm install side-comments-redis

Start a redis server (local, for now) and here’s how you can use it in your project:

    // Create a new instantiace
    var Comments = require('side-comments-redis');
    
    // Add a comment
    Comments.addComment({ ... }, cb);
    
    // Get a list of comments by passing a URL
    Comments.getByUrl(url, cb);
    
    // Remove a comment by its id
    Comments.delComment(id, cb);

## Docs

### Create a new instance

    var Comments = require('side-comments-redis');

This library uses [Thug](https://github.com/sintaxi/thug) to 

### Adding a Comment

    Comments.addComment({
      url:              "http://jorgepedret.com/posts/harp-project-hub",
      section:          5,
      comment:          "This is awesome!",
      authorId:         1,
      authorName:       "Jorge",
      authorAvatarUrl:  "http://avatar.jpg"
    }, function (err, comment) { ... });

Parameters:

`url`: The URL where the comment was made

`section`: Indicates the index of the paragraph where the comment was made. This is calculated by SideComment.js and passed on the `commentPosted` event.

`comment`: The content of the comment made.

`authorId`: The id of the author in your system.

`authorName`: The name of the author.

`authorAvatarUrl`: The URL where the author’s avatar live.

### Getting Comments

Currently there’s only one way to get comments and it’s by its associated URL. There’s no method to get comment by its `id`. I don’t see the need for such method, but it could be implemented in the future.

    var url = "http://jorgepedret.com/posts/harp-project-hub";
    Comments.getByUrl(url, function (comments) { ... });

### Deleting Comments

    Comments.delComment(id, function (error) { ... });


## TODO

- Pass a config object when instantiating to be able to configure Redis.
- Consider adding a setCurrentUser method.
- Add more test for edge cases.
- Make `Comments::getByUrl()`’s callback error first.

## Run test

    npm test

## License

MIT