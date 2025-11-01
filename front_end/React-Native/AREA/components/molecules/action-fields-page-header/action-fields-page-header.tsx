import { View, Text, Image, StyleSheet } from 'react-native';
import { Service, Action } from '@/types/type';
import { getServiceImageSource } from '@/utils/serviceImageUtils';

interface ActionFieldsPageHeaderProps {
  service: Service;
  action: Action;
}

/**
 * Header component for action fields page
 * Displays service logo, action name and description
 */
const ActionFieldsPageHeader: React.FC<ActionFieldsPageHeaderProps> = ({ service, action }) => {
  return (
    <View style={[styles.header, { backgroundColor: service.services_color }]}>
      <Image
        style={styles.logo}
        source={getServiceImageSource(service)}
      />
      <Text style={styles.actionName}>{action.name}</Text>
      <Text style={styles.actionDescription}>{action.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 20,
  },
  actionName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#fff',
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: '#fff',
    maxWidth: 320,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ActionFieldsPageHeader;
