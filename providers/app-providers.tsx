/**
 * This file is used to wrap the entire application with configuration and context providers.
 * It is used to provide the application with the necessary context and configuration.
 *
 * Do not modify this file unless you know what you are doing.
 */

import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as SQLite from 'expo-sqlite';
import { PropsWithChildren } from 'react';
import { SafeAreaView, Text } from 'react-native';

import { DB_NAME } from '@/constants/db';
import { db } from '@/db/client';
import migrations from '@/drizzle/migrations';

// TanStack query client.
export const queryClient = new QueryClient();

type AppProvidersProps = PropsWithChildren<{}>;

export default function AppProviders({ children }: AppProvidersProps) {
  // Expo Drizzle Studio plugin.
  useDrizzleStudio(SQLite.openDatabaseSync(DB_NAME));
  // TanStack React Query DevTools plugin.
  useReactQueryDevTools(queryClient);

  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <SafeAreaView>
        <Text>Drizzle Migration error</Text>
        {error.message && <Text>{error.message}</Text>}
      </SafeAreaView>
    );
  }

  if (!success) {
    return (
      <SafeAreaView>
        <Text>Drizzle Migration in progress...</Text>
      </SafeAreaView>
    );
  }
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
