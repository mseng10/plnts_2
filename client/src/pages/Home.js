// import React, { useState, useRef, useEffect } from 'react';
// import { Box, TextField, IconButton, Paper, Typography, CircularProgress } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';

// // This is the functional component for a single chat message (bubble)
// const ChatBubble = ({ message }) => {
//   const isUser = message.role === 'user';
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: isUser ? 'flex-end' : 'flex-left',
//         mb: 2,
//       }}
//     >
//       <Paper
//         variant="outlined"
//         sx={{
//           p: 1.5,
//           maxWidth: '70%',
//           backgroundColor: isUser ? 'primary.light' : 'grey.200',
//           color: isUser ? 'primary.contrastText' : 'text.primary',
//           borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
//         }}
//       >
//         <Typography variant="body1">{message.content}</Typography>
//       </Paper>
//     </Box>
//   );
// };

// const Home = () => {
//   const [messages, setMessages] = useState([
//     { role: 'assistant', content: 'Hello! How can I help you today?' }
//   ]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   // Automatically scroll to the bottom when new messages are added
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSend = async () => {
//     if (input.trim() === '' || isLoading) return;

//     const userMessage = { role: 'user', content: input };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       // This is where you call your Node.js backend endpoint
//       const response = await fetch('http://127.0.0.1:8002/chat/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: input }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       // The backend should return the final message from Ollama
//       const assistantResponse = await response.json(); 

//       // Ensure the response from your backend is in the format { role: 'assistant', content: '...' }
//       // We are directly using the 'content' field from the returned message object.
//        setMessages((prevMessages) => [
//         ...prevMessages,
//         { role: 'assistant', content: assistantResponse.content },
//       ]);

//     } catch (error) {
//       console.error('Failed to get response from Ollama:', error);
//       // Display an error message to the user in the chat
//       const errorMessage = {
//         role: 'assistant',
//         content: "Sorry, I couldn't connect to the AI service. Please try again later.",
//       };
//       setMessages((prevMessages) => [...prevMessages, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   }

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         height: 'calc(100vh - 40px)', // Adjust height as needed
//         width: '100%',
//         maxWidth: '800px',
//         mx: 'auto', // Center horizontally
//         p: 2,
//         boxSizing: 'border-box',
//       }}
//     >
//       {/* Chat Messages Area */}
//       <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 1 }}>
//         {messages.map((msg, index) => (
//           <ChatBubble key={index} message={msg} />
//         ))}
//         {isLoading && (
//             <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
//                 <CircularProgress size={24} sx={{ml: 1.5}}/>
//             </Box>
//         )}
//         <div ref={chatEndRef} />
//       </Box>

//       {/* Input Area */}
//       <Paper
//         component="form"
//         onSubmit={(e) => { e.preventDefault(); handleSend(); }}
//         sx={{
//           p: '4px 8px',
//           display: 'flex',
//           alignItems: 'center',
//           width: '100%',
//           borderRadius: '28px',
//         }}
//         elevation={3}
//       >
//         <TextField
//           sx={{ ml: 1, flex: 1 }}
//           placeholder="Enter a prompt..."
//           variant="standard"
//           fullWidth
//           multiline
//           maxRows={4}
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           InputProps={{ disableUnderline: true }}
//           disabled={isLoading}
//         />
//         <IconButton
//           color="primary"
//           sx={{ p: '10px' }}
//           aria-label="send message"
//           onClick={handleSend}
//           disabled={isLoading || !input.trim()}
//         >
//           <SendIcon />
//         </IconButton>
//       </Paper>
//     </Box>
//   );
// };

// export default Home;