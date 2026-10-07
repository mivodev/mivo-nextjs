import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import Spinner from 'ink-spinner';
import figures from 'figures';

export interface TaskDefinition {
  label: string;
  run: () => Promise<void> | void;
}

interface ProgressTasksProps {
  tasks: TaskDefinition[];
  onComplete: () => void;
  onError?: (error: string) => void;
}

type TaskStatus = 'pending' | 'running' | 'done' | 'failed';

/**
 * Animated multi-task progress with ink-spinner.
 * Runs tasks sequentially with real-time status updates.
 */
export function ProgressTasks({
  tasks,
  onComplete,
  onError,
}: ProgressTasksProps): React.ReactElement {
  const [statuses, setStatuses] = useState<TaskStatus[]>(
    tasks.map(() => 'pending'),
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) return;
    setStarted(true);

    const runAll = async () => {
      for (let i = 0; i < tasks.length; i++) {
        setStatuses((prev) => {
          const next = [...prev];
          next[i] = 'running';
          return next;
        });

        try {
          await tasks[i]!.run();
          setStatuses((prev) => {
            const next = [...prev];
            next[i] = 'done';
            return next;
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          setErrorMsg(msg);
          setStatuses((prev) => {
            const next = [...prev];
            next[i] = 'failed';
            return next;
          });
          onError?.(msg);
          return; // Stop on failure
        }
      }
      onComplete();
    };

    runAll();
  }, [started, tasks, onComplete, onError]);

  return (
    <Box flexDirection="column" marginBottom={1}>
      {tasks.map((task, index) => {
        const status = statuses[index]!;
        return (
          <Box key={task.label}>
            {status === 'done' && (
              <Text color="green">{figures.tick} </Text>
            )}
            {status === 'running' && (
              <Text color="magenta">
                <Spinner type="dots" />{' '}
              </Text>
            )}
            {status === 'pending' && (
              <Text dimColor>  </Text>
            )}
            {status === 'failed' && (
              <Text color="red">{figures.cross} </Text>
            )}
            <Text
              color={
                status === 'done'
                  ? 'green'
                  : status === 'running'
                    ? 'white'
                    : status === 'failed'
                      ? 'red'
                      : 'gray'
              }
              dimColor={status === 'pending'}
            >
              {task.label}
            </Text>
            <Text dimColor>
              {' '}
              {status === 'done'
                ? '[Done]'
                : status === 'running'
                  ? '[Running]'
                  : status === 'failed'
                    ? '[Failed]'
                    : '[Pending]'}
            </Text>
          </Box>
        );
      })}
      {errorMsg && (
        <Box marginTop={1}>
          <Text color="red">  └─ {errorMsg}</Text>
        </Box>
      )}
    </Box>
  );
}
