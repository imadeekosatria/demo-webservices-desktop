import { createFileRoute } from '@tanstack/react-router';
import { ByElemen } from '../pages/ByElemen';

export const Route = createFileRoute('/by-elemen')({
  component: ByElemen,
});
