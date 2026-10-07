import React, { useState } from 'react';
import { Text, Box, useInput } from 'ink';
import TextInput from 'ink-text-input';
import figures from 'figures';

interface ProjectPromptProps {
  initialDir?: string;
  onSubmit: (dir: string) => void;
}

/**
 * Directory and project name input prompt.
 */
export function ProjectPrompt({
  initialDir = 'mivo-app',
  onSubmit,
}: ProjectPromptProps): React.ReactElement {
  const [value, setValue] = useState(initialDir);
  const [error, setError] = useState('');

  const handleSubmit = (val: string) => {
    if (!val.trim()) {
      setError('Project directory is required');
      return;
    }
    setError('');
    onSubmit(val.trim());
  };

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text color="magenta">{figures.pointer}</Text>
        <Text bold> Project directory: </Text>
      </Box>
      <Box marginLeft={4}>
        <TextInput value={value} onChange={setValue} onSubmit={handleSubmit} />
      </Box>
      {error && (
        <Box marginLeft={4}>
          <Text color="red">{figures.cross} {error}</Text>
        </Box>
      )}
    </Box>
  );
}
