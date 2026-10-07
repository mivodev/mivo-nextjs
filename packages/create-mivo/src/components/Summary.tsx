import React from 'react';
import { Text, Box } from 'ink';
import figures from 'figures';
import path from 'node:path';

interface SummaryProps {
  projectDir: string;
  adminEmail: string;
}

/**
 * Success screen with next steps and run instructions.
 */
export function Summary({
  projectDir,
  adminEmail,
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
        <Text color="cyan">2. pnpm install</Text>
        <Text color="cyan">3. pnpm dev</Text>
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
