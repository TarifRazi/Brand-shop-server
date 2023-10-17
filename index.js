const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 7000;

// middleware
app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send('tech stor is cooking...!')
})

app.listen(port, () => {
    console.log(`tech store server is working at ${port}`)
})