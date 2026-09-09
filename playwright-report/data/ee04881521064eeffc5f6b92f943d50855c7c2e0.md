# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow/customer-playlist.spec.ts >> Workflow Tests - Playlist Lifecycle (SCN-W-02 / CWF-07) >> TC-W-02: End-to-end Playlist Creation, Modification, and Deletion
- Location: tests/workflow/customer-playlist.spec.ts:29:7

# Error details

```
TypeError: Cannot read properties of undefined (reading 'includes')
```

# Test source

```ts
  1  | import * as fs from 'fs';
  2  | import * as path from 'path';
  3  | import * as yaml from 'js-yaml';
  4  | 
  5  | export interface AuthorizationDoc {
  6  |   authorization: {
  7  |     type: string;
  8  |     authorized_by: string;
  9  |     authorized_at: string;
  10 |     expires_at: string;
  11 |     target_url: string;
  12 |     scope: string[];
  13 |     test_accounts_confirmed_disposable: boolean;
  14 |     destructive_operations_authorized: boolean;
  15 |     load_testing_authorized: boolean;
  16 |     notes?: string;
  17 |   }
  18 | }
  19 | 
  20 | export class SafetyGate {
  21 |   private static parseDoc(filePath: string): AuthorizationDoc {
  22 |     if (!fs.existsSync(filePath)) {
  23 |       throw new Error(`[SAFETY GATE FAILED] Required authorization document not found: ${filePath}`);
  24 |     }
  25 |     const fileContent = fs.readFileSync(filePath, 'utf-8');
  26 |     return yaml.load(fileContent) as AuthorizationDoc;
  27 |   }
  28 | 
  29 |   private static validateCommon(doc: AuthorizationDoc, targetUrl: string) {
  30 |     if (doc.authorization.target_url !== targetUrl) {
  31 |       throw new Error(`[SAFETY GATE FAILED] target_url mismatch. Expected ${targetUrl}, got ${doc.authorization.target_url}`);
  32 |     }
  33 | 
  34 |     const expiresAt = new Date(doc.authorization.expires_at);
  35 |     if (expiresAt < new Date()) {
  36 |       throw new Error(`[SAFETY GATE FAILED] Authorization document expired at ${expiresAt.toISOString()}`);
  37 |     }
  38 | 
  39 |     if (doc.authorization.test_accounts_confirmed_disposable !== true) {
  40 |       throw new Error(`[SAFETY GATE FAILED] test_accounts_confirmed_disposable must be true.`);
  41 |     }
  42 |   }
  43 | 
  44 |   public static enforceFunctionalProduction(targetUrl: string, baseDir: string = process.cwd()) {
  45 |     // Only enforce if we're hitting production
> 46 |     if (!targetUrl.includes('api.beeplayer1.com')) return;
     |                    ^ TypeError: Cannot read properties of undefined (reading 'includes')
  47 | 
  48 |     const docPath = path.resolve(baseDir, 'docs/execution/production-authorization.md');
  49 |     const doc = this.parseDoc(docPath);
  50 | 
  51 |     if (doc.authorization.type !== 'functional-production') {
  52 |       throw new Error(`[SAFETY GATE FAILED] Document type must be functional-production`);
  53 |     }
  54 | 
  55 |     this.validateCommon(doc, targetUrl);
  56 |   }
  57 | 
  58 |   public static enforceLoadProduction(targetUrl: string, baseDir: string = process.cwd()) {
  59 |     // Only enforce if we're hitting production
  60 |     if (!targetUrl.includes('api.beeplayer1.com')) return;
  61 | 
  62 |     // Must pass functional first (SR-02 rule)
  63 |     this.enforceFunctionalProduction(targetUrl, baseDir);
  64 | 
  65 |     const docPath = path.resolve(baseDir, 'docs/execution/load-production-approval.md');
  66 |     const doc = this.parseDoc(docPath);
  67 | 
  68 |     if (doc.authorization.type !== 'load-production') {
  69 |       throw new Error(`[SAFETY GATE FAILED] Document type must be load-production`);
  70 |     }
  71 | 
  72 |     if (doc.authorization.load_testing_authorized !== true) {
  73 |       throw new Error(`[SAFETY GATE FAILED] load_testing_authorized must be true.`);
  74 |     }
  75 | 
  76 |     if (doc.authorization.destructive_operations_authorized === true) {
  77 |       throw new Error(`[SAFETY GATE FAILED] Destructive operations can never be authorized for load tests.`);
  78 |     }
  79 | 
  80 |     this.validateCommon(doc, targetUrl);
  81 |   }
  82 | }
  83 | 
```