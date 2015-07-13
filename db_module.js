var events = require('events');
var _ = require('underscore');
var monk = require('monk');
var __module_cache = {};
var utils = require('./utils');
var dbpath = utils.getConfig('testMongodbPath');
console.log(dbpath);

function checkDbAvailable(module) {
    if(module.db)
        return true;
    else
        return false;
}

var Module = function(settings) {

    _.extend(this,{
        schemaName: null,
        idName: null
    });

    _.extend(this, settings);

    if(!this.db)
        this.db = monk(dbpath);

    var dbTemplate = function(templateCb) {

        var module = this;
        return function() {
            var args = Array.prototype.slice.call(arguments);
            var query, doc, options, cb;
            switch(args.length) {
                case 1:
                    cb = args[0];
                    break;
                case 2:
                    cb = args[1];
                    query = args[0];
                    break;
                case 3:
                    query = args[0];
                    options = args[1];
                    cb = args[2];
                    break;
                case 4:
                    query = args[0];
                    doc = args[1];
                    options = args[2];
                    cb = args[3];
                    break;
                default:
                    throw new Error('this function require at least a callback arguments!');
            }
            if(!checkDbAvailable(module)) {
                return cb(new Error('db is already closed or not initiated'));
            }
            if(!options)
                options = {};
            return templateCb.bind(module)(query, doc, options, cb);
        };
    }.bind(this);

    this.loadById = dbTemplate(function(query, doc, options, cb){
        var col = this.getCol();
        var id = query;
        query = {};
        query[this.idName] = id;
        col.findOne(query, options, cb);
    });
    this.drop = dbTemplate(function(query, doc, options, cb){
        this.getCol().drop(cb);
    });
    this.insert = dbTemplate(function(query, doc, options, cb){
        this.getCol().insert(query, cb);
    });
    this.query = dbTemplate(function(query, doc, options, cb){
        var col = this.getCol();    
        col.find(query, options, cb);
    });
    this.updateOne = dbTemplate(function(query, doc, options, cb){
        if(!doc) {
            doc = options;
            options = {};
        }
        var col = this.getCol();
        var dboptions = {
            new : true
        };
        _.extend(dboptions, options);
        col.findAndModify(query, doc, dboptions, cb);
    });
    this.update = dbTemplate(function(query, doc, options, cb){
        if(!doc) {
            doc = options;
            options = {};
        }
        var col = this.getCol();
        var dboptions = {
            multi: true
        };
        _.extend(dboptions, options);
        col.update(query, doc, dboptions, function(err, updateNum){
            cb(err, updateNum);
        });
    });
    this.delete = dbTemplate(function(query, doc, options, cb){
        var col = this.getCol();
        col.remove(query, cb);
    });
    this.aggregate = dbTemplate(function(aggregate, doc, options, cb){
        var col = this.getCol().col;
        col.aggregate(aggregate, options, cb);
    });

};


Module.prototype = {
    requireModule : function(moduleName, path) {
        var moduleObject = __module_cache[moduleName];
        var modulePath = "";
        if(!moduleObject) {
            modulePath = path ? path : "./";
            var requirePath = path + moduleName;
            var module = require(requirePath);
            if(!module)
                throw new Error('cant find moudle in ' + requirePath);
            __module_cache[requirePath] = module;
            moduleObject = module;
        }
        return new moduleObject({db: this.db});
    },
    getCol: function() {
        return this.db.get(this.schemaName);
    },
    closeDb: function() {
        if(this.db) {
            this.db.close();
            delete this.db;
        }
    }
};
var mixEmiterProto = new events.EventEmitter();
_.extend(Module.prototype, mixEmiterProto);

module.exports = Module; 
