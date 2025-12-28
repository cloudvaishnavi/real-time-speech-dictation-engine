import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import transcriptionRoutes from '../../backend/routes/transcriptionRoutes.js';
import Transcription from '../../backend/models/Transcription.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  app = express();
  app.use(express.json());
  app.use('/transcriptions', transcriptionRoutes);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

afterEach(async () => {
  await Transcription.deleteMany({});
});

describe('POST /transcriptions', () => {
  it('should save and return cleaned transcription', async () => {
    const rawText = 'Um I am happy';
    const response = await request(app)
      .post('/transcriptions')
      .send({ rawText })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.rawText).toBe(rawText);
    expect(response.body.cleanedText).toBe('I am happy.');
    expect(response.body).toHaveProperty('createdAt');
  });

  it('should return 400 if rawText is missing or empty', async () => {
    await request(app).post('/transcriptions').send({}).expect(400);
    await request(app).post('/transcriptions').send({ rawText: '   ' }).expect(400);
  });
});

describe('GET /transcriptions', () => {
  it('should return array of transcriptions sorted by createdAt desc', async () => {
    const first = new Transcription({ rawText: 'one', cleanedText: 'One.' });
    const second = new Transcription({ rawText: 'two', cleanedText: 'Two.' });
    await first.save();
    await second.save();

    const response = await request(app).get('/transcriptions').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0].rawText).toBe('two');
    expect(response.body[1].rawText).toBe('one');
  });
});

describe('GET /transcriptions/:id', () => {
  it('should return transcription by id', async () => {
    const transcription = new Transcription({ rawText: 'test', cleanedText: 'Test.' });
    await transcription.save();

    const response = await request(app).get(`/transcriptions/${transcription._id}`).expect(200);
    expect(response.body.rawText).toBe('test');
    expect(response.body.cleanedText).toBe('Test.');
  });

  it('should return 404 if transcription not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await request(app).get(`/transcriptions/${fakeId}`).expect(404);
  });

  it('should return 400 for invalid id format', async () => {
    await request(app).get('/transcriptions/invalidid').expect(400);
  });
});

describe('DELETE /transcriptions/:id', () => {
  it('should delete transcription and return success message', async () => {
    const transcription = new Transcription({ rawText: 'delete me', cleanedText: 'Delete me.' });
    await transcription.save();

    const response = await request(app).delete(`/transcriptions/${transcription._id}`).expect(200);
    expect(response.body).toHaveProperty('message', 'Transcription deleted successfully');

    const found = await Transcription.findById(transcription._id);
    expect(found).toBeNull();
  });

  it('should return 404 if transcription to delete not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await request(app).delete(`/transcriptions/${fakeId}`).expect(404);
  });

  it('should return 400 for invalid id format', async () => {
    await request(app).delete('/transcriptions/invalidid').expect(400);
  });
});
