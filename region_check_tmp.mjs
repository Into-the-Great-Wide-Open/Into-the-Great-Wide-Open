import { z } from 'zod';
const regionSchema = z.enum(['Eastern', 'Central', 'Southwest and Hawaii', 'Northwest']).optional();
try {
  const r = regionSchema.parse('');
  console.log('PASSED with value:', JSON.stringify(r));
} catch (e) {
  console.log('FAILED:', e.errors ? e.errors[0].message : e.message);
}
