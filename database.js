'use strict';

// COUCH DB

const Couchdb = require('couch-db').CouchDB;
// no auth
const sofaking = new Couchdb('http://localhost:11311');

let reptileMoon = sofaking.database('reptilian_moon_base');

reptileMoon.extend({
    // TODO : common access patterns
});