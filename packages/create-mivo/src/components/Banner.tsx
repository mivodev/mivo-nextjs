import React from 'react';
import { Text, Box } from 'ink';
import gradientString from 'gradient-string';

const ASCII_LOGO = `
  __  __ _____ _    _  ____  
 |  \\/  |_   _| |  | |/ __ \\ 
 | \\  / | | | | |  | | |  | |
 | |\\/| | | | \\ \\  / / |  | |
 | |  | |_| |_ \\ \\/ /| |__| |
 |_|  |_|_____| \\__/  \\____/ 
`;

const mivoGradient = gradientString(['#6366f1', '#8b5cf6', '#a855f7']);

/**
 * ASCII art header with gradient coloring.
 */
export function Banner(): React.ReactElement {
  const coloredLogo = mivoGradient(ASCII_LOGO);

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text>{coloredLogo}</Text>
      <Text dimColor>  Next-Gen MikroTik Voucher Management Platform</Text>
    </Box>
  );
}
