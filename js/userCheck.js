function checkLoggedIn() {
    const loggedIn = document.cookie.includes('loggedIn=true');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const userName = document.getElementById('userName');
  
    if (loggedIn) {
      const loggedInUsername = getLoggedInUsername();
      console.log('Logged in username:', loggedInUsername); // Add this line for debugging
      userName.textContent = `Welcome, ${loggedInUsername}!`;
      loginLink.style.display = 'none';
      registerLink.style.display = 'none';
      logoutLink.style.display = 'inline';
      userName.style.display = 'inline';
    } else {
      console.log('Not logged in'); // Add this line for debugging
      loginLink.style.display = 'inline';
      registerLink.style.display = 'inline';
      logoutLink.style.display = 'none';
      userName.style.display = 'none';
    }
  }
  
  function getLoggedInUsername() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name.trim() === 'loggedInUser') {
        const username = value || null;
        console.log('Username from cookie:', username); // Add this line for debugging
        return username;
      }
    }
    return null;
  }

  function logoutUser() {
    // Remove the loggedIn and loggedInUser cookies
    document.cookie = 'loggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = 'loggedInUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    // Redirect to the login page or any other desired page
    window.location.href = 'login.html';
  }

  // Add an event listener to the logout link
document.getElementById('logoutLink').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default link behavior
    logoutUser(); // Call the logout function
  });
  
  
  
  document.addEventListener('DOMContentLoaded', checkLoggedIn);
  