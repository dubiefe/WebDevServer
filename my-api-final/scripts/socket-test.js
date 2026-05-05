import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWYxZjhmYjVlODExZGE0ZmQ1N2FjMzgiLCJpYXQiOjE3NzgwMTQzNDksImV4cCI6MTc3ODAxNTI0OX0.2X9UHmZyJP5BpPYJtGacphNL_AGhAvbJX8qAW-k3EQs"
  }
});

socket.on("connect", () => {
  console.log("🟢 CONNECTED:", socket.id);
});

socket.on("deliverynote:new", (data) => {
  console.log("📦 deliverynote:new received:", data);
});

socket.on("deliverynote:signed", (data) => {
  console.log("📦 deliverynote:signed received:", data);
});

socket.on("client:new", (data) => {
  console.log("👤 client:new received:", data);
});

socket.on("project:new", (data) => {
  console.log("📁 project:new received:", data);
});