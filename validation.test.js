const test = require('node:test');
const assert = require('node:assert/strict');
test('scope examples contain only permitted target characters', () => {
  const safe = /^[a-zA-Z0-9.:/\-\[\]]{1,255}$/;
  ['192.168.10.0/24','server01.local','2001:db8::1'].forEach(value => assert.ok(safe.test(value)));
  ['127.0.0.1 & whoami','; powershell'].forEach(value => assert.ok(!safe.test(value)));
});
