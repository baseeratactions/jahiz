// Minimal Google Apps Script emulator to run server/Code.gs (+ DemoAccounts.gs) in Node and call doPost like the website does.
const fs = require('fs'), vm = require('vm'), crypto = require('crypto');
module.exports = function load(files) {
  const sheets = {}, props = {}, cache = {}, mails = [], logs = [], fetches = [];
  const toSigned = b => Array.from(b).map(x => x > 127 ? x - 256 : x);
  const toBuf = a => Buffer.from(typeof a === 'string' ? a : a.map(x => (x + 256) % 256));
  function mkSheet(name) {
    const data = [];   // array of rows
    const s = {
      name, data,
      getLastRow: () => data.length,
      getRange(r, c, nr = 1, nc = 1) {
        return {
          getValues() { const out = []; for (let i = 0; i < nr; i++) { const row = data[r - 1 + i] || []; const o = []; for (let j = 0; j < nc; j++) o.push(row[c - 1 + j] ?? ''); out.push(o); } return out; },
          setValues(v) { for (let i = 0; i < nr; i++) { data[r - 1 + i] = data[r - 1 + i] || []; for (let j = 0; j < nc; j++) data[r - 1 + i][c - 1 + j] = v[i][j]; } return this; },
          setFontWeight() { return this; }, setNumberFormat() { return this; },
        };
      },
      setFrozenRows() {}, deleteRow(i) { data.splice(i - 1, 1); }, getName: () => name,
    };
    return s;
  }
  const ctx = {
    console,
    SpreadsheetApp: { getActive: () => ({ getSheetByName: n => sheets[n] || null, insertSheet: n => (sheets[n] = mkSheet(n)), getId: () => 'ss1' }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] ?? null, setProperty: (k, v) => { props[k] = String(v); }, deleteProperty: k => { delete props[k]; } }) },
    CacheService: { getScriptCache: () => ({ get: k => cache[k] ?? null, put: (k, v) => { cache[k] = String(v); }, remove: k => { delete cache[k]; } }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    Session: { getScriptTimeZone: () => 'Asia/Qatar', getEffectiveUser: () => ({ getEmail: () => 'owner@example.com' }) },
    Utilities: {
      getUuid: () => crypto.randomUUID(), sleep() {},
      DigestAlgorithm: { SHA_256: 'sha256', MD5: 'md5' }, Charset: { UTF_8: 'utf8' },
      computeDigest: (alg, s) => toSigned(crypto.createHash(alg).update(String(s), 'utf8').digest()),
      computeHmacSha256Signature: (s, k) => toSigned(crypto.createHmac('sha256', k).update(String(s), 'utf8').digest()),
      base64EncodeWebSafe: b => toBuf(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_'),
      base64Encode: b => toBuf(b).toString('base64'),
      formatDate: (d, tz, f) => { const s = new Date(d).toLocaleString('sv-SE', { timeZone: 'Asia/Qatar', hour12: false }); return f === 'yyyy-MM-dd' ? s.slice(0, 10) : s.slice(0, 16); },
    },
    MailApp: { sendEmail: m => mails.push(m), getRemainingDailyQuota: () => 100 },
    UrlFetchApp: { fetch: u => { fetches.push(u); return { getContentText: () => '' }; } },
    ScriptApp: { getProjectTriggers: () => [], newTrigger: () => ({ timeBased: () => ({ everyDays: () => ({ atHour: () => ({ create() {} }) }), everyWeeks: () => ({ onWeekDay: () => ({ atHour: () => ({ create() {} }) }) }), onWeekDay: () => ({ atHour: () => ({ create() {} }) }) }) }), WeekDay: {} },
    ContentService: { createTextOutput: t => ({ setMimeType() { return this; }, text: t }), MimeType: { JSON: 'json' } },
    Logger: { log: s => logs.push(String(s)) },
    DriveApp: {},
  };
  vm.createContext(ctx);
  for (const f of files) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
  const post = body => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify(body) } }).text);
  return { ctx, post, sheets, props, cache, mails, logs, fetches };
};
