import React, { useState } from 'react';
import { Text, Box } from 'ink';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';
import figures from 'figures';
import { generateSecret } from '../core/env.js';

interface SecretPromptProps {
  initialSecret?: string;
  onSubmit: (secret: string) => void;
}

interface SelectItem {
  label: string;
  value: 'keep' | 'regenerate' | 'custom';
}

/**
 * Cryptographic secret viewer & selector using ink-select-input.
 * Allows keeping the key, regenerating a fresh key, or entering a custom key.
 */
export function SecretPrompt({
  initialSecret,
  onSubmit,
}: SecretPromptProps): React.ReactElement {
  const [secret, setSecret] = useState(() => initialSecret || generateSecret());
  const [isEnteringCustom, setIsEnteringCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [error, setError] = useState('');

  const items: SelectItem[] = [
    { label: `${figures.tick} Keep this key & proceed`, value: 'keep' },
    { label: `↻ Regenerate fresh 32-byte key`, value: 'regenerate' },
    { label: `✎ Enter custom secret key`, value: 'custom' },
  ];

  const handleSelect = (item: SelectItem) => {
    if (item.value === 'keep') {
      onSubmit(secret);
    } else if (item.value === 'regenerate') {
      const fresh = generateSecret();
      setSecret(fresh);
    } else if (item.value === 'custom') {
      setIsEnteringCustom(true);
    }
  };

  const handleCustomSubmit = (val: string) => {
    if (val.trim().length < 16) {
      setError('Secret key should be at least 16 characters long');
      return;
    }
    setError('');
    onSubmit(val.trim());
  };

  const prefix = secret.substring(0, 32);
  const suffix = secret.substring(32);

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text>  🔑 </Text>
        <Text bold>Auth Secret Key: </Text>
        <Text color="yellow">{prefix}</Text>
        <Text dimColor>{suffix}</Text>
      </Box>
      <Box marginLeft={5} marginBottom={1}>
        <Text dimColor>(Auto-generated 32-byte cryptographic hex token)</Text>
      </Box>

      {isEnteringCustom ? (
        <Box flexDirection="column" marginLeft={5}>
          <Box>
            <Text color="cyan">{figures.pointer} Custom secret: </Text>
            <TextInput
              value={customInput}
              onChange={setCustomInput}
              onSubmit={handleCustomSubmit}
            />
          </Box>
          {error && (
            <Box marginTop={1}>
              <Text color="red">{figures.cross} {error}</Text>
            </Box>
          )}
        </Box>
      ) : (
        <Box marginLeft={4} flexDirection="column">
          <SelectInput items={items} onSelect={handleSelect} />
        </Box>
      )}
    </Box>
  );
}
