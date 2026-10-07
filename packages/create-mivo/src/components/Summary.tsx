import React from 'react';
import { Text, Box } from 'ink';
import figures from 'figures';
import path from 'node:path';
import type { PackageManager } from '../types/index.js';
import { getRunCommand } from '../core/pm.js';

interface SummaryProps {
  projectDir: string;
  adminEmail: string;
  packageManager?: PackageManager;
}

/**
 * Success screen with next steps and run instructions.
 */
export function Summary({
  projectDir,
  adminEmail,
  packageManager = 'pnpm',
}: SummaryProps): React.ReactElement {
  const dir = path.basename(path.resolve(projectDir));

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text color="green" bold>
        🎉 MIVO successfully initialized!
      </Text>
      <Box height={1} />
      <Text bold color="white">
        Next steps:
      </Text>
      <Box marginLeft={2} flexDirection="column">
        <Text color="cyan">1. cd {dir}</Text>
        <Text color="cyan">2. {packageManager} install</Text>
        <Text color="cyan">3. {getRunCommand(packageManager, 'dev')}</Text>
      </Box>
      <Box height={1} />
      <Text dimColor>
        Open <Text underline>http://localhost:3000/login</Text> in your browser.
      </Text>
      <Text dimColor>Administrator: {adminEmail}</Text>
      <Box height={1} />
    </Box>
  );
}
