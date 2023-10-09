// frontend.js
const socket = io();

// Initialize SSE connection
const eventSource = new EventSource('/sse');

// Function to add a new coin to the list
function addCoinToList(message) {
  const coinList = document.getElementById('coin-list');
  const listItem = document.createElement('li');
  listItem.textContent = message;
  coinList.appendChild(listItem);
}

// Listen for SSE events
eventSource.addEventListener('message', (event) => {
  const message = event.data;
  addCoinToList(message);
});

// Submit form data to add a new coin
document.getElementById('coin-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const coinName = document.getElementById('coinName').value;
  const coinPrice = document.getElementById('coinPrice').value;

  const response = await fetch('/add-coin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ coinName, coinPrice }),
  });

  if (response.ok) {
    document.getElementById('coinName').value = '';
    document.getElementById('coinPrice').value = '';
  }
});
