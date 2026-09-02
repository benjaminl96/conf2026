import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the demo home page', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Hello, Splunk!' })).toBeInTheDocument();
  });
});
