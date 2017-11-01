const mongoose = require('mongoose');

const Document = mongoose.model('Document', {
  title: {
    type: String,
    required: true,
  },
  docId: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

module.exports = Document;
