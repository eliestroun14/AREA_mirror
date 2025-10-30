import React, { useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box, Typography, CircularProgress } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { apiService } from '@/services/api';

interface StepSourceSelectorProps {
  zapId: number;
  currentStepId?: number | null;
  token: string;
  onRefresh?: () => void;
  onSelectFromStep?: (fromStepId: number | null) => void;
}

interface StepInfo {
  id: number;
  name: string;
  step_order: number;
}

const StepSourceSelector: React.FC<StepSourceSelectorProps> = ({
  zapId,
  currentStepId,
  token,
  onRefresh,
  onSelectFromStep
}) => {
  const [steps, setSteps] = useState<StepInfo[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    const fetchSteps = async () => {
      setLoading(true);
      setError(null);
      try {
        const actions = await apiService.getZapActions(zapId, token);

        let zapTrigger = null;
        try {
          zapTrigger = await apiService.getZapTrigger(zapId, token);
        } catch (err) {
          console.warn('Failed to fetch zap trigger (ignored):', err);
          zapTrigger = null;
        }

        if (currentStepId) {
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
            if (!filtered.find(f => f.id === triggerEntry.id)) {
              filtered.push(triggerEntry);
            }
          }

          filtered = filtered.sort((a, b) => a.step_order - b.step_order);
          setSteps(filtered);

          const fromStepId = currentAction.step.source_step_id as number | null;

          console.log('🔍 Current source_step_id from DB:', fromStepId);
          console.log('🔍 Available steps:', filtered.map(s => ({ id: s.id, name: s.name })));

          let stepToSelect: number | '' = '';

          if (fromStepId !== null && fromStepId !== undefined) {
            const stepExists = filtered.find(s => s.id === fromStepId);
            if (stepExists) {
              stepToSelect = fromStepId;
              console.log('✅ Using existing source_step_id from DB:', fromStepId, `(${stepExists.name})`);
            } else {
              console.warn('⚠️ source_step_id', fromStepId, 'not found in available steps, using trigger as fallback');
              const triggerId = zapTrigger && zapTrigger.step ? zapTrigger.step.id : null;
              if (triggerId !== null) {
                stepToSelect = triggerId;
              }
            }
          } else {
            const triggerId = zapTrigger && zapTrigger.step && (zapTrigger.step.step_order as number) < currentOrder
              ? zapTrigger.step.id
              : null;

            if (triggerId !== null) {
              stepToSelect = triggerId;
              console.log('🎯 No source_step_id in DB, auto-selecting trigger as default:', triggerId);
            } else if (filtered.length > 0) {
              stepToSelect = filtered[0].id;
              console.log('🎯 No trigger available, auto-selecting first step:', filtered[0].id);
            }
          }

          setSelectedStepId(stepToSelect);

          if (!initialLoadDone && stepToSelect !== '' && onSelectFromStep) {
            console.log('📤 Initial load: Notifying parent of selection:', stepToSelect);
            onSelectFromStep(stepToSelect as number);
            setInitialLoadDone(true);
          }

        } else {
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
            if (!mapped.find(f => f.id === triggerEntry.id)) {
              mapped.push(triggerEntry);
            }
          }

          const sorted = mapped.sort((a, b) => a.step_order - b.step_order);
          setSteps(sorted);

          const triggerId = zapTrigger && zapTrigger.step ? zapTrigger.step.id : null;
          let stepToSelect: number | '' = '';

          if (triggerId !== null) {
            stepToSelect = triggerId;
          } else if (sorted.length > 0) {
            stepToSelect = sorted[0].id;
          }

          setSelectedStepId(stepToSelect);

          if (!initialLoadDone && stepToSelect !== '' && onSelectFromStep) {
            onSelectFromStep(stepToSelect as number);
            setInitialLoadDone(true);
          }
        }
      } catch (e) {
        console.error(e);
        setError('Failed to fetch steps');
      } finally {
        setLoading(false);
      }
    };

    if (zapId && token) fetchSteps();
  }, [zapId, currentStepId, token, initialLoadDone, onSelectFromStep]);

  const handleSelect = async (event: SelectChangeEvent) => {
    const value = event.target.value;
    const parsed = value === '' ? '' : Number(value);
    setSelectedStepId(parsed as number | '');

    if (!currentStepId && onSelectFromStep) {
      const resolved = parsed === '' ? null : (parsed as number);
      onSelectFromStep(resolved);
      return;
    }

    if (currentStepId) {
      if (parsed === '') return;
      setSubmitting(true);
      setError(null);
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

        console.log('📤 Updating source_step_id:', {
          zapId,
          currentStepId,
          newFromStepId: parsed
        });

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

        console.log('✅ source_step_id updated successfully');

        if (onSelectFromStep) {
          onSelectFromStep(parsed as number);
        } else if (onRefresh) {
          onRefresh();
        }
      } catch (err) {
        console.error('❌ Failed to update source step:', err);
        setError('Failed to update source step');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      {loading ? (
        <CircularProgress size={20} />
      ) : steps.length === 0 ? (
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
