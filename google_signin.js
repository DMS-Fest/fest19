// var provider = null;
// function start(){
//     var provider = new firebase.auth.GoogleAuthProvider();
//     firebase.auth().signInWithRedirect(provider);
//     //   window.alert(typeof(start));
// }
function onSignIn(googleUser) {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.getAuthResponse().id_token);
        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential).then(function(result) {
            var user = result.user;
            // console.log("Result ", result);
            // console.log("User", user);
            // console.log("Success fully signed in");
            
            //initializing var
            var signInButton = document.getElementById("sign-in-button");
            var profile = document.getElementById("profile");
            var emailContainer = document.getElementById("email");
            var signOutButton = document.getElementById("sign-out-button");
            
            signInButton.className = "g-signin2 hide";
            profile.className = "show";
            signOutButton.className = "show";

            emailContainer.innerHTML = "Email " + user.email;
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          window.alert(errorMessage);
          // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  }
  function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }