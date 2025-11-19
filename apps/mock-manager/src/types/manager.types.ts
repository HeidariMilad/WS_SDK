import type { CommandPayload } from '@frontend-ui-command-sdk/shared';

export interface ServerStatus {
  status: 'online' | 'offline';
  uptime?: number;
  activeConnections: number;
  totalCommandsSent: number;
  timestamp: string;
}

export interface PlaylistInfo {
  name: string;
  filename: string;
  description: string;
  commandCount: number;
  intervalMs?: number;
}

export interface PlaylistControlRequest {
  action: 'start' | 'stop' | 'pause' | 'resume';
  playlist?: string;
  interval?: number;
  loop?: boolean;
  clientId?: string;
}

// Command execution is now handled via WebSocket messages
// No REST API types needed for command execution

export interface CommandSchema {
  command: string;
  description: string;
  requiresElementId: boolean;
  payloadSchema?: Record<string, unknown>;
}

export interface CommandHistoryEntry {
  id: string;
  command: CommandPayload;
  timestamp: number;
  status: 'sent' | 'success' | 'error';
  response?: string;
}

export interface WebSocketMessage {
  id: string;
  direction: 'sent' | 'received';
  timestamp: number;
  data: unknown;
}
