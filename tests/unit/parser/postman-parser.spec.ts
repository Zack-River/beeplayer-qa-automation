import { test, expect } from '@playwright/test';
import { PostmanParser } from '../../../src/parser/postman-parser';
import * as fs from 'fs';
import * as path from 'path';

test.describe('PostmanParser Unit Tests', () => {
  const mockCollectionPath = path.join(__dirname, 'mock-collection.json');

  test.beforeAll(() => {
    // Create a mock postman collection
    const mockData = {
      info: {
        name: "Mock Collection"
      },
      item: [
        {
          name: "Folder 1",
          item: [
            {
              name: "Get Health",
              request: {
                method: "GET",
                url: {
                  raw: "https://api.mock.com/health"
                },
                auth: {
                  type: "noauth"
                }
              }
            }
          ]
        },
        {
          name: "Login",
          request: {
            method: "POST",
            url: {
              raw: "https://api.mock.com/login"
            },
            auth: {
              type: "none"
            }
          }
        }
      ]
    };
    fs.writeFileSync(mockCollectionPath, JSON.stringify(mockData, null, 2));
  });

  test.afterAll(() => {
    // Cleanup
    if (fs.existsSync(mockCollectionPath)) {
      fs.unlinkSync(mockCollectionPath);
    }
  });

  test('should correctly parse folders and requests', () => {
    const parser = new PostmanParser(mockCollectionPath);
    const results = parser.parse();

    expect(results).toHaveLength(2);
    
    expect(results[0].name).toBe('Get Health');
    expect(results[0].folder).toBe('Folder 1');
    expect(results[0].method).toBe('GET');
    expect(results[0].auth).toBe('noauth');
    expect(results[0].id).toBe('001');

    expect(results[1].name).toBe('Login');
    expect(results[1].folder).toBe('');
    expect(results[1].method).toBe('POST');
    expect(results[1].id).toBe('002');
  });
});
