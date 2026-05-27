import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBRow,
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { PageHeader, useToast } from '../../components/ui';
import {
  equipmentService,
  preventiveMaintenanceService,
  workOrderService,
} from '../../services';
import { useAuth } from '../../contexts';
import type {
  Equipment,
  PreventiveMaintenancePlan,
  WorkOrderPriority,
} from '../../types';

type IntervalPreset = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'custom';

interface PlanFormState {
  title: string;
  description: string;
  equipmentId: string;
  priorityId: string;
  intervalDays: string;
  nextDueAt: string;
  isActive: boolean;
  intervalPreset: IntervalPreset;
}

const presetToDays: Record<Exclude<IntervalPreset, 'custom'>, number> = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
  quarterly: 90,
};

const defaultForm: PlanFormState = {
  title: '',
  description: '',
  equipmentId: '',
  priorityId: '',
  intervalDays: '7',
  nextDueAt: '',
  isActive: true,
  intervalPreset: 'weekly',
};

export const PreventiveMaintenancePage = () => {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const { permissions } = useAuth();

  const [plans, setPlans] = useState<PreventiveMaintenancePlan[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [priorities, setPriorities] = useState<WorkOrderPriority[]>([]);
  const [form, setForm] = useState<PlanFormState>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [runningDue, setRunningDue] = useState(false);

  const canManage = permissions.canManageWorkOrders;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [plansData, equipmentData, prioritiesData] = await Promise.all([
        preventiveMaintenanceService.getPlans(),
        equipmentService.getEquipmentList(1, 1000),
        workOrderService.getWorkOrderPriorities(),
      ]);

      setPlans(Array.isArray(plansData) ? plansData : []);
      setEquipmentList(equipmentData.data || []);
      setPriorities(Array.isArray(prioritiesData) ? prioritiesData : []);
    } catch (err) {
      console.error('Failed to load preventive maintenance data:', err);
      error(t('pm.loadError', { defaultValue: 'Nie udało się załadować planów prewencji.' }));
    } finally {
      setLoading(false);
    }
  }, [error, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(() => {
    const active = plans.filter((plan) => plan.isActive).length;
    const dueNow = plans.filter((plan) => {
      if (!plan.isActive || !plan.nextDueAt) {
        return false;
      }
      return new Date(plan.nextDueAt) <= new Date();
    }).length;

    return {
      total: plans.length,
      active,
      dueNow,
    };
  }, [plans]);

  const updateForm = (patch: Partial<PlanFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handlePresetChange = (preset: IntervalPreset) => {
    if (preset === 'custom') {
      updateForm({ intervalPreset: preset });
      return;
    }

    updateForm({ intervalPreset: preset, intervalDays: String(presetToDays[preset]) });
  };

  const handleCreatePlan = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canManage) {
      return;
    }

    const intervalDays = Number(form.intervalDays);
    if (!form.title.trim() || !form.equipmentId || !form.priorityId || !Number.isFinite(intervalDays) || intervalDays < 1) {
      error(t('pm.validationError', { defaultValue: 'Uzupełnij wymagane pola i popraw interwał.' }));
      return;
    }

    setSubmitting(true);
    try {
      await preventiveMaintenanceService.createPlan({
        title: form.title.trim(),
        description: form.description.trim(),
        equipmentId: Number(form.equipmentId),
        priorityId: Number(form.priorityId),
        intervalDays,
        isActive: form.isActive,
        nextDueAt: form.nextDueAt ? new Date(form.nextDueAt).toISOString() : undefined,
      });

      success(t('pm.createSuccess', { defaultValue: 'Plan prewencji został dodany.' }));
      setForm(defaultForm);
      await loadData();
    } catch (err) {
      console.error('Failed to create preventive plan:', err);
      error(t('pm.createError', { defaultValue: 'Nie udało się dodać planu prewencji.' }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerate = async (plan: PreventiveMaintenancePlan) => {
    if (!canManage) {
      return;
    }
    try {
      await preventiveMaintenanceService.generatePlanWorkOrder(plan.id);
      success(t('pm.generateSuccess', { defaultValue: 'Wygenerowano zlecenie prewencyjne.' }));
      await loadData();
    } catch (err) {
      console.error('Failed to generate work order from plan:', err);
      error(t('pm.generateError', { defaultValue: 'Nie udało się wygenerować zlecenia.' }));
    }
  };

  const handleRunDue = async () => {
    if (!canManage) {
      return;
    }
    setRunningDue(true);
    try {
      const result = await preventiveMaintenanceService.runDuePlans();
      success(
        t('pm.runDueSuccess', {
          defaultValue: `Wygenerowano ${result.generated} zleceń z planów zaległych.`,
        }),
      );
      await loadData();
    } catch (err) {
      console.error('Failed to run due plans:', err);
      error(t('pm.runDueError', { defaultValue: 'Nie udało się uruchomić zaległych planów.' }));
    } finally {
      setRunningDue(false);
    }
  };

  const handleToggleActive = async (plan: PreventiveMaintenancePlan) => {
    if (!canManage) {
      return;
    }
    try {
      await preventiveMaintenanceService.updatePlan(plan.id, {
        isActive: !plan.isActive,
      });
      success(t('pm.statusUpdated', { defaultValue: 'Zmieniono status planu.' }));
      await loadData();
    } catch (err) {
      console.error('Failed to toggle plan active state:', err);
      error(t('pm.statusUpdateError', { defaultValue: 'Nie udało się zmienić statusu planu.' }));
    }
  };

  const handleDelete = async (plan: PreventiveMaintenancePlan) => {
    if (!canManage) {
      return;
    }
    const shouldDelete = window.confirm(
      t('pm.confirmDelete', {
        defaultValue: `Usunąć plan "${plan.title}"?`,
      }),
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await preventiveMaintenanceService.deletePlan(plan.id);
      success(t('pm.deleteSuccess', { defaultValue: 'Plan został usunięty.' }));
      await loadData();
    } catch (err) {
      console.error('Failed to delete preventive plan:', err);
      error(t('pm.deleteError', { defaultValue: 'Nie udało się usunąć planu.' }));
    }
  };

  return (
    <div data-testid="preventive-maintenance-page">
      <PageHeader
        title={t('pm.title', { defaultValue: 'Prewencja (PM)' })}
        subtitle={t('pm.subtitle', { defaultValue: 'Planowanie i automatyczne generowanie zleceń prewencyjnych' })}
        breadcrumbs={[
          { label: t('nav.dashboard', { defaultValue: 'Pulpit' }), path: '/' },
          { label: t('nav.preventive', { defaultValue: 'Prewencja' }) },
        ]}
        actions={
          canManage && (
            <MDBBtn color="success" onClick={handleRunDue} disabled={runningDue || loading} data-testid="pm-run-due">
              <MDBIcon icon="play" className="me-2" />
              {runningDue
                ? t('pm.running', { defaultValue: 'Uruchamianie...' })
                : t('pm.runDue', { defaultValue: 'Uruchom zaległe' })}
            </MDBBtn>
          )
        }
      />

      <MDBRow className="mb-4 g-3">
        <MDBCol md="4">
          <MDBCard className="shadow-sm border-0 h-100">
            <MDBCardBody>
              <p className="text-muted mb-1">{t('pm.totalPlans', { defaultValue: 'Wszystkie plany' })}</p>
              <h3 className="mb-0">{stats.total}</h3>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="4">
          <MDBCard className="shadow-sm border-0 h-100">
            <MDBCardBody>
              <p className="text-muted mb-1">{t('pm.activePlans', { defaultValue: 'Aktywne plany' })}</p>
              <h3 className="mb-0 text-success">{stats.active}</h3>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="4">
          <MDBCard className="shadow-sm border-0 h-100">
            <MDBCardBody>
              <p className="text-muted mb-1">{t('pm.duePlans', { defaultValue: 'Do uruchomienia teraz' })}</p>
              <h3 className="mb-0 text-warning">{stats.dueNow}</h3>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      <MDBRow className="g-4">
        <MDBCol lg="5">
          <MDBCard className="shadow-sm border-0">
            <MDBCardHeader className="bg-white border-0 py-3">
              <h5 className="mb-0">
                <MDBIcon icon="plus-circle" className="me-2 text-primary" />
                {t('pm.createPlan', { defaultValue: 'Dodaj plan prewencji' })}
              </h5>
            </MDBCardHeader>
            <MDBCardBody>
              <form onSubmit={handleCreatePlan}>
                <MDBInput
                  label={t('pm.planTitle', { defaultValue: 'Nazwa planu' })}
                  className="mb-3"
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  required
                />

                <MDBInput
                  label={t('pm.description', { defaultValue: 'Opis' })}
                  className="mb-3"
                  value={form.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                />

                <label className="form-label">{t('pm.equipment', { defaultValue: 'Sprzęt' })}</label>
                <select
                  className="form-select mb-3"
                  value={form.equipmentId}
                  onChange={(e) => updateForm({ equipmentId: e.target.value })}
                  required
                >
                  <option value="">{t('pm.selectEquipment', { defaultValue: 'Wybierz sprzęt' })}</option>
                  {equipmentList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <label className="form-label">{t('pm.priority', { defaultValue: 'Priorytet' })}</label>
                <select
                  className="form-select mb-3"
                  value={form.priorityId}
                  onChange={(e) => updateForm({ priorityId: e.target.value })}
                  required
                >
                  <option value="">{t('pm.selectPriority', { defaultValue: 'Wybierz priorytet' })}</option>
                  {priorities.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <label className="form-label">{t('pm.frequency', { defaultValue: 'Częstotliwość' })}</label>
                <select
                  className="form-select mb-3"
                  value={form.intervalPreset}
                  onChange={(e) => handlePresetChange(e.target.value as IntervalPreset)}
                >
                  <option value="weekly">{t('pm.weekly', { defaultValue: 'Co tydzień (7 dni)' })}</option>
                  <option value="biweekly">{t('pm.biweekly', { defaultValue: 'Co 2 tygodnie (14 dni)' })}</option>
                  <option value="monthly">{t('pm.monthly', { defaultValue: 'Co miesiąc (30 dni)' })}</option>
                  <option value="quarterly">{t('pm.quarterly', { defaultValue: 'Co kwartał (90 dni)' })}</option>
                  <option value="custom">{t('pm.custom', { defaultValue: 'Własny interwał' })}</option>
                </select>

                <MDBInput
                  type="number"
                  min={1}
                  label={t('pm.intervalDays', { defaultValue: 'Interwał (dni)' })}
                  className="mb-3"
                  value={form.intervalDays}
                  onChange={(e) => updateForm({ intervalDays: e.target.value, intervalPreset: 'custom' })}
                  required
                />

                <MDBInput
                  type="datetime-local"
                  label={t('pm.firstDueAt', { defaultValue: 'Pierwszy termin (opcjonalnie)' })}
                  className="mb-3"
                  value={form.nextDueAt}
                  onChange={(e) => updateForm({ nextDueAt: e.target.value })}
                />

                <div className="form-check form-switch mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="pm-active"
                    checked={form.isActive}
                    onChange={(e) => updateForm({ isActive: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="pm-active">
                    {t('pm.isActive', { defaultValue: 'Plan aktywny' })}
                  </label>
                </div>

                <MDBBtn type="submit" color="primary" className="w-100" disabled={!canManage || submitting} data-testid="pm-create-submit">
                  {submitting
                    ? t('pm.creating', { defaultValue: 'Zapisywanie...' })
                    : t('pm.create', { defaultValue: 'Dodaj plan' })}
                </MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol lg="7">
          <MDBCard className="shadow-sm border-0">
            <MDBCardHeader className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <MDBIcon icon="tasks" className="me-2 text-primary" />
                {t('pm.currentPlans', { defaultValue: 'Aktualne plany prewencji' })}
              </h5>
            </MDBCardHeader>
            <MDBCardBody>
              {loading ? (
                <div className="text-center text-muted py-4">
                  <MDBIcon icon="spinner" spin className="me-2" />
                  {t('common.loading', { defaultValue: 'Ładowanie...' })}
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <MDBIcon icon="inbox" size="2x" className="mb-3 d-block" />
                  {t('pm.noPlans', { defaultValue: 'Brak planów prewencji. Dodaj pierwszy plan po lewej stronie.' })}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>{t('pm.plan', { defaultValue: 'Plan' })}</th>
                        <th>{t('pm.interval', { defaultValue: 'Interwał' })}</th>
                        <th>{t('pm.nextDue', { defaultValue: 'Następny termin' })}</th>
                        <th>{t('pm.status', { defaultValue: 'Status' })}</th>
                        <th className="text-end">{t('common.actions', { defaultValue: 'Akcje' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plans.map((plan) => {
                        const isDue = plan.nextDueAt ? new Date(plan.nextDueAt) <= new Date() : false;
                        return (
                          <tr key={plan.id} data-testid={`pm-plan-row-${plan.id}`}>
                            <td>
                              <div className="fw-semibold">{plan.title}</div>
                              <small className="text-muted">
                                {plan.equipment?.name} / {plan.priority?.name}
                              </small>
                            </td>
                            <td>{plan.intervalDays} dni</td>
                            <td>
                              {plan.nextDueAt ? new Date(plan.nextDueAt).toLocaleString('pl-PL') : '-'}
                              {isDue && (
                                <span className="badge bg-warning text-dark ms-2">
                                  {t('pm.dueNowBadge', { defaultValue: 'TERMIN' })}
                                </span>
                              )}
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`btn btn-sm ${plan.isActive ? 'btn-outline-success' : 'btn-outline-secondary'}`}
                                onClick={() => handleToggleActive(plan)}
                                disabled={!canManage}
                              >
                                {plan.isActive
                                  ? t('pm.active', { defaultValue: 'Aktywny' })
                                  : t('pm.inactive', { defaultValue: 'Nieaktywny' })}
                              </button>
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-2">
                                <MDBBtn
                                  size="sm"
                                  color="success"
                                  onClick={() => handleGenerate(plan)}
                                  disabled={!canManage}
                                  title={t('pm.generate', { defaultValue: 'Wygeneruj zlecenie' })}
                                >
                                  <MDBIcon icon="bolt" />
                                </MDBBtn>
                                <MDBBtn
                                  size="sm"
                                  color="danger"
                                  onClick={() => handleDelete(plan)}
                                  disabled={!canManage}
                                  title={t('common.delete', { defaultValue: 'Usuń' })}
                                >
                                  <MDBIcon icon="trash" />
                                </MDBBtn>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </div>
  );
};
