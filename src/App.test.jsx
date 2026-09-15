import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('renders the demo home page', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Hello, Splunk!' })).toBeInTheDocument();
  });

  it('renders the React-only page from a client-side route', () => {
    window.location.hash = '#/react-only';

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'React can show more than Splunk navigation knows about.' })
    ).toBeInTheDocument();
  });
});
