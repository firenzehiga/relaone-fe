#!/usr/bin/env node
'use strict';

// Simple performance test for organization create-event endpoint
// Usage (PowerShell):
// $env:ORGANIZATION_TOKEN="<token>"; node .\scripts\perf\org-create-event-perf.js --count=5 --delay=200

const axios = require('axios');

const argv = require('minimist')(process.argv.slice(2));

const BASE_URL = process.env.VITE_API_BASE_URL || argv.base || 'https://peladen.my.id/api';
const TOKEN = process.env.ORGANIZATION_TOKEN || argv.token || '';
const COUNT = parseInt(argv.count || 5, 10);
const DELAY = parseInt(argv.delay || 200, 10); // ms between requests

if (!TOKEN) {
  console.error('[ERROR] ORGANIZATION_TOKEN environment variable is required.');
  console.error('Set it in PowerShell: $env:ORGANIZATION_TOKEN = "<token>"');
  process.exit(1);
}

const client = axios.create({ baseURL: BASE_URL, timeout: 30000, headers: { Authorization: `Bearer ${TOKEN}` } });

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const makePayload = (i) => {
  const now = new Date();
  const startDate = new Date(now.getTime() + 24 * 3600 * 1000); // +1 day
  const endDate = new Date(startDate.getTime() + 3 * 3600 * 1000); // +3 hours

  return {
    judul: `PERFORMANCE TEST EVENT ${now.toISOString()} #${i}`,
    deskripsi: 'Event untuk pengujian performa pembuatan event oleh organisasi.',
    tanggal_mulai: startDate.toISOString().split('T')[0],
    tanggal_selesai: endDate.toISOString().split('T')[0],
    waktu_mulai: '09:00',
    waktu_selesai: '12:00',
    lokasi: 'Lokasi Pengujian',
    maks_peserta: 100,
  };
};

async function run() {
  console.log(`[PERFORMANCE TEST] STARTING ${COUNT} CREATE EVENT REQUESTS TO ${BASE_URL}/organization/events`);
  const results = [];

  for (let i = 1; i <= COUNT; i++) {
    const payload = makePayload(i);
    const start = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
    try {
      const res = await client.post('/organization/events', payload);
      const end = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
      const durationMs = Math.round(end - start);
      console.log(`[PERFORMANCE] PEMBUATAN EVENT #${i} BERHASIL DALAM ${durationMs} ms.`);
      results.push({ ok: true, durationMs });
    } catch (err) {
      const end = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
      const durationMs = Math.round(end - start);
      const status = err.response?.status || 'NO_RESPONSE';
      console.error(`[PERFORMANCE] PEMBUATAN EVENT #${i} GAGAL SETELAH ${durationMs} ms. STATUS: ${status}`);
      results.push({ ok: false, durationMs, status });
    }

    if (i < COUNT) await sleep(DELAY);
  }

  // summary
  const success = results.filter((r) => r.ok);
  const times = results.map((r) => r.durationMs).filter((t) => typeof t === 'number');
  const avg = times.reduce((a, b) => a + b, 0) / Math.max(1, times.length);
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log('');
  console.log('[PERFORMANCE SUMMARY]');
  console.log(`TOTAL REQUESTS: ${results.length}`);
  console.log(`SUCCESS: ${success.length}`);
  console.log(`FAIL: ${results.length - success.length}`);
  console.log(`DURATIONS (ms) => AVG: ${Math.round(avg)} | MIN: ${isFinite(min) ? min : '-'} | MAX: ${isFinite(max) ? max : '-'} `);
  console.log('[PERFORMANCE] TEST COMPLETE');
}

run().catch((err) => {
  console.error('[PERFORMANCE] TEST CRASHED', err);
  process.exit(2);
});
