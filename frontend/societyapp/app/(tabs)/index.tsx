import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Welcome{user?.first_name ? `, ${user.first_name}` : ''}!
        </ThemedText>
        
        {user && (
          <ThemedView style={styles.userInfo}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              User Information
            </ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Username:</ThemedText>
              <ThemedText style={styles.value}>{user.username}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Email:</ThemedText>
              <ThemedText style={styles.value}>{user.email}</ThemedText>
            </View>
            {user.first_name && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Name:</ThemedText>
                <ThemedText style={styles.value}>
                  {user.first_name} {user.last_name}
                </ThemedText>
              </View>
            )}
            {user.phone && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Phone:</ThemedText>
                <ThemedText style={styles.value}>{user.phone}</ThemedText>
              </View>
            )}
            {user.status && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Status:</ThemedText>
                <ThemedText style={styles.value}>{user.status}</ThemedText>
              </View>
            )}
          </ThemedView>
        )}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}>
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 32,
    textAlign: 'center',
  },
  userInfo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
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
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
