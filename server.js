'use strict';

// SERVER

const Hapi = require('hapi');

const server = new Hapi.Server();

require('./canned_ham');

server.connection({ port: 3000, host: 'localhost' });

// ROUTES

// Reptilian Player Registor

server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
	reply('no ham for you');
    }
})

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
