import { StateCard } from '../../ui/StateCard';

export function LoadingState({ title = 'Chargement...', description = 'Nous preparons votre experience SmartCard.' }) {
  return <StateCard title={title} description={description} icon="" iconClassName="state-pulse" />;
}
