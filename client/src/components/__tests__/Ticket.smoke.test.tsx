import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Ticket from '../Ticket';
import type { ExtractedRoute } from '../../lib/api';

const mockRoute: ExtractedRoute = {
  origin: 'Cubao, Quezon City',
  destination: 'Kapitolyo, Pasig',
  steps: [
    {
      step_order: 1,
      mode: 'mrt',
      line_label: 'MRT-3',
      landmark: 'Cubao Station',
      instruction: 'Sumakay MRT-3 mula Cubao papuntang Shaw Boulevard',
      fare_estimate_php: 20,
      estimated_duration_min: 15,
      notes: null,
    },
    {
      step_order: 2,
      mode: 'jeep',
      line_label: null,
      landmark: 'Kapitolyo',
      instruction: 'Sumakay jeep papuntang Kapitolyo',
      fare_estimate_php: 13,
      estimated_duration_min: 20,
      notes: 'Pwede rin sumakay ng tricycle',
    },
  ],
  options: [
    {
      option_id: 'opt-1',
      title: 'Ruta 1 (Recommended)',
      badge: 'Recommended',
      total_fare_php: 33,
      total_duration_min: 35,
      steps: [
        {
          step_order: 1,
          mode: 'mrt',
          line_label: 'MRT-3',
          landmark: 'Cubao Station',
          instruction: 'Sumakay MRT-3 mula Cubao papuntang Shaw Boulevard',
          fare_estimate_php: 20,
          estimated_duration_min: 15,
          notes: null,
        },
        {
          step_order: 2,
          mode: 'jeep',
          line_label: null,
          landmark: 'Kapitolyo',
          instruction: 'Sumakay jeep papuntang Kapitolyo',
          fare_estimate_php: 13,
          estimated_duration_min: 20,
          notes: 'Pwede rin sumakay ng tricycle',
        },
      ],
    },
  ],
};

describe('Ticket component smoke test', () => {
  it('renders origin, destination, fare, and steps', () => {
    render(<Ticket route={mockRoute} />);

    // Origin and destination are visible
    expect(screen.getByText('Cubao, Quezon City')).toBeInTheDocument();
    expect(screen.getByText('Kapitolyo, Pasig')).toBeInTheDocument();

    // Total fare is displayed (₱33)
    expect(screen.getByText('₱33')).toBeInTheDocument();

    // Step instructions are rendered
    expect(screen.getByText(/Sumakay MRT-3 mula Cubao/)).toBeInTheDocument();
    expect(screen.getByText(/Sumakay jeep papuntang Kapitolyo/)).toBeInTheDocument();

    // Mode labels are present
    expect(screen.getByText('MRT-3')).toBeInTheDocument();
    expect(screen.getByText('JEEP')).toBeInTheDocument();
  });

  it('renders the ticket header and barcode', () => {
    render(<Ticket route={mockRoute} />);

    // Ticket title
    expect(screen.getByText('PARA PO! PASS')).toBeInTheDocument();

    // Barcode serial number exists (MNL-xxxx) — appears on the pass and the stub
    const serials = screen.getAllByText(/MNL-/);
    expect(serials.length).toBeGreaterThanOrEqual(1);
  });
});
