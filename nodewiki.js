var fs = require('fs');
var path = require('path');
var async = require('async');

function NodeWiki(opts){

  opts = opts || {};

  this.config = opts.config || {};

  if (opts.rootDir){
    try {
      fs.statSync(opts.rootDir);
    } catch (err){
      if (err.code == 'ENOENT'){
        throw new TypeError('root directory does not exist');
      }
    }
  }
  this.rootDir = opts.rootDir || process.cwd();

  this.allowedExtensions = [
    '.md',
    '.mdown',
    '.markdown',
    '.mkd',
    '.mkdn',
    '.txt'
  ];

  this.marked = require('marked');

  this.app = require('./lib/create-express-app.js')();

  var Routes = require('./lib/routes');
  var routes = new Routes(this);
  this.app.use('/', routes);

}

NodeWiki.prototype.listFiles = function(dir, cb){

  var self = this;

  // check if requested directory is within root directory of nodewiki
  if (path.join(self.rootDir, dir).indexOf(self.rootDir) !== 0){
    return cb('error');
  }

  var filteredFiles = [];

  var filter = function(file, callback){
    var filePath = path.join(self.rootDir, file);

    fs.stat(filePath, function(err, stats){
      if (err) throw err;

      if (stats.isDirectory()){
        filteredFiles.push({name: file, type: 'dir'});
      } else if (self.allowedExtensions.indexOf(path.extname(file)) > -1 && stats.isFile()){
        filteredFiles.push({name: file, type: 'file'});
      }

      callback(null);
    });
  };

  fs.readdir(self.rootDir, function(err, files){
    async.each(files, filter, function(err){
      if (err){
        return cb('error with listing files');
      }

      cb(null, filteredFiles);
    });
  });

}

NodeWiki.prototype.load = function(itemName, cb){
  var self = this;

  async.waterfall([
    function(callback){
      self.listFiles(function(files){
        callback(null, files);
      });
    },

    function(files, callback){
      var filter = function(file, cb){
        if (file.name == itemName){
          return cb(true);
        }
        return cb(false);
      };

      async.detect(files, filter, function(result){
        callback(null, result);
      });
    },

    function(result, callback){
      if (result && result.type == 'file'){
        fs.readFile(path.join(self.rootDir, result.name), {encoding: 'utf8'}, function(err, file){
          if (err) throw err;

          return callback(null, {file: true, content: file})
        });
      } else {
        return callback(null, {file: false});
      }
    }],

    function(err, result){
      if (err) console.log('error', err);

      if (result.file){
        result.content = self.marked(result.content);
      } 

      cb(result);
    }
  );
}

module.exports = NodeWiki;
