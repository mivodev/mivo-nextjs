import React, { useState, useCallback } from 'react';
import { Box, useApp } from 'ink';
import { Banner } from './components/Banner.js';
import { DoctorCheck } from './components/DoctorCheck.js';
import { StepIndicator } from './components/StepIndicator.js';
import { ProjectPrompt } from './components/ProjectPrompt.js';
import { PackageManagerPrompt } from './components/PackageManagerPrompt.js';
import { AdminPrompt } from './components/AdminPrompt.js';
import { SecretPrompt } from './components/SecretPrompt.js';
import { ProgressTasks, type TaskDefinition } from './components/ProgressTasks.js';
import { Summary } from './components/Summary.js';
import { runDoctor } from './core/doctor.js';
import { generateSecret, writeEnvFile } from './core/env.js';
import { scaffoldProject } from './core/scaffold.js';
import { initializeDatabase } from './core/database.js';
import { seedAdmin, seedSettings } from './core/admin.js';
import { detectDefaultPackageManager } from './core/pm.js';
import { execAsync } from './core/exec.js';
import type { MivoConfig, DoctorResult, PackageManager } from './types/index.js';
import path from 'node:path';

type Step = 'doctor' | 'project' | 'pm' | 'admin' | 'secret' | 'execute' | 'done';

const STEP_LABELS = [
  'Environment Check',
  'Project Setup',
  'Package Manager',
  'Admin Account',
  'Auth Secret',
  'Installation',
];

interface AppProps {
  initialConfig: Partial<MivoConfig>;
}

/**
 * Main Ink application — orchestrates the full interactive setup flow
 * as a React state machine.
 */
export function App({ initialConfig }: AppProps): React.ReactElement {
  const { exit } = useApp();

  const [step, setStep] = useState<Step>('doctor');
  const [projectDir, setProjectDir] = useState(initialConfig.projectDir || 'mivo-app');
  const [packageManager, setPackageManager] = useState<PackageManager>(
    initialConfig.packageManager || detectDefaultPackageManager(),
  );
  const [adminUser, setAdminUser] = useState(initialConfig.adminUser || '');
  const [adminEmail, setAdminEmail] = useState(initialConfig.adminEmail || '');
  const [adminPassword, setAdminPassword] = useState(initialConfig.adminPassword || '');
  const [secret, setSecret] = useState(initialConfig.secret || '');

  // Doctor result
  const [doctorResult] = useState<DoctorResult>(() => {
    const result = runDoctor(projectDir);
    if (!result.allPassed) {
      // Will display error in DoctorCheck, then exit
      setTimeout(() => exit(), 100);
    } else {
      // Auto-advance if doctor passes
      setTimeout(() => {
        if (initialConfig.projectDir) {
          if (!initialConfig.packageManager) {
            setStep('pm');
          } else if (
            !initialConfig.adminUser ||
            !initialConfig.adminEmail ||
            !initialConfig.adminPassword
          ) {
            setStep('admin');
          } else {
            setStep('secret');
          }
        } else {
          setStep('project');
        }
      }, 500);
    }
    return result;
  });

  // Step number for the indicator
  const currentStepNumber =
    step === 'doctor' ? 1
      : step === 'project' ? 2
        : step === 'pm' ? 3
          : step === 'admin' ? 4
            : step === 'secret' ? 5
              : 6;

  // Handlers
  const handleProjectSubmit = useCallback((dir: string) => {
    setProjectDir(dir);
    if (initialConfig.packageManager) {
      if (initialConfig.adminUser && initialConfig.adminEmail && initialConfig.adminPassword) {
        setStep('secret');
      } else {
        setStep('admin');
      }
    } else {
      setStep('pm');
    }
  }, [initialConfig]);

  const handlePmSubmit = useCallback((selectedPm: PackageManager) => {
    setPackageManager(selectedPm);
    if (initialConfig.adminUser && initialConfig.adminEmail && initialConfig.adminPassword) {
      setStep('secret');
    } else {
      setStep('admin');
    }
  }, [initialConfig]);

  const handleAdminSubmit = useCallback(
    (data: { username: string; email: string; password: string }) => {
      setAdminUser(data.username);
      setAdminEmail(data.email);
      setAdminPassword(data.password);
      setStep('secret');
    },
    [],
  );

  const handleSecretSubmit = useCallback((s: string) => {
    setSecret(s);
    setStep('execute');
  }, []);

  const handleComplete = useCallback(() => {
    setStep('done');
    setTimeout(() => exit(), 500);
  }, [exit]);

  const handleTaskError = useCallback(
    (_err: string) => {
      setTimeout(() => exit(), 2500);
    },
    [exit],
  );

  // Build tasks for the execution step
  const resolvedDir = path.resolve(projectDir);
  const finalSecret = secret || generateSecret();

  const isDryRun = Boolean(initialConfig.dryRun);

  const tasks: TaskDefinition[] = [
    {
      label: 'Scaffolding MIVO application core',
      run: async () => {
        if (isDryRun) {
          await new Promise((r) => setTimeout(r, 400));
          return;
        }
        await scaffoldProject(projectDir);
      },
    },
    {
      label: 'Generating cryptographic secret & .env',
      run: async () => {
        if (isDryRun) {
          await new Promise((r) => setTimeout(r, 300));
          return;
        }
        writeEnvFile(projectDir, finalSecret);
      },
    },
    {
      label: 'Installing dependencies',
      run: async () => {
        if (isDryRun) {
          await new Promise((r) => setTimeout(r, 500));
          return;
        }
        await execAsync(`${packageManager} install`, {
          cwd: resolvedDir,
          env: { ...process.env, CI: 'true' },
        });
      },
    },
    {
      label: 'Provisioning SQLite database & running migrations',
      run: async () => {
        if (isDryRun) {
          await new Promise((r) => setTimeout(r, 400));
          return;
        }
        initializeDatabase(projectDir);
      },
    },
    {
      label: 'Seeding superadmin account',
      run: async () => {
        if (isDryRun) {
          await new Promise((r) => setTimeout(r, 300));
          return;
        }
        await seedAdmin(projectDir, adminUser, adminEmail, adminPassword);
      },
    },
    {
      label: 'Writing system defaults',
      run: async () => {
        if (isDryRun) {
          await new Promise((r) => setTimeout(r, 200));
          return;
        }
        seedSettings(projectDir, finalSecret);
        try {
          await execAsync('git init', { cwd: resolvedDir });
          await execAsync('git add -A', { cwd: resolvedDir });
          await execAsync('git commit -m "Initial commit from create-mivo"', {
            cwd: resolvedDir,
          });
        } catch {
          // Git non-fatal
        }
      },
    },
  ];

  return (
    <Box flexDirection="column" paddingLeft={1}>
      <Banner />
      <DoctorCheck result={doctorResult} />

      {doctorResult.allPassed && step !== 'doctor' && (
        <StepIndicator currentStep={currentStepNumber} steps={STEP_LABELS} />
      )}

      {step === 'project' && (
        <ProjectPrompt
          initialDir={projectDir}
          onSubmit={handleProjectSubmit}
        />
      )}

      {step === 'pm' && (
        <PackageManagerPrompt
          initial={packageManager}
          onSubmit={handlePmSubmit}
        />
      )}

      {step === 'admin' && (
        <AdminPrompt
          initialUser={initialConfig.adminUser}
          initialEmail={initialConfig.adminEmail}
          onSubmit={handleAdminSubmit}
        />
      )}

      {step === 'secret' && (
        <SecretPrompt
          initialSecret={initialConfig.secret}
          onSubmit={handleSecretSubmit}
        />
      )}

      {step === 'execute' && (
        <ProgressTasks
          tasks={tasks}
          onComplete={handleComplete}
          onError={handleTaskError}
        />
      )}

      {step === 'done' && (
        <Summary
          projectDir={projectDir}
          adminEmail={adminEmail}
          packageManager={packageManager}
        />
      )}
    </Box>
  );
}
