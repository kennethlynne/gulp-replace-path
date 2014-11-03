var es = require('event-stream');
var rs = require('replacestream');
var stream = require('stream');
var istextorbinary = require('istextorbinary');

module.exports = function replace(search, replacement, options) {

  var doReplace = function (file, callback) {

    var origReplacement = replacement;

    if (typeof replacement === 'function') {

      // If second parameter is __absolutePath__, inject the files absolute path as second parameter
      // TODO: Get index of __absolutePath__ and inject it dynamically
      if (/function[\s]*\([\w]+\,[\s]*__absolutePath__[\s]*\)*/.test(replacement.toString())) {
        replacement = function (file) {
          return origReplacement.apply(null, [arguments[0], file.path]);
        }
      }
      else {
        replacement = function () {
          return origReplacement.apply(null, arguments);
        }
      }
    }
    else {
      replacement = function () {
        return origReplacement;
      }
    }

    var isRegExp = search instanceof RegExp;
    var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
    var isBuffer = file.contents instanceof Buffer;

    if (isRegExp && isStream) {
      return callback(new Error('gulp-replace-path: Cannot do regexp replace on a stream'), file);
    }

    function doReplace() {

      if (isStream) {
        file.contents = file.contents.pipe(rs(search, replacement(file)));
        return callback(null, file);
      }

      if (isBuffer) {
        if (isRegExp) {
          file.contents = new Buffer(String(file.contents).replace(search, replacement(file)));
        }
        else {
          var chunks = String(file.contents).split(search);

          var result;
          if (typeof replacement(file) === 'function') {
            // Start with the first chunk already in the result
            // Replacements will be added thereafter
            // This is done to avoid checking the value of i in the loop
            result = [chunks[0]];

            // The replacement function should be called once for each match
            for (var i = 1; i < chunks.length; i++) {
              // Add the replacement value
              result.push(replacement(file)(search));

              // Add the next chunk
              result.push(chunks[i]);
            }

            result = result.join('');
          }
          else {
            result = chunks.join(replacement(file));
          }

          file.contents = new Buffer(result);
        }
        return callback(null, file);
      }

      callback(null, file);

    }

    if (options && options.skipBinary) {
      istextorbinary.isText('', file.contents, function (err, result) {
        if (err) {
          return callback(err, file);
        }

        if (!result) {
          return callback(null, file);
        } else {
          doReplace();
        }
      });
    }
    else {
      doReplace();
    }

  };

  return es.map(doReplace);
};
