import express from 'express';
import Transcription from '../models/Transcription.js';
import { cleanText } from '../services/cleaningService.js';

const router = express.Router();

/* ================= POST /transcriptions ================= */
router.post('/', async (req, res) => {
  try {
    const { rawText, tone } = req.body;

    if (typeof rawText !== 'string' || rawText.trim() === '') {
      return res.status(400).json({
        error: 'rawText is required and must be a non-empty string'
      });
    }

    const startTime = Date.now();

    const cleanedText = cleanText(rawText, tone);

    const processingTimeMs = Date.now() - startTime;

    const transcription = new Transcription({
      rawText: rawText.trim(),
      cleanedText
    });

    const saved = await transcription.save();

    res.status(201).json({
      id: saved._id,
      rawText: saved.rawText,
      cleanedText: saved.cleanedText,
      createdAt: saved.createdAt,
      latencyMs: processingTimeMs
    });

  } catch (error) {
    console.error('Error in POST /transcriptions:', error);
    res.status(500).json({ error: 'Failed to save transcription' });
  }
});

/* ================= GET ALL ================= */
router.get('/', async (req, res) => {
  try {
    const transcriptions = await Transcription.find({})
      .sort({ createdAt: -1 })
      .select('_id rawText cleanedText createdAt');

    res.json(transcriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transcriptions' });
  }
});

/* ================= GET BY ID ================= */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid transcription id format' });
  }

  const transcription = await Transcription.findById(id);
  if (!transcription) {
    return res.status(404).json({ error: 'Transcription not found' });
  }

  res.json(transcription);
});

/* ================= DELETE ================= */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid transcription id format' });
  }

  const result = await Transcription.deleteOne({ _id: id });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Transcription not found' });
  }

  res.json({ message: 'Transcription deleted successfully' });
});

export default router;
