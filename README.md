# gulp-replace-path [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]
> A string replace plugin for gulp 3 that supports injecting file path.

## TODO:
* Fix tests
* Fix documentation
* Implement dynamic injection

## Usage

First, install `gulp-replace-path` as a development dependency:

```shell
npm install --save-dev gulp-replace-path
```

Then, add it to your `gulpfile.js`:

```javascript
var replace = require('gulp-replace-path');
var path = require('path');

gulp.task('templates', function(){
  gulp.src(['file.txt'])
    .pipe(replace(/foo(.{3})/g, '$1foo'))
    .pipe(replace('{./}', function (match, __absolutePath__) {
      return path.dirname(path.relative('somePath/', __absolutePath__));
    }))
    .pipe(gulp.dest('build/file.txt'));
});
```

In some target file you may set some variable based on the files current location
```javascript
function pathifyThis() {
  return {
    templateUrl: '{./}/template.html'
  }
}
```

## API

gulp-replace-path can be called with a string or regex.

### replace(string, replacement[, options])

#### string
Type: `String`

The string to search for.

#### replacement
Type: `String` or `Function`

The replacement string or function. If `replacement` is a function, it will be called once for each match and will be passed the string that is to be replaced.

### replace(regex, replacement[, options])

*Note:* gulp-replace-path cannot perform regex replacement on streams.

#### regex
Type: `RegExp`

The regex pattern to search for. See the [MDN documentation for RegExp] for details.

#### replacement
Type: `String` or `Function`

The replacement string or function. See the [MDN documentation for String.replace] for details.

### gulp-replace-path options

An optional third argument, `options`, can be passed.

#### options
Type: `Object`

##### options.skipBinary
Type: `boolean`  
Default: `false`

Skip binary files


[MDN documentation for RegExp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[MDN documentation for String.replace]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter

[travis-url]: http://travis-ci.org/kennethlynne/gulp-replace-path
[travis-image]: https://secure.travis-ci.org/kennethlynne/gulp-replace-path.svg?branch=master
[npm-url]: https://npmjs.org/package/gulp-replace-path
[npm-image]: https://badge.fury.io/js/gulp-replace-path.svg
