const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();
const port = 8080;

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

app.get('/', (req, res) => {
  fs.readFile('index.html', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.end();
  });
});

async function aiWaifu() {
  try {
    const url = 'https://lilyane.cyclic.app/api/ai-waifu';
    const response = await axios.get(url);
    return response.data.url;
  } catch (err) {
    console.error('Error fetching image URL:', err);
    throw err;
  }
}

async function nahida() {
  try {
    const url = 'https://lilyane.cyclic.app/api/nahida';
    const response = await axios.get(url);
    return response.data.url;
  } catch (err) {
    console.error('Error fetching image URL:', err);
    throw err;
  }
}

async function animesearch(query) {
  try {
    const url = 'https://lilyane.cyclic.app/api/animeimg?q='+query;
    const response = await axios.get(url);
    return response.data.url;
  } catch (err) {
    console.error('Error fetching image URL:', err);
    throw err;
  }
}

app.get('/image/aiwaifu', async (req, res) => {
  try {
    const imageUrl = await aiWaifu();
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    res.setHeader('Content-Type', 'image/jpeg'); // Sesuaikan dengan tipe gambar yang benar
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/image/nahida', async (req, res) => {
  try {
    const imageUrl = await nahida();
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    res.setHeader('Content-Type', 'image/jpeg'); // Sesuaikan dengan tipe gambar yang benar
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/image/search', async (req, res) => {
  const query = req.query.q;
  if(!query) return res.send(`<h1>Tolong masukan query!!</h1>`);
  try {
    const imageUrl = await animesearch(query);
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    res.setHeader('Content-Type', 'image/jpeg'); // Sesuaikan dengan tipe gambar yang benar
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Internal Server Error');
  }
});