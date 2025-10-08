import { DiscordStrategy } from './discord.strategy';
import { Profile } from 'passport-discord-auth';

describe('DiscordStrategy', () => {
  let strategy: DiscordStrategy;

  beforeEach(() => {
    strategy = new DiscordStrategy();
  });

  describe('validate', () => {
    it('should return Discord provider with all fields', () => {
      const mockProfile = {
        id: 'discord-user-123',
        username: 'testuser',
        emails: [{ value: 'test@discord.com' }],
        photos: [{ value: 'https://example.com/photo.jpg' }],
      } as any;

      const result = strategy.validate(
        'access_token_123',
        'refresh_token_456',
        mockProfile,
      );

      expect(result).toEqual({
        connection_name: 'Discord',
        account_identifier: 'discord-user-123',
        email: 'test@discord.com',
        username: 'testuser',
        picture: 'https://example.com/photo.jpg',
        rate_limit_remaining: undefined,
        rate_limit_reset: null,
        access_token: 'access_token_123',
        refresh_token: 'refresh_token_456',
        expires_at: null,
        scopes: ['email', 'identify'],
      });
    });

    it('should handle profile without email', () => {
      const mockProfile = {
        id: 'discord-user-456',
        username: 'testuser2',
        emails: undefined,
        photos: [{ value: 'https://example.com/photo2.jpg' }],
      } as any;

      const result = strategy.validate(
        'access_token_456',
        'refresh_token_456',
        mockProfile,
      );

      expect(result.email).toBe('none');
      expect(result.account_identifier).toBe('discord-user-456');
    });

    it('should handle profile without username', () => {
      const mockProfile = {
        id: 'discord-user-789',
        username: '',
        emails: [{ value: 'test@example.com' }],
        photos: [{ value: 'https://example.com/photo3.jpg' }],
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
        id: 'discord-user-101',
        username: 'testuser3',
        emails: [{ value: 'test@example.com' }],
        photos: undefined,
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
        id: 'discord-user-202',
        username: 'testuser4',
        emails: [],
        photos: [{ value: 'https://example.com/photo4.jpg' }],
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
        id: 'discord-user-303',
        username: 'testuser5',
        emails: [{ value: 'test@example.com' }],
        photos: [],
      } as any;

      const result = strategy.validate(
        'access_token_303',
        'refresh_token_303',
        mockProfile,
      );

      expect(result.picture).toBe('/assets/placeholder.png');
    });

    it('should always set connection_name to Discord', () => {
      const mockProfile = {
        id: 'test-id',
        username: 'testuser',
        emails: [{ value: 'test@example.com' }],
        photos: [{ value: 'photo.jpg' }],
      } as any;

      const result = strategy.validate('token', 'refresh', mockProfile);

      expect(result.connection_name).toBe('Discord');
    });

    it('should always include email and identify scopes', () => {
      const mockProfile = {
        id: 'test-id',
        username: 'testuser',
        emails: [{ value: 'test@example.com' }],
      } as any;

      const result = strategy.validate('token', 'refresh', mockProfile);

      expect(result.scopes).toEqual(['email', 'identify']);
    });

    it('should set expires_at to null', () => {
      const mockProfile = {
        id: 'test-id',
        username: 'testuser',
        emails: [{ value: 'test@example.com' }],
      } as any;

      const result = strategy.validate('token', 'refresh', mockProfile);

      expect(result.expires_at).toBeNull();
    });

    it('should set rate_limit_reset to null', () => {
      const mockProfile = {
        id: 'test-id',
        username: 'testuser',
        emails: [{ value: 'test@example.com' }],
      } as any;

      const result = strategy.validate('token', 'refresh', mockProfile);

      expect(result.rate_limit_reset).toBeNull();
    });

    it('should set rate_limit_remaining to undefined', () => {
      const mockProfile = {
        id: 'test-id',
        username: 'testuser',
        emails: [{ value: 'test@example.com' }],
      } as any;

      const result = strategy.validate('token', 'refresh', mockProfile);

      expect(result.rate_limit_remaining).toBeUndefined();
    });

    it('should pass through access_token and refresh_token', () => {
      const mockProfile = {
        id: 'test-id',
        username: 'testuser',
        emails: [{ value: 'test@example.com' }],
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
