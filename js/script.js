// script.js

/********************
  CONTACT FORM: VALIDATION + SENDING
********************/
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
  };

  if (!formData.name || !formData.email || !formData.message) {
    alert("Please fill all required fields!");
    return;
  }

  fetch('https://archer-portfolio.onrender.com/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Email sent successfully!");
      contactForm.reset();
    })
    .catch((error) => {
      console.error('Error:', error);
      alert("Failed to send email.");
    });
});

/********************
  CHATBOT CODE
********************/
const robotIcon = document.getElementById('robotIcon');
const chatbotContainer = document.getElementById('chatbotContainer');
const closeChatbotBtn = document.getElementById('closeChatbotBtn');
const chatbotMessages = document.getElementById('chatbotMessages');
const userInput = document.getElementById('userInput');
const sendMsgBtn = document.getElementById('sendMsgBtn');

// Tracks if it's the first time the chatbot is opened
let firstOpen = true;

robotIcon.addEventListener('click', () => {
  chatbotContainer.classList.toggle('hidden');
  if (firstOpen) {
    addMessageToChat("Hey, I'm Arrow, Archer's ...? I might know the most secrets about him. Let's know more about him together!", "bot-msg");
    firstOpen = false;
  }
});

closeChatbotBtn.addEventListener('click', () => {
  chatbotContainer.classList.add('hidden');
});

sendMsgBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const userMsg = userInput.value.trim();
  if (!userMsg) return;

  addMessageToChat(userMsg, "user-msg");
  userInput.value = "";

  fetch('https://archer-portfolio.onrender.com/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMsg }),
  })
    .then((response) => response.json())
    .then((data) => {
      const assistantReply = data.choices?.[0]?.message?.content || "No response from AI.";
      addMessageToChat(assistantReply, "bot-msg");
    })
    .catch((error) => {
      console.error('Error:', error);
      addMessageToChat("Error occurred. Check console.", "bot-msg");
    });
}

function addMessageToChat(text, className) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add("message", className);
  msgDiv.textContent = text;
  chatbotMessages.appendChild(msgDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}
