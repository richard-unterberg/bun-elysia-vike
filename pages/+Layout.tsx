export { Layout };

import { Counter } from "../components/Counter";
import "../components/style.css";

// `children` includes the +Page component (and all inner +Layout components)
function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div style={{ padding: "20px" }}>
			<nav style={{ marginBottom: "20px" }}>
				<a href="/">Home (Counter)</a> |{" "}
				<a href="/star-wars">Star Wars Movies</a> |
				<Counter />
			</nav>
			<div>{children}</div>
		</div>
	);
}