import { useEffect } from 'react';
import { ServerStatus } from 'types';
import { SERVER } from 'util';

export function useRestart() {
  // Check client + server time
  useEffect(() => {
    let serverTime: number;
    let clientTime: number;

    // Check server status every 15 seconds. Restart if server/client time changes
    const statusInterval = setInterval(async () => {
      try {
        const url = `${SERVER}/status?cache=${Date.now()}`;
        const data: ServerStatus = await (await fetch(url)).json();
        if (!serverTime) serverTime = data.serverTime;
        if (!clientTime) clientTime = data.clientTime;

        const serverOutdated = serverTime !== data.serverTime;
        const clientOutdated = clientTime !== data.clientTime;

        if (serverOutdated || clientOutdated) window.location.reload();
      } catch (err) {
        console.error('Error fetching server status:', err);
      }
    }, 15 * 1000);

    return () => {
      clearInterval(statusInterval);
    };
  }, []);
}
