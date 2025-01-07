/* 
  script.js

  1. Contact form validation
  2. Chatbot logic (OpenAI API calls)
  3. The small waving robot icon controlling the chatbot
*/

/********************
  CONTACT FORM VALIDATION
********************/
const contactForm = document.getElementById('contactForm');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const messageField = document.getElementById('message');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nameValue = nameField.value.trim();
  const emailValue = emailField.value.trim();
  const messageValue = messageField.value.trim();

  if (!nameValue) {
    alert("Please enter your name.");
    return;
  }
  if (!emailValue || !isValidEmail(emailValue)) {
    alert("Please enter a valid email address.");
    return;
  }
  if (!messageValue) {
    alert("Please enter a message.");
    return;
  }

  alert("Thank you! Your message has been sent.");
  // contactForm.reset();
});

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/********************
  CHATBOT CODE
********************/
const robotIcon = document.getElementById('robotIcon');
const chatbotContainer = document.getElementById('chatbotContainer');
const closeChatbotBtn = document.getElementById('closeChatbotBtn');
const chatbotMessages = document.getElementById('chatbotMessages');
const userInput = document.getElementById('userInput');
const sendMsgBtn = document.getElementById('sendMsgBtn');

/* Replace with your real API key (INSECURE for production) */
const OPENAI_API_KEY = "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";

/**
 * We maintain an array of message objects for the conversation.
 * The first "system" message includes your life story or instructions.
 */
const conversation = [
  {
    role: "system",
    content: `
      Your name is Arrow. You are Archer's childhood robot friend, who knows everything about him.
      Here's Archer's life story:

      [Insert Archer's full life story here...]

      Please answer any question the user asks, always in a friendly, playful tone,
      and reveal relevant facts about Archer if asked. 
    `
  }
];

/* 
  We'll track if it's the first time the chatbot has been opened 
  to display the special welcome message.
*/
let firstOpen = true;

// Clicking the small robot icon toggles the chatbot container
robotIcon.addEventListener('click', () => {
  chatbotContainer.classList.toggle('hidden');

  // If this is the very first time the chatbot is opened,
  // post a friendly initial message.
  if (firstOpen && !chatbotContainer.classList.contains('hidden')) {
    addMessageToChat(
      "Hey, I'm Arrow, Archer's ...? I might know the most secrets about him, shhh... So let's know more about him together!",
      "bot-msg"
    );
    firstOpen = false;
  }
});

// Clicking "X" closes the chatbot
closeChatbotBtn.addEventListener('click', () => {
  chatbotContainer.classList.add('hidden');
});

// Send message on button click
sendMsgBtn.addEventListener('click', sendMessage);

// Send message on "Enter" key
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

/**
 * Send user message -> OpenAI -> Display response
 */
function sendMessage() {
  const userMsg = userInput.value.trim();
  if (!userMsg) return;

  // Display user message
  addMessageToChat(userMsg, "user-msg");

  // Clear input
  userInput.value = "";

  // Add user message to conversation
  conversation.push({ role: "user", content: userMsg });

  // Call OpenAI API
  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // or "gpt-4" if you have access
      messages: conversation
    })
  })
    .then(response => response.json())
    .then(data => {
      const assistantReply = data.choices?.[0]?.message?.content;
      if (assistantReply) {
        // Add to conversation
        conversation.push({ role: "assistant", content: assistantReply });
        // Show in chat
        addMessageToChat(assistantReply, "bot-msg");
      } else {
        addMessageToChat("Oops, no valid response from AI.", "bot-msg");
      }
    })
    .catch(err => {
      console.error("Error from OpenAI API:", err);
      addMessageToChat("Error occurred. Check console.", "bot-msg");
    });
}

/**
 * Helper: Add message to the chatbot UI
 */
function addMessageToChat(text, className) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add("message", className);
  msgDiv.textContent = text;
  chatbotMessages.appendChild(msgDiv);

  // Auto-scroll to bottom
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}
