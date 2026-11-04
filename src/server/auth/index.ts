import 'server-only';
import { getDb } from '@/server/db';
import { createAuth, parseAuthEnvironment } from './config';
let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() { return instance ??= createAuth(getDb(), parseAuthEnvironment()); }
