import express from 'express';
import cors from 'cors';
const app = express();

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



// import all the routes 
import healthCheckRouter from "./routes/healthcheck.routes.js"

app.use("/api/v1/healthcheck", healthCheckRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})
export default app;