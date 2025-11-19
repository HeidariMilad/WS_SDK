import type {
  ServerStatus,
  PlaylistInfo,
  PlaylistControlRequest,
  CommandSchema,
} from '../types/manager.types';

const REST_API_BASE = 'http://localhost:3000';

export class MockServerClient {
  private baseUrl: string;

  constructor(baseUrl: string = REST_API_BASE) {
    this.baseUrl = baseUrl;
  }

  async getServerStatus(): Promise<ServerStatus> {
    const response = await fetch(`${this.baseUrl}/api/status`);
    if (!response.ok) {
      throw new Error(`Failed to fetch server status: ${response.statusText}`);
    }
    return response.json();
  }

  async getPlaylists(): Promise<PlaylistInfo[]> {
    const response = await fetch(`${this.baseUrl}/api/playlists`);
    if (!response.ok) {
      throw new Error(`Failed to fetch playlists: ${response.statusText}`);
    }
    return response.json();
  }

  async controlPlaylist(request: PlaylistControlRequest): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/api/playlist/control`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Failed to control playlist: ${response.statusText}`);
    }
    return response.json();
  }

  // Note: Command execution is now handled via WebSocket only
  // This ensures real-time bi-directional communication

  async getCommands(): Promise<CommandSchema[]> {
    const response = await fetch(`${this.baseUrl}/api/commands`);
    if (!response.ok) {
      throw new Error(`Failed to fetch commands: ${response.statusText}`);
    }
    return response.json();
  }

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }
}

export const mockServerClient = new MockServerClient();
