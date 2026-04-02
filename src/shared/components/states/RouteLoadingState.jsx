import { LoadingState } from './LoadingState';

export function RouteLoadingState() {
  return (
    <div className="premium-page-stack">
      <LoadingState title="Chargement" description="Nous preparons cette page." />
    </div>
  );
}
