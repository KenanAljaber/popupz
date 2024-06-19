// src/index.ts
import express from 'express';
import cors from 'cors';
import api from "./api"
require('dotenv').config({ path: '.env.development' });
const app = express();
const PORT = process.env.PORT || 8080;
app.use('/api', api);
var server = app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
