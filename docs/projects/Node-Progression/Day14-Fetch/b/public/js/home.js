import {} from './darkMode.js';


//Task a.4: Displaying Howls on the Frontend
import HTTPClient from './HTTPClient.js';

const howlList = document.getElementById('howlList');
const howlTemplate = document.getElementById('howlTemplate');

function renderHowl(howl) {
    const howlInstance = howlTemplate.content.cloneNode(true);
    const howlElement = howlInstance.querySelector('.howl.container');

    howlElement.querySelector('.user').textContent = howl.user;
    howlElement.querySelector('.content').textContent = howl.message;

    howlList.prepend(howlElement);
}

HTTPClient.get('/howls')
    .then(howls => {
        howls.forEach(renderHowl);
    })
    .catch(error => console.error('Failed to fetch howls:', error));

//Task b.1: Posting New Howls

// Get a reference to the <textarea> and call it howlInput, and another to the button and call it howlButton.
const howlInput = document.querySelector('#howlInput textarea');
const howlButton = document.getElementById('howlButton');

howlButton.addEventListener('click', () => {
    // Check if input is empty
    if (howlInput.value === '') return;

    // Create the data object
    const data = {
        message: howlInput.value,
    };

    // Send a POST request to /howls
    HTTPClient.post('/howls', data)
        .then(newHowl => {
            renderHowl(newHowl);
            howlInput.value = '';
        })
        .catch(error => console.error('Failed to post howl:', error));
});