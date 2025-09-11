import api from './APIClient.js';

function displayUserInHeader(user) {
  let link = document.createElement('a');
  link.href = '#';
  link.innerHTML = "Log Out";
  link.addEventListener("click", e => {
    e.preventDefault();
    logOut();
  })

  document.getElementById('user').textContent = `${user.first_name} ${user.last_name} (${user.username}) `;
  document.getElementById('user').appendChild(document.createElement('br'));
  document.getElementById('user').appendChild(link);
}


// YOUR CODE HERE

function logOut() {
  api.logOut().then(() => {
    document.location = "./login";
  });
}

api.getCurrentUser().then(user => {
  displayUserInHeader(user);
})
.catch(error => {
  if(error.status === 401) {
    console.log("We are not logged in");
    document.location = './login';
  }
  else {
    console.log(`${error.status}`, error);
  }
});
