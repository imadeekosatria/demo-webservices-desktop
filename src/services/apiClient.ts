import { isTauri } from '@tauri-apps/api/core';

/**
 * Check if the application is currently running inside Tauri Desktop
 */
export function isDesktopApp(): boolean {
  try {
    return typeof window !== 'undefined' && isTauri();
  } catch {
    return false;
  }
}

/**
 * Helper to fetch Dukcapil API seamlessly in both Tauri Desktop and Web Browser
 */
export async function dukcapilFetch(
  endpointPath: string,
  options: RequestInit = {},
  serverUrl: string = 'https://172.16.160.177:8000'
): Promise<Response> {
  const isDesktop = isDesktopApp();

  if (isDesktop) {
    try {
      // In Tauri desktop, dynamically load @tauri-apps/plugin-http to bypass CORS and SSL checks
      const { fetch: tauriFetch } = await import('@tauri-apps/plugin-http');
      const cleanBase = (serverUrl || 'https://172.16.160.177:8000').replace(/\/+$/, '');
      const cleanPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
      const directUrl = `${cleanBase}${cleanPath}`;
      
      // In Desktop, bypass SSL certificate checks for internal/self-signed Dukcapil IP
      const desktopOptions = {
        ...options,
        danger: {
          acceptInvalidCerts: true,
          acceptInvalidHostnames: true,
        },
      };

      return await tauriFetch(directUrl, desktopOptions as any);
    } catch (err: any) {
      console.error('Tauri native HTTP fetch failed:', err);
      throw new Error(`Koneksi desktop native gagal: ${err.message || err}. Pastikan alamat IP ${serverUrl} dapat dijangkau dan plugin tauri-plugin-http dikonfigurasi dengan dangerous-settings.`);
    }
  }

  // In Web mode (Vite dev/preview server), relative endpoint is proxied to bypass CORS
  return await window.fetch(endpointPath, options);
}
