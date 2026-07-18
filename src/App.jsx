import { useSyncExternalStore } from 'react';
import { store } from './lib/store';
import Setup from './views/Setup';
import Shell from './Shell';

export default function App() {
  const state = useSyncExternalStore(store.subscribe, store.get);

  if (!state.setup) {
    return <Setup onStart={amount => store.actions.completeSetup(amount)} />;
  }

  return <Shell state={state} />;
}
