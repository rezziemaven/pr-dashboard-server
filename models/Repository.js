const mongoose = require('mongoose');
const { Schema } = mongoose;

const repositorySchema = new Schema({
  githubId: { type: String, required: true },
  name: { type: String, required: true },
  fullName: { type: String, required: false },
  private: { type: Boolean, required: true },
  webUrl: { type: String, required: false },
  apiUrl: { type: String, required: false },
  hookUrl: { type: String, required: false },
  hookId: { type: String },
  pullUrl: { type: String, required: false },
  description: { type: String },
  language: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'users' },
  hookEnabled: { type: Boolean, default: true },
  color: { type: String, default: '#0bd8be' },
  _pullRequests: [
    // {type: Schema.Types.ObjectId, ref: 'pullrequests'},
    {
      _id: false,
      pullRequest: { type: Schema.Types.ObjectId, ref: 'pullrequests' },
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  synced_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('repositories', repositorySchema);
