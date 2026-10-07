import { exec, type ExecOptions } from 'node:child_process';
import { promisify } from 'node:util';

const rawExec = promisify(exec);

/**
 * Asynchronously execute a command with promise-based handling.
 * Does not block the Node.js event loop, allowing spinners and Ink animations
 * to run smoothly without freezing.
 */
export async function execAsync(
  command: string,
  options: ExecOptions = {},
): Promise<{ stdout: string; stderr: string }> {
  const result = await rawExec(command, {
    maxBuffer: 20 * 1024 * 1024,
    encoding: 'utf8',
    ...options,
  });
  return {
    stdout: String(result.stdout),
    stderr: String(result.stderr),
  };
}
