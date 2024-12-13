const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

function getAuthenticatedClient(accessToken) {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken); // Pass the access token to the client
    }
  });
}

module.exports = {
  getEvents: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);
    try {
      const events = await client.api('/me/events').get();
      return events.value;
    } catch (err) {
      console.error('Error getting events:', err);
      throw err;
    }
  },

  createEvent: async function(accessToken, eventDetails) {
    const client = getAuthenticatedClient(accessToken);
    try {
      const response = await client.api('/me/events').post(eventDetails);
      return response;
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    }
  }
};
