import APIClient from './APIClient.js';

document.addEventListener('DOMContentLoaded', () => {
  const howlInput = document.querySelector('textarea'); // Textarea for new howl
  const howlButton = document.getElementById('howlButton'); // Button to post a howl
  const howlList = document.getElementById('howlList'); // Container for howls
  const howlTemplate = document.getElementById('howlTemplate').content; // Template for howls
  const logoutButton = document.getElementById('logoutButton'); // Logout button
  const profileLink = document.getElementById('profileLink'); // Profile link

  // Check if user is logged in
  APIClient.getCurrentUser()
    .then(user => {
      // Set the profile link to the current user's profile
      profileLink.href = `/profile/${user.id}`;

      // Display the feed
      loadFeed();
    })
    .catch(() => {
      // Redirect to login page if not logged in
      window.location.href = '/login';
    });

  // Load the feed
  function loadFeed() {
    APIClient.getFeed()
      .then(howls => {
        howlList.innerHTML = ''; // Clear existing howls

        // Fetch user details for each howl
        const userPromises = howls.map(howl => APIClient.getUserById(howl.userId));

        Promise.all(userPromises)
          .then(users => {
            howls.forEach((howl, index) => {
              const user = users[index]; // Get the user details for this howl
              const howlElement = document.importNode(howlTemplate, true);

              // Update the template with howl data
              const userAvatar = howlElement.querySelector('img');
              const userNameElement = howlElement.querySelector('strong');
              const usernameElement = howlElement.querySelector('span');

              if (userAvatar) {
                userAvatar.src = user.avatar; // Set the user's avatar
                userAvatar.alt = `${user.first_name} ${user.last_name}`;
              }

              if (userNameElement) {
                userNameElement.textContent = `${user.first_name} ${user.last_name}`; // Set the user's full name
                userNameElement.style.cursor = 'pointer'; // Make the name clickable
                userNameElement.addEventListener('click', () => {
                  window.location.href = `/profile/${user.id}`; // Redirect to the user's profile
                });
              }

              if (usernameElement) {
                usernameElement.textContent = `@${user.username}`; // Set the username
              }

              howlElement.querySelector('p.card-text').textContent = howl.text; // Set the howl text
              howlList.appendChild(howlElement);
            });
          })
          .catch(err => {
            console.error('Failed to load user details', err);
            howlList.innerHTML = '<p class="error">Failed to load user details. Please try again later.</p>';
          });
      })
      .catch(err => {
        console.error('Failed to load feed', err);
        howlList.innerHTML = '<p class="error">Failed to load feed. Please try again later.</p>';
      });
  }

  // Post a new howl
  howlButton.addEventListener('click', () => {
    const text = howlInput.value.trim();
    if (text) {
      APIClient.postHowl(text)
        .then(() => {
          howlInput.value = ''; // Clear input
          loadFeed(); // Refresh the feed
        })
        .catch(err => {
          console.error('Failed to post howl', err);
          alert('Failed to post howl. Please try again later.');
        });
    } else {
      alert('Howl text cannot be empty.');
    }
  });

  // Logout functionality
  logoutButton.addEventListener('click', () => {
    APIClient.logout()
      .then(() => {
        window.location.href = '/login'; // Redirect to login page
      })
      .catch(err => {
        console.error('Failed to log out', err);
      });
  });
});