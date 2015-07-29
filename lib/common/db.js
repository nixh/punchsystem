var monk = require('monk');
var Q = require('q');
var _ = require('underscore');
var events = require('events');
var util = require('util');
var config = require('./config')();

function Db(url) {
    this.url = url;
    events.EventEmitter.call(this);
}

util.inherits(Db, events.EventEmitter);

var dbPrototype = {

    getUrl: function() {
        return this.url;
    },

    setUrl: function(url) {
        this.url = url;
    },

    use: function() {
        var args = Array.prototype.slice.call(arguments, 0);
        if(args.length < 1) {
            throw new Error('Db.use needs at least one arguments');
        }
        if(args.length === 1 && _.isArray(args[0])) {
            args = _.flatten(args[0]);
        } else {
            args = _.flatten(args);
        }
        var ctx = { db: monk(this.url) };
        var self = this;
        var result = args.reduce(function(v, f){
            if(typeof f !== 'function')
                throw new Error('Db.use can only use function');
            self.emit('before:eachUse', ctx.db);
            return v.then(f.bind(ctx)).then(function(result){
                self.emit('after:eachUse', ctx.db);
                return Q(result);
            });
        }, Q());
        return result.catch(function(err){ 
            self.emit('error', err);
        }).fin(function(){ ctx.db.close(); delete ctx.db; });
    },

    parallel: function() {
        var args = Array.prototype.slice.call(arguments, 0);
        if(args.length < 1) {
            throw new Error('Db.use needs at least one arguments');
        }
        if(args.length === 1 && _.isArray(args[0])) {
            args = args[0];
        } else {
            args = _.flatten(args);
        }
        var self = this;
        var ctx = { db: monk(this.url) };
        args = args.map(function(f){ 
            self.emit('before:eachParallel', ctx.db);
            return Q.fcall(f.bind(ctx)).then(function(result){
                self.emit('after:eachParallel', ctx.db);
                return Q(result);
            });
        });
        return Q.all(args).catch(function(err){
            self.emit('error', err);
        }).fin(function(){ ctx.db.close(); delete ctx.db; });
    },

    drop: function(colName) {
        var self = this;
        return function () {
            if(!colName)
                throw new Error('must specific an valid colName');
            var deferred = Q.defer();
            var col = this.db.get(colName);
            self.emit('before:drop', col);
            col.drop(deferred.makeNodeResolver());
            return deferred.promise.then(function(result){
                self.emit('after:drop', result, col);
                return Q(result);
            });
        };

    },

    dropIfExists: function(colName) {
        var self = this;  
        return function () {
            if(!colName)
                throw new Error('must specific an valid colName');
            var deferred = Q.defer();
            this.db.driver.collectionNames(deferred.makeNodeResolver());
            var promise = deferred.promise;
            var col = this.db.get(colName);
            return promise.then(function(names){
                names = _.pluck(names, 'name');
                return _.contains(names, colName);
            }).then(function(contains){
                if(contains) {
                    var dropDeffered = Q.defer();
                    self.emit('before:dropIfExists', col);
                    col.drop(dropDeffered.makeNodeResolver());
                    return dropDeffered.promise.then(function(result){
                        self.emit('after:dropIfExists', result, col);
                        return Q(result);
                    });
                } else {
                    return Q(false);
                }
            });
        };
    },

    load: function(colName, id, idName, options) {
        var self = this;
        return function () {
            if(!colName)
                throw new Error('must specific an valid colName');
            if(!id)
                throw new Error('id cant be empty');
            if(!options)
                options = {};
            idName = idName ? idName : "_id";
            var query = {};
            query[idName] = id;
            var deferred = Q.defer();
            var col = this.db.get(colName);
            self.emit('before:load', col, id, idName, options);
            col.findOne(query, options, deferred.makeNodeResolver());
            return deferred.promise.then(function(result){
                self.emit('after:load', result, col, id, idName, options);
                return Q(result);
            });
        };
    },

    query: function(colName, query, options) {
        var self = this;
        return function (){
            if(!colName)
                throw new Error('must specific an valid colName');
            if(!query)
                throw new Error('query cant be empty');
            if(!options)
                options = {};
            var deferred = Q.defer();
            var col = this.db.get(colName);
            self.emit('before:query', col, query, options);
            col.find(query, options, deferred.makeNodeResolver());
            return deferred.promise.then(function(result){
                self.emit('after:query', result, col, query, options);
                return Q(result);
            });
        };
    },

    deleteOne: function(colName, query, options) {
        var self = this;
        return function (){
            if(!colName)
                throw new Error('must specific an valid colName');
            if(!query)
                throw new Error('query cant be empty');
            if(!options)
                options = {justOne: true};
            var deferred = Q.defer();
            var col = this.db.get(colName);
            self.emit('before:deleteOne', col, query, options);
            col.remove(query, options, deferred.makeNodeResolver());
            return deferred.promise.then(function(result){
                self.emit('after:deleteOne', result, col, query, options);
                return Q(result);
            });
        };
    },

    deleteMany: function(colName, query, options) {
        var self = this;
        return function (){
            if(!colName)
                throw new Error('must specific an valid colName');
            if(!query)
                throw new Error('query cant be empty');
            if(!options)
                options = {};
            var deferred = Q.defer();
            var col = this.db.get(colName);
            self.emit('before:deleteMany', col, query, options);
            col.remove(query, options, deferred.makeNodeResolver());
            return deferred.promise.then(function(result){
                self.emit('after:deleteMany', result, col, query, options);
                return Q(result);
            });
        };
    },

    insert: function(colName, docs) {
        var self = this;
        return function (){
            if(!colName)
                throw new Error('must specific an valid colName');
            if(!docs)
                throw new Error('cant insert empty docs');
            var deferred = Q.defer();
            var col = this.db.get(colName);
            self.emit('before:insert', col, docs);
            col.insert(docs, deferred.makeNodeResolver());
            return deferred.promise.then(function(result){
                self.emit('after:insert', result, col, docs);
                return Q(result);
            });
        };
    },

    updateOne: function(colName, query, doc, options) {
        var self = this;
        return function (){
            if(!colName)
                throw new Error('must specific an valid colName');
            if(!query)
                throw new Error('query cant be empty');
            if(!doc)
                throw new Error('cant update empty doc');
            if(!options)
                options = { new: true };
            var deferred = Q.defer();
            var col = this.db.get(colName);
            self.emit('before:updateOne', col, query, doc, options);
            col.findAndModify(query, doc, options, deferred.makeNodeResolver());
            return deferred.promise.then(function(result){
                self.emit('after:updateOne', result, col, query, doc, options);
                return Q(result);
            });
        };
    },

    updateMany: function(colName, query, doc, options) {
        var self = this;
        return function (){
            if(!colName)
                throw new Error('must specific an valid colName');
            if(!query)
                throw new Error('query cant be empty');
            if(!doc)
                throw new Error('cant update empty doc');
            if(!options)
                options = { multi: true };
            var deferred = Q.defer();
            var col = this.db.get(colName);
            self.emit('before:updateMany', col, query, doc, options);
            col.update(query, doc, options, deferred.makeNodeResolver());
            return deferred.promise.then(function(result){
                self.emit('after:updateMany', result, col, query, doc, options);
                return Q(result);
            });
        };
    },

    aggregate: function(colName, aggregate, options) {
        var self = this;
        return function() {
            if(!colName)
                throw new Error('must specific an valid colName');
            if(!aggregate || !aggregate.length)
                throw new Error('aggregate cant be empty');
            if(!options)
                options = {};
            var deferred = Q.defer();
            var col = this.db.get(colName);
            self.emit('before:aggregate', col, aggregate, options);
            col.col.aggregate(aggregate, options, deferred.makeNodeResolver());
            return deferred.promise.then(function(result){
                self.emit('after:aggregate', result, col, aggregate, options);
                return Q(result);
            });
        };
    }
};

_.extend(Db.prototype, dbPrototype);
var dbm = new Db(config.get('mongodbPath'));

module.exports = dbm;

//var db = new Db("localhost/punchsystem");
//db.use(db.query('users', {owner:true}), function(users){
//    return db.load('companies', users[0].compid, 'compid').call(this);
//}, function(comp){
//    console.log(comp);
//}).done();
//
//db.parallel(
//    db.query('users', {owner:true}), 
//    db.query('companies', { compid: {$in : [2,3,4,5]} })
//).spread(function(users, comps){
//    console.log(users.length);
//    console.log(comps.length);
//});
