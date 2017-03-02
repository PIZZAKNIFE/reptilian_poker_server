'use strict';

// SERVER

const Hapi = require('hapi');

const server = new Hapi.Server();


let Hamler = require('./canned_ham').getInstance();


console.log(Hamler);

server.connection({ port: 3000, host: 'localhost' });

// ROUTES

// Reptilian Player Registor

server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
	reply(Hamler.fetchCannedHam('annalsOfTheOverlords/canned_ham.txt', { splitWith: '\n' } ));
    }
})

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
