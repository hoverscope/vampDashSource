function loginUser() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const errorMessageElement = document.getElementById('errorMessage');

  if (username === '' || password === '') {
    errorMessageElement.textContent = 'Please fill in both username and password fields.';
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username);

  if (user && user.password === CryptoJS.SHA256(password).toString()) {
    // Set a cookie for loggedIn
    document.cookie = 'loggedIn=true; path=/';
    // Set a separate cookie for the username
    document.cookie = `loggedInUser=${username}; path=/`;

    console.log('User logged in successfully.');
    window.location.href = 'game.html';
  } else {
    errorMessageElement.textContent = 'Invalid username or password.';
  }
}
