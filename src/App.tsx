/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { ApiProvider } from './context/ApiContext';
import { UpdaterProvider } from './context/UpdaterContext';

export default function App() {
  return (
    <ApiProvider>
      <UpdaterProvider>
        <RouterProvider router={router} />
      </UpdaterProvider>
    </ApiProvider>
  );
}
