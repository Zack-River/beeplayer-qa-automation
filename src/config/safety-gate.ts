import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface AuthorizationDoc {
  authorization: {
    type: string;
    authorized_by: string;
    authorized_at: string;
    expires_at: string;
    target_url: string;
    scope: string[];
    test_accounts_confirmed_disposable: boolean;
    destructive_operations_authorized: boolean;
    load_testing_authorized: boolean;
    notes?: string;
  }
}

export class SafetyGate {
  private static parseDoc(filePath: string): AuthorizationDoc {
    if (!fs.existsSync(filePath)) {
      throw new Error(`[SAFETY GATE FAILED] Required authorization document not found: ${filePath}`);
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return yaml.load(fileContent) as AuthorizationDoc;
  }

  private static validateCommon(doc: AuthorizationDoc, targetUrl: string) {
    if (doc.authorization.target_url !== targetUrl) {
      throw new Error(`[SAFETY GATE FAILED] target_url mismatch. Expected ${targetUrl}, got ${doc.authorization.target_url}`);
    }

    const expiresAt = new Date(doc.authorization.expires_at);
    if (expiresAt < new Date()) {
      throw new Error(`[SAFETY GATE FAILED] Authorization document expired at ${expiresAt.toISOString()}`);
    }

    if (doc.authorization.test_accounts_confirmed_disposable !== true) {
      throw new Error(`[SAFETY GATE FAILED] test_accounts_confirmed_disposable must be true.`);
    }
  }

  public static enforceFunctionalProduction(targetUrl: string, baseDir: string = process.cwd()) {
    // Only enforce if we're hitting production
    if (!targetUrl.includes('api.beeplayer1.com')) return;

    const docPath = path.resolve(baseDir, 'docs/execution/production-authorization.md');
    const doc = this.parseDoc(docPath);

    if (doc.authorization.type !== 'functional-production') {
      throw new Error(`[SAFETY GATE FAILED] Document type must be functional-production`);
    }

    this.validateCommon(doc, targetUrl);
  }

  public static enforceLoadProduction(targetUrl: string, baseDir: string = process.cwd()) {
    // Only enforce if we're hitting production
    if (!targetUrl.includes('api.beeplayer1.com')) return;

    // Must pass functional first (SR-02 rule)
    this.enforceFunctionalProduction(targetUrl, baseDir);

    const docPath = path.resolve(baseDir, 'docs/execution/load-production-approval.md');
    const doc = this.parseDoc(docPath);

    if (doc.authorization.type !== 'load-production') {
      throw new Error(`[SAFETY GATE FAILED] Document type must be load-production`);
    }

    if (doc.authorization.load_testing_authorized !== true) {
      throw new Error(`[SAFETY GATE FAILED] load_testing_authorized must be true.`);
    }

    if (doc.authorization.destructive_operations_authorized === true) {
      throw new Error(`[SAFETY GATE FAILED] Destructive operations can never be authorized for load tests.`);
    }

    this.validateCommon(doc, targetUrl);
  }
}
