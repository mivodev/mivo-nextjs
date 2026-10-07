import React, { useState } from 'react';
import { Text, Box, useInput } from 'ink';
import TextInput from 'ink-text-input';
import figures from 'figures';

interface AdminPromptProps {
  initialUser?: string;
  initialEmail?: string;
  onSubmit: (data: {
    username: string;
    email: string;
    password: string;
  }) => void;
}

type Field = 'username' | 'email' | 'password' | 'confirm';

/**
 * Interactive admin account form with text inputs and masked password.
 */
export function AdminPrompt({
  initialUser = 'admin',
  initialEmail = 'admin@mivo.local',
  onSubmit,
}: AdminPromptProps): React.ReactElement {
  const [field, setField] = useState<Field>('username');
  const [username, setUsername] = useState(initialUser);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmitField = (value: string) => {
    setError('');

    switch (field) {
      case 'username':
        if (!value.trim()) {
          setError('Username is required');
          return;
        }
        setField('email');
        break;
      case 'email':
        if (!value.includes('@')) {
          setError('Enter a valid email address');
          return;
        }
        setField('password');
        break;
      case 'password':
        if (value.length < 8) {
          setError('Password must be at least 8 characters');
          return;
        }
        setField('confirm');
        break;
      case 'confirm':
        if (value !== password) {
          setError('Passwords do not match');
          setConfirmPassword('');
          return;
        }
        onSubmit({ username, email, password });
        break;
    }
  };

  const renderField = (
    label: string,
    value: string,
    isActive: boolean,
    isDone: boolean,
    mask = false,
  ) => (
    <Box>
      <Text color={isDone ? 'green' : isActive ? 'magenta' : 'gray'}>
        {isDone ? figures.tick : isActive ? figures.pointer : ' '}
      </Text>
      <Text bold={isActive}> {label}: </Text>
      {isDone ? (
        <Text dimColor>{mask ? '••••••••' : value}</Text>
      ) : isActive ? null : (
        <Text dimColor>—</Text>
      )}
    </Box>
  );

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color="white" underline>
        Administrator Account
      </Text>
      <Box height={1} />

      {/* Username */}
      {renderField('Username', username, field === 'username', field !== 'username')}
      {field === 'username' && (
        <Box marginLeft={4}>
          <TextInput
            value={username}
            onChange={setUsername}
            onSubmit={handleSubmitField}
          />
        </Box>
      )}

      {/* Email */}
      {renderField('Email', email, field === 'email', ['password', 'confirm'].includes(field))}
      {field === 'email' && (
        <Box marginLeft={4}>
          <TextInput
            value={email}
            onChange={setEmail}
            onSubmit={handleSubmitField}
          />
        </Box>
      )}

      {/* Password */}
      {renderField('Password', password, field === 'password', field === 'confirm', true)}
      {field === 'password' && (
        <Box marginLeft={4}>
          <TextInput
            value={password}
            onChange={setPassword}
            onSubmit={handleSubmitField}
            mask="•"
          />
        </Box>
      )}

      {/* Confirm Password */}
      {field === 'confirm' && (
        <>
          {renderField('Confirm password', confirmPassword, true, false, true)}
          <Box marginLeft={4}>
            <TextInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              onSubmit={handleSubmitField}
              mask="•"
            />
          </Box>
        </>
      )}

      {error && (
        <Box marginTop={1}>
          <Text color="red">{figures.cross} {error}</Text>
        </Box>
      )}
    </Box>
  );
}
