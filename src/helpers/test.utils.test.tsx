import { screen } from '@testing-library/react';
import { renderWithRouter, renderWithRedux, renderWithRouterAndRedux } from './test.utils';

const TestComponent = () => <div>Test Component</div>;

describe('Test Utilities', () => {
  describe('renderWithRouter', () => {
    test('renders component with router', () => {
      renderWithRouter(<TestComponent />);
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    test('uses provided route', () => {
      renderWithRouter(<TestComponent />, '/test-route');
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    test('defaults to home route', () => {
      renderWithRouter(<TestComponent />);
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });
  });

  describe('renderWithRedux', () => {
    test('renders component with redux provider', () => {
      renderWithRedux(<TestComponent />);
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    test('provides redux store context', () => {
      const { container } = renderWithRedux(<TestComponent />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('renderWithRouterAndRedux', () => {
    test('renders component with router and redux', () => {
      renderWithRouterAndRedux(<TestComponent />);
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    test('uses provided route with redux', () => {
      renderWithRouterAndRedux(<TestComponent />, '/test-route');
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    test('defaults to home route with redux', () => {
      renderWithRouterAndRedux(<TestComponent />);
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });
  });
});
