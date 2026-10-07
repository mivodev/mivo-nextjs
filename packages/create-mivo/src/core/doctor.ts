import fs from 'node:fs';
import path from 'node:path';
import type { DoctorResult } from '../types/index.js';

const MIN_NODE_MAJOR = 20;

/**
 * Verify the runtime environment meets all prerequisites:
 * - Node.js >= 20.0.0
 * - Target directory is writable
 */
export function runDoctor(projectDir: string): DoctorResult {
  // 1. Node.js version check
  const nodeVersion = process.version; // e.g. "v22.12.0"
  const majorStr = nodeVersion.replace('v', '').split('.')[0];
  const major = parseInt(majorStr ?? '0', 10);
  const nodeOk = major >= MIN_NODE_MAJOR;

  // 2. Directory existence & write permissions
  const resolved = path.resolve(projectDir);
  const parentDir = path.dirname(resolved);
  const dirExists = fs.existsSync(resolved);

  let dirWritable = false;
  try {
    // Check the parent directory is writable (so we can create the project folder)
    const checkDir = dirExists ? resolved : parentDir;
    fs.accessSync(checkDir, fs.constants.W_OK);
    dirWritable = true;
  } catch {
    dirWritable = false;
  }

  return {
    nodeVersion,
    nodeOk,
    dirWritable,
    dirExists,
    allPassed: nodeOk && dirWritable,
  };
}
