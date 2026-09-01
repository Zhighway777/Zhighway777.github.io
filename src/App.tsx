import { useEffect } from "react";
import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Results from "./pages/Results";

function LegacyPathRedirect() {
  useEffect(() => {
    if (window.location.hash) return;
    const path = window.location.pathname.replace(/\/$/, "");
    if (path.endsWith("/test") || path.endsWith("/results")) {
      window.location.replace(`${window.location.origin}/#${path.slice(1)}`);
    }
  }, []);

  return null;
}

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <LegacyPathRedirect />
      <div className="app-shell">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/test" component={Test} />
          <Route path="/results" component={Results} />
          <Route>
            <main className="page-shell">
              <section className="panel">
                <h1>页面不存在</h1>
                <a className="button primary" href="#/">
                  返回首页
                </a>
              </section>
            </main>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
