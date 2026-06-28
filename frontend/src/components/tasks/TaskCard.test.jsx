import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TaskCard from './TaskCard';

const baseTask = {
  _id: 1,
  title: 'Write unit tests',
  description: 'Cover all critical paths',
  completed: false,
  priority: 'medium',
  category: 'work',
  dueDate: null,
};

const renderCard = (task = baseTask, props = {}) =>
  render(
    <MemoryRouter>
      <TaskCard
        task={task}
        onToggle={props.onToggle ?? vi.fn()}
        onDelete={props.onDelete ?? vi.fn()}
        dragHandleProps={props.dragHandleProps}
      />
    </MemoryRouter>
  );

describe('TaskCard', () => {
  it('renders the task title', () => {
    renderCard();
    expect(screen.getByText('Write unit tests')).toBeInTheDocument();
  });

  it('renders the task description', () => {
    renderCard();
    expect(screen.getByText('Cover all critical paths')).toBeInTheDocument();
  });

  it('renders the priority badge', () => {
    renderCard();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('renders the category badge', () => {
    renderCard();
    expect(screen.getByText('work')).toBeInTheDocument();
  });

  it('does not render description element when description is empty', () => {
    renderCard({ ...baseTask, description: '' });
    expect(screen.queryByText('Cover all critical paths')).toBeNull();
  });

  it('renders an unchecked checkbox for an incomplete task', () => {
    renderCard();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders a checked checkbox for a completed task', () => {
    renderCard({ ...baseTask, completed: true });
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onToggle with the task when the checkbox is clicked', () => {
    const onToggle = vi.fn();
    renderCard(baseTask, { onToggle });
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(baseTask);
  });

  it('calls onDelete with the task when the delete button is clicked', () => {
    const onDelete = vi.fn();
    renderCard(baseTask, { onDelete });
    fireEvent.click(screen.getByTitle('Delete'));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(baseTask);
  });

  it('edit link points to the task edit route', () => {
    renderCard();
    expect(screen.getByTitle('Edit')).toHaveAttribute('href', '/tasks/1/edit');
  });

  it('shows the formatted due date badge when dueDate is set', () => {
    renderCard({ ...baseTask, dueDate: '2099-06-01' });
    expect(screen.getByText(/Jun/)).toBeInTheDocument();
  });

  it('does not render a due date badge when dueDate is null', () => {
    renderCard();
    // Calendar icon and date badge should not be present
    expect(screen.queryByTitle('Delete')).toBeInTheDocument(); // sanity check card rendered
    expect(screen.queryByText(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/)).toBeNull();
  });

  it('applies reduced opacity to completed tasks', () => {
    const { container } = renderCard({ ...baseTask, completed: true });
    const card = container.firstChild;
    expect(card.className).toContain('opacity-60');
  });
});
