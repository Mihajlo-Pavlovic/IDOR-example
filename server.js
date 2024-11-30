const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

const files = [
  { id: 1, ownerId: 1, filename: 'file1.txt', path: '/uploads/file1.txt' },
  { id: 2, ownerId: 2, filename: 'file2.txt', path: '/uploads/file2.txt' },
];

const users = [
  { id: 1, name: 'Alice', token: 'token-alice' },
  { id: 2, name: 'Bob', token: 'token-bob' },
];

const authenticate = (req, res, next) => {
  const { token } = req.headers;

  const user = users.find((u) => u.token === token);

  if (!user) {
    return res.status(401).send('Unauthorized: Invalid token');
  }

  req.user = user;
  next();
};

app.post('/unsafe-download', (req, res) => {
  const { fileId } = req.body;

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

app.post('/safe-download', authenticate, (req, res) => {
  const { fileId } = req.body;

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
  console.log('Safe server running on http://localhost:3000');
});
