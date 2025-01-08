require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch'); // For API requests
const cors = require('cors');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'https://archer-portfolio.onrender.com' })); // CORS setup
app.use(express.json()); // Parse JSON body

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "archerlin0530@gmail.com", // Loaded from .env
    pass: "qaic gzlt bryu uyhe", // Loaded from .env
  },
});

// Endpoint for testing
app.get('/', (req, res) => {
  res.send('Server is running!');
});

/**
 * POST /send-email
 * Handles email form submissions
 */
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing name, email, or message.' });
  }

  const mailOptions = {
    from: `"Portfolio Contact" <${email}>`, // Sender email
    to: "archerlin0530@gmail.com", // Receiver email from .env
    subject: `New message from ${name}`,
    text: `
    Sender Name: ${name}
    Sender Email: ${email}
    
    Message:
    ${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Error sending email' });
    }
    console.log('Email sent:', info.response);
    return res.status(200).json({ message: 'Email sent successfully!' });
  });
});

/**
 * POST /chat
 * Handles OpenAI chatbot interactions
 */
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const conversation = [
    {
      role: "system",
      content: `
        Your name is Arrow. You are Archer's childhood robot friend, who knows everything about him.
        Here's Archer's life story:

        Archer was born on May 30, 2004. He's 20 years old now. He was born in Taipei, Taiwan, a very beautiful country with the best food ever.
        When he was young, he learned soccer, swimming, go, and piano. Then he decided to join the swimming team in elementary school and won over 15 gold medals in 4 years locally. 
        He was also good at go where he reached single digit kyu when he was 9 years old. When he started middle school, he committed to the next biggest thing in his life, canoe polo. 
        He started training since 12 years old, the summer of 2016 at China with his high school varsity. He trained every weekday and Saturday since then, never took breaks.
        He was always the first to get into the training pool and the last to come out. Representing Taiwan and playing against 20+ countries, he won 2nd place in the Germany Championship when he was 14.
        At the age of 17, he was elected as the Taiwan Under 21 National Team Team Captain, but due to college transition and COVID19, he ended up going right into college and retired from the national team.
        Archer went to Purdue for college and majored in business analytics and information management, focused on the synergy between data science and business management. The reason he did that was because
        he wants to go into the most useful space since 2020 and also being creative in business. He started two startups in college, one is GENEZIS Consulting where he combined led 23 genZ students to innovate 
        AI Digital Marketing strategies for over 30 businesses over the world. Then he started Mellow Space, a mobile app that connects people to the real world. He thought social media was an amazing innovation
        at first when we aimed to connect people to the world, but now it's getting toxic with people competing against each other fakely and cause mental issues. There is definitely a solution to that. He 
        wants to make social media a tool for people to connect with the peers. He ended up having over 500+ events on the app and connected over hundreds of users. Now, he decided to go all in into AI and robotics. 
        He believes to create the most impactful innovation, it has to be with the next biggest trend, trillion dollars market of robotics intelligence. You can look at his website to see the details of his creations.

        Please answer any question the user asks, always in a friendly, playful tone,
        and reveal relevant facts about Archer if asked. 
      `,
    },
    { role: "user", content: userMessage },
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: conversation,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
