var baseHtml = `
<html>
<head>
  <meta charset="utf-8">
  <title>%title%</title>
  <link rel="stylesheet" href="styles/app.css">
</head>
<body>
  <div class="page-container">
    <h2>Calendar Sync Demo</h2> <!-- Static title here -->
    %body%
  </div>
</body>
</html>
`;

module.exports = {
  loginPage: function (signinUrl) {
    var html = `<a class="button" href="${signinUrl}">Sign in with Microsoft</a>`;
    return baseHtml.replace('%title%', 'Login').replace('%body%', html);
  },

  homePage: function (userEmail, events) {
    var html = `
      <p>Signed in as: <strong>${userEmail}</strong></p>
      <div class="action-buttons">
        <a class="button" href="/addevent">Add New Event</a>
        <a class="button" href="/logout">Sign Out</a>
      </div>
      <h2>Your Calendar Events</h2>
      <ul class="event-list">
        ${events.length > 0 ? events.map(event => `
          <li>
            <strong>${event.subject}</strong>
            <span>${new Date(event.start.dateTime).toLocaleString()}</span>
          </li>
        `).join('') : '<li>No events found.</li>'}
      </ul>
    `;
    return baseHtml.replace('%title%', 'Your Events').replace('%body%', html);
  },

  addEventPage: function () {
    return `
      <h2>Add New Event</h2>
      <form action="/addevent" method="post" class="form-container">
        <label for="subject" class="form-label">Subject: 
          <input type="text" name="subject" id="subject" class="form-input" required />
        </label>
        <label for="startTime" class="form-label">Start Time: 
          <input type="datetime-local" name="startTime" id="startTime" class="form-input" required />
        </label>
        <label for="endTime" class="form-label">End Time: 
          <input type="datetime-local" name="endTime" id="endTime" class="form-input" required />
        </label>
        <input type="submit" value="Create Event" />
      </form>
    `;
  },

  eventCreatedPage: function (event) {
    var html = `
      <p>Event "<strong>${event.subject}</strong>" created successfully!</p>
      <p>Scheduled for: ${new Date(event.start.dateTime).toLocaleString()}</p>
      <div class="action-buttons">
        <a class="button" href="/home">Back to Events</a>
      </div>
    `;
    return baseHtml.replace('%title%', 'Event Created').replace('%body%', html);
  },

  errorPage: function (message, error) {
    var html = `<p><strong>${message}</strong></p><p>${error.message}</p>`;
    return baseHtml.replace('%title%', 'Error').replace('%body%', html);
  },
};
