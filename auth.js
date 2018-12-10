var GoogleAuth;
var SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly';
var clients = [
  {
    apiKey: 'YOUR KEY',
    clientId: 'YOUR ID',
    viewId: 'YOUR ID'
  }, {
    apiKey: 'YOUR KEY',
    clientId: 'YOUR ID',
    viewId: 'YOUR ID'
  }
];
// Set default client
var selectedClient = clients[0];

function changeClient(client) {
  selectedClient = clients[client];
  if (GoogleAuth.isSignedIn.get()) {
    GoogleAuth.signOut();
  }
  GoogleAuth.signIn();
}

function handleClientLoad() {
  // Load the API's client and auth2 modules.
  // Call the initClient function after the modules load.
  gapi.load('client:auth2', {
    callback: function () {
      // Handle gapi.client initialization.
      initClient();
    },
    onerror: function () {
      // Handle loading error.
      alert('gapi.client failed to load!');
    },
    timeout: 5000, // 5 seconds.
    ontimeout: function () {
      // Handle timeout.
      alert('gapi.client could not load in a timely manner!');
    }
  });
}

function initClient() {
  // Retrieve the discovery document for version 3 of Google Drive API.
  // In practice, your app can retrieve one or more discovery documents.
  var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

  // Initialize the gapi.client object, which app uses to make API requests.
  // Get API key and client ID from API Console.
  // 'scope' field specifies space-delimited list of access scopes.
  gapi.client.init({
    'apiKey': selectedClient.apiKey,
    'discoveryDocs': [discoveryUrl],
    'clientId': selectedClient.clientId,
    'scope': SCOPE
  }).then(function () {
    GoogleAuth = gapi.auth2.getAuthInstance();

    // Listen for sign-in state changes.
    GoogleAuth.isSignedIn.listen(updateSigninStatus);

    // Handle initial sign-in state. (Determine if user is already signed in.)
    var user = GoogleAuth.currentUser.get();
    setSigninStatus();

    // Call handleAuthClick function when user clicks on
    //      "Sign In/Authorize" button.
    $('#sign-in-or-out-button').click(function () {
      handleAuthClick();
    });
    $('#revoke-access-button').click(function () {
      revokeAccess();
    });
  });
}

// function handleAuthClick() {
//   if (GoogleAuth.isSignedIn.get()) {
//     // User is authorized and has clicked 'Sign out' button.
//     GoogleAuth.signOut();
//   } else {
//     // User is not signed in. Start Google auth flow.
//     GoogleAuth.signIn();
//   }
// }

// function revokeAccess() {
//   GoogleAuth.disconnect();
// }

function setSigninStatus(isSignedIn) {
  var user = GoogleAuth.currentUser.get();
  var viewId = selectedClient.viewId;
  if (user.Zi) {
    var accessToken = user.Zi.access_token;
  }
  var isAuthorized = user.hasGrantedScopes(SCOPE);
  if (isAuthorized) {
    $('.sign-in-clients').children().removeClass('active')
    if(selectedClient === clients[0]){
      $('.client-1').addClass('active')
      $('.client-title').html('Client 1')
    } else {
      $('.client-2').addClass('active')
      $('.client-title').html('Client 2')
    }
    // $('#auth-status').html('');
    // Query Request  
    queryReports(accessToken, viewId);
  } else {
    // $('#auth-status').html('You have not authorized this app or you are ' +
    //   'signed out.');
  }
}

function updateSigninStatus(isSignedIn) {
  setSigninStatus();
}