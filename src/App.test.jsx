import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/en-US/app/conf2026/home');
  });

  it('renders the demo home page', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Hello, Splunk!' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Top-level route/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Home sub-page/ })).toBeInTheDocument();
  });

  it('renders the React-only page from the top-level app route after React loads', () => {
    window.history.pushState({}, '', '/en-US/app/conf2026/react-only');

    render(<App />);

    expect(screen.getByRole('heading', { name: 'This top-level route has no Splunk template.' })).toBeInTheDocument();
  });

  it('navigates to a sub-route under the Home view', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: /Home sub-page/ }));

    expect(
      await screen.findByRole('heading', { name: 'This sub-page routes safely inside the Home view.' })
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe('/en-US/app/conf2026/home');
    expect(window.location.hash).toBe('#/sub-page');

    fireEvent.click(screen.getByRole('link', { name: /^Home$/ }));

    expect(await screen.findByRole('heading', { name: 'Hello, Splunk!' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/en-US/app/conf2026/home');
    expect(window.location.hash).toBe('');
  });

  it('can navigate to the top-level route only after the app is already mounted', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: /Top-level route/ }));

    expect(
      await screen.findByRole('heading', { name: 'This top-level route has no Splunk template.' })
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe('/en-US/app/conf2026/react-only');
  });

  it('renders the Home sub-page from the direct-load-safe hash URL', () => {
    window.history.pushState({}, '', '/en-US/app/conf2026/home#/sub-page');

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'This sub-page routes safely inside the Home view.' })
    ).toBeInTheDocument();
  });
});
