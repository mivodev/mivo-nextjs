import React from 'react';
import { Text, Box } from 'ink';
import figures from 'figures';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

/**
 * Step progress indicator showing numbered steps with active highlighting.
 */
export function StepIndicator({
  currentStep,
  steps,
}: StepIndicatorProps): React.ReactElement {
  return (
    <Box flexDirection="column" marginBottom={1}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;

        return (
          <Box key={step}>
            <Text
              color={isDone ? 'green' : isActive ? 'magenta' : 'gray'}
              bold={isActive}
            >
              {isDone ? figures.tick : isActive ? figures.pointer : ' '}{' '}
              {stepNumber}. {step}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
