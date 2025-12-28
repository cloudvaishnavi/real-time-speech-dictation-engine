import mongoose from 'mongoose';

const transcriptionSchema = new mongoose.Schema(
  {
    rawText: {
      type: String,
      required: true,
      trim: true
    },
    cleanedText: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
      immutable: true
    }
  },
  {
    versionKey: false
  }
);

const Transcription = mongoose.model('Transcription', transcriptionSchema);

export default Transcription;
