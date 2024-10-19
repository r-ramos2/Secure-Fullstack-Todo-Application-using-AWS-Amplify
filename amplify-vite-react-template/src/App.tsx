import { useAuthenticator } from '@aws-amplify/ui-react';
import Todo from './components/Todo';
import { signOut } from 'aws-amplify/auth';

function App() {
  const { user } = useAuthenticator();

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s Todos</h1>
      <Todo />
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
