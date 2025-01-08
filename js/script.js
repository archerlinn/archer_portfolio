/* 
  script.js

  1. Contact form validation
  2. Chatbot logic (OpenAI API calls)
  3. The small waving robot icon controlling the chatbot
*/

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

  // Basic validations
  if (!formData.name || !formData.email || !formData.message) {
    alert("Please fill all required fields!");
    return;
  }

  // Call our backend endpoint
  fetch('http://localhost:3000/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      alert("Email sent successfully!");
      contactForm.reset();
    })
    .catch((error) => {
      console.error('Error:', error);
      alert("Failed to send email. Check console for details.");
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

      Archer was bornt in May 30, 2004. He's 20 years old now. He was born in Taipei, Taiwan, a very beautiful country with the best food ever.
      When he was young, he learned soccer, swimming, go, and piano. Then he decided to join the swimming team in elementary school and won over 15 gold medals in 4 years locally. 
      He was also good at go where he reached single digit kyu when he was 9 years old. When he started middle school, he committed to the next biggest thing in his life, canoe polo. 
      He started training since 12 years old, the summer of 2016 at China with his high school varsity. He trained every weekday and Saturday since then, never took breaks.
      He was always the first to get into the training pool and the last to come out. Representing Taiwan and playing against 20+ countries, he won 2nd place in the Germany Championship when he was 14.
      At the age of 17, he was elected as the Taiwan Under 21 National Team Team Captain, but due to college transition and COVID19, he ended up going right into college and retired from the national team.
      Archer went to Purdue for college and majored in business analytics and information management, focused on the synergy between data science and business management. The reason he did that was because
      he wants to go into the most useful space since 2020 and also being creative in business. He started two startups in college, one is GENEZIS Consulting where he combined led 23 genZ students to innovate 
      AI Digital Marketing strategies for over 30 businesses over the world. Then he started Mellow Space, a mobile app that connects people to the real world. He thought social media was an amazing innovation
      at first when we aimed to connect people to the world, but now it's getting toxic with people competing against each other fakely and cause mental issues. There is definitely a solution to that. He 
      wants to make social media a tool for people to connect with the peers. He ended up having over 500+ events on the app and connected over hundred of users. Now, he decided to go all in into AI and robotics. 
      He believes to create the most impactful innovation, it has to be with the next biggest trend, trillion dollars market of robotics intelligence. You can look at his website to see the details of his creations.

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
      model: "gpt-4o-mini",
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
