import { z } from 'zod';
import yaml from 'yaml';
import fs from 'fs';

const raw = fs.readFileSync('/tmp/agra_new.md', 'utf8');
const fm = raw.split('---')[1];
const data = yaml.parse(fm);

const regionSchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  z.enum(['Eastern', 'Central', 'Southwest and Hawaii', 'Northwest']).optional()
);

try {
  const r = regionSchema.parse(data.region);
  console.log('region field (new commit) parses OK, value:', JSON.stringify(r));
} catch (e) {
  console.log('region FAILED:', e.errors ? e.errors[0].message : e.message);
}
console.log('raw region value was:', JSON.stringify(data.region));
console.log('attributionHref now:', data.lyric.attributionHref);
