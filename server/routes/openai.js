/* 
  NOTE: replace the openai.js file with this file and uncomment 
  the code if you want to use the newer version of the openai API.
  OPENAI released their gpt-3.5-turbo version on 3/1/2023, this is
  gpt-3.5 version which is what powers the ChatGPT bot. most of the
  code is the same with some minor changes.
*/

import express from "express";
import axios from "axios";
import dotenv from "dotenv";

 import { openai } from "../index.js";
  dotenv.config();
  const router = express.Router();
   router.post("/text", async (req, res) => {
      try {
      const text  = req.body.text;
      console.log("text" , text);
      const activeChatId  = req.body.activeChatId;
    const response = await openai.createChatCompletion({
     model: "gpt-3.5-turbo",
     messages: [
       { role: "system", content: "You are a helpful assistant." }, 
       { role: "user", content: text },       
     ],
   });
   console.log("activeChatId" , activeChatId);
   console.log("process.env.PROJECT_ID" , process.env.PROJECT_ID)
   await axios.post(
     `https://api.chatengine.io/chats/${activeChatId}/messages/`,
     { text: response.data.choices[0].message.content },
     {
       headers: {
         "Project-ID": process.env.PROJECT_ID,
         "User-Name": "AiChat_",
         "User-Secret": process.env.BOT_USER_SECRET,
       },
     }
    
   );
   console.log("activeChatId" , activeChatId);
   console.log("process.env.PROJECT_ID" , process.env.PROJECT_ID)
   res.status(200).json({ text: response.data.choices[0].message.content });
 } catch (error) {
   console.error("error", error.response.data.error);
   res.status(500).json({ error: error.message });
 }
});
console.log("49");

router.post("/code", async (req, res) => {
 try {
   const { text, activeChatId} = req.body;

   const response = await openai.createChatCompletion({
     model: "gpt-3.5-turbo",
     messages: [
       {
         role: "system",
         content: "You are an assistant coder who responds with only code and no explanations.",
       }, // this represents the bot and what role they will assume
       { role: "user", content: text }, // the message that the user sends
     ],
   });
  
   await axios.post(
     `https://api.chatengine.io/chats/${activeChatId}/messages/`,
     { text: response.data.choices[0].message.content },
     {
       headers: {
         "Project-ID": process.env.PROJECT_ID,
         "User-Name": "AiCode_",
         "User-Secret": process.env.BOT_USER_SECRET,
       },
     }
   );

   res.status(200).json({ text: response.data.choices[0].message.content });
 } catch (error) {
   console.error("error", error.response.data.error);
   res.status(500).json({ error: error.message });
 }
});

router.post("/assist", async (req, res) => {
 try {
   const text  = req.body.text;

   const response = await openai.createChatCompletion({
     model: "gpt-3.5-turbo",
     messages: [
       {
         role: "system",
         content:  "You are a helpful assistant that serves to only complete user's thoughts or sentences.",
       }, // this represents the bot and what role they will assume
       { role: "user", content: `Finish my thought: ${text}` }, // the message that the user sends
     ],
   });   
   res.status(200).json({ text: response.data.choices[0].message.content });
 } catch (error) {
   console.error("error", error);
   res.status(500).json({ error: error.message });
 }
});

export default router;
