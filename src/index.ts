// src/index.ts
import express from "express";
import cors from "cors";
import api from "./api";
require("dotenv").config({ path: ".env.development" });
const PORT = process.env.PORT || 8080;

var server = api.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
