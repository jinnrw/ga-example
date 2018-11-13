gapi.analytics.ready(function () {

  // Authorize the user

  var CLIENT_ID = '515465435162-mqrovgo9cvfnb1otbgidl2bmhqgdm0do.apps.googleusercontent.com';

  gapi.analytics.auth.authorize({
    container: 'auth-button',
    clientid: CLIENT_ID,
  });


  /**
   * Create a new ActiveUsers instance to be rendered inside of an
   * element with the id "active-users-container" and poll for changes every
   * five seconds.
   */
  var activeUsers = new gapi.analytics.ext.ActiveUsers({
    container: 'active-users-container',
    pollingInterval: 5,
    ids: "ga:179857751"
  });

  // Step 4: Create the view selector.

  var viewSelector = new gapi.analytics.ViewSelector({
    container: 'view-selector'
  });

  // Step 5: Create the timeline chart.

  var timeline = new gapi.analytics.googleCharts.DataChart({
    reportType: 'ga',
    query: {
      'dimensions': 'ga:date',
      'metrics': 'ga:sessions',
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
    },
    chart: {
      type: 'LINE',
      container: 'timeline'
    }
  });

  /**
   * Create a ViewSelector for the first view to be rendered inside of an
   * element with the id "view-selector-1-container".
   */
  var viewSelector1 = new gapi.analytics.ViewSelector({
    container: 'view-selector-1-container'
  });

  /**
   * Create the first DataChart for top countries over the past 30 days.
   * It will be rendered inside an element with the id "chart-1-container".
   */
  var dataChart1 = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:sessions',
      dimensions: 'ga:browser',
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
      'max-results': 6,
      sort: '-ga:sessions'
    },
    chart: {
      container: 'chart-1-container',
      type: 'PIE',
      options: {
        width: '100%',
        pieHole: 4 / 9
      }
    }
  });

  var viewSelector2 = new gapi.analytics.ViewSelector({
    container: 'view-selector-2-container'
  });

  var dataChart2 = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:sessions',
      dimensions: 'ga:mobileDeviceInfo',
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
      'max-results': 6,
      sort: '-ga:sessions'
    },
    chart: {
      container: 'chart-2-container',
      type: 'PIE',
      options: {
        width: '100%',
        pieHole: 4 / 9
      }
    }
  });

  // Step 6: Hook up the components to work together.

  gapi.analytics.auth.on('success', function (response) {
    // Start tracking active users for this view.
    activeUsers.set(response).execute();

    viewSelector.execute();
    viewSelector1.execute();
    viewSelector2.execute();
  });

  viewSelector.on('change', function (ids) {
    var newIds = {
      query: {
        ids: ids
      }
    }
    timeline.set(newIds).execute();
  });

  /**
   * Update the first dataChart when the first view selecter is changed.
   */
  viewSelector1.on('change', function (ids) {
    dataChart1.set({
      query: {
        ids: ids
      }
    }).execute();
  });

  viewSelector2.on('change', function (ids) {
    dataChart2.set({
      query: {
        ids: ids
      }
    }).execute();
  });
});