import React, { useState, useEffect } from 'react';
import { mockServerClient } from '../api/mockServerClient';
import type { PlaylistInfo } from '../types/manager.types';

export const PlaylistControls: React.FC = () => {
  const [playlists, setPlaylists] = useState<PlaylistInfo[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [interval, setInterval] = useState<number>(1000);
  const [loop, setLoop] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const data = await mockServerClient.getPlaylists();
      setPlaylists(data);
      if (data.length > 0 && !selectedPlaylist) {
        setSelectedPlaylist(data[0].filename);
      }
    } catch (error) {
      console.error('Failed to load playlists:', error);
    }
  };

  const handleControl = async (action: 'start' | 'stop' | 'pause' | 'resume') => {
    setIsLoading(true);
    setMessage('');
    try {
      const response = await mockServerClient.controlPlaylist({
        action,
        playlist: action === 'start' ? selectedPlaylist : undefined,
        interval: action === 'start' ? interval : undefined,
        loop: action === 'start' ? loop : undefined,
      });
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlaylistInfo = playlists.find(p => p.filename === selectedPlaylist);

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: 'white',
    }}>
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
        Playlist Controls
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            Select Playlist
          </label>
          <select
            value={selectedPlaylist}
            onChange={(e) => setSelectedPlaylist(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          >
            {playlists.map((playlist) => (
              <option key={playlist.filename} value={playlist.filename}>
                {playlist.name} ({playlist.commandCount} commands)
              </option>
            ))}
          </select>
          {selectedPlaylistInfo && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
              {selectedPlaylistInfo.description}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Interval (ms)
            </label>
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              min="100"
              step="100"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={loop}
                onChange={(e) => setLoop(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              Loop playlist
            </label>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          <button
            onClick={() => handleControl('start')}
            disabled={isLoading || !selectedPlaylist}
            style={{
              padding: '0.5rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            ▶ Start
          </button>
          <button
            onClick={() => handleControl('pause')}
            disabled={isLoading}
            style={{
              padding: '0.5rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            ⏸ Pause
          </button>
          <button
            onClick={() => handleControl('resume')}
            disabled={isLoading}
            style={{
              padding: '0.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            ⏯ Resume
          </button>
          <button
            onClick={() => handleControl('stop')}
            disabled={isLoading}
            style={{
              padding: '0.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            ⏹ Stop
          </button>
        </div>

        {message && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#eff6ff',
            color: '#1e40af',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
