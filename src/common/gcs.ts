import fs from 'fs';
import path from 'path';
import { environment } from './environment';
import { Storage } from '@google-cloud/storage';

const keyContent = environment.gcp.bucket.key;
const keyFilename = path.join(__dirname, '../../secret/adit-bucket-admin.json');
fs.writeFileSync(keyFilename, keyContent);

export const GCS: Storage = new Storage({ keyFilename });
export const bucketName: string = environment.gcp.bucket.name;
