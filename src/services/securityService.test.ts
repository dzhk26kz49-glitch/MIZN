import assert from 'node:assert';
import { test } from 'node:test';
import { SecurityService } from './securityService';

test('SecurityService.validateFileUpload permits valid PDF and image files <= 5MB', () => {
  const validPdf = { name: 'cv.pdf', size: 2 * 1024 * 1024, type: 'application/pdf' };
  const result = SecurityService.validateFileUpload(validPdf);
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.error, null);
});

test('SecurityService.validateFileUpload rejects malicious extensions and oversized files', () => {
  const dangerousFile = { name: 'script.exe', size: 1000, type: 'application/x-msdownload' };
  const res1 = SecurityService.validateFileUpload(dangerousFile);
  assert.strictEqual(res1.valid, false);
  assert.ok(res1.error?.includes('غير مدعوم'));

  const oversizedPdf = { name: 'large_cv.pdf', size: 10 * 1024 * 1024, type: 'application/pdf' };
  const res2 = SecurityService.validateFileUpload(oversizedPdf);
  assert.strictEqual(res2.valid, false);
  assert.ok(res2.error?.includes('يتجاوز'));
});

test('SecurityService.checkRateLimit blocks requests exceeding limits in window', () => {
  const clientId = 'client-test-rate-limit';
  const limit = 3;

  assert.strictEqual(SecurityService.checkRateLimit(clientId, limit, 10000).allowed, true);
  assert.strictEqual(SecurityService.checkRateLimit(clientId, limit, 10000).allowed, true);
  assert.strictEqual(SecurityService.checkRateLimit(clientId, limit, 10000).allowed, true);

  // 4th request should be blocked
  const fourth = SecurityService.checkRateLimit(clientId, limit, 10000);
  assert.strictEqual(fourth.allowed, false);
  assert.strictEqual(fourth.remaining, 0);
});

test('SecurityService logs security events accurately', () => {
  const event = SecurityService.logSecurityEvent('UNAUTHORIZED_ACCESS', 'HIGH', 'Test Unauthorized Access Event');
  assert.strictEqual(event.eventType, 'UNAUTHORIZED_ACCESS');
  assert.strictEqual(event.severity, 'HIGH');
  assert.ok(SecurityService.getSecurityEvents().some(e => e.id === event.id));
});
