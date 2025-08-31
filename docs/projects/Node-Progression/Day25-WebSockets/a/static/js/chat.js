/****************\
* SERVICE WORKER *
\****************/
import { registerServiceWorker } from './sw.js';
registerServiceWorker();

/*****\
* GUI *
\*****/
const btnConnect = document.querySelector("#connect");
btnConnect.addEventListener('click', (event) => {
  socket = connect();
});

//Allow sending messages by pressing Enter
const inputText = document.querySelector("#message");
inputText.addEventListener("keyup", e => {
  if(e.keyCode === 13) { // Enter key
    sendButton.click();
  }
});

//Get the name from local storage, if we have it, or generate a random one
const myName = localStorage.getItem('name') || myRandomName();
//Save the name in local storage
localStorage.setItem('name', myName);

//Function to show a message in the chat area
const chatContainer = document.querySelector("#chatcontainer");
function renderMessage(messageData) {
  let messageDiv = document.createElement('div');
  messageDiv.className = `message ${messageData.name === myName ? 'me' : 'other'}`;
  let nameDiv = document.createElement('div');
  nameDiv.className = "name";
  nameDiv.innerHTML = messageData.name;
  let textDiv = document.createElement('div');
  textDiv.className = "text";
  textDiv.innerHTML = messageData.message;
  messageDiv.appendChild(nameDiv);
  messageDiv.appendChild(textDiv);
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

//Send a message when the Send button is clicked
//The message is sent to the server, which will broadcast it to all clients
//This will clear the input field and focus it again
const sendButton = document.querySelector("#send");
sendButton.addEventListener("click", e => {
  if(!socket) return; //Only send messages if we are connected
  const messageText = inputText.value.trim();
  if(messageText === "") return; //Only send messages if we have something to send
  let messageData = {name: myName, timestamp: new Date(), message: messageText}
  inputText.value = "";
  renderMessage(messageData);
  sendMessage(messageData);
  inputText.focus();
});

//Generate a random name consisting of two words from the list
function myRandomName() {
  const words = [
    'apple', 'banana', 'orange', 'grape', 'melon', 'pear', 'strawberry', 'blueberry', 'peach', 'pineapple',
    'dog', 'cat', 'rabbit', 'hamster', 'guinea pig', 'parrot', 'goldfish', 'turtle', 'frog', 'horse',
    'book', 'pen', 'pencil', 'notebook', 'marker', 'eraser', 'paper', 'dictionary', 'ruler', 'scissors',
    'car', 'bicycle', 'train', 'bus', 'motorcycle', 'truck', 'airplane', 'boat', 'helicopter', 'subway',
    'computer', 'keyboard', 'mouse', 'monitor', 'laptop', 'tablet', 'printer', 'speaker', 'router', 'server',
    'coffee', 'tea', 'milk', 'juice', 'water', 'soda', 'smoothie', 'beer', 'wine', 'cocktail',
    'house', 'apartment', 'building', 'bungalow', 'cabin', 'castle', 'villa', 'palace', 'tent', 'mansion',
    'tree', 'flower', 'grass', 'mountain', 'river', 'lake', 'ocean', 'desert', 'island', 'cave',
    'music', 'dance', 'song', 'instrument', 'guitar', 'piano', 'violin', 'drum', 'flute', 'trumpet',
    'sun', 'moon', 'star', 'planet', 'galaxy', 'comet', 'asteroid', 'meteor', 'nebula', 'black hole'
  ];
  let word1 = words[Math.floor(Math.random() * words.length)];
  //Capitalize first letter of word
  word1 = word1.charAt(0).toUpperCase() + word1.slice(1);
  let word2 = words[Math.floor(Math.random() * words.length)];
  //Capitalize first letter of word
  word2 = word2.charAt(0).toUpperCase() + word2.slice(1);
  return word1 + word2;
}




/***********\
* WEBSOCKET *
\***********/

// Global WebSocket variable, create WebSocket connection.
let socket = connect();

function connect() {
  // Determine WebSocket protocol based on current page protocol
  const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
  
  // Create new WebSocket connection
  const ws = new WebSocket(`${scheme}://${window.location.host}/ws`);
  
  // Disable connect button when connection is established
  ws.addEventListener('open', () => {
    console.log('WebSocket connection established');
    btnConnect.disabled = true;
  });
  
  // Handle connection errors
  ws.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
    btnConnect.disabled = false;
    ws.close();
    socket = null;
  });
  
  // Handle connection closing
  ws.addEventListener('close', () => {
    console.log('WebSocket connection closed');
    btnConnect.disabled = false;
    socket = null;
  });
  
  // Handle incoming messages
  ws.addEventListener('message', (event) => {
    try {
      const packet = JSON.parse(event.data);
      
      switch (packet.label) {
        case 'init':
          // Initialize chat with existing messages
          init(packet.data);
          break;
          
        case 'chat':
          // Render incoming chat message
          renderMessage(packet.data);
          break;
          
        default:
          console.log('Unknown message type:', packet.label);
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });
  
  return ws;
}

// Populate the chat area with the messages we have so far
function init(messages) {
  // Clear existing messages (if any)
  chatContainer.innerHTML = '';
  
  // Render each message
  messages.forEach(message => {
    renderMessage(message);
  });
}

// Send a chat message through the WebSocket
function sendMessage(messageData) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('Cannot send message - WebSocket not connected');
    return;
  }
  
  // Create packet with chat label and message data
  const packet = {
    label: 'chat',
    data: messageData
  };
  
  // Send the packet
  socket.send(JSON.stringify(packet));
}
