import { APIRequestContext } from '@playwright/test';

export interface AuthContext {
  token: string;
  type: 'admin' | 'reseller' | 'customer';
  id?: string; // resellerId or customerId
}

export class AuthManager {
  public static async loginAdmin(request: APIRequestContext, baseUrl: string): Promise<AuthContext> {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(`[DATA_FAILURE] Missing Admin credentials in environment.`);
    }

    const response = await request.post(`${baseUrl}/auth/login`, {
      data: { email, password }
    });

    if (!response.ok()) {
      throw new Error(`[PRODUCT_FAILURE] Admin login failed: ${response.status()}`);
    }

    const json = await response.json();
    // Implementation per Phase 1 evidence (EV-001)
    const token = json.access_token || json.token || (json.data && json.data.access_token);

    if (!token) {
      throw new Error(`[PRODUCT_FAILURE] Token extraction failed for Admin login.`);
    }

    return { token, type: 'admin' };
  }
}
