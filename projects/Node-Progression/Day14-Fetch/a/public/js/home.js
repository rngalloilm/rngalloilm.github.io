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

