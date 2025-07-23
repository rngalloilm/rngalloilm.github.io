import APIClient from './APIClient.js';

document.addEventListener('DOMContentLoaded', () => {
  const userId = window.location.pathname.split('/').pop(); // Extract user ID from URL
  const profileAvatar = document.getElementById('profileAvatar');
  const profileName = document.getElementById('profileName');
  const profileUsername = document.getElementById('profileUsername');
  const followButton = document.getElementById('followButton');
  const followedUsersList = document.getElementById('followedUsersList');
  const profileHowls = document.getElementById('profileHowls');
  const howlTemplate = document.getElementById('howlTemplate').content;

  let currentUser;

  // Fetch user profile, howls, and followed users
  Promise.all([
    APIClient.getCurrentUser(),
    APIClient.getHowlsByUser(userId),
    APIClient.getFollowedUsers(userId),
    APIClient.getUserById(userId), // Fetch the profile owner's details
  ])
    .then(([loggedInUser, howls, followedUsers, profileOwner]) => {
      currentUser = loggedInUser;

      // Display profile info
      profileAvatar.src = profileOwner.avatar;
      profileName.textContent = `${profileOwner.first_name} ${profileOwner.last_name}`;
      profileUsername.textContent = `@${profileOwner.username}`;

      // Show follow/unfollow button if the user is viewing another profile
      if (currentUser.id !== parseInt(userId)) {
        followButton.textContent = followedUsers.includes(currentUser.id) ? 'Unfollow' : 'Follow';
        followButton.classList.remove('d-none');
      }

      // Display followed users
      followedUsersList.innerHTML = '';
      followedUsers.forEach(userId => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `User ${userId}`;
        followedUsersList.appendChild(li);
      });

      // Display howls
      profileHowls.innerHTML = '';
      howls.forEach(howl => {
        const howlElement = document.importNode(howlTemplate, true);
        howlElement.querySelector('img').src = `https://robohash.org/${howl.userId}.png?size=64x64&set=set1`;
        howlElement.querySelector('strong').textContent = `User ${howl.userId}`;
        howlElement.querySelector('span').textContent = `@${profileOwner.username}`;
        howlElement.querySelector('p').textContent = howl.text;
        profileHowls.appendChild(howlElement);
      });

      // Add follow/unfollow button functionality
      followButton.addEventListener('click', () => {
        if (followedUsers.includes(currentUser.id)) {
          APIClient.unfollowUser(currentUser.id, parseInt(userId))
            .then(() => window.location.reload())
            .catch(err => {
              console.error('Failed to unfollow user', err);
              alert('Failed to unfollow user. Please try again later.');
            });
        } else {
          APIClient.followUser(currentUser.id, parseInt(userId))
            .then(() => window.location.reload())
            .catch(err => {
              console.error('Failed to follow user', err);
              alert('Failed to follow user. Please try again later.');
            });
        }
      });
    })
    .catch(err => {
      console.error('Failed to load profile', err);
      profileHowls.innerHTML = '<p class="text-danger">Failed to load profile. Please try again later.</p>';
    });
});