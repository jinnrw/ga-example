var timeoutId;

function queryReports(accessToken, viewId) {

  // Fetch Realtime api
  var apiURL = 'https://www.googleapis.com/analytics/v3/data/realtime?ids=',
    apiOptions = '&metrics=rt:activeUsers';
  var viewId = 'ga:' + viewId;

  // Polling function needs to be clear first when making a new polling
  // i.e. when making the 2nd client api call, first clear the 1st api call
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  (function poll() {
    timeoutId = setTimeout(function () {
      fetch(apiURL + viewId + apiOptions + "&access_token=" + accessToken)
        .then(response => response.json())
        .then(result => {
          if (result.error)
            console.log(result.error.message);
          else //if (result.totalsForAllResults['rt:activeUsers'] > 0)
            displayActiveUsers(result);
        })
        .then(poll())
        .catch(error => console.log('error:', error));
    }, 5000);
  })();



  // Request for ga:sessions
  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    body: {
      reportRequests: [{
        viewId: viewId,
        dateRanges: [{
          startDate: '7daysAgo',
          endDate: 'today'
        }],
        metrics: [{
          expression: 'ga:sessions'
        }],
        dimensions: [{
          'name': 'ga:date'
        }]
      }]
    }
  }).then(displayDate, console.error.bind(console));

  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    body: {
      reportRequests: [{
        viewId: viewId,
        dateRanges: [{
          startDate: '7daysAgo',
          endDate: 'today'
        }],
        metrics: [{
          expression: 'ga:sessions'
        }],
        dimensions: [{
          'name': 'ga:browser'
        }]
      }]
    }
  }).then(displayBrowser, console.error.bind(console));

  // ::::: Request: Page View :::::
  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    body: {
      reportRequests: [{
        viewId: viewId,
        dateRanges: [{
          startDate: '7daysAgo',
          endDate: 'today'
        }],
        dimensions: [{
          name: 'ga:pagePath'
        }],
        metrics: [{
          expression: 'ga:pageviews'
        }]
      }]
    }
  }).then(displayPageviews, console.error.bind(console));
}

function displayActiveUsers(res) {
  document.getElementById('active-users-content').innerHTML = res.totalsForAllResults["rt:activeUsers"];
}

function displayDate(res) {
  var formattedJson = JSON.stringify(res.result, null, 2);
  document.getElementById('date-content').innerHTML = formattedJson;
}

function displayBrowser(res) {
  var formattedJson = JSON.stringify(res.result, null, 2);
  document.getElementById('browser-content').innerHTML = formattedJson;
}

function displayPageviews(res) {
  var formattedJson = JSON.stringify(res.result, null, 2);
  document.getElementById('page-views-content').innerHTML = formattedJson;
}