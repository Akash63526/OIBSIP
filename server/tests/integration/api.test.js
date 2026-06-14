const request = require('supertest');
const express = require('express');

const app = express();
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('API Integration Tests', () => {
  it('should return 200 on health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
  });
});
