// Accordion.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Accordion from './Accordion';

describe('Accordion Component', () => {
  const mockItems = [
    { title: 'Item 1', content: 'Content for item 1' },
    { title: 'Item 2', content: 'Content for item 2' },
    { title: 'Item 3', content: 'Content for item 3' },
  ];

  test('renders accordion items', () => {
    render(<Accordion items={mockItems} />);
    
    // Check if all titles are rendered
    mockItems.forEach(item => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  test('toggles content visibility when title is clicked', () => {
    render(<Accordion items={mockItems} />);
    
    // Initially, no content is visible
    mockItems.forEach(item => {
      expect(screen.queryByText(item.content)).not.toBeVisible();
    });

    // Click on the first item
    fireEvent.click(screen.getByText('Item 1'));
    expect(screen.getByText('Content for item 1')).toBeVisible();

    // Click on the second item
    fireEvent.click(screen.getByText('Item 2'));
    expect(screen.getByText('Content for item 2')).toBeVisible();

    // The first item's content should be hidden
    expect(screen.queryByText('Content for item 1')).not.toBeVisible();
  });

  test('closes the content when the same title is clicked', () => {
    render(<Accordion items={mockItems} />);
    
    // Click on the first item
    fireEvent.click(screen.getByText('Item 1'));
    expect(screen.getByText('Content for item 1')).toBeVisible();

    // Click again to close
    fireEvent.click(screen.getByText('Item 1'));
    expect(screen.queryByText('Content for item 1')).not.toBeVisible();
  });
});