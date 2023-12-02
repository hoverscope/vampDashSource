function registerUser() {
  // Retrieve values from form fields
  const firstName = document.getElementById('firstname').value;
  const lastName = document.getElementById('lastname').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const errorMessageElement = document.getElementById('errorMessage');

  // Check if any field is empty
  if (firstName === '' || lastName === '' || username === '' || email === '' || password === '' || confirmPassword === '') {
    errorMessageElement.textContent = 'Please fill in all fields.';
    return; // Do not proceed further
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    errorMessageElement.textContent = 'Passwords do not match';
    return; // Do not proceed further
  }

  // Encrypt the password with CryptoJS (make sure CryptoJS is included in your project)
  const encryptedPassword = CryptoJS.SHA256(password).toString();

  // Create a user object
  const user = {
    firstName,
    lastName,
    username,
    email,
    password: encryptedPassword,
    highScore: 0 // Initialize high score to 0 for new users
  };

  // Retrieve existing users from local storage or create an empty array
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Check if the username or email is already taken
  if (users.some(u => u.username === username) || users.some(u => u.email === email)) {
    errorMessageElement.textContent = 'Username or email is already taken';
    return;
  }

  // Add the new user to the array
  users.push(user);

  // Save the updated user data to local storage
  localStorage.setItem('users', JSON.stringify(users));

  // Save initial high score to local storage
  localStorage.setItem(`hiscore_${username}`, 0);

  // Optionally, you can redirect the user to another page after registration
  window.location.href = 'login.html'; // Redirect to login page
}
