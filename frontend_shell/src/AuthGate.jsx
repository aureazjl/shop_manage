import * as React from 'react';
import { API } from './App';
import App from './App';
import Login from './pages/auth/Login';

export default function AuthGate() {
  const [state, setState] = React.useState({ loading: true, setup: false, authenticated: false });
  const refresh = React.useCallback(async () => {
    const status = await fetch(`${API}/api/auth/status`, { credentials: 'include' }).then(r => r.json());
    if (status.setup_required) return setState({ loading: false, setup: true, authenticated: false });
    const me = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
    setState({ loading: false, setup: false, authenticated: me.ok });
  }, []);
  React.useEffect(() => { refresh().catch(() => setState({ loading: false, setup: false, authenticated: false })); }, [refresh]);
  if (state.loading) return <div style={{ padding: 24 }}>正在检查登录状态…</div>;
  if (!state.authenticated) return <Login setup={state.setup} onSuccess={refresh} />;
  return <App />;
}
