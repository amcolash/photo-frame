import { useEffect } from 'react';
import { ServerStatus } from 'types';
import { SERVER } from 'util';

export function useRestart() {
  // Check client + server time
  useEffect(() => {
    let clientTime: number;
    let serverTime: number;

    fetch(`${SERVER}/build.json?cache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => (clientTime = data.buildTime))
      .catch((err) => console.error(err));

    // Check server status every 15 seconds. Restart if server time changes
    const statusInterval = setInterval(async () => {
      try {
        const url = `${SERVER}/status?cache=${Date.now()}`;
        const data: ServerStatus = await (await fetch(url)).json();
        if (!serverTime) serverTime = data.serverTime;

        const serverOutdated = serverTime !== data.serverTime;
        const clientOutdated = clientTime && clientTime !== data.clientTime;

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
