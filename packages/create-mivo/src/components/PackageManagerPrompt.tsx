import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import figures from 'figures';
import type { PackageManager } from '../types/index.js';

interface PackageManagerPromptProps {
  initial?: PackageManager;
  onSubmit: (pm: PackageManager) => void;
}

interface ItemType {
  label: string;
  value: PackageManager;
}

const ITEMS: ItemType[] = [
  { label: 'pnpm (Recommended)', value: 'pnpm' },
  { label: 'npm', value: 'npm' },
  { label: 'bun', value: 'bun' },
  { label: 'yarn', value: 'yarn' },
];

export function PackageManagerPrompt({
  initial = 'pnpm',
  onSubmit,
}: PackageManagerPromptProps): React.ReactElement {
  const initialIndex = Math.max(
    0,
    ITEMS.findIndex((item) => item.value === initial),
  );

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text color="magenta">{figures.pointer}</Text>
        <Text bold> Package manager: </Text>
      </Box>
      <Box marginLeft={2}>
        <SelectInput<PackageManager>
          items={ITEMS}
          initialIndex={initialIndex}
          onSelect={(item) => onSubmit(item.value)}
        />
      </Box>
    </Box>
  );
}
