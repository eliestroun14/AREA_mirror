import { GmailStrategy } from './gmail.strategy';
import { Profile } from 'passport-google-oauth20';

describe('GmailStrategy', () => {
  let strategy: GmailStrategy;

  beforeEach(() => {
    strategy = new GmailStrategy();
  });

  describe('validate', () => {
    it('should return Gmail provider with all fields', () => {
      const mockProfile = {
        id: 'google-user-123',
        displayName: 'Test User',
        emails: [{ value: 'test@gmail.com', verified: true }],
        photos: [{ value: 'https://example.com/photo.jpg' }],
        username: 'testuser',
        provider: 'google',
        profileUrl: 'https://plus.google.com/profile',
        _json: {
          iss: 'https://accounts.google.com',
          aud: 'client-id',
          sub: 'google-user-123',
          iat: 1234567890,
          exp: 1234567890,
        },
        _raw: '',
      } as any;

      const result = strategy.validate(
        'access_token_123',
        'refresh_token_456',
        mockProfile,
      );

      expect(result).toEqual({
        connection_name: 'Gmail',
        account_identifier: 'google-user-123',
        email: 'test@gmail.com',
        username: 'testuser',
        picture: 'https://example.com/photo.jpg',
        rate_limit_remaining: undefined,
        rate_limit_reset: null,
        access_token: 'access_token_123',
        refresh_token: 'refresh_token_456',
        expires_at: null,
        scopes: ['email'],
      });
    });

    it('should handle profile without email', () => {
      const mockProfile = {
        id: 'google-user-456',
        displayName: 'No Email User',
        emails: undefined,
        provider: 'google',
      } as any;

      const result = strategy.validate(
        'access_token_456',
        'refresh_token_456',
        mockProfile,
      );

      expect(result.email).toBe('none');
      expect(result.account_identifier).toBe('google-user-456');
    });

    it('should handle profile without username', () => {
      const mockProfile = {
        id: 'google-user-789',
        displayName: 'No Username User',
        emails: [{ value: 'test@example.com', verified: true }],
        provider: 'google',
        username: undefined,
      } as any;

      const result = strategy.validate(
        'access_token_789',
        'refresh_token_789',
        mockProfile,
      );

      expect(result.username).toBe('');
    });

    it('should handle profile without photo', () => {
      const mockProfile = {
        id: 'google-user-101',
        displayName: 'No Photo User',
        emails: [{ value: 'test@example.com', verified: true }],
        photos: undefined,
        provider: 'google',
      } as any;

      const result = strategy.validate(
        'access_token_101',
        'refresh_token_101',
        mockProfile,
      );

      expect(result.picture).toBe('/assets/placeholder.png');
    });

    it('should handle empty email array', () => {
      const mockProfile = {
        id: 'google-user-202',
        displayName: 'Empty Email Array',
        emails: [],
        provider: 'google',
      } as any;

      const result = strategy.validate(
        'access_token_202',
        'refresh_token_202',
        mockProfile,
      );

      expect(result.email).toBe('none');
    });

    it('should handle empty photos array', () => {
      const mockProfile = {
        id: 'google-user-303',
        displayName: 'Empty Photos Array',
        emails: [{ value: 'test@example.com', verified: true }],
        photos: [],
        provider: 'google',
      } as any;

      const result = strategy.validate(
        'access_token_303',
        'refresh_token_303',
        mockProfile,
      );

      expect(result.picture).toBe('/assets/placeholder.png');
    });

    it('should always set connection_name to Gmail', () => {
      const mockProfile = {
        id: 'test-id',
        displayName: 'Test User',
        emails: [{ value: 'test@example.com', verified: true }],
        photos: [{ value: 'photo.jpg' }],
        provider: 'google',
      } as any;

      const result = strategy.validate('token', 'refresh', mockProfile);

      expect(result.connection_name).toBe('Gmail');
    });

    it('should always include email scope', () => {
      const mockProfile = {
        id: 'test-id',
        displayName: 'Test User',
        emails: [{ value: 'test@example.com', verified: true }],
        provider: 'google',
      } as any;

      const result = strategy.validate('token', 'refresh', mockProfile);

      expect(result.scopes).toEqual(['email']);
    });

    it('should set expires_at to null', () => {
      const mockProfile = {
        id: 'test-id',
        displayName: 'Test User',
        emails: [{ value: 'test@example.com', verified: true }],
        provider: 'google',
      } as any;

      const result = strategy.validate('token', 'refresh', mockProfile);

      expect(result.expires_at).toBeNull();
    });

    it('should set rate_limit_reset to null', () => {
      const mockProfile = {
        id: 'test-id',
        displayName: 'Test User',
        emails: [{ value: 'test@example.com', verified: true }],
        provider: 'google',
      } as any;

      const result = strategy.validate('token', 'refresh', mockProfile);

      expect(result.rate_limit_reset).toBeNull();
    });

    it('should set rate_limit_remaining to undefined', () => {
      const mockProfile = {
        id: 'test-id',
        displayName: 'Test User',
        emails: [{ value: 'test@example.com', verified: true }],
        provider: 'google',
      } as any;

      const result = strategy.validate('token', 'refresh', mockProfile);

      expect(result.rate_limit_remaining).toBeUndefined();
    });

    it('should pass through access_token and refresh_token', () => {
      const mockProfile = {
        id: 'test-id',
        displayName: 'Test User',
        emails: [{ value: 'test@example.com', verified: true }],
        provider: 'google',
      } as any;

      const result = strategy.validate(
        'custom_access_token',
        'custom_refresh_token',
        mockProfile,
      );

      expect(result.access_token).toBe('custom_access_token');
      expect(result.refresh_token).toBe('custom_refresh_token');
    });
  });
});
