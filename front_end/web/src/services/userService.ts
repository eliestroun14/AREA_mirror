// Services API pour la gestion des utilisateurs

interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  isEmailVerified: boolean;
}

interface UpdateUserProfileRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
}

class UserService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }

  private getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  async getUserProfile(token: string): Promise<UserProfile> {
    const response = await fetch(`${this.apiBaseUrl}/users/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `Erreur ${response.status}: Impossible de récupérer le profil`);
    }

    return response.json();
  }

  /**
   * Met à jour le profil de l'utilisateur
   */
  async updateUserProfile(token: string, updates: UpdateUserProfileRequest): Promise<UserProfile> {
    const response = await fetch(`${this.apiBaseUrl}/users/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `Erreur ${response.status}: Impossible de mettre à jour le profil`);
    }

    return response.json();
  }

  /**
   * Change le mot de passe de l'utilisateur
   */
  async changePassword(token: string, passwordData: ChangePasswordRequest): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/users/change-password`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      let errorMessage;
      try {
        const parsedError = JSON.parse(errorData);
        errorMessage = parsedError.message || errorData;
      } catch {
        errorMessage = errorData;
      }
      throw new Error(errorMessage || `Erreur ${response.status}: Impossible de changer le mot de passe`);
    }
  }

  /**
   * Récupère les paramètres de l'utilisateur
   */
  async getUserSettings(token: string): Promise<UserSettings> {
    const response = await fetch(`${this.apiBaseUrl}/users/settings`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
      credentials: 'include',
    });

    if (!response.ok) {
      // Si l'endpoint n'existe pas encore, retourner des valeurs par défaut
      if (response.status === 404) {
        return {
          emailNotifications: true,
          pushNotifications: false,
          marketingEmails: false,
          twoFactorAuth: false,
        };
      }
      const errorData = await response.text();
      throw new Error(errorData || `Erreur ${response.status}: Impossible de récupérer les paramètres`);
    }

    return response.json();
  }

  /**
   * Met à jour les paramètres de l'utilisateur
   */
  async updateUserSettings(token: string, settings: UserSettings): Promise<UserSettings> {
    const response = await fetch(`${this.apiBaseUrl}/users/settings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `Erreur ${response.status}: Impossible de mettre à jour les paramètres`);
    }

    return response.json();
  }

  /**
   * Supprime le compte de l'utilisateur
   */
  async deleteAccount(token: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/users/account`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `Erreur ${response.status}: Impossible de supprimer le compte`);
    }
  }

  /**
   * Demande la vérification de l'email
   */
  async requestEmailVerification(token: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/users/verify-email/request`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `Erreur ${response.status}: Impossible d'envoyer l'email de vérification`);
    }
  }

  /**
   * Vérifie l'email avec le token reçu
   */
  async verifyEmail(token: string, verificationToken: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/users/verify-email`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify({ verificationToken }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `Erreur ${response.status}: Impossible de vérifier l'email`);
    }
  }
}

// Instance singleton du service
export const userService = new UserService();

// Export des types pour utilisation dans les composants
export type { UserProfile, UpdateUserProfileRequest, ChangePasswordRequest, UserSettings };
