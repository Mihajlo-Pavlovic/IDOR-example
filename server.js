const express = require('express');
const app = express();
const path = require('path');

// Simulation of DB for files metadata
const files = [
  { id: 1, ownerId: 1, filename: 'file1.txt', path: '/uploads/file1.txt' },
  { id: 2, ownerId: 2, filename: 'file2.txt', path: '/uploads/file2.txt' },
];

app.use((req, res, next) => {
  req.user = { id: 1, name: 'Alice' };
  next();
});

app.get('/unsafe-download/:fileId', (req, res) => {
  const fileId = parseInt(req.params.fileId, 10);

  const file = files.find((f) => f.id === fileId);

  if (!file) {
    return res.status(404).send('File not found');
  }

  res.download(path.join(__dirname, file.path), file.filename, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error downloading file');
    }
  });
});

app.get('/safe-download/:fileId', (req, res) => {
    const fileId = parseInt(req.params.fileId, 10);
  
    const file = files.find((f) => f.id === fileId);
  
    if (!file) {
      return res.status(404).send('File not found');
    }
  
    if (file.ownerId !== req.user.id) {
      return res.status(403).send('Forbidden: You do not have access to this file');
    }
  
    res.download(path.join(__dirname, file.path), file.filename, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error downloading file');
      }
    });
  });

app.listen(3000, () => {
  console.log('Vulnerable server running on http://localhost:3000');
});
