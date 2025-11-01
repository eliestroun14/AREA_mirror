import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service, Trigger, Action } from "@/types/type";
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import { getServiceImageSource } from "@/utils/serviceImageUtils";
import ActionFieldCard from "@/components/molecules/action-field-card/action-field-card";
import StepSourceSelector from "@/components/molecules/step-source-selector/step-source-selector";
import { TriggerField } from "@/types/type";
import { router } from "expo-router";
import { useApi } from "@/context/ApiContext";

type Props = {}

const ActionFieldsPage = (props: Props) => {
  console.log('(ACTION FIELDS PAGE)');

  const { id, actionId, serviceActionId, triggerId, serviceTriggerId, zapId } = useLocalSearchParams<{
    id?: string;
    actionId?: string;
    serviceActionId?: string;
    triggerId?: string;
    serviceTriggerId?: string;
    zapId?: string;
  }>();

  const [service, setService] = useState<Service | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFromStepId, setSelectedFromStepId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  const { apiUrl } = useApi();


  useEffect(() => {
    const fetchServiceAndAction = async () => {
      setLoading(true);
      try {
        if (!serviceActionId || !actionId) {
          setService(null);
          setAction(null);
          setLoading(false);
          return;
        }
        // Fetch service
        const serviceRes = await fetch(`${apiUrl}/services/${serviceActionId}`);
        if (!serviceRes.ok) throw new Error('Service not found');
        const serviceData: Service = await serviceRes.json();
        setService(serviceData);
        // Fetch action
        const actionRes = await fetch(`${apiUrl}/services/${serviceActionId}/actions/${actionId}`);
        if (!actionRes.ok) throw new Error('Action not found');
        const actionData: Action = await actionRes.json();
        setAction(actionData);
        console.log('Action fields:', actionData.fields);
        
        // Initialize form data with default values
        const fieldsArray = Object.entries(actionData.fields);
        const initialFormData: Record<string, string> = {};
        fieldsArray.forEach(([key, field]) => {
          const fieldData = field as TriggerField;
          initialFormData[key] = fieldData.default_value || '';
        });
        setFormData(initialFormData);
        
      } catch (err) {
        setService(null);
        setAction(null);
        console.log('[ActionFieldsPage] Error fetching service or action:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceAndAction();
  }, [serviceActionId, actionId, apiUrl]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleContinue = () => {
    // Validate required fields
    const fieldsArray = Object.entries(action?.fields || {});
    const missingRequired = fieldsArray
      .filter(([key, field]) => {
        const fieldData = field as TriggerField;
        return fieldData.required && !formData[key]?.trim();
      })
      .map(([key, field]) => (field as TriggerField).field_name);

    if (missingRequired.length > 0) {
      alert(`Please fill in the following required fields: ${missingRequired.join(', ')}`);
      return;
    }

    router.push({
      pathname: "/(tabs)/create",
      params: {
        actionId: action?.id,
        serviceActionId: service?.id,
        triggerId: triggerId,
        serviceTriggerId: serviceTriggerId,
        zapId: zapId,
        fromStepId: selectedFromStepId,
        actionFormData: JSON.stringify(formData)
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!service || !action) {
    return (
      <View style={styles.container}>
        <Text>Service ou Action non trouvé</Text>
      </View>
    );
  }

  const fieldsArray = Object.entries(action.fields).map(([key, field]) => ({
    fieldId: key, // Use fieldId instead of id to avoid conflicts
    ...(field as TriggerField)
  }));

  return (
    <>
      <Stack.Screen
          options={{
            title: "Complete action fields",
            headerStyle: {
              backgroundColor: service.services_color,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <View style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
          <ScrollView style={[styles.header, {backgroundColor: service.services_color}]} 
                      contentContainerStyle={{ paddingBottom: 150 }}> 
            <Image
              style={styles.appLogo}
              source={getServiceImageSource(service)}
            />
            <Text style={styles.actionName}>
              {action.name}
            </Text>
            <Text style={styles.actionDescription}>
              {action.description}
            </Text>
            
            {/* Source Selection Section */}
            {zapId && (
              <View style={styles.sourceSection}>
                <StepSourceSelector
                  zapId={Number(zapId)}
                  selectedFromStepId={selectedFromStepId}
                  onSelectFromStep={setSelectedFromStepId}
                  serviceColor={service.services_color}
                />
              </View>
            )}
            
            {/* Action Fields */}
            <View style={styles.fieldsContainer}>
              {fieldsArray.map((item) => (
                <ActionFieldCard 
                  key={item.fieldId} 
                  item={{...item, id: item.fieldId}} 
                  zapId={zapId ? Number(zapId) : undefined}
                  sourceStepId={selectedFromStepId}
                  serviceColor={service.services_color}
                  onFieldChange={handleFieldChange}
                  value={formData[item.fieldId]}
                />
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.connectButton}
              onPress={handleContinue}
            >
              <Text style={styles.connectButtonText}>
                  Continue
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
    </>
  )
}

export default ActionFieldsPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    paddingBottom: 30,
    marginBottom: 10,
    height: "100%"
  },

  appLogo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 70
  },

  actionName: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: "center",
    marginTop: 20,
    color: '#fff'
  },

  actionDescription: {
    fontSize: 16,
    lineHeight: 20,
    color: '#fff',
    alignSelf: "center",
    maxWidth: 300,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "500"
  },

  sourceSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  fieldsContainer: {
    paddingHorizontal: 16,
  },

  connectButton: {
  position: 'absolute',
  bottom: 80,
  left: 20,
  right: 20,
  height: 80,
  backgroundColor: "#fff",
  borderRadius: 100,
  alignItems: "center",
  justifyContent: "center",
},

  connectButtonText: {
    fontSize: 25,
    fontWeight: "bold",
  },

  content: {
    alignSelf: "center"
  },

})
