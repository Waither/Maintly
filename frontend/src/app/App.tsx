import { MDBContainer } from 'mdb-react-ui-kit';

function App() {
	return (
		<MDBContainer fluid className="p-0">
			<div className="min-vh-100 d-flex flex-column">
				{/* Nagłówek aplikacji */}
				<header className="bg-primary text-white p-3">
					<MDBContainer>
						<h1 className="h3 mb-0">Maintly</h1>
					</MDBContainer>
				</header>

				{/* Główna zawartość */}
				<main className="flex-grow-1">
					<MDBContainer className="py-4">
						<h2>Witaj w aplikacji Maintly</h2>
						<p className="text-muted">
							System zarządzania konserwacją i utrzymaniem sprzętu
						</p>
					</MDBContainer>
				</main>

				{/* Stopka */}
				<footer className="bg-light text-center py-3">
					<MDBContainer>
						<p className="mb-0 text-muted">
							&copy; {new Date().getFullYear()} Maintly. Wszelkie prawa zastrzeżone.
						</p>
					</MDBContainer>
				</footer>
			</div>
		</MDBContainer>
	);
}

export default App;
