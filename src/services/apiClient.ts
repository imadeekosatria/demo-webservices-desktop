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
      // In Tauri desktop, dynamically load @tauri-apps/plugin-http to bypass CORS
      const { fetch: tauriFetch } = await import('@tauri-apps/plugin-http');
      const cleanBase = (serverUrl || 'https://172.16.160.177:8000').replace(/\/+$/, '');
      const cleanPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
      const directUrl = `${cleanBase}${cleanPath}`;
      
      return await tauriFetch(directUrl, options as any);
    } catch (err) {
      console.warn('Tauri HTTP fetch error, falling back to window.fetch:', err);
      // Fallback
      return await window.fetch(endpointPath, options);
    }
  }

  // In Web mode (Vite dev/preview server), relative endpoint is proxied to bypass CORS
  return await window.fetch(endpointPath, options);
}
