import dotenv from 'dotenv'
dotenv.config()
import app from './app.js';
import connectDB from './db/connection.js';




const port = process.env.PORT || 8000


connectDB()
  .then(() =>{
    app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

  })
  .catch((err) => {
    console.log("MongoDB connection error" , err)
    process.exit(1)
  })



