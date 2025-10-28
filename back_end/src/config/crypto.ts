import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

interface EncryptedTokenData {
  jwt: string;
  platform?: string;
  exp: number;
}

export class Crypto {
  private static readonly ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY!;
  private static readonly ALGORITHM = 'aes-256-gcm';

  /**
   * Chiffre le JWT avec AES-256-GCM
   */
  static encryptJWT(jwt: string, platform?: string): string {
    const iv = randomBytes(16);

    const cipher = createCipheriv(
      this.ALGORITHM,
      Buffer.from(this.ENCRYPTION_KEY, 'hex'),
      iv,
    );

    const data: EncryptedTokenData = {
      jwt,
      platform,
      exp: Date.now() + 300000,
    };

    const dataString = JSON.stringify(data);
    let encrypted = cipher.update(dataString, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    const result = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    return Buffer.from(result).toString('base64url');
  }

  static decryptJWT(
    encryptedToken: string | undefined,
  ): { jwt: string; platform?: string } | null {
    if (!encryptedToken || typeof encryptedToken !== 'string') {
      console.error('decryptJWT: No token provided');
      return null;
    }
    try {
      const decoded = Buffer.from(encryptedToken, 'base64url').toString('utf8');
      const [ivHex, authTagHex, encrypted] = decoded.split(':');

      if (!ivHex || !authTagHex || !encrypted) {
        return null;
      }

      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');

      const decipher = createDecipheriv(
        this.ALGORITHM,
        Buffer.from(this.ENCRYPTION_KEY, 'hex'),
        iv,
      );

      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      const data = JSON.parse(decrypted) as EncryptedTokenData;

      if (typeof data.jwt !== 'string') {
        console.error('Invalid token structure: missing or invalid jwt');
        return null;
      }

      if (data.exp && Date.now() > data.exp) {
        console.warn('Encrypted token expired');
        return null;
      }

      return {
        jwt: data.jwt,
        platform: data.platform,
      };
    } catch (error) {
      console.error('Failed to decrypt token:', error);
      return null;
    }
  }
}
