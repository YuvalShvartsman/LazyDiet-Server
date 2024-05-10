import express from 'express';
import cors from "cors"

const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

app.get('/getSomething', (req, res) => {
  console.log('am i even getting here?')
  res.status(200).json(100)
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); 
});