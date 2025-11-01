import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';

// Hooks
import { useActionData } from '@/hooks/useActionData';
import { useFormData } from '@/hooks/useFormData';

// Utils
import { validateRequiredFields, convertFieldsToArray } from '@/utils/formValidation';

// Components
import LoadingView from '@/components/atoms/loading-view/loading-view';
import ErrorView from '@/components/atoms/error-view/error-view';
import PrimaryButton from '@/components/atoms/primary-button/primary-button';
import ActionFieldsPageHeader from '@/components/molecules/action-fields-page-header/action-fields-page-header';
import SourceSelectionCard from '@/components/molecules/source-selection-card/source-selection-card';
import ActionFieldsCard from '@/components/molecules/action-fields-card/action-fields-card';

/**
 * Action Fields Page
 * Allows users to configure action fields with variable support
 */
const ActionFieldsPage = () => {
  console.log('[ActionFieldsPage] Mounted');

  // Route params
  const {
    actionId,
    serviceActionId,
    triggerId,
    serviceTriggerId,
    zapId
  } = useLocalSearchParams<{
    actionId?: string;
    serviceActionId?: string;
    triggerId?: string;
    serviceTriggerId?: string;
    zapId?: string;
  }>();

  // State
  const [selectedFromStepId, setSelectedFromStepId] = useState<number | null>(null);

  // Custom hooks
  const { service, action, loading, error } = useActionData({
    serviceActionId,
    actionId
  });
  
  const { formData, handleFieldChange, initializeFormData } = useFormData();

  // Initialize form data when action is loaded
  useEffect(() => {
    if (action) {
      initializeFormData(action);
    }
  }, [action]);

  // Handle continue button
  const handleContinue = () => {
    const validation = validateRequiredFields(action, formData);

    if (!validation.isValid) {
      Alert.alert(
        'Missing Required Fields',
        `Please fill in the following required fields: ${validation.missingFields.join(', ')}`
      );
      return;
    }

    router.push({
      pathname: '/(tabs)/create',
      params: {
        actionId: action?.id,
        serviceActionId: service?.id,
        triggerId,
        serviceTriggerId,
        zapId,
        fromStepId: selectedFromStepId,
        actionFormData: JSON.stringify(formData)
      }
    });
  };

  // Loading state
  if (loading) {
    return <LoadingView message="Loading action..." />;
  }

  // Error states
  if (error) {
    return <ErrorView message={error} type="error" />;
  }

  if (!service || !action) {
    return <ErrorView message="Service or Action not found" type="error" />;
  }

  if (!zapId) {
    return (
      <ErrorView
        message="No zap ID found. Please start from the beginning."
        type="warning"
      />
    );
  }

  // Convert fields to array format
  const fieldsArray = convertFieldsToArray(action);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Complete action fields',
          headerStyle: {
            backgroundColor: service.services_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <ActionFieldsPageHeader service={service} action={action} />

          {/* Source Selection */}
          <SourceSelectionCard
            zapId={Number(zapId)}
            selectedFromStepId={selectedFromStepId}
            onSelectFromStep={setSelectedFromStepId}
            serviceColor={service.services_color}
          />

          {/* Action Fields */}
          <ActionFieldsCard
            fields={fieldsArray}
            zapId={Number(zapId)}
            sourceStepId={selectedFromStepId}
            serviceColor={service.services_color}
            formData={formData}
            onFieldChange={handleFieldChange}
          />

          {/* Continue Button */}
          <PrimaryButton
            title="Continue"
            onPress={handleContinue}
            backgroundColor={service.services_color}
          />
        </ScrollView>
      </View>
    </>
  );
};

export default ActionFieldsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
});
