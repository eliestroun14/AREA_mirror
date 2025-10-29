import React, { useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box, Typography, CircularProgress } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { apiService } from '@/services/api';

interface StepSourceSelectorProps {
  zapId: number;
  // currentStepId is optional: when provided the component edits an existing step (PATCH).
  // When omitted/null the component works in "pre-create" mode and exposes the selected
  // source via onSelectFromStep callback.
  currentStepId?: number | null;
  token: string;
  onRefresh?: () => void;
  // Called in pre-create mode when the user confirms the selected source.
  onSelectFromStep?: (fromStepId: number | null) => void;
}

interface StepInfo {
  id: number;
  name: string;
  step_order: number;
}

const StepSourceSelector: React.FC<StepSourceSelectorProps> = ({ zapId, currentStepId, token, onRefresh, onSelectFromStep }) => {
  const [steps, setSteps] = useState<StepInfo[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSteps = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all actions and the trigger
        const actions = await apiService.getZapActions(zapId, token);

        let zapTrigger = null;
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          zapTrigger = await apiService.getZapTrigger(zapId, token);
        } catch (err) {
          console.warn('Failed to fetch zap trigger (ignored):', err);
          zapTrigger = null;
        }

        // If currentStepId is provided -> we're editing an existing action: filter only previous steps
        if (currentStepId) {
          // fetch current action to know its step_order and from_step_id
          const currentAction = await apiService.getZapActionById(zapId, currentStepId, token);
          if (!currentAction) {
            setSteps([]);
            setLoading(false);
            return;
          }

          const currentOrder = currentAction.step.step_order as number;

          let filtered: StepInfo[] = actions
            .filter(({ step }) => (step.step_order as number) < currentOrder)
            .map(({ step, action }) => ({
              id: step.id,
              name: action.name,
              step_order: step.step_order as number,
            }));

          if (zapTrigger && zapTrigger.step && (zapTrigger.step.step_order as number) < currentOrder) {
            const triggerEntry: StepInfo = {
              id: zapTrigger.step.id,
              name: `Trigger — ${zapTrigger.service?.name ?? 'Trigger'}`,
              step_order: zapTrigger.step.step_order as number,
            };
            if (!filtered.find(f => f.id === triggerEntry.id)) filtered.push(triggerEntry);
          }

          filtered = filtered.sort((a, b) => a.step_order - b.step_order);
          setSteps(filtered);

          // existing action may have a from_step_id but we don't display it here;
          // the selector's value is used as the source directly
          const fromStepId = currentAction.step.from_step_id as number | null;

          const triggerId = zapTrigger && zapTrigger.step && (zapTrigger.step.step_order as number) < currentOrder
            ? zapTrigger.step.id
            : null;

          if (triggerId !== null) setSelectedStepId(triggerId);
          else if (fromStepId) setSelectedStepId(fromStepId);
          else setSelectedStepId('');
        } else {
          // Pre-create mode: include all existing actions and the trigger (no filtering by order)
          const mapped: StepInfo[] = actions.map(({ step, action }) => ({
            id: step.id,
            name: action.name,
            step_order: step.step_order as number,
          }));

          if (zapTrigger && zapTrigger.step) {
            const triggerEntry: StepInfo = {
              id: zapTrigger.step.id,
              name: `Trigger — ${zapTrigger.service?.name ?? 'Trigger'}`,
              step_order: zapTrigger.step.step_order as number,
            };
            if (!mapped.find(f => f.id === triggerEntry.id)) mapped.push(triggerEntry);
          }

          const sorted = mapped.sort((a, b) => a.step_order - b.step_order);
          setSteps(sorted);

          // default selection: prefer trigger
          const triggerId = zapTrigger && zapTrigger.step ? zapTrigger.step.id : null;
          if (triggerId !== null) setSelectedStepId(triggerId);
          else setSelectedStepId('');
        }
      } catch (e) {
        console.error(e);
        setError('Failed to fetch steps');
      } finally {
        setLoading(false);
      }
    };

    if (zapId && token) fetchSteps();
  }, [zapId, currentStepId, token]);

  const handleSelect = async (event: SelectChangeEvent) => {
    const value = event.target.value;
    const parsed = value === '' ? '' : Number(value);
    setSelectedStepId(parsed as number | '');

    // Pre-create mode: immediately notify parent of selection (no button)
    if (!currentStepId && onSelectFromStep) {
      const resolved = parsed === '' ? null : (parsed as number);
      onSelectFromStep(resolved);
      return;
    }

    // Edit mode (currentStepId provided): commit selection immediately via PATCH
    if (currentStepId) {
      if (parsed === '') return;
      setSubmitting(true);
      setError(null);
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiBaseUrl}/zaps/${zapId}/actions/${currentStepId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ fromStepId: parsed }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }
        if (onRefresh) onRefresh();
      } catch (err) {
        console.error(err);
        setError('Failed to update source step');
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Note: explicit confirmation button removed — selection commits immediately.

  return (
    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      {loading ? (
        <CircularProgress size={20} />
      ) : steps.length === 0 ? (
        // If there are no previous steps, render nothing (as requested)
        null
      ) : (
        <>
          <FormControl sx={{ minWidth: 240 }} size="small">
            <InputLabel>Étape source</InputLabel>
            <Select
              value={selectedStepId === '' ? '' : String(selectedStepId)}
              onChange={handleSelect}
              label="Étape source"
            >
              {steps.map((step) => (
                <MenuItem key={step.id} value={String(step.id)}>
                  {step.name} (Step {step.step_order})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {submitting ? <CircularProgress size={20} /> : null}

          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        </>
      )}
    </Box>
  );
};

export default StepSourceSelector;
