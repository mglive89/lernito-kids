import { Component, type ErrorInfo, type ReactNode } from 'react';
import { L } from '../i18n';

interface State { error: Error | null }

export class ErrorBoundary extends Component<{ children: ReactNode; compact?: boolean }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Lernito-Fehler:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className={`flex flex-col items-center justify-center gap-4 p-8 text-center ${this.props.compact ? '' : 'min-h-screen'}`}>
        <div className="emoji text-6xl" aria-hidden>🦁</div>
        <h1 className="font-display text-2xl font-bold">{L('Hoppla, da ist etwas schiefgelaufen.', 'Ops, qualcosa è andato storto.')}</h1>
        <p className="max-w-md text-tinte/70">{L('Puppy hat sich kurz verlaufen. Dein Lernfortschritt ist sicher gespeichert.', 'Puppy si è perso un attimo. I tuoi progressi sono salvati.')}</p>
        <div className="flex gap-3">
          <button className="knopf bg-sonne-500" onClick={() => this.setState({ error: null })}>{L('Nochmal versuchen', 'Riprova')}</button>
          <button className="knopf bg-flaeche" onClick={() => window.location.assign(import.meta.env.BASE_URL)}>{L('Zur Startseite', 'Alla pagina iniziale')}</button>
        </div>
      </div>
    );
  }
}
