import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authManager } from '../../utils/auth';

// Mock fetch
global.fetch = vi.fn();

describe('AuthManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any stored data
    sessionStorage.clear();
    document.cookie = '';
  });

  describe('Token Management', () => {
    it('should store tokens securely', () => {
      const token = {
        access_token: 'test-access',
        refresh_token: 'test-refresh',
        expires_in: 3600,
        token_type: 'Bearer'
      };

      authManager.setSecureToken(token);
      
      expect(authManager.getAuthHeader()).toBe('Bearer test-access');
    });

    it('should return null when no token is available', () => {
      expect(authManager.getAuthHeader()).toBeNull();
    });
  });

  describe('User Management', () => {
    it('should update user data', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        permissions: ['read']
      };

      authManager.updateUser(user);
      expect(authManager.getCurrentUser()).toEqual(user);
    });

    it('should handle partial user updates', () => {
      const initialUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        permissions: ['read']
      };

      authManager.updateUser(initialUser);

      const update = { name: 'Updated Name' };
      authManager.updateUser(update);

      const updatedUser = authManager.getCurrentUser();
      expect(updatedUser?.name).toBe('Updated Name');
      expect(updatedUser?.email).toBe('test@example.com');
    });
  });

  describe('Permissions', () => {
    it('should check user permissions correctly', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        permissions: ['read', 'write', 'admin']
      };

      authManager.updateUser(user);

      expect(authManager.hasPermission('read')).toBe(true);
      expect(authManager.hasPermission('write')).toBe(true);
      expect(authManager.hasPermission('admin')).toBe(true);
      expect(authManager.hasPermission('delete')).toBe(false);
    });

    it('should check user roles correctly', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        permissions: ['read', 'write', 'admin']
      };

      authManager.updateUser(user);

      expect(authManager.hasRole('admin')).toBe(true);
      expect(authManager.hasRole('user')).toBe(false);
    });
  });

  describe('Security', () => {
    it('should clear all auth data on security incident', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        permissions: ['read']
      };

      authManager.updateUser(user);
      expect(authManager.getCurrentUser()).toBeTruthy();

      authManager.clearAllAuthData();
      expect(authManager.getCurrentUser()).toBeNull();
      expect(authManager.getAuthHeader()).toBeNull();
    });
  });
}); 