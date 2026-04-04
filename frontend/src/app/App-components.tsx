import {
	MDBBtn,
	MDBCard,
	MDBCardBody,
	MDBCardHeader,
	MDBCardTitle,
	MDBCardText,
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBBadge,
	MDBNavbar,
	MDBNavbarBrand,
	MDBIcon,
	MDBTypography,
	MDBAlert,
	MDBListGroup,
	MDBListGroupItem,
	MDBProgress,
	MDBProgressBar,
	MDBTable,
	MDBTableHead,
	MDBTableBody,
	MDBInput,
	MDBTextArea,
	MDBSwitch,
	MDBTooltip,
	MDBBtnGroup,
	MDBCheckbox,
	MDBRadio,
	MDBFile,
	MDBSpinner,
	MDBDatepicker,
	MDBTimepicker,
	MDBSelect,
	MDBDateTimepicker,
	MDBRange,
	MDBValidation,
	MDBValidationItem,
	MDBRipple,
	MDBCarousel,
	MDBCarouselItem,
	MDBModal,
	MDBModalDialog,
	MDBModalContent,
	MDBModalHeader,
	MDBModalTitle,
	MDBModalBody,
	MDBModalFooter,
	MDBPopover,
	MDBPopoverBody,
	MDBPopoverHeader,
	MDBCollapse
} from '../lib/mdb/dist/types/index-pro';
import { useState } from 'react';

function App() {
	// State dla MDBSelect
	const [statusValue, setStatusValue] = useState('');
	const [priorityValue, setPriorityValue] = useState('');
	const [categoriesValue, setCategoriesValue] = useState<number[]>([]);
	const [technicianValue, setTechnicianValue] = useState('');
	const [locationValue, setLocationValue] = useState('');

	// State dla nowych komponentów
	const [budgetRange, setBudgetRange] = useState(5000);
	const [showModal, setShowModal] = useState(false);
	const [showCollapse, setShowCollapse] = useState(false);

	return (
		<>
			
			{/* Navbar */}
			<MDBNavbar expand='lg' dark bgColor='primary'>
				<MDBContainer fluid>
					<MDBNavbarBrand href='#'>
						<MDBIcon fas icon='tools' className='me-2' />
						Maintly CMMS - Katalog Komponentów
					</MDBNavbarBrand>
				</MDBContainer>
			</MDBNavbar>

			<MDBContainer className='mt-4 mb-5'>
				
				{/* SEKCJA 1: BADGES - Statusy i Priorytety */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='tags' className='me-2' />
						1. Badges - Statusy Zleceń i Priorytet
					</MDBCardHeader>
					<MDBCardBody>
						<MDBTypography tag='h6' className='mb-3'>Statusy Zleceń Serwisowych:</MDBTypography>
						<MDBBadge color='primary' pill className='me-2 mb-2'>
							<MDBIcon fas icon='hourglass-start' className='me-1' />
							Nowe
						</MDBBadge>
						<MDBBadge color='warning' pill className='me-2 mb-2'>
							<MDBIcon fas icon='wrench' className='me-1' />
							W realizacji
						</MDBBadge>
						<MDBBadge color='info' pill className='me-2 mb-2'>
							<MDBIcon fas icon='pause' className='me-1' />
							Oczekuje
						</MDBBadge>
						<MDBBadge color='success' pill className='me-2 mb-2'>
							<MDBIcon fas icon='check-circle' className='me-1' />
							Zakończone
						</MDBBadge>
						<MDBBadge color='danger' pill className='me-2 mb-2'>
							<MDBIcon fas icon='exclamation-triangle' className='me-1' />
							Pilne
						</MDBBadge>
						<MDBBadge color='secondary' pill className='me-2 mb-2'>
							<MDBIcon fas icon='times-circle' className='me-1' />
							Anulowane
						</MDBBadge>

						<MDBTypography tag='h6' className='mb-3 mt-4'>Priorytety:</MDBTypography>
						<MDBBadge color='secondary' className='me-2'>
							<MDBIcon fas icon='arrow-down' className='me-1' />
							Niski
						</MDBBadge>
						<MDBBadge color='info' className='me-2'>
							<MDBIcon fas icon='minus' className='me-1' />
							Średni
						</MDBBadge>
						<MDBBadge color='warning' className='me-2'>
							<MDBIcon fas icon='arrow-up' className='me-1' />
							Wysoki
						</MDBBadge>
						<MDBBadge color='danger' className='me-2'>
							<MDBIcon fas icon='fire' className='me-1' />
							Krytyczny
						</MDBBadge>

						<MDBTypography tag='h6' className='mb-3 mt-4'>Statusy Sprzętu:</MDBTypography>
						<MDBBadge color='success' light className='me-2 mb-2'>
							<MDBIcon fas icon='check' className='me-1' />
							Sprawny
						</MDBBadge>
						<MDBBadge color='warning' light className='me-2 mb-2'>
							<MDBIcon fas icon='tools' className='me-1' />
							Wymaga serwisu
						</MDBBadge>
						<MDBBadge color='danger' light className='me-2 mb-2'>
							<MDBIcon fas icon='exclamation-circle' className='me-1' />
							Awaria
						</MDBBadge>
						<MDBBadge color='secondary' light className='me-2 mb-2'>
							<MDBIcon fas icon='box' className='me-1' />
							W magazynie
						</MDBBadge>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 2: ALERTS - Powiadomienia */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='bell' className='me-2' />
						2. Alerts - Powiadomienia Systemowe
					</MDBCardHeader>
					<MDBCardBody>
						<MDBAlert color='success' className='mb-3'>
							<MDBIcon fas icon='check-circle' className='me-2' />
							<strong>Sukces!</strong> Zlecenie #1234 zostało pomyślnie zapisane.
						</MDBAlert>

						<MDBAlert color='danger' className='mb-3'>
							<MDBIcon fas icon='exclamation-triangle' className='me-2' />
							<strong>Błąd krytyczny!</strong> Nie udało się połączyć z bazą danych.
						</MDBAlert>

						<MDBAlert color='warning' className='mb-3'>
							<MDBIcon fas icon='exclamation-circle' className='me-2' />
							<strong>Uwaga!</strong> Sprzęt ID-0045 wymaga przeglądu technicznego w ciągu 7 dni.
						</MDBAlert>

						<MDBAlert color='info' className='mb-3'>
							<MDBIcon fas icon='info-circle' className='me-2' />
							<strong>Informacja:</strong> Zaplanowano 3 nowe zlecenia serwisowe na ten tydzień.
						</MDBAlert>

						<MDBAlert color='light'>
							<MDBIcon fas icon='lightbulb' className='me-2' />
							<strong>Wskazówka:</strong> Użyj filtrów aby szybciej znaleźć zlecenia.
						</MDBAlert>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 3: CARDS - Karty Dashboard */}
				<MDBTypography tag='h5' className='mb-3'>
					<MDBIcon fas icon='th' className='me-2' />
					3. Cards - Dashboard CMMS
				</MDBTypography>

				<MDBRow className='mb-4'>
					{/* Karta statystyk 1 */}
					<MDBCol md='3' className='mb-3'>
						<MDBCard className='text-center'>
							<MDBCardBody>
								<MDBIcon fas icon='clipboard-list' size='3x' className='text-primary mb-3' />
								<MDBCardTitle>42</MDBCardTitle>
								<MDBCardText className='text-muted'>Aktywne zlecenia</MDBCardText>
							</MDBCardBody>
						</MDBCard>
					</MDBCol>

					{/* Karta statystyk 2 */}
					<MDBCol md='3' className='mb-3'>
						<MDBCard className='text-center'>
							<MDBCardBody>
								<MDBIcon fas icon='wrench' size='3x' className='text-warning mb-3' />
								<MDBCardTitle>127</MDBCardTitle>
								<MDBCardText className='text-muted'>Sprzęt w systemie</MDBCardText>
							</MDBCardBody>
						</MDBCard>
					</MDBCol>

					{/* Karta statystyk 3 */}
					<MDBCol md='3' className='mb-3'>
						<MDBCard className='text-center'>
							<MDBCardBody>
								<MDBIcon fas icon='exclamation-triangle' size='3x' className='text-danger mb-3' />
								<MDBCardTitle>8</MDBCardTitle>
								<MDBCardText className='text-muted'>Awarie do naprawy</MDBCardText>
							</MDBCardBody>
						</MDBCard>
					</MDBCol>

					{/* Karta statystyk 4 */}
					<MDBCol md='3' className='mb-3'>
						<MDBCard className='text-center'>
							<MDBCardBody>
								<MDBIcon fas icon='calendar-check' size='3x' className='text-success mb-3' />
								<MDBCardTitle>95%</MDBCardTitle>
								<MDBCardText className='text-muted'>Czas sprawności</MDBCardText>
							</MDBCardBody>
						</MDBCard>
					</MDBCol>
				</MDBRow>

				{/* SEKCJA 4: LIST GROUP - Lista zleceń */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='list' className='me-2' />
						4. List Group - Lista Aktywnych Zleceń
					</MDBCardHeader>
					<MDBCardBody className='p-0'>
						<ul className='list-group list-group-flush'>
							<li className='list-group-item d-flex justify-content-between align-items-center'>
								<div>
									<MDBIcon fas icon='tools' className='me-2 text-primary' />
									<strong>#1234</strong> - Wymiana filtra w sprężarce A-01
									<br />
									<small className='text-muted'>Dodano: 2024-11-08 10:30</small>
								</div>
								<MDBBadge color='warning' pill>W realizacji</MDBBadge>
							</li>

							<li className='list-group-item d-flex justify-content-between align-items-center'>
								<div>
									<MDBIcon fas icon='exclamation-triangle' className='me-2 text-danger' />
									<strong>#1235</strong> - Awaria pompy hydraulicznej B-12
									<br />
									<small className='text-muted'>Dodano: 2024-11-08 09:15</small>
								</div>
								<MDBBadge color='danger' pill>Pilne</MDBBadge>
							</li>

							<li className='list-group-item d-flex justify-content-between align-items-center'>
								<div>
									<MDBIcon fas icon='calendar' className='me-2 text-info' />
									<strong>#1236</strong> - Przegląd okresowy linii produkcyjnej C
									<br />
									<small className='text-muted'>Zaplanowano: 2024-11-10</small>
								</div>
								<MDBBadge color='primary' pill>Nowe</MDBBadge>
							</li>

							<li className='list-group-item d-flex justify-content-between align-items-center'>
								<div>
									<MDBIcon fas icon='check-circle' className='me-2 text-success' />
									<strong>#1237</strong> - Konserwacja systemu HVAC
									<br />
									<small className='text-muted'>Zakończono: 2024-11-07 16:45</small>
								</div>
								<MDBBadge color='success' pill>Zakończone</MDBBadge>
							</li>
						</ul>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 5: PROGRESS BARS - Postęp */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='tasks' className='me-2' />
						5. Progress Bars - Postęp Realizacji
					</MDBCardHeader>
					<MDBCardBody>
						<MDBTypography tag='p' className='mb-2'>
							Zlecenie #1234 - Wymiana filtra
						</MDBTypography>
						<MDBProgress height='25'>
							<MDBProgressBar width={75} valuemin={0} valuemax={100} className='bg-success'>
								75%
							</MDBProgressBar>
						</MDBProgress>

						<MDBTypography tag='p' className='mb-2 mt-4'>
							Zlecenie #1235 - Naprawa pompy
						</MDBTypography>
						<MDBProgress height='25'>
							<MDBProgressBar width={30} valuemin={0} valuemax={100} className='bg-warning'>
								30%
							</MDBProgressBar>
						</MDBProgress>

						<MDBTypography tag='p' className='mb-2 mt-4'>
							Zlecenie #1236 - Przegląd linii (etapy)
						</MDBTypography>
						<MDBProgress height='25'>
							<MDBProgressBar striped animated width={25} valuemin={0} valuemax={100} className='bg-info'>
								Przygotowanie 25%
							</MDBProgressBar>
						</MDBProgress>

						<MDBTypography tag='p' className='mb-2 mt-4'>
							Wykorzystanie budżetu serwisowego (miesięczne)
						</MDBTypography>
						<MDBProgress height='25'>
							<MDBProgressBar width={82} valuemin={0} valuemax={100} className='bg-danger'>
								82% (12,300 PLN / 15,000 PLN)
							</MDBProgressBar>
						</MDBProgress>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 6: TABLE - Tabela sprzętu */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='table' className='me-2' />
						6. Table - Rejestr Sprzętu
					</MDBCardHeader>
					<MDBCardBody className='p-0'>
						<MDBTable hover responsive>
							<MDBTableHead className='table-light'>
								<tr>
									<th>ID</th>
									<th>Nazwa sprzętu</th>
									<th>Lokalizacja</th>
									<th>Status</th>
									<th>Ostatni serwis</th>
									<th>Następny przegląd</th>
								</tr>
							</MDBTableHead>
							<MDBTableBody>
								<tr>
									<td>A-01</td>
									<td>
										<MDBIcon fas icon='fan' className='me-2' />
										Sprężarka śrubowa
									</td>
									<td>Hala A</td>
									<td>
										<MDBBadge color='success' light>Sprawny</MDBBadge>
									</td>
									<td>2024-10-15</td>
									<td>2025-01-15</td>
								</tr>
								<tr>
									<td>B-12</td>
									<td>
										<MDBIcon fas icon='tint' className='me-2' />
										Pompa hydrauliczna
									</td>
									<td>Hala B</td>
									<td>
										<MDBBadge color='danger' light>Awaria</MDBBadge>
									</td>
									<td>2024-09-20</td>
									<td className='text-danger'>
										<strong>Przekroczony!</strong>
									</td>
								</tr>
								<tr>
									<td>C-05</td>
									<td>
										<MDBIcon fas icon='industry' className='me-2' />
										Linia produkcyjna
									</td>
									<td>Hala C</td>
									<td>
										<MDBBadge color='warning' light>Wymaga serwisu</MDBBadge>
									</td>
									<td>2024-08-10</td>
									<td>2024-11-10</td>
								</tr>
								<tr>
									<td>D-08</td>
									<td>
										<MDBIcon fas icon='temperature-high' className='me-2' />
										System HVAC
									</td>
									<td>Biurowiec</td>
									<td>
										<MDBBadge color='success' light>Sprawny</MDBBadge>
									</td>
									<td>2024-11-07</td>
									<td>2025-02-07</td>
								</tr>
							</MDBTableBody>
						</MDBTable>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 7: BUTTONS - Akcje */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='mouse-pointer' className='me-2' />
						7. Buttons - Akcje i Operacje
					</MDBCardHeader>
					<MDBCardBody>
						<MDBTypography tag='h6' className='mb-3'>Akcje podstawowe:</MDBTypography>
						<MDBBtn color='primary' className='me-2 mb-2'>
							<MDBIcon fas icon='plus' className='me-1' />
							Nowe zlecenie
						</MDBBtn>
						<MDBBtn color='success' className='me-2 mb-2'>
							<MDBIcon fas icon='save' className='me-1' />
							Zapisz
						</MDBBtn>
						<MDBBtn color='warning' className='me-2 mb-2'>
							<MDBIcon fas icon='edit' className='me-1' />
							Edytuj
						</MDBBtn>
						<MDBBtn color='danger' className='me-2 mb-2'>
							<MDBIcon fas icon='trash' className='me-1' />
							Usuń
						</MDBBtn>
						<MDBBtn color='info' className='me-2 mb-2'>
							<MDBIcon fas icon='download' className='me-1' />
							Eksport PDF
						</MDBBtn>

						<MDBTypography tag='h6' className='mb-3 mt-4'>Akcje outline:</MDBTypography>
						<MDBBtn outline color='primary' className='me-2 mb-2'>
							<MDBIcon fas icon='filter' className='me-1' />
							Filtruj
						</MDBBtn>
						<MDBBtn outline color='secondary' className='me-2 mb-2'>
							<MDBIcon fas icon='search' className='me-1' />
							Szukaj
						</MDBBtn>
						<MDBBtn outline color='success' className='me-2 mb-2'>
							<MDBIcon fas icon='check' className='me-1' />
							Zatwierdź
						</MDBBtn>

						<MDBTypography tag='h6' className='mb-3 mt-4'>Przyciski floating (szybkie akcje):</MDBTypography>
						<MDBBtn floating color='primary' className='me-2 mb-2'>
							<MDBIcon fas icon='plus' />
						</MDBBtn>
						<MDBBtn floating color='danger' className='me-2 mb-2'>
							<MDBIcon fas icon='exclamation-triangle' />
						</MDBBtn>
						<MDBBtn floating color='success' className='me-2 mb-2'>
							<MDBIcon fas icon='check' />
						</MDBBtn>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 8: FORMS - Formularze */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='edit' className='me-2' />
						8. Forms - Formularz Nowego Zlecenia
					</MDBCardHeader>
					<MDBCardBody>
						<MDBRow>
							<MDBCol md='6' className='mb-3'>
								<MDBInput label='Numer zlecenia' type='text' value='#AUTO-1238' disabled />
							</MDBCol>
							<MDBCol md='6' className='mb-3'>
								<MDBInput label='Data utworzenia' type='date' defaultValue='2024-11-08' />
							</MDBCol>
						</MDBRow>

						<MDBRow>
							<MDBCol md='12' className='mb-3'>
								<MDBInput label='Tytuł zlecenia' type='text' placeholder='np. Wymiana filtra w sprężarce' />
							</MDBCol>
						</MDBRow>

						<MDBRow>
							<MDBCol md='6' className='mb-3'>
								<select className='form-select'>
									<option>Wybierz sprzęt</option>
									<option>A-01 - Sprężarka śrubowa</option>
									<option>B-12 - Pompa hydrauliczna</option>
									<option>C-05 - Linia produkcyjna</option>
								</select>
							</MDBCol>
							<MDBCol md='6' className='mb-3'>
								<select className='form-select'>
									<option>Priorytet</option>
									<option>Niski</option>
									<option>Średni</option>
									<option>Wysoki</option>
									<option>Krytyczny</option>
								</select>
							</MDBCol>
						</MDBRow>

						<MDBRow>
							<MDBCol md='12' className='mb-3'>
								<MDBTextArea label='Opis problemu / prace do wykonania' rows={4} />
							</MDBCol>
						</MDBRow>

						<MDBRow>
							<MDBCol md='6' className='mb-3'>
								<MDBSwitch id='urgentSwitch' label='Oznacz jako pilne' />
							</MDBCol>
							<MDBCol md='6' className='mb-3'>
								<MDBSwitch id='notifySwitch' label='Powiadom serwisanta' defaultChecked />
							</MDBCol>
						</MDBRow>

						<div className='d-flex justify-content-end mt-3'>
							<MDBBtn color='secondary' className='me-2'>Anuluj</MDBBtn>
							<MDBBtn color='primary'>
								<MDBIcon fas icon='save' className='me-1' />
								Utwórz zlecenie
							</MDBBtn>
						</div>
					</MDBCardBody>
				</MDBCard>

				{/* Info stopka */}
				<MDBAlert color='light' className='text-center'>
					<MDBIcon fas icon='info-circle' className='me-2' />
					<strong>Katalog komponentów MDB dla Maintly CMMS</strong> - Wszystkie komponenty są w pełni funkcjonalne i gotowe do użycia w aplikacji.
				</MDBAlert>

				{/* SEKCJA 9: TOASTS - Powiadomienia (graficzne preview) */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='bell' className='me-2' />
						9. Toast Notifications - Powiadomienia Push (Preview)
					</MDBCardHeader>
					<MDBCardBody>
						<MDBTypography tag='h6' className='mb-3'>Przykłady toastów systemowych:</MDBTypography>
						
						{/* Toast Success - symulacja */}
						<div className='border border-success rounded p-3 mb-3' style={{backgroundColor: '#d4edda'}}>
							<div className='d-flex justify-content-between align-items-start'>
								<div className='d-flex align-items-center'>
									<MDBIcon fas icon='check-circle' size='2x' className='text-success me-3' />
									<div>
										<strong className='text-success'>Sukces!</strong>
										<div className='small text-muted'>2s temu</div>
										<div className='mt-1'>Zlecenie #1234 zostało zapisane</div>
									</div>
								</div>
								<MDBBtn color='link' className='text-success p-0' size='sm'>×</MDBBtn>
							</div>
						</div>

						{/* Toast Error - symulacja */}
						<div className='border border-danger rounded p-3 mb-3' style={{backgroundColor: '#f8d7da'}}>
							<div className='d-flex justify-content-between align-items-start'>
								<div className='d-flex align-items-center'>
									<MDBIcon fas icon='exclamation-circle' size='2x' className='text-danger me-3' />
									<div>
										<strong className='text-danger'>Błąd!</strong>
										<div className='small text-muted'>15s temu</div>
										<div className='mt-1'>Nie udało się połączyć z serwerem</div>
									</div>
								</div>
								<MDBBtn color='link' className='text-danger p-0' size='sm'>×</MDBBtn>
							</div>
						</div>

						{/* Toast Warning - symulacja */}
						<div className='border border-warning rounded p-3 mb-3' style={{backgroundColor: '#fff3cd'}}>
							<div className='d-flex justify-content-between align-items-start'>
								<div className='d-flex align-items-center'>
									<MDBIcon fas icon='exclamation-triangle' size='2x' className='text-warning me-3' />
									<div>
										<strong className='text-warning'>Ostrzeżenie!</strong>
										<div className='small text-muted'>1min temu</div>
										<div className='mt-1'>Sprzęt A-01 wymaga przeglądu za 3 dni</div>
									</div>
								</div>
								<MDBBtn color='link' className='text-warning p-0' size='sm'>×</MDBBtn>
							</div>
						</div>

						{/* Toast Info - symulacja */}
						<div className='border border-info rounded p-3' style={{backgroundColor: '#d1ecf1'}}>
							<div className='d-flex justify-content-between align-items-start'>
								<div className='d-flex align-items-center'>
									<MDBIcon fas icon='info-circle' size='2x' className='text-info me-3' />
									<div>
										<strong className='text-info'>Informacja</strong>
										<div className='small text-muted'>5min temu</div>
										<div className='mt-1'>Nowa wersja aplikacji dostępna</div>
									</div>
								</div>
								<MDBBtn color='link' className='text-info p-0' size='sm'>×</MDBBtn>
							</div>
						</div>

						<MDBAlert color='light' className='mt-3 mb-0'>
							<small>
								<MDBIcon fas icon='lightbulb' className='me-1' />
								Toasty stackują się w prawym górnym rogu i znikają automatycznie po 5 sekundach
							</small>
						</MDBAlert>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 10: TIMELINE - Historia zdarzeń */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='history' className='me-2' />
						10. Timeline - Historia Zlecenia
					</MDBCardHeader>
					<MDBCardBody>
						{/* Timeline item 1 */}
						<div className='d-flex mb-4'>
							<div className='me-3 text-center' style={{minWidth: '80px'}}>
								<div className='text-muted small'>10:30</div>
								<div className='text-muted small'>08.11.24</div>
							</div>
							<div className='position-relative' style={{minWidth: '30px'}}>
								<div className='position-absolute' style={{
									left: '13px',
									top: '30px',
									width: '2px',
									height: '100%',
									backgroundColor: '#dee2e6'
								}}></div>
								<div className='bg-primary rounded-circle d-flex align-items-center justify-content-center' 
										 style={{width: '30px', height: '30px'}}>
									<MDBIcon fas icon='plus' className='text-white' size='sm' />
								</div>
							</div>
							<div className='flex-grow-1 ms-3'>
								<strong>Zlecenie utworzone</strong>
								<div className='text-muted small'>przez: Jan Kowalski</div>
								<div className='mt-1'>Utworzono nowe zlecenie serwisowe #1234</div>
							</div>
						</div>

						{/* Timeline item 2 */}
						<div className='d-flex mb-4'>
							<div className='me-3 text-center' style={{minWidth: '80px'}}>
								<div className='text-muted small'>11:15</div>
								<div className='text-muted small'>08.11.24</div>
							</div>
							<div className='position-relative' style={{minWidth: '30px'}}>
								<div className='position-absolute' style={{
									left: '13px',
									top: '30px',
									width: '2px',
									height: '100%',
									backgroundColor: '#dee2e6'
								}}></div>
								<div className='bg-warning rounded-circle d-flex align-items-center justify-content-center' 
										 style={{width: '30px', height: '30px'}}>
									<MDBIcon fas icon='wrench' className='text-white' size='sm' />
								</div>
							</div>
							<div className='flex-grow-1 ms-3'>
								<strong>Rozpoczęto prace</strong>
								<div className='text-muted small'>przez: Adam Nowak (serwisant)</div>
								<div className='mt-1'>Status zmieniony na "W realizacji"</div>
							</div>
						</div>

						{/* Timeline item 3 */}
						<div className='d-flex mb-4'>
							<div className='me-3 text-center' style={{minWidth: '80px'}}>
								<div className='text-muted small'>13:45</div>
								<div className='text-muted small'>08.11.24</div>
							</div>
							<div className='position-relative' style={{minWidth: '30px'}}>
								<div className='position-absolute' style={{
									left: '13px',
									top: '30px',
									width: '2px',
									height: '100%',
									backgroundColor: '#dee2e6'
								}}></div>
								<div className='bg-info rounded-circle d-flex align-items-center justify-content-center' 
										 style={{width: '30px', height: '30px'}}>
									<MDBIcon fas icon='comment' className='text-white' size='sm' />
								</div>
							</div>
							<div className='flex-grow-1 ms-3'>
								<strong>Dodano komentarz</strong>
								<div className='text-muted small'>przez: Adam Nowak</div>
								<div className='mt-1 p-2 bg-light rounded'>
									"Wymieniono filtr, sprawdzono ciśnienie - wszystko OK"
								</div>
							</div>
						</div>

						{/* Timeline item 4 */}
						<div className='d-flex'>
							<div className='me-3 text-center' style={{minWidth: '80px'}}>
								<div className='text-muted small'>14:20</div>
								<div className='text-muted small'>08.11.24</div>
							</div>
							<div className='position-relative' style={{minWidth: '30px'}}>
								<div className='bg-success rounded-circle d-flex align-items-center justify-content-center' 
										 style={{width: '30px', height: '30px'}}>
									<MDBIcon fas icon='check' className='text-white' size='sm' />
								</div>
							</div>
							<div className='flex-grow-1 ms-3'>
								<strong>Zlecenie zakończone</strong>
								<div className='text-muted small'>przez: Adam Nowak</div>
								<div className='mt-1'>
									<MDBBadge color='success' pill>Zakończone</MDBBadge>
									<span className='ms-2 small'>Czas realizacji: 3h 10min</span>
								</div>
							</div>
						</div>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 11: QUICK ACTIONS - Szybkie akcje */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='bolt' className='me-2' />
						11. Quick Actions - Szybkie Akcje
					</MDBCardHeader>
					<MDBCardBody>
						<MDBRow>
							<MDBCol md='6' className='mb-3'>
								<div className='border rounded p-3 d-flex align-items-center hover-shadow' 
										 style={{cursor: 'pointer', transition: 'all 0.3s'}}>
									<div className='bg-primary rounded-circle p-3 me-3'>
										<MDBIcon fas icon='plus' className='text-white' size='2x' />
									</div>
									<div>
										<strong>Nowe zlecenie</strong>
										<div className='small text-muted'>Utwórz zlecenie serwisowe</div>
									</div>
									<MDBIcon fas icon='chevron-right' className='ms-auto text-muted' />
								</div>
							</MDBCol>

							<MDBCol md='6' className='mb-3'>
								<div className='border rounded p-3 d-flex align-items-center hover-shadow' 
										 style={{cursor: 'pointer', transition: 'all 0.3s'}}>
									<div className='bg-danger rounded-circle p-3 me-3'>
										<MDBIcon fas icon='exclamation-triangle' className='text-white' size='2x' />
									</div>
									<div>
										<strong>Zgłoś awarię</strong>
										<div className='small text-muted'>Pilne zgłoszenie awarii</div>
									</div>
									<MDBIcon fas icon='chevron-right' className='ms-auto text-muted' />
								</div>
							</MDBCol>

							<MDBCol md='6' className='mb-3'>
								<div className='border rounded p-3 d-flex align-items-center hover-shadow' 
										 style={{cursor: 'pointer', transition: 'all 0.3s'}}>
									<div className='bg-success rounded-circle p-3 me-3'>
										<MDBIcon fas icon='wrench' className='text-white' size='2x' />
									</div>
									<div>
										<strong>Dodaj sprzęt</strong>
										<div className='small text-muted'>Rejestruj nowy sprzęt</div>
									</div>
									<MDBIcon fas icon='chevron-right' className='ms-auto text-muted' />
								</div>
							</MDBCol>

							<MDBCol md='6' className='mb-3'>
								<div className='border rounded p-3 d-flex align-items-center hover-shadow' 
										 style={{cursor: 'pointer', transition: 'all 0.3s'}}>
									<div className='bg-info rounded-circle p-3 me-3'>
										<MDBIcon fas icon='calendar-alt' className='text-white' size='2x' />
									</div>
									<div>
										<strong>Harmonogram</strong>
										<div className='small text-muted'>Zaplanuj konserwację</div>
									</div>
									<MDBIcon fas icon='chevron-right' className='ms-auto text-muted' />
								</div>
							</MDBCol>
						</MDBRow>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 12: TOOLTIPS & BUTTON GROUPS */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='question-circle' className='me-2' />
						12. Tooltips & Button Groups
					</MDBCardHeader>
					<MDBCardBody>
						<MDBTypography tag='h6' className='mb-3'>Tooltips (podpowiedzi):</MDBTypography>
						<div className='mb-4'>
							<MDBTooltip tag='span' title='To jest tooltip - pomaga użytkownikowi zrozumieć funkcję'>
								<MDBBtn color='primary' className='me-2'>
									<MDBIcon fas icon='info-circle' className='me-1' />
									Najedź na mnie
								</MDBBtn>
							</MDBTooltip>

							<MDBTooltip tag='span' title='Kliknij aby zapisać zmiany w zleceniu'>
								<MDBBtn color='success'>
									<MDBIcon fas icon='save' className='me-1' />
									Zapisz
								</MDBBtn>
							</MDBTooltip>
						</div>

						<MDBTypography tag='h6' className='mb-3 mt-4'>Button Groups - Filtry statusu:</MDBTypography>
						<MDBBtnGroup>
							<MDBBtn color='primary'>Wszystkie</MDBBtn>
							<MDBBtn outline color='primary'>Nowe</MDBBtn>
							<MDBBtn outline color='primary'>W realizacji</MDBBtn>
							<MDBBtn outline color='primary'>Zakończone</MDBBtn>
						</MDBBtnGroup>

						<MDBTypography tag='h6' className='mb-3 mt-4'>Button Groups - Widoki:</MDBTypography>
						<MDBBtnGroup>
							<MDBBtn color='secondary'>
								<MDBIcon fas icon='th-large' />
							</MDBBtn>
							<MDBBtn outline color='secondary'>
								<MDBIcon fas icon='list' />
							</MDBBtn>
							<MDBBtn outline color='secondary'>
								<MDBIcon fas icon='table' />
							</MDBBtn>
						</MDBBtnGroup>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 13: CHECKBOXES & RADIOS - Wybory */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='check-square' className='me-2' />
						13. Checkboxes & Radios - Formularze wyboru
					</MDBCardHeader>
					<MDBCardBody>
						<MDBRow>
							<MDBCol md='6'>
								<MDBTypography tag='h6' className='mb-3'>Checkboxes - Wybór wielu:</MDBTypography>
								<MDBCheckbox 
									name='flexCheck1' 
									value='' 
									id='flexCheckChecked1' 
									label='Sprężarki' 
									defaultChecked 
								/>
								<MDBCheckbox 
									name='flexCheck2' 
									value='' 
									id='flexCheckChecked2' 
									label='Pompy hydrauliczne' 
									defaultChecked 
								/>
								<MDBCheckbox 
									name='flexCheck3' 
									value='' 
									id='flexCheckChecked3' 
									label='Systemy HVAC' 
								/>
								<MDBCheckbox 
									name='flexCheck4' 
									value='' 
									id='flexCheckChecked4' 
									label='Linie produkcyjne' 
								/>
							</MDBCol>

							<MDBCol md='6'>
								<MDBTypography tag='h6' className='mb-3'>Radio - Wybór jednego:</MDBTypography>
								<MDBRadio 
									name='priority' 
									id='radio1' 
									label='Niski priorytet' 
								/>
								<MDBRadio 
									name='priority' 
									id='radio2' 
									label='Średni priorytet' 
									defaultChecked 
								/>
								<MDBRadio 
									name='priority' 
									id='radio3' 
									label='Wysoki priorytet' 
								/>
								<MDBRadio 
									name='priority' 
									id='radio4' 
									label='Krytyczny priorytet' 
								/>
							</MDBCol>
						</MDBRow>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 14: FILE UPLOAD - Załączniki */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='paperclip' className='me-2' />
						14. File Upload - Dodawanie załączników
					</MDBCardHeader>
					<MDBCardBody>
						<MDBTypography tag='h6' className='mb-3'>Załącz dokumentację do zlecenia:</MDBTypography>
						<MDBFile label='Wybierz pliki (PDF, JPG, PNG)' id='customFile' />
						
						<MDBTypography tag='h6' className='mb-3 mt-4'>Załączone pliki:</MDBTypography>
						<MDBListGroup>
							<MDBListGroupItem className='d-flex justify-content-between align-items-center'>
								<div>
									<MDBIcon fas icon='file-pdf' className='text-danger me-2' />
									<strong>instrukcja_serwisowa.pdf</strong>
									<small className='text-muted ms-2'>(2.4 MB)</small>
								</div>
								<MDBBtn color='link' className='text-danger p-0'>
									<MDBIcon fas icon='trash' />
								</MDBBtn>
							</MDBListGroupItem>
							<MDBListGroupItem className='d-flex justify-content-between align-items-center'>
								<div>
									<MDBIcon fas icon='file-image' className='text-primary me-2' />
									<strong>zdjecie_przed.jpg</strong>
									<small className='text-muted ms-2'>(1.8 MB)</small>
								</div>
								<MDBBtn color='link' className='text-danger p-0'>
									<MDBIcon fas icon='trash' />
								</MDBBtn>
							</MDBListGroupItem>
							<MDBListGroupItem className='d-flex justify-content-between align-items-center'>
								<div>
									<MDBIcon fas icon='file-image' className='text-primary me-2' />
									<strong>zdjecie_po.jpg</strong>
									<small className='text-muted ms-2'>(1.5 MB)</small>
								</div>
								<MDBBtn color='link' className='text-danger p-0'>
									<MDBIcon fas icon='trash' />
								</MDBBtn>
							</MDBListGroupItem>
						</MDBListGroup>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 15: STATS CARDS - Zaawansowane karty statystyk */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='chart-line' className='me-2' />
						15. Advanced Stats - Zaawansowane statystyki
					</MDBCardHeader>
					<MDBCardBody>
						<MDBRow>
							{/* Stat 1 */}
							<MDBCol md='6' lg='3' className='mb-3'>
								<MDBCard className='border-start border-primary border-4'>
									<MDBCardBody>
										<div className='d-flex justify-content-between align-items-center'>
											<div>
												<div className='text-muted small text-uppercase mb-1'>Dziś</div>
												<div className='h4 mb-0'>12</div>
												<div className='small text-success'>
													<MDBIcon fas icon='arrow-up' /> +25%
												</div>
											</div>
											<MDBIcon fas icon='clipboard-list' size='2x' className='text-primary opacity-50' />
										</div>
									</MDBCardBody>
								</MDBCard>
							</MDBCol>

							{/* Stat 2 */}
							<MDBCol md='6' lg='3' className='mb-3'>
								<MDBCard className='border-start border-success border-4'>
									<MDBCardBody>
										<div className='d-flex justify-content-between align-items-center'>
											<div>
												<div className='text-muted small text-uppercase mb-1'>Zakończone</div>
												<div className='h4 mb-0'>156</div>
												<div className='small text-success'>
													<MDBIcon fas icon='arrow-up' /> +12%
												</div>
											</div>
											<MDBIcon fas icon='check-circle' size='2x' className='text-success opacity-50' />
										</div>
									</MDBCardBody>
								</MDBCard>
							</MDBCol>

							{/* Stat 3 */}
							<MDBCol md='6' lg='3' className='mb-3'>
								<MDBCard className='border-start border-warning border-4'>
									<MDBCardBody>
										<div className='d-flex justify-content-between align-items-center'>
											<div>
												<div className='text-muted small text-uppercase mb-1'>Śr. czas</div>
												<div className='h4 mb-0'>4.2h</div>
												<div className='small text-danger'>
													<MDBIcon fas icon='arrow-down' /> -8%
												</div>
											</div>
											<MDBIcon fas icon='clock' size='2x' className='text-warning opacity-50' />
										</div>
									</MDBCardBody>
								</MDBCard>
							</MDBCol>

							{/* Stat 4 */}
							<MDBCol md='6' lg='3' className='mb-3'>
								<MDBCard className='border-start border-danger border-4'>
									<MDBCardBody>
										<div className='d-flex justify-content-between align-items-center'>
											<div>
												<div className='text-muted small text-uppercase mb-1'>Pilne</div>
												<div className='h4 mb-0'>3</div>
												<div className='small text-danger'>
													<MDBIcon fas icon='exclamation-triangle' /> Wymagają uwagi
												</div>
											</div>
											<MDBIcon fas icon='fire' size='2x' className='text-danger opacity-50' />
										</div>
									</MDBCardBody>
								</MDBCard>
							</MDBCol>
						</MDBRow>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 16: MODALS - Okna dialogowe */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='window-restore' className='me-2' />
						16. Modals - Okna dialogowe (Preview struktur)
					</MDBCardHeader>
					<MDBCardBody>
						<MDBRow>
							<MDBCol md='4' className='mb-3'>
								<div className='border rounded p-3'>
									<strong className='d-block mb-2'>
										<MDBIcon fas icon='exclamation-triangle' className='text-warning me-2' />
										Potwierdzenie usunięcia
									</strong>
									<div className='small text-muted mb-3'>
										Czy na pewno chcesz usunąć zlecenie #1234?
									</div>
									<div className='d-flex gap-2'>
										<MDBBtn color='danger' size='sm'>
											<MDBIcon fas icon='trash' className='me-1' />
											Usuń
										</MDBBtn>
										<MDBBtn outline color='secondary' size='sm'>Anuluj</MDBBtn>
									</div>
								</div>
							</MDBCol>

							<MDBCol md='4' className='mb-3'>
								<div className='border rounded p-3'>
									<strong className='d-block mb-2'>
										<MDBIcon fas icon='info-circle' className='text-info me-2' />
										Szczegóły sprzętu
									</strong>
									<div className='small mb-2'>
										<strong>Model:</strong> Sprężarka XYZ-500
									</div>
									<div className='small mb-2'>
										<strong>Numer seryjny:</strong> SN123456
									</div>
									<div className='small mb-3'>
										<strong>Status:</strong> <MDBBadge color='success'>Sprawny</MDBBadge>
									</div>
									<MDBBtn color='primary' size='sm' block>Zamknij</MDBBtn>
								</div>
							</MDBCol>

							<MDBCol md='4' className='mb-3'>
								<div className='border rounded p-3'>
									<strong className='d-block mb-2'>
										<MDBIcon fas icon='cog' className='text-secondary me-2' />
										Ustawienia powiadomień
									</strong>
									<MDBSwitch id='notif1' label='Email' defaultChecked />
									<MDBSwitch id='notif2' label='Push' defaultChecked />
									<MDBSwitch id='notif3' label='SMS' />
									<div className='mt-3'>
										<MDBBtn color='success' size='sm' block>Zapisz</MDBBtn>
									</div>
								</div>
							</MDBCol>
						</MDBRow>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 17: DROPDOWNS & MENUS */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='bars' className='me-2' />
						17. Dropdowns & Context Menus
					</MDBCardHeader>
					<MDBCardBody>
						<MDBRow>
							<MDBCol md='6' className='mb-3'>
								<MDBTypography tag='h6' className='mb-3'>Menu akcji zlecenia:</MDBTypography>
								<div className='border rounded p-3'>
									<div className='d-flex justify-content-between align-items-center mb-3'>
										<div>
											<strong>Zlecenie #1234</strong>
											<div className='small text-muted'>Wymiana filtra</div>
										</div>
										<MDBBtn color='link' className='p-0'>
											<MDBIcon fas icon='ellipsis-v' size='lg' />
										</MDBBtn>
									</div>
									
									{/* Symulacja rozwiniętego menu */}
									<div className='border rounded bg-white shadow-sm p-2'>
										<div className='dropdown-item d-flex align-items-center py-2' style={{cursor: 'pointer'}}>
											<MDBIcon fas icon='edit' className='me-2 text-primary' />
											Edytuj zlecenie
										</div>
										<div className='dropdown-item d-flex align-items-center py-2' style={{cursor: 'pointer'}}>
											<MDBIcon fas icon='user-plus' className='me-2 text-success' />
											Przypisz serwisanta
										</div>
										<div className='dropdown-item d-flex align-items-center py-2' style={{cursor: 'pointer'}}>
											<MDBIcon fas icon='calendar' className='me-2 text-warning' />
											Zmień termin
										</div>
										<hr className='my-1' />
										<div className='dropdown-item d-flex align-items-center py-2' style={{cursor: 'pointer'}}>
											<MDBIcon fas icon='trash' className='me-2 text-danger' />
											Usuń zlecenie
										</div>
									</div>
								</div>
							</MDBCol>

							<MDBCol md='6' className='mb-3'>
								<MDBTypography tag='h6' className='mb-3'>Filtry i sortowanie:</MDBTypography>
								<div className='d-flex gap-2 mb-3'>
									<div className='border rounded px-3 py-2 flex-grow-1'>
										<div className='d-flex justify-content-between align-items-center'>
											<span className='small'>Status: Wszystkie</span>
											<MDBIcon fas icon='chevron-down' size='sm' />
										</div>
									</div>
									<div className='border rounded px-3 py-2 flex-grow-1'>
										<div className='d-flex justify-content-between align-items-center'>
											<span className='small'>Priorytet: Wysoki</span>
											<MDBIcon fas icon='chevron-down' size='sm' />
										</div>
									</div>
								</div>

								<div className='border rounded px-3 py-2'>
									<div className='d-flex justify-content-between align-items-center'>
										<span className='small'>
											<MDBIcon fas icon='sort' className='me-2' />
											Sortuj: Data utworzenia
										</span>
										<MDBIcon fas icon='chevron-down' size='sm' />
									</div>
								</div>
							</MDBCol>
						</MDBRow>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 18: SPINNERS & LOADING STATES */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='spinner' className='me-2' />
						18. Spinners & Loading States - Stany ładowania
					</MDBCardHeader>
					<MDBCardBody>
						<MDBRow>
							<MDBCol md='3' className='mb-3 text-center'>
								<MDBSpinner color='primary' role='status'>
									<span className='visually-hidden'>Ładowanie...</span>
								</MDBSpinner>
								<div className='mt-2 small text-muted'>Ładowanie...</div>
							</MDBCol>
							<MDBCol md='3' className='mb-3 text-center'>
								<MDBSpinner color='success' grow role='status'>
									<span className='visually-hidden'>Zapisywanie...</span>
								</MDBSpinner>
								<div className='mt-2 small text-muted'>Zapisywanie...</div>
							</MDBCol>
							<MDBCol md='3' className='mb-3 text-center'>
								<MDBSpinner color='danger' size='sm' role='status'>
									<span className='visually-hidden'>Usuwanie...</span>
								</MDBSpinner>
								<div className='mt-2 small text-muted'>Usuwanie...</div>
							</MDBCol>
							<MDBCol md='3' className='mb-3 text-center'>
								<MDBBtn disabled color='primary'>
									<MDBSpinner size='sm' role='status' tag='span' className='me-2'>
										<span className='visually-hidden'>Przetwarzanie...</span>
									</MDBSpinner>
									Przetwarzanie...
								</MDBBtn>
							</MDBCol>
						</MDBRow>

						<hr />

						<MDBTypography tag='h6' className='mb-3 mt-3'>Karty ze stanem ładowania:</MDBTypography>
						<MDBRow>
							<MDBCol md='6' className='mb-3'>
								<MDBCard className='text-center p-4'>
									<MDBSpinner color='primary' className='mx-auto mb-3' role='status'>
										<span className='visually-hidden'>Ładowanie...</span>
									</MDBSpinner>
									<div className='text-muted'>Pobieranie danych zlecenia...</div>
								</MDBCard>
							</MDBCol>
							<MDBCol md='6' className='mb-3'>
								<MDBCard>
									<div className='p-3 bg-light'>
										<div className='placeholder-glow'>
											<span className='placeholder col-7 mb-2'></span>
											<span className='placeholder col-4'></span>
											<span className='placeholder col-8 mt-2'></span>
										</div>
									</div>
								</MDBCard>
							</MDBCol>
						</MDBRow>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 19: ACCORDION - Rozwijane sekcje */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='chevron-down' className='me-2' />
						19. Accordion - FAQ / Dokumentacja techniczna
					</MDBCardHeader>
					<MDBCardBody>
						{/* Accordion FAQ - Bootstrap native */}
						<div className='accordion' id='accordionFAQ'>
							<div className='accordion-item'>
								<h2 className='accordion-header' id='headingOne'>
									<button className='accordion-button' type='button' data-mdb-toggle='collapse' data-mdb-target='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>
										<strong>Jak utworzyć nowe zlecenie serwisowe?</strong>
									</button>
								</h2>
								<div id='collapseOne' className='accordion-collapse collapse show' aria-labelledby='headingOne' data-mdb-parent='#accordionFAQ'>
									<div className='accordion-body'>
										<ol className='mb-0'>
											<li>Kliknij przycisk "Nowe zlecenie" na dashboardzie</li>
											<li>Wybierz typ zlecenia (konserwacja / naprawa / awaria)</li>
											<li>Przypisz odpowiedni sprzęt z listy</li>
											<li>Ustaw priorytet i termin realizacji</li>
											<li>Dodaj opis problemu i załączniki (opcjonalnie)</li>
											<li>Kliknij "Zapisz" aby utworzyć zlecenie</li>
										</ol>
									</div>
								</div>
							</div>

							<div className='accordion-item'>
								<h2 className='accordion-header' id='headingTwo'>
									<button className='accordion-button collapsed' type='button' data-mdb-toggle='collapse' data-mdb-target='#collapseTwo' aria-expanded='false' aria-controls='collapseTwo'>
										<strong>Jak przypisać serwisanta do zlecenia?</strong>
									</button>
								</h2>
								<div id='collapseTwo' className='accordion-collapse collapse' aria-labelledby='headingTwo' data-mdb-parent='#accordionFAQ'>
									<div className='accordion-body'>
										<p className='mb-2'>Istnieją 2 sposoby przypisania serwisanta:</p>
										<ul className='mb-0'>
											<li><strong>Automatyczne:</strong> System automatycznie przypisuje najbliższego dostępnego serwisanta</li>
											<li><strong>Manualne:</strong> Otwórz zlecenie → kliknij "Przypisz serwisanta" → wybierz z listy</li>
										</ul>
									</div>
								</div>
							</div>

							<div className='accordion-item'>
								<h2 className='accordion-header' id='headingThree'>
									<button className='accordion-button collapsed' type='button' data-mdb-toggle='collapse' data-mdb-target='#collapseThree' aria-expanded='false' aria-controls='collapseThree'>
										<strong>Jak zgłosić awarię pilną?</strong>
									</button>
								</h2>
								<div id='collapseThree' className='accordion-collapse collapse' aria-labelledby='headingThree' data-mdb-parent='#accordionFAQ'>
									<div className='accordion-body'>
										<div className='alert alert-danger mb-2'>
											<MDBIcon fas icon='exclamation-triangle' className='me-2' />
											<strong>Awaria pilna wymaga natychmiastowej reakcji!</strong>
										</div>
										<p className='mb-1'>1. Kliknij czerwony przycisk "Zgłoś awarię" (FAB w prawym dolnym rogu)</p>
										<p className='mb-1'>2. Wybierz sprzęt który uległ awarii</p>
										<p className='mb-1'>3. System automatycznie przypisze priorytet "Krytyczny"</p>
										<p className='mb-0'>4. Serwisant otrzyma natychmiastowe powiadomienie push</p>
									</div>
								</div>
							</div>

							<div className='accordion-item'>
								<h2 className='accordion-header' id='headingFour'>
									<button className='accordion-button collapsed' type='button' data-mdb-toggle='collapse' data-mdb-target='#collapseFour' aria-expanded='false' aria-controls='collapseFour'>
										<strong>Jak dodać nowy sprzęt do rejestru?</strong>
									</button>
								</h2>
								<div id='collapseFour' className='accordion-collapse collapse' aria-labelledby='headingFour' data-mdb-parent='#accordionFAQ'>
									<div className='accordion-body'>
										<p className='mb-2'>Menu → Sprzęt → Dodaj nowy</p>
										<p className='mb-1'><strong>Wymagane pola:</strong></p>
										<ul className='mb-0'>
											<li>Numer inwentarzowy (unikalny)</li>
											<li>Nazwa / Model sprzętu</li>
											<li>Kategoria (sprężarki, pompy, HVAC, etc.)</li>
											<li>Lokalizacja (hala, piętro, pomieszczenie)</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 20: TABS - Zakładki */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='folder-open' className='me-2' />
						20. Tabs - Panel szczegółów zlecenia
					</MDBCardHeader>
					<MDBCardBody>
						{/* Tab pills/headers - statyczna wizualizacja */}
						<ul className='nav nav-pills mb-3'>
							<li className='nav-item'>
								<a className='nav-link active' href='#'>
									<MDBIcon fas icon='info-circle' className='me-1' />
									Szczegóły
								</a>
							</li>
							<li className='nav-item'>
								<a className='nav-link' href='#'>
									<MDBIcon fas icon='history' className='me-1' />
									Historia
								</a>
							</li>
							<li className='nav-item'>
								<a className='nav-link' href='#'>
									<MDBIcon fas icon='paperclip' className='me-1' />
									Załączniki (3)
								</a>
							</li>
							<li className='nav-item'>
								<a className='nav-link' href='#'>
									<MDBIcon fas icon='comments' className='me-1' />
									Komentarze (12)
								</a>
							</li>
						</ul>

						{/* Aktywna zawartość taba "Szczegóły" */}
						<div className='border rounded p-3 bg-light'>
							<MDBRow>
								<MDBCol md='6'>
									<div className='mb-3'>
										<strong className='d-block text-muted small mb-1'>Numer zlecenia</strong>
										<span>#1234</span>
									</div>
									<div className='mb-3'>
										<strong className='d-block text-muted small mb-1'>Typ</strong>
										<MDBBadge color='info'>Konserwacja</MDBBadge>
									</div>
									<div className='mb-3'>
										<strong className='d-block text-muted small mb-1'>Status</strong>
										<MDBBadge color='warning'>W realizacji</MDBBadge>
									</div>
								</MDBCol>
								<MDBCol md='6'>
									<div className='mb-3'>
										<strong className='d-block text-muted small mb-1'>Priorytet</strong>
										<MDBBadge color='danger'>Wysoki</MDBBadge>
									</div>
									<div className='mb-3'>
										<strong className='d-block text-muted small mb-1'>Termin realizacji</strong>
										<span>15.11.2024 14:00</span>
									</div>
									<div className='mb-3'>
										<strong className='d-block text-muted small mb-1'>Serwisant</strong>
										<div className='d-flex align-items-center'>
											<div className='bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2' 
													 style={{width: '30px', height: '30px', fontSize: '12px'}}>
												AN
											</div>
											Adam Nowak
										</div>
									</div>
								</MDBCol>
							</MDBRow>
						</div>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 21: FLOATING ACTION BUTTON (FAB) */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='plus-circle' className='me-2' />
						21. FAB - Floating Action Buttons
					</MDBCardHeader>
					<MDBCardBody>
						<MDBTypography tag='h6' className='mb-3'>Przyciski akcji w prawym dolnym rogu ekranu:</MDBTypography>
						
						<div className='position-relative border rounded p-4 bg-light' style={{minHeight: '300px'}}>
							<div className='text-muted text-center mb-3'>
								<MDBIcon fas icon='desktop' size='3x' className='opacity-25' />
								<div className='mt-2'>Główna przestrzeń aplikacji</div>
							</div>

							{/* Symulacja FAB w prawym dolnym rogu */}
							<div className='position-absolute' style={{bottom: '20px', right: '20px'}}>
								<div className='d-flex flex-column gap-2 align-items-end'>
									{/* Mini FABs */}
									<MDBBtn floating size='sm' color='secondary' className='shadow'>
										<MDBIcon fas icon='wrench' />
									</MDBBtn>
									<MDBBtn floating size='sm' color='secondary' className='shadow'>
										<MDBIcon fas icon='clipboard-list' />
									</MDBBtn>
									<MDBBtn floating size='sm' color='secondary' className='shadow'>
										<MDBIcon fas icon='cog' />
									</MDBBtn>
									
									{/* Main FAB */}
									<MDBBtn floating color='danger' size='lg' className='shadow-5'>
										<MDBIcon fas icon='exclamation-triangle' size='lg' />
									</MDBBtn>
								</div>
							</div>

							<div className='position-absolute' style={{bottom: '20px', left: '20px'}}>
								<MDBBtn floating color='primary' size='lg' className='shadow-5'>
									<MDBIcon fas icon='plus' size='lg' />
								</MDBBtn>
							</div>
						</div>

						<MDBAlert color='light' className='mt-3 mb-0'>
							<small>
								<MDBIcon fas icon='lightbulb' className='me-1' />
								FAB czerwony (awaria) zawsze widoczny, niebieski (dodaj) tylko na listach
							</small>
						</MDBAlert>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 22: BREADCRUMBS & PAGINATION */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='map-signs' className='me-2' />
						22. Breadcrumbs & Pagination - Nawigacja
					</MDBCardHeader>
					<MDBCardBody>
						<MDBTypography tag='h6' className='mb-3'>Breadcrumbs - Ścieżka nawigacji:</MDBTypography>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<a href='#'>
										<MDBIcon fas icon='home' />
									</a>
								</li>
								<li className='breadcrumb-item'><a href='#'>Zlecenia</a></li>
								<li className='breadcrumb-item'><a href='#'>W realizacji</a></li>
								<li className='breadcrumb-item active' aria-current='page'>Zlecenie #1234</li>
							</ol>
						</nav>

						<hr className='my-4' />

						<MDBTypography tag='h6' className='mb-3'>Pagination - Stronicowanie:</MDBTypography>
						<nav aria-label='Page navigation'>
							<ul className='pagination'>
								<li className='page-item disabled'>
									<a className='page-link' href='#'>
										<MDBIcon fas icon='angle-double-left' />
									</a>
								</li>
								<li className='page-item disabled'>
									<a className='page-link' href='#'>Poprzednia</a>
								</li>
								<li className='page-item active'><a className='page-link' href='#'>1</a></li>
								<li className='page-item'><a className='page-link' href='#'>2</a></li>
								<li className='page-item'><a className='page-link' href='#'>3</a></li>
								<li className='page-item'><a className='page-link' href='#'>4</a></li>
								<li className='page-item'><a className='page-link' href='#'>5</a></li>
								<li className='page-item'>
									<a className='page-link' href='#'>Następna</a>
								</li>
								<li className='page-item'>
									<a className='page-link' href='#'>
										<MDBIcon fas icon='angle-double-right' />
									</a>
								</li>
							</ul>
						</nav>

						<div className='text-muted small'>
							Wyświetlanie 1-20 z 156 zleceń
						</div>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 23: SEARCH & FILTERS - Wyszukiwarka */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='search' className='me-2' />
						23. Search & Advanced Filters - Wyszukiwarka zaawansowana
					</MDBCardHeader>
					<MDBCardBody>
						{/* Główne pole wyszukiwania */}
						<div className='position-relative mb-4'>
							<div className='input-group input-group-lg'>
								<span className='input-group-text'>
									<MDBIcon fas icon='search' />
								</span>
								<input 
									type='text' 
									className='form-control' 
									placeholder='Szukaj zleceń, sprzętu, serwisantów...'
								/>
								<MDBBtn color='primary'>
									Szukaj
								</MDBBtn>
							</div>
						</div>

						{/* Zaawansowane filtry */}
						<div className='border rounded p-3 bg-light'>
							<div className='d-flex justify-content-between align-items-center mb-3'>
								<strong>
									<MDBIcon fas icon='filter' className='me-2' />
									Filtry zaawansowane
								</strong>
								<MDBBtn color='link' size='sm' className='p-0 text-decoration-underline'>
									Wyczyść wszystkie
								</MDBBtn>
							</div>

							<MDBRow>
								<MDBCol md='3' className='mb-2'>
									{/* @ts-ignore */}
									<MDBSelect
										data={[
											{ text: 'Wszystkie statusy', value: '' },
											{ text: 'Nowe', value: 'new' },
											{ text: 'W realizacji', value: 'in-progress' },
											{ text: 'Zakończone', value: 'completed' }
										]}
										search
										label='Status'
									/>
								</MDBCol>
								<MDBCol md='3' className='mb-2'>
									{/* @ts-ignore */}
									<MDBSelect
										data={[
											{ text: 'Wszystkie priorytety', value: '' },
											{ text: 'Niski', value: 'low' },
											{ text: 'Średni', value: 'medium' },
											{ text: 'Wysoki', value: 'high' },
											{ text: 'Krytyczny', value: 'critical' }
										]}
										search
										label='Priorytet'
									/>
								</MDBCol>
								<MDBCol md='3' className='mb-2'>
									<MDBDatepicker label='Data od' />
								</MDBCol>
								<MDBCol md='3' className='mb-2'>
									<MDBDatepicker label='Data do' />
								</MDBCol>
							</MDBRow>

							<div className='mt-3'>
								<strong className='d-block mb-2 small text-muted'>Aktywne filtry:</strong>
								<div className='d-flex gap-2 flex-wrap'>
									<MDBBadge color='primary' pill className='p-2'>
										Status: W realizacji
										<MDBIcon fas icon='times' className='ms-2' style={{cursor: 'pointer'}} />
									</MDBBadge>
									<MDBBadge color='danger' pill className='p-2'>
										Priorytet: Wysoki
										<MDBIcon fas icon='times' className='ms-2' style={{cursor: 'pointer'}} />
									</MDBBadge>
									<MDBBadge color='info' pill className='p-2'>
										Data: Ostatnie 7 dni
										<MDBIcon fas icon='times' className='ms-2' style={{cursor: 'pointer'}} />
									</MDBBadge>
								</div>
							</div>
						</div>

						<div className='mt-3 text-end text-muted small'>
							<MDBIcon fas icon='check-circle' className='text-success me-1' />
							Znaleziono 23 wyniki pasujące do kryteriów
						</div>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 24: SELECT - Listy rozwijane */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='list-ul' className='me-2' />
						24. Select - Listy rozwijane MDB
					</MDBCardHeader>
					<MDBCardBody>
						<MDBRow>
							<MDBCol md='6' className='mb-4'>
								<MDBTypography tag='h6' className='mb-3'>Podstawowy Select - Status zlecenia:</MDBTypography>
								{/* @ts-ignore */}
								<MDBSelect
									label='Wybierz status'
									data={[
										{ text: 'Nowe', value: 'new' },
										{ text: 'W realizacji', value: 'in_progress' },
										{ text: 'Zakończone', value: 'completed' },
										{ text: 'Anulowane', value: 'cancelled' },
									]}
									value={statusValue}
									onValueChange={(e: any) => setStatusValue(e.value)}
								/>
							</MDBCol>

							<MDBCol md='6' className='mb-4'>
								<MDBTypography tag='h6' className='mb-3'>Select z ikonami - Priorytet:</MDBTypography>
								{/* @ts-ignore */}
								<MDBSelect
									label='Wybierz priorytet'
									data={[
										{ text: 'Niski', value: 'low' },
										{ text: 'Średni', value: 'medium' },
										{ text: 'Wysoki', value: 'high' },
										{ text: 'Krytyczny', value: 'critical' },
									]}
									value={priorityValue}
									onValueChange={(e: any) => setPriorityValue(e.value)}
								/>
							</MDBCol>

							<MDBCol md='6' className='mb-4'>
								<MDBTypography tag='h6' className='mb-3'>Multi Select - Kategorie sprzętu:</MDBTypography>
								{/* @ts-ignore */}
								<MDBSelect
									label='Wybierz kategorie (wiele)'
									multiple
									data={[
										{ text: 'Sprężarki', value: 1 },
										{ text: 'Pompy hydrauliczne', value: 2 },
										{ text: 'Systemy HVAC', value: 3 },
										{ text: 'Linie produkcyjne', value: 4 },
										{ text: 'Wózki widłowe', value: 5 },
										{ text: 'Generatory', value: 6 },
										{ text: 'Przenośniki', value: 7 },
										{ text: 'Roboty przemysłowe', value: 8 },
									]}
									value={categoriesValue}
									onValueChange={(e: any) => setCategoriesValue(e.value)}
								/>
							</MDBCol>

							<MDBCol md='6' className='mb-4'>
								<MDBTypography tag='h6' className='mb-3'>Select z wyszukiwaniem - Przypisz serwisanta:</MDBTypography>
								{/* @ts-ignore */}
								<MDBSelect
									label='Wybierz serwisanta'
									search
									data={[
										{ text: 'Jan Kowalski', value: 'jan_kowalski' },
										{ text: 'Adam Nowak', value: 'adam_nowak' },
										{ text: 'Piotr Wiśniewski', value: 'piotr_wisniewski' },
										{ text: 'Marek Wójcik', value: 'marek_wojcik' },
										{ text: 'Tomasz Kamiński', value: 'tomasz_kaminski' },
										{ text: 'Krzysztof Lewandowski', value: 'krzysztof_lewandowski' },
									]}
									value={technicianValue}
									onValueChange={(e: any) => setTechnicianValue(e.value)}
								/>
							</MDBCol>

							<MDBCol md='6' className='mb-4'>
								<MDBTypography tag='h6' className='mb-3'>Select - Lokalizacja sprzętu:</MDBTypography>
								{/* @ts-ignore */}
								<MDBSelect
									label='Wybierz lokalizację'
									data={[
										{ text: 'Hala A - Piętro 1 - Linia montażowa', value: 'a1_line' },
										{ text: 'Hala A - Piętro 1 - Magazyn', value: 'a1_warehouse' },
										{ text: 'Hala A - Piętro 2 - Produkcja', value: 'a2_production' },
										{ text: 'Hala B - Piętro 1 - Pakowanie', value: 'b1_packaging' },
										{ text: 'Hala B - Piętro 2 - Kontrola jakości', value: 'b2_quality' },
										{ text: 'Hala C - Magazyn główny', value: 'c_main_warehouse' },
										{ text: 'Hala C - Strefa załadunku', value: 'c_loading' },
									]}
									value={locationValue}
									onValueChange={(e: any) => setLocationValue(e.value)}
								/>
							</MDBCol>

							<MDBCol md='6' className='mb-4'>
								<MDBTypography tag='h6' className='mb-3'>Select disabled - Opcja zablokowana:</MDBTypography>
								{/* @ts-ignore */}
								<MDBSelect
									label='Typ zlecenia'
									disabled
									data={[
										{ text: 'Konserwacja', value: 'maintenance' },
										{ text: 'Naprawa', value: 'repair' },
										{ text: 'Awaria', value: 'emergency' },
									]}
								/>
								<small className='text-muted'>To pole jest zablokowane dla użytkowników podstawowych</small>
							</MDBCol>
						</MDBRow>

						<MDBAlert color='light' className='mt-3 mb-0'>
							<MDBIcon fas icon='info-circle' className='me-2' />
							<strong>MDBSelect:</strong> Prawdziwe komponenty MDB z obsługą state, multi-select i wyszukiwaniem!
						</MDBAlert>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 25: DATE & TIME PICKERS */}
				<MDBCard className='mb-4'>
					<MDBCardHeader className='bg-dark text-white'>
						<MDBIcon fas icon='calendar-alt' className='me-2' />
						25. Date & Time Pickers - Wybór daty i czasu
					</MDBCardHeader>
					<MDBCardBody>
						<MDBRow>
							<MDBCol md='6' className='mb-4'>
								<MDBTypography tag='h6' className='mb-3'>Date Picker - Wybór daty zlecenia:</MDBTypography>
								<MDBDatepicker />
							</MDBCol>

							<MDBCol md='6' className='mb-4'>
								<MDBTypography tag='h6' className='mb-3'>Time Picker - Wybór godziny:</MDBTypography>
								<MDBTimepicker />
							</MDBCol>

							<MDBCol md='6' className='mb-4'>
								<MDBTypography tag='h6' className='mb-3'>DateTime Picker - Data i czas:</MDBTypography>
								<MDBDateTimepicker />
							</MDBCol>

							<MDBCol md='6' className='mb-4'>
								<MDBTypography tag='h6' className='mb-3'>Inline Date Picker - Kalendarz (widoczny):</MDBTypography>
								<div className='border rounded p-3 bg-light'>
									<MDBDatepicker inline />
								</div>
							</MDBCol>
						</MDBRow>

						<MDBAlert color='light' className='mt-3 mb-0'>
							<MDBIcon fas icon='info-circle' className='me-2' />
							<strong>Date & Time Pickers MDB:</strong> Pełne wsparcie dla języka polskiego, format 24h dla czasu, dd.mm.yyyy dla dat.
						</MDBAlert>
					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA 26: ZAAWANSOWANE KOMPONENTY CMMS */}
				<MDBCard className='mb-4 border-danger border-3'>
					<MDBCardHeader className='bg-gradient' style={{background: 'linear-gradient(45deg, #dc3545, #c92a2a)'}}>
						<MDBTypography tag='h5' className='text-white mb-0'>
							<MDBIcon fas icon='cogs' className='me-2' />
							🔧 SEKCJA 26: Zaawansowane Komponenty CMMS
						</MDBTypography>
					</MDBCardHeader>
					<MDBCardBody>
						
						{/* 1. MDBRange - Suwaki budżetu/kosztów */}
						<MDBTypography tag='h6' className='mb-3 text-primary'>
							<MDBIcon fas icon='sliders-h' className='me-2' />
							Range Sliders - Filtry budżetu i kosztów
						</MDBTypography>
						<MDBRow className='mb-4'>
							<MDBCol md='6' className='mb-3'>
								<label className='form-label'>Maksymalny budżet: <strong>{budgetRange} PLN</strong></label>
								<MDBRange 
									min={'0'} 
									max={'50000'} 
									step={'500'} 
									value={budgetRange}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBudgetRange(Number(e.target.value))}
									id='budgetRange'
								/>
								<div className='d-flex justify-content-between mt-1'>
									<small className='text-muted'>0 PLN</small>
									<small className='text-muted'>50,000 PLN</small>
								</div>
							</MDBCol>
							<MDBCol md='6' className='mb-3'>
								<label className='form-label'>Procent wykonania: <strong>75%</strong></label>
								<MDBRange 
									min={'0'} 
									max={'100'} 
									step={'5'} 
									defaultValue={75}
									id='progressRange'
								/>
								<div className='d-flex justify-content-between mt-1'>
									<small className='text-muted'>0%</small>
									<small className='text-muted'>100%</small>
								</div>
							</MDBCol>
						</MDBRow>

						<hr className='my-4' />

						{/* 2. MDBStepper - Workflow zgłoszeń */}
						<MDBTypography tag='h6' className='mb-3 text-primary'>
							<MDBIcon fas icon='tasks' className='me-2' />
							Stepper - Proces zgłoszenia serwisowego
						</MDBTypography>
						<MDBCard className='mb-4'>
							<MDBCardBody>
								{/* Uproszczona wersja stepera - używamy gotowego layoutu MDB */}
								<div className='stepper-vertical'>
									{/* Krok 1 - Zakończony */}
									<div className='d-flex mb-4'>
										<div className='me-3'>
											<div className='bg-success rounded-circle d-flex align-items-center justify-content-center text-white'
													 style={{width: '40px', height: '40px', minWidth: '40px'}}>
												<MDBIcon fas icon='check' />
											</div>
										</div>
										<div className='flex-grow-1'>
											<h6 className='mb-1'>
												<MDBIcon fas icon='clipboard-list' className='me-2 text-primary' />
												Zgłoszenie problemu
											</h6>
											<p className='mb-1'><strong>Status:</strong> Nowe zgłoszenie utworzone przez operatora</p>
											<p className='text-muted mb-0'><small>08.11.2025, 09:15</small></p>
										</div>
									</div>

									{/* Krok 2 - Zakończony */}
									<div className='d-flex mb-4'>
										<div className='me-3'>
											<div className='bg-success rounded-circle d-flex align-items-center justify-content-center text-white'
													 style={{width: '40px', height: '40px', minWidth: '40px'}}>
												<MDBIcon fas icon='check' />
											</div>
										</div>
										<div className='flex-grow-1'>
											<h6 className='mb-1'>
												<MDBIcon fas icon='search' className='me-2 text-info' />
												Diagnostyka problemu
											</h6>
											<p className='mb-1'><strong>Status:</strong> Serwisant Jan Kowalski przeprowadza diagnostykę</p>
											<p className='text-muted mb-0'><small>08.11.2025, 10:30</small></p>
										</div>
									</div>

									{/* Krok 3 - W trakcie */}
									<div className='d-flex mb-4'>
										<div className='me-3'>
											<div className='bg-warning rounded-circle d-flex align-items-center justify-content-center text-white'
													 style={{width: '40px', height: '40px', minWidth: '40px'}}>
												<MDBIcon fas icon='spinner' spin />
											</div>
										</div>
										<div className='flex-grow-1'>
											<h6 className='mb-1'>
												<MDBIcon fas icon='tools' className='me-2 text-warning' />
												Wykonanie naprawy
											</h6>
											<p className='mb-1'><strong>Status:</strong> Trwa wymiana uszkodzonych części</p>
											<p className='text-muted mb-0'><small>08.11.2025, 14:00 - W TRAKCIE</small></p>
										</div>
									</div>

									{/* Krok 4 - Oczekujący */}
									<div className='d-flex'>
										<div className='me-3'>
											<div className='bg-light border rounded-circle d-flex align-items-center justify-content-center text-muted'
													 style={{width: '40px', height: '40px', minWidth: '40px'}}>
												<MDBIcon fas icon='clock' />
											</div>
										</div>
										<div className='flex-grow-1'>
											<h6 className='mb-1 text-muted'>
												<MDBIcon fas icon='check-circle' className='me-2' />
												Weryfikacja i test
											</h6>
											<p className='text-muted mb-0'>Oczekuje na wykonanie...</p>
										</div>
									</div>
								</div>
							</MDBCardBody>
						</MDBCard>

						<hr className='my-4' />

						{/* 3. MDBCarousel - Galeria zdjęć sprzętu */}
						<MDBTypography tag='h6' className='mb-3 text-primary'>
							<MDBIcon fas icon='images' className='me-2' />
							Carousel - Galeria zdjęć naprawy
						</MDBTypography>
						<MDBRow className='mb-4'>
							<MDBCol md='8' className='mx-auto'>
								<MDBCarousel showControls showIndicators dark>
									<MDBCarouselItem itemId={1}>
										<div style={{height: '300px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}} 
												 className='d-flex align-items-center justify-content-center'>
											<div className='text-center text-white'>
												<MDBIcon fas icon='camera' size='3x' className='mb-3' />
												<h4>Zdjęcie przed naprawą</h4>
												<p>Widoczne uszkodzenie silnika</p>
											</div>
										</div>
									</MDBCarouselItem>
									<MDBCarouselItem itemId={2}>
										<div style={{height: '300px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}} 
												 className='d-flex align-items-center justify-content-center'>
											<div className='text-center text-white'>
												<MDBIcon fas icon='tools' size='3x' className='mb-3' />
												<h4>W trakcie naprawy</h4>
												<p>Wymiana uszkodzonych części</p>
											</div>
										</div>
									</MDBCarouselItem>
									<MDBCarouselItem itemId={3}>
										<div style={{height: '300px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}} 
												 className='d-flex align-items-center justify-content-center'>
											<div className='text-center text-white'>
												<MDBIcon fas icon='check-circle' size='3x' className='mb-3' />
												<h4>Po naprawie</h4>
												<p>Urządzenie sprawne i przetestowane</p>
											</div>
										</div>
									</MDBCarouselItem>
								</MDBCarousel>
							</MDBCol>
						</MDBRow>

						<hr className='my-4' />

						{/* 4. MDBModal - Działający modal */}
						<MDBTypography tag='h6' className='mb-3 text-primary'>
							<MDBIcon fas icon='window-restore' className='me-2' />
							Modal - Okno dodawania zgłoszenia
						</MDBTypography>
						<MDBBtn color='primary' onClick={() => setShowModal(true)}>
							<MDBIcon fas icon='plus' className='me-2' />
							Otwórz Modal Zgłoszenia
						</MDBBtn>

						<MDBModal open={showModal} onClose={() => setShowModal(false)} tabIndex='-1'>
							<MDBModalDialog size='lg'>
								<MDBModalContent>
									<MDBModalHeader>
										<MDBModalTitle>
											<MDBIcon fas icon='clipboard-list' className='me-2' />
											Nowe zgłoszenie serwisowe
										</MDBModalTitle>
										<MDBBtn className='btn-close' color='none' onClick={() => setShowModal(false)}></MDBBtn>
									</MDBModalHeader>
									<MDBModalBody>
										<MDBRow>
											<MDBCol md='6' className='mb-3'>
												<MDBInput label='Tytuł zgłoszenia' type='text' />
											</MDBCol>
											<MDBCol md='6' className='mb-3'>
												{/* @ts-ignore */}
												<MDBSelect 
													label='Priorytet'
													data={[
														{ text: 'Niski', value: 'low' },
														{ text: 'Średni', value: 'medium' },
														{ text: 'Wysoki', value: 'high' },
														{ text: 'Krytyczny', value: 'critical' }
													]}
												/>
											</MDBCol>
											<MDBCol size='12' className='mb-3'>
												<MDBTextArea label='Opis problemu' rows={4} />
											</MDBCol>
											<MDBCol md='6' className='mb-3'>
												<MDBDatepicker label='Termin realizacji' />
											</MDBCol>
											<MDBCol md='6' className='mb-3'>
												<MDBFile label='Załącz zdjęcia' />
											</MDBCol>
										</MDBRow>
									</MDBModalBody>
									<MDBModalFooter>
										<MDBBtn color='secondary' onClick={() => setShowModal(false)}>
											Anuluj
										</MDBBtn>
										<MDBBtn color='primary' onClick={() => setShowModal(false)}>
											<MDBIcon fas icon='save' className='me-2' />
											Zapisz zgłoszenie
										</MDBBtn>
									</MDBModalFooter>
								</MDBModalContent>
							</MDBModalDialog>
						</MDBModal>

						<hr className='my-4' />

						{/* 5. MDBCollapse - Rozwijane szczegóły */}
						<MDBTypography tag='h6' className='mb-3 text-primary'>
							<MDBIcon fas icon='chevron-down' className='me-2' />
							Collapse - Rozwijane szczegóły zgłoszenia
						</MDBTypography>
						<MDBCard className='mb-4'>
							<MDBCardHeader className='d-flex justify-content-between align-items-center' 
														style={{cursor: 'pointer'}}
														onClick={() => setShowCollapse(!showCollapse)}>
								<div>
									<MDBIcon fas icon='wrench' className='me-2' />
									<strong>Zgłoszenie #12345 - Awaria pompy hydraulicznej</strong>
								</div>
								<MDBIcon fas icon={showCollapse ? 'chevron-up' : 'chevron-down'} />
							</MDBCardHeader>
							<MDBCollapse open={showCollapse}>
								<MDBCardBody>
									<MDBRow>
										<MDBCol md='6'>
											<p><strong>Lokalizacja:</strong> Hala produkcyjna A</p>
											<p><strong>Zgłaszający:</strong> Jan Kowalski</p>
											<p><strong>Data zgłoszenia:</strong> 08.11.2025, 09:15</p>
										</MDBCol>
										<MDBCol md='6'>
											<p><strong>Priorytet:</strong> <MDBBadge color='danger'>Krytyczny</MDBBadge></p>
											<p><strong>Status:</strong> <MDBBadge color='warning'>W realizacji</MDBBadge></p>
											<p><strong>Serwisant:</strong> Adam Nowak</p>
										</MDBCol>
										<MDBCol size='12' className='mt-2'>
											<strong>Opis problemu:</strong>
											<p className='text-muted'>Pompa hydrauliczna nie buduje odpowiedniego ciśnienia. Słychać nietypowe dźwięki podczas pracy. Możliwa awaria łożysk lub uszkodzenie wirnika.</p>
										</MDBCol>
										<MDBCol size='12' className='mt-3'>
											<MDBBtn color='primary' size='sm' className='me-2'>
												<MDBIcon fas icon='edit' className='me-1' /> Edytuj
											</MDBBtn>
											<MDBBtn color='success' size='sm' className='me-2'>
												<MDBIcon fas icon='check' className='me-1' /> Zakończ
											</MDBBtn>
											<MDBBtn color='info' size='sm'>
												<MDBIcon fas icon='comment' className='me-1' /> Dodaj komentarz
											</MDBBtn>
										</MDBCol>
									</MDBRow>
								</MDBCardBody>
							</MDBCollapse>
						</MDBCard>

						<hr className='my-4' />

						{/* 6. MDBRipple - Efekt ripple na kartach */}
						<MDBTypography tag='h6' className='mb-3 text-primary'>
							<MDBIcon fas icon='water' className='me-2' />
							Ripple Effect - Interaktywne karty sprzętu
						</MDBTypography>
						<MDBRow className='mb-4'>
							<MDBCol md='3'>
								<MDBRipple rippleColor='primary' rippleTag='div'>
									<MDBCard className='h-100' style={{cursor: 'pointer'}}>
										<MDBCardBody className='text-center'>
											<div className='bg-primary bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
													 style={{width: '60px', height: '60px'}}>
												<MDBIcon fas icon='cogs' className='text-white' size='2x' />
											</div>
											<h6>Maszyna CNC</h6>
											<p className='text-muted mb-0'><small>ID: EQ-001</small></p>
											<MDBBadge color='success' className='mt-2'>Sprawna</MDBBadge>
										</MDBCardBody>
									</MDBCard>
								</MDBRipple>
							</MDBCol>
							<MDBCol md='3'>
								<MDBRipple rippleColor='warning' rippleTag='div'>
									<MDBCard className='h-100' style={{cursor: 'pointer'}}>
										<MDBCardBody className='text-center'>
											<div className='bg-warning bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
													 style={{width: '60px', height: '60px'}}>
												<MDBIcon fas icon='industry' className='text-white' size='2x' />
											</div>
											<h6>Prasa hydrauliczna</h6>
											<p className='text-muted mb-0'><small>ID: EQ-002</small></p>
											<MDBBadge color='warning' className='mt-2'>Konserwacja</MDBBadge>
										</MDBCardBody>
									</MDBCard>
								</MDBRipple>
							</MDBCol>
							<MDBCol md='3'>
								<MDBRipple rippleColor='danger' rippleTag='div'>
									<MDBCard className='h-100' style={{cursor: 'pointer'}}>
										<MDBCardBody className='text-center'>
											<div className='bg-danger bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
													 style={{width: '60px', height: '60px'}}>
												<MDBIcon fas icon='exclamation-triangle' className='text-white' size='2x' />
											</div>
											<h6>Pompa hydrauliczna</h6>
											<p className='text-muted mb-0'><small>ID: EQ-003</small></p>
											<MDBBadge color='danger' className='mt-2'>Awaria</MDBBadge>
										</MDBCardBody>
									</MDBCard>
								</MDBRipple>
							</MDBCol>
							<MDBCol md='3'>
								<MDBRipple rippleColor='info' rippleTag='div'>
									<MDBCard className='h-100' style={{cursor: 'pointer'}}>
										<MDBCardBody className='text-center'>
											<div className='bg-info bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
													 style={{width: '60px', height: '60px'}}>
												<MDBIcon fas icon='truck-loading' className='text-white' size='2x' />
											</div>
											<h6>Wózek widłowy</h6>
											<p className='text-muted mb-0'><small>ID: EQ-004</small></p>
											<MDBBadge color='info' className='mt-2'>W użyciu</MDBBadge>
										</MDBCardBody>
									</MDBCard>
								</MDBRipple>
							</MDBCol>
						</MDBRow>

						{/* 7. MDBPopover - Szybki podgląd */}
						<MDBTypography tag='h6' className='mb-3 text-primary'>
							<MDBIcon fas icon='info-circle' className='me-2' />
							Popover - Szybki podgląd danych
						</MDBTypography>
						<div className='mb-4'>
							<MDBPopover 
								btnChildren='Szczegóły serwisanta' 
								color='info'
								placement='right'
							>
								<MDBPopoverHeader>Jan Kowalski</MDBPopoverHeader>
								<MDBPopoverBody>
									<p className='mb-1'><strong>Stanowisko:</strong> Starszy Serwisant</p>
									<p className='mb-1'><strong>Specjalizacja:</strong> Maszyny CNC</p>
									<p className='mb-1'><strong>Aktywne zgłoszenia:</strong> 5</p>
									<p className='mb-0'><strong>Ocena:</strong> ⭐⭐⭐⭐⭐ (4.8/5.0)</p>
								</MDBPopoverBody>
							</MDBPopover>

							<MDBPopover 
								btnChildren='Info o sprzęcie' 
								color='success'
								placement='top'
								className='ms-2'
							>
								<MDBPopoverHeader>Maszyna CNC HAAS VF-2</MDBPopoverHeader>
								<MDBPopoverBody>
									<p className='mb-1'><strong>Numer seryjny:</strong> 1234567890</p>
									<p className='mb-1'><strong>Rok produkcji:</strong> 2020</p>
									<p className='mb-1'><strong>Ostatni serwis:</strong> 15.10.2025</p>
									<p className='mb-0'><strong>Status:</strong> <MDBBadge color='success'>Sprawna</MDBBadge></p>
								</MDBPopoverBody>
							</MDBPopover>

							<MDBPopover 
								btnChildren='Historia napraw' 
								color='warning'
								placement='bottom'
								className='ms-2'
							>
								<MDBPopoverHeader>Ostatnie 3 naprawy</MDBPopoverHeader>
								<MDBPopoverBody>
									<ul className='mb-0' style={{paddingLeft: '1rem'}}>
										<li>15.10.2025 - Wymiana oleju</li>
										<li>01.09.2025 - Kalibracja osi</li>
										<li>10.07.2025 - Wymiana filtra</li>
									</ul>
								</MDBPopoverBody>
							</MDBPopover>
						</div>

						<hr className='my-4' />

						{/* 8. MDBValidation - Formularz z walidacją */}
						<MDBTypography tag='h6' className='mb-3 text-primary'>
							<MDBIcon fas icon='check-circle' className='me-2' />
							Validation - Formularz z walidacją
						</MDBTypography>
						<MDBCard className='mb-4'>
							<MDBCardBody>
								{/* @ts-ignore */}
								<MDBValidation className='row g-3'>
									<MDBCol md='6'>
										{/* @ts-ignore */}
										<MDBValidationItem feedback='Proszę podać nazwę sprzętu' invalid>
											<MDBInput 
												label='Nazwa sprzętu *' 
												type='text' 
												required 
											/>
										</MDBValidationItem>
									</MDBCol>
									<MDBCol md='6'>
										{/* @ts-ignore */}
										<MDBValidationItem feedback='Proszę podać numer seryjny' invalid>
											<MDBInput 
												label='Numer seryjny *' 
												type='text' 
												required 
											/>
										</MDBValidationItem>
									</MDBCol>
									<MDBCol md='4'>
										{/* @ts-ignore */}
										<MDBValidationItem feedback='Wybierz lokalizację' invalid>
											{/* @ts-ignore */}
											<MDBSelect 
												label='Lokalizacja *'
												data={[
													{ text: 'Wybierz...', value: '' },
													{ text: 'Hala A', value: 'hall-a' },
													{ text: 'Hala B', value: 'hall-b' },
													{ text: 'Magazyn', value: 'warehouse' }
												]}
											/>
										</MDBValidationItem>
									</MDBCol>
									<MDBCol md='4'>
										{/* @ts-ignore */}
										<MDBValidationItem feedback='Podaj rok produkcji' invalid>
											<MDBInput 
												label='Rok produkcji *' 
												type='number' 
												min='1900'
												max='2025'
												required 
											/>
										</MDBValidationItem>
									</MDBCol>
									<MDBCol md='4'>
										{/* @ts-ignore */}
										<MDBValidationItem feedback='Wybierz datę zakupu' invalid>
											<MDBDatepicker label='Data zakupu *' />
										</MDBValidationItem>
									</MDBCol>
									<MDBCol size='12'>
										<MDBCheckbox label='Akceptuję regulamin dodawania sprzętu' required />
									</MDBCol>
									<MDBCol size='12'>
										<MDBBtn type='submit' color='primary'>
											<MDBIcon fas icon='save' className='me-2' />
											Dodaj sprzęt
										</MDBBtn>
										<MDBBtn type='reset' color='secondary' className='ms-2'>
											Reset
										</MDBBtn>
									</MDBCol>
								</MDBValidation>
							</MDBCardBody>
						</MDBCard>

						<MDBAlert color='success' className='mb-0'>
							<MDBIcon fas icon='check-circle' className='me-2' />
							<strong>Sekcja 26 kompletna!</strong> Wszystkie zaawansowane komponenty dla CMMS: Range Sliders, Stepper, Carousel, Modal, Collapse, Ripple, Popover i Validation.
						</MDBAlert>

					</MDBCardBody>
				</MDBCard>

				{/* SEKCJA BONUSOWA: ANIMACJE & HOVER EFFECTS */}
				<MDBCard className='mb-4 border-primary border-3'>
					<MDBCardHeader className='bg-gradient' style={{background: 'linear-gradient(45deg, #1266f1, #0d6efd)'}}>
						<MDBTypography tag='h5' className='text-white mb-0'>
							<MDBIcon fas icon='magic' className='me-2' />
							🎨 BONUS: Hover Effects & Animations
						</MDBTypography>
					</MDBCardHeader>
					<MDBCardBody>
						<MDBRow className='g-3'>
							{/* Karta 1 - Hover Shadow */}
							<MDBCol md='3'>
								<MDBCard className='h-100 hover-shadow' style={{transition: 'all 0.3s', cursor: 'pointer'}}>
									<MDBCardBody className='text-center'>
										<div className='bg-primary bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
												 style={{width: '60px', height: '60px'}}>
											<MDBIcon fas icon='rocket' className='text-white' size='2x' />
										</div>
										<strong className='d-block'>Hover Shadow</strong>
										<small className='text-muted'>Najedź aby zobaczyć efekt</small>
									</MDBCardBody>
								</MDBCard>
							</MDBCol>

							{/* Karta 2 - Animated Border */}
							<MDBCol md='3'>
								<MDBCard className='h-100' style={{
									transition: 'all 0.3s',
									cursor: 'pointer',
									borderWidth: '2px',
									borderStyle: 'solid',
									borderImage: 'linear-gradient(45deg, #1266f1, #00b74a) 1'
								}}>
									<MDBCardBody className='text-center'>
										<div className='bg-success bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
												 style={{width: '60px', height: '60px'}}>
											<MDBIcon fas icon='fire' className='text-white' size='2x' />
										</div>
										<strong className='d-block'>Gradient Border</strong>
										<small className='text-muted'>Kolorowa ramka</small>
									</MDBCardBody>
								</MDBCard>
							</MDBCol>

							{/* Karta 3 - Pulsing Badge */}
							<MDBCol md='3'>
								<MDBCard className='h-100'>
									<MDBCardBody className='text-center'>
										<div className='position-relative d-inline-block mb-3'>
											<MDBIcon fas icon='bell' size='3x' className='text-warning' />
											<span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
														style={{animation: 'pulse 2s infinite'}}>
												8
												<span className='visually-hidden'>nowych powiadomień</span>
											</span>
										</div>
										<strong className='d-block'>Pulsing Badge</strong>
										<small className='text-muted'>Animowana ikona</small>
									</MDBCardBody>
								</MDBCard>
							</MDBCol>

							{/* Karta 4 - Loading Shimmer */}
							<MDBCol md='3'>
								<MDBCard className='h-100' style={{
									background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
									backgroundSize: '200% 100%',
									animation: 'shimmer 1.5s infinite'
								}}>
									<MDBCardBody className='text-center'>
										<div className='mb-3'>
											<div className='placeholder-glow'>
												<div className='placeholder col-12 mb-2' style={{height: '60px', borderRadius: '50%', width: '60px', margin: '0 auto'}}></div>
											</div>
										</div>
										<strong className='d-block'>Shimmer Effect</strong>
										<small className='text-muted'>Stan ładowania</small>
									</MDBCardBody>
								</MDBCard>
							</MDBCol>
						</MDBRow>

						{/* CSS dla animacji (info) */}
						<MDBAlert color='light' className='mt-4 mb-0'>
							<MDBIcon fas icon='code' className='me-2' />
							<strong>Animacje CSS:</strong>
							<ul className='mb-0 mt-2 small'>
								<li><code>hover-shadow</code> - zwiększa cień przy najechaniu</li>
								<li><code>pulse</code> - pulsująca animacja dla powiadomień</li>
								<li><code>shimmer</code> - efekt ładowania/szkieletu</li>
								<li><code>transition: all 0.3s</code> - płynne przejścia</li>
							</ul>
						</MDBAlert>
					</MDBCardBody>
				</MDBCard>

			</MDBContainer>
		</>
	);
}

export default App;
