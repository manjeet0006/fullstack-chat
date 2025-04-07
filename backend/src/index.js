import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

app

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Increase the request body size limit
app.use(express.json({ limit: "10mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // For URL-encoded data

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*" , (req , res ) => {
    res.sendFile(path.join(__dirname , "../frontend" , "dist" , "index.html"))
  })
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
