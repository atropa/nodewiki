/*jslint
    node: true,
    nomen: true,
    white: true
*/
/*globals
    describe,
    it,
    expect
*/
var Nodewiki = require('../nodewiki');
var fixtures = require('path').join(__dirname, 'fixtures');
var app = {};

describe('app instantiation', function () {
    "use strict";
    it('should give an error setting rootDir to a directory that doesn\'t exist', function () {
        expect(function () {
            app = new Nodewiki({
                    rootDir : __dirname + '/doesntexist'
                });
        }).toThrow();
    });
});

describe('directory listings', function () {
    "use strict";
    app = new Nodewiki({
            rootDir : fixtures
        });
    it('should list files', function (done) {
        /*jslint unparam: true */
        app.listFiles('/', function (err, files) {
            expect(files.length).toEqual(1);
            expect(files[0].name).toEqual('test.md');
            expect(files[0].type).toEqual('file');
            done();
        });
        /*jslint unparam: false */
    });

    it('should give an error when requesting a listing outside of rootDir', function (done) {
        app.listFiles('../../', function (files) {
            expect(typeof files).toEqual('string');
            done();
        });

    });
});
