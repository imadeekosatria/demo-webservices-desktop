import { createFileRoute } from '@tanstack/react-router';
import { ByNik } from '../pages/ByNik';

export const Route = createFileRoute('/by-nik')({
  component: ByNik,
});
