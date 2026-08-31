import * as fs from 'fs';

export interface NormalizedRequest {
  id: string;
  folder: string;
  name: string;
  method: string;
  url: string;
  auth: string; // 'none', 'bearer', etc
  body?: string;
}

export class PostmanParser {
  private collectionPath: string;

  constructor(collectionPath: string) {
    this.collectionPath = collectionPath;
  }

  public parse(): NormalizedRequest[] {
    const rawData = fs.readFileSync(this.collectionPath, 'utf-8');
    const collection = JSON.parse(rawData);
    
    const requests: NormalizedRequest[] = [];
    let counter = 1;

    // Recursive function to handle nested folders
    const traverse = (items: any[], currentFolder: string) => {
      for (const item of items) {
        if (item.item) {
          // It's a folder
          const folderName = currentFolder ? `${currentFolder} / ${item.name}` : item.name;
          traverse(item.item, folderName);
        } else if (item.request) {
          // It's a request
          const req = item.request;
          
          let authType = 'none';
          if (req.auth) {
            authType = req.auth.type;
          }

          let urlStr = '';
          if (typeof req.url === 'string') {
            urlStr = req.url;
          } else if (req.url && req.url.raw) {
            urlStr = req.url.raw;
          }

          requests.push({
            id: counter.toString().padStart(3, '0'),
            folder: currentFolder,
            name: item.name,
            method: req.method,
            url: urlStr,
            auth: authType,
            body: req.body?.raw || undefined
          });
          counter++;
        }
      }
    };

    if (collection.item) {
      traverse(collection.item, '');
    }

    return requests;
  }
}
