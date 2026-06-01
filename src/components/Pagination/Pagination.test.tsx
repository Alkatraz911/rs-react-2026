import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination component', () => {
  test('returns null when totalPages is 1', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('returns null when totalPages is 0', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={0}
        onPageChange={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('renders pagination controls', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
      />
    );

    expect(container.querySelector('.pagination')).toBeInTheDocument();
  });

  test('renders prev and next buttons', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test('prev button is disabled on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
      />
    );

    const prevBtn = screen.getByText('Prev');
    expect(prevBtn).toBeDisabled();
  });

  test('prev button is enabled on other pages', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={vi.fn()}
      />
    );

    const prevBtn = screen.getByText('Prev');
    expect(prevBtn).not.toBeDisabled();
  });

  test('next button is disabled on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={vi.fn()}
      />
    );

    const nextBtn = screen.getByText('Next');
    expect(nextBtn).toBeDisabled();
  });

  test('next button is enabled on other pages', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
      />
    );

    const nextBtn = screen.getByText('Next');
    expect(nextBtn).not.toBeDisabled();
  });

  test('renders correct page numbers', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('current page button has active class', () => {
    const { container } = render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={vi.fn()}
      />
    );

    const currentPageBtn = container.querySelector('.page.active');
    expect(currentPageBtn).toHaveTextContent('2');
  });

  test('calls onPageChange when page clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const page3Btn = screen.getByText('3');
    await user.click(page3Btn);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('calls onPageChange when prev clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const prevBtn = screen.getByText('Prev');
    await user.click(prevBtn);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  test('calls onPageChange when next clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const nextBtn = screen.getByText('Next');
    await user.click(nextBtn);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('handles pagination across groups', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={25}
        onPageChange={vi.fn()}
      />
    );

    const pages = container.querySelectorAll('.page');
    expect(pages.length).toBeLessThanOrEqual(10);
  });

  test('shows correct page range for different groups', () => {
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={25}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    rerender(
      <Pagination
        currentPage={15}
        totalPages={25}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  test('renders with large total pages', () => {
    const { container } = render(
      <Pagination
        currentPage={5}
        totalPages={100}
        onPageChange={vi.fn()}
      />
    );

    expect(container.querySelector('.pagination')).toBeInTheDocument();
    expect(screen.getByText('Prev')).not.toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();
  });
});
