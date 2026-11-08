import assert from 'node:assert';
import { test } from 'node:test';
import { AuthService } from './authService';
import { UserRole } from '../types';

test('AuthService.signUp creates a user with correct role and governorate', async () => {
  const result = await AuthService.signUp({
    name: 'حيدر الكرخي',
    email: 'haider@test.iq',
    role: 'JOB_SEEKER',
    governorate: 'بغداد (Baghdad)',
    city: 'المنصور',
  });

  assert.strictEqual(result.error, null);
  assert.ok(result.user);
  assert.strictEqual(result.user?.name, 'حيدر الكرخي');
  assert.strictEqual(result.user?.role, 'JOB_SEEKER');
  assert.strictEqual(result.user?.governorate, 'بغداد (Baghdad)');
});

test('AuthService.signIn retrieves existing mock user profile', async () => {
  const result = await AuthService.signIn('ali.hassan@mizn.iq');
  assert.strictEqual(result.error, null);
  assert.ok(result.user);
  assert.strictEqual(result.user?.email, 'ali.hassan@mizn.iq');
  assert.strictEqual(result.user?.role, 'JOB_SEEKER');
});

test('AuthService.hasPermission validates RBAC permissions correctly', () => {
  // SUPER_ADMIN has access to everything
  assert.strictEqual(AuthService.hasPermission('SUPER_ADMIN', 'COMPANY_OWNER'), true);
  assert.strictEqual(AuthService.hasPermission('SUPER_ADMIN', 'ADMIN'), true);

  // JOB_SEEKER cannot perform COMPANY_OWNER or SUPER_ADMIN actions
  assert.strictEqual(AuthService.hasPermission('JOB_SEEKER', 'SUPER_ADMIN'), false);
  assert.strictEqual(AuthService.hasPermission('JOB_SEEKER', 'COMPANY_OWNER'), false);

  // Array of allowed roles
  const allowedRoles: UserRole[] = ['COMPANY_OWNER', 'RECRUITER', 'SUPER_ADMIN'];
  assert.strictEqual(AuthService.hasPermission('COMPANY_OWNER', allowedRoles), true);
  assert.strictEqual(AuthService.hasPermission('JOB_SEEKER', allowedRoles), false);
});
