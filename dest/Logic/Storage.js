(function(){
  var RSVP, Promise, all, db, save, load;
  RSVP = require('rsvp'), Promise = RSVP.Promise, all = RSVP.all;
  RSVP.on('error', function(it){
    return console.log(it.stack);
  });
  db = new Promise(function(resolve, reject){
    var x$;
    x$ = indexedDB.open('BookDataBase');
    x$.onerror = function(it){
      return reject(it);
    };
    x$.onsuccess = function(it){
      return resolve(it.target.result);
    };
    x$.onupgradeneeded = function(it){
      var db, objectStore;
      db = it.target.result;
      objectStore = db.createObjectStore('settings', {
        keyPath: 'key'
      });
      return objectStore.createIndex('key', 'key', {
        unique: true
      });
    };
    return x$;
  });
  save = function(key, value){
    return new Promise(function(resolve, reject){
      return db.then(function(it){
        var transaction, store, request, x$;
        transaction = it.transaction(['settings'], 'readwrite');
        transaction.onerror = function(it){
          return reject(it);
        };
        store = transaction.objectStore('settings');
        request = store.put({
          key: key,
          value: value
        });
        x$ = request;
        x$.onerror = function(it){
          return reject(it);
        };
        x$.onsuccess = function(it){
          return resolve(it.target.result);
        };
        return x$;
      });
    });
  };
  load = function(key){
    return new Promise(function(resolve, reject){
      return db.then(function(it){
        var transaction, store, request, x$;
        transaction = it.transaction(['settings'], 'readwrite');
        transaction.onerror = function(it){
          return reject(it);
        };
        store = transaction.objectStore('settings');
        request = store.get(key);
        x$ = request;
        x$.onerror = function(it){
          return reject(it);
        };
        x$.onsuccess = function(it){
          return resolve(it.target.result.value);
        };
        return x$;
      });
    });
  };
  module.exports = {
    save: save,
    load: load
  };
}).call(this);
