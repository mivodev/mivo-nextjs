import React from 'react';
import { Text, Box } from 'ink';
import figures from 'figures';
import type { DoctorResult } from '../types/index.js';

interface DoctorCheckProps {
  result: DoctorResult;
}

/**
 * Environment preflight verification display.
 * Shows pass/fail status for Node.js version and directory permissions.
 */
export function DoctorCheck({ result }: DoctorCheckProps): React.ReactElement {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text color={result.nodeOk ? 'green' : 'red'}>
          {result.nodeOk ? figures.tick : figures.cross}
        </Text>
        <Text> Node.js runtime </Text>
        <Text dimColor>({result.nodeVersion})</Text>
      </Box>
      <Box>
        <Text color={result.dirWritable ? 'green' : 'red'}>
          {result.dirWritable ? figures.tick : figures.cross}
        </Text>
        <Text> Directory permissions </Text>
        <Text dimColor>verified</Text>
      </Box>
    </Box>
  );
}
