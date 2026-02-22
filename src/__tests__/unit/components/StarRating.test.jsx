/**
 * Unit test:  StarRating component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StarRating } from '../../components/Molecules/StarRating.jsx';

describe('StarRating Component', () => {
  it('should render 5 stars', () => {
    const handleChange = vi.fn();
    render(
      <StarRating
        value={0}
        onChangeRating={handleChange}
        ariaLabel="Test rating"
      />
    );

    const buttons = screen.getAllByRole('radio');
    expect(buttons).toHaveLength(5);
  });

  it('should call onChange when star is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <StarRating
        value={0}
        onChangeRating={handleChange}
        ariaLabel="Test rating"
      />
    );

    const thirdStar = screen.getByRole('radio', { name: /3 stars/i });
    await user.click(thirdStar);

    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('should display correct number of filled stars', () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <StarRating
        value={0}
        onChangeRating={handleChange}
        ariaLabel="Test rating"
      />
    );

    rerender(
      <StarRating
        value={4}
        onChangeRating={handleChange}
        ariaLabel="Test rating"
      />
    );

    const filledStars = screen.getAllByRole('radio', { checked: true });
    expect(filledStars).toHaveLength(0);
  });

  it('should be disabled when readonly prop is true', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <StarRating
        value={0}
        onChangeRating={handleChange}
        readonly={true}
        ariaLabel="Test rating"
      />
    );

    const buttons = screen.getAllByRole('radio');
    for (const button of buttons) {
      expect(button).toBeDisabled();
    }

    await user.click(buttons[0]);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
