import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Welcome{user?.first_name ? `, ${user.first_name}` : ''}!
          </ThemedText>
          
          <ThemedText style={styles.subtitle}>
            Your dashboard is ready. Use the sidebar to view your details and role information.
          </ThemedText>

          {user && (
            <ThemedView style={styles.infoCard}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Quick Info
              </ThemedText>
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Username:</ThemedText>
                <ThemedText style={styles.value}>{user.username}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Email:</ThemedText>
                <ThemedText style={styles.value}>{user.email}</ThemedText>
              </View>
              {user.roles && user.roles.length > 0 && (
                <View style={styles.infoRow}>
                  <ThemedText style={styles.label}>Primary Role:</ThemedText>
                  <ThemedText style={styles.value}>
                    {user.roles[0].display_name || user.roles[0].role_name}
                  </ThemedText>
                </View>
              )}
            </ThemedView>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: 32,
    opacity: 0.7,
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  cardTitle: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  value: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
});
