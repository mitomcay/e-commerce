import express, { Express, Request, Response} from "express";
import http from 'http';
import { Server } from 'socket.io';
import { Message } from '@entitiesMessage';
import { User } from '@entities/User';
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import "reflect-metadata";
import { AppDataSource } from "@config/data-source";
import session from 'express-session';
import path from 'path';
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import { initSocket } from "./sockets/notification.socket";


// import routes ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import loginroutes from "@routes/login";
import registerroutes from "@routes/register";
import homeroutes from "@routeshome";
import profileroutes from "@routes/profile";
import adminroutes from "@routes/admin";
import cartsroutes from "@routes/cart";
import productsroutes from "@routesproduct";
import categoriesroutes from "@routes/category";
import checkoutroutes from "@routes/checkout";
import orderroutes from "@routesorder"
import wishlistroutes from "@routes/wishlist";
import commentroutes from "@routes/comment";
import Paymentroutes from "@routespaymentAccount";
import messageroutes from "@routes/message";
import notificationroutes from "@routes/notification";

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const app: Express = express();
const server = http.createServer(app);
const host = '0.0.0.0';
const port = +(process.env.PORT || 3000);

// socket.ip - send message ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
initSocket(server);

server.listen(port, host, () => {
  console.log(`[server]: 🚀 Server is running at http://localhost:${port}`);
});

// db ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
AppDataSource.initialize().then(() => {
    console.log("Connected to the database");
    // start your server here...
}).catch(err => {
    console.error("Error connecting to the database", err);
    process.exit(1); // exit application with error
})

// app.set() ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ejs
app.set('view engine', 'ejs');
app.set('views', './src/views'); 

// app.use() ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// session
app.use(
  session({
      secret: `${process.env.SESSION_KEY}`, 
      resave: false, 
      saveUninitialized: true, 
      cookie: {
          secure: false, 
          maxAge: 1000 * 60 * 60 * 24, 
      },
  })
);
// static files middleware
app.use(express.static(path.join(__dirname, '../public')));
// bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// cookies parser
app.use(cookieParser());
// routes
app.use(loginroutes);
app.use(registerroutes);
app.use(homeroutes); 
app.use(profileroutes);
app.use(adminroutes);
app.use(cartsroutes);
app.use(productsroutes);
app.use(categoriesroutes);
app.use(checkoutroutes);
app.use(orderroutes);
app.use(wishlistroutes);
app.use(commentroutes);
app.use(messageroutes);
app.use(notificationroutes);
app.use("/api/payment", Paymentroutes);

// chatbot ------------------------------------------------------------------------------------------------------------
/* const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Lưu ý: Đừng hardcode API Key vào code
});

const openai = new OpenAIApi(configuration);


app.post('/api/chatbot', async (req: Request, res: Response): Promise<any> => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required!" });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const botMessage = response.data.choices[0]?.message?.content || "Bot không trả lời được.";

    console.log('Bot response:', botMessage);
    res.status(200).json({ message: botMessage });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.log("Lỗi không xác định:", error);
      res.status(500).json({ error: error });
    }
    
  }
});*/



// end app.ts -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------