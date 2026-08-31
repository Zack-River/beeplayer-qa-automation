import { PostmanParser } from './postman-parser';
import * as fs from 'fs';
import * as path from 'path';

const collectionPath = path.resolve(__dirname, '../../collections/beeplayer-api.postman_collection.json');
const outputPath = path.resolve(__dirname, '../models/normalized-api.json');

const parser = new PostmanParser(collectionPath);
const results = parser.parse();

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`Successfully normalized ${results.length} endpoints to ${outputPath}`);
