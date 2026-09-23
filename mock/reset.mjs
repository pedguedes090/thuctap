import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const seed = await readFile(join(here, 'seed.json'), 'utf8');

await writeFile(join(here, 'db.json'), seed);

console.log('Đã khôi phục mock/db.json từ mock/seed.json');
