import { StateCard } from '../../ui/StateCard';

export function EmptyState({ title, description, children = null }) {
  return (
    <StateCard title={title} description={description}>
      {children}
    </StateCard>
  );
}
