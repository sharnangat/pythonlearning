import { StyleSheet, View, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';

interface SidebarProps {
  onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  if (!user) return null;

  const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0] : null;

  return (
    <ThemedView style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.userName}>
            {user.first_name && user.last_name
              ? `${user.first_name} ${user.last_name}`
              : user.username}
          </ThemedText>
          {user.email && (
            <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            User Details
          </ThemedText>
          
          <View style={styles.detailRow}>
            <ThemedText style={styles.label}>Username:</ThemedText>
            <ThemedText style={styles.value}>{user.username}</ThemedText>
          </View>

          {user.phone && (
            <View style={styles.detailRow}>
              <ThemedText style={styles.label}>Phone:</ThemedText>
              <ThemedText style={styles.value}>{user.phone}</ThemedText>
            </View>
          )}

          {user.status && (
            <View style={styles.detailRow}>
              <ThemedText style={styles.label}>Status:</ThemedText>
              <ThemedText style={styles.value}>{user.status}</ThemedText>
            </View>
          )}
        </View>

        {primaryRole && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Role
            </ThemedText>
            <View style={styles.roleContainer}>
              <ThemedText style={styles.roleName}>
                {primaryRole.display_name || primaryRole.role_name}
              </ThemedText>
              {primaryRole.society_name && (
                <ThemedText style={styles.societyName}>
                  {primaryRole.society_name}
                </ThemedText>
              )}
            </View>
          </View>
        )}

        {user.roles && user.roles.length > 1 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              All Roles ({user.roles.length})
            </ThemedText>
            {user.roles.map((role, index) => (
              <View key={role.id || index} style={styles.roleItem}>
                <ThemedText style={styles.roleItemName}>
                  {role.display_name || role.role_name}
                </ThemedText>
                {role.society_name && (
                  <ThemedText style={styles.roleItemSociety}>
                    {role.society_name}
                  </ThemedText>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {onLogout && (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
          activeOpacity={0.7}>
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 280,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    flex: 1,
  },
  sidebarMobile: {
    width: 240,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  roleContainer: {
    backgroundColor: Colors.light.tint + '20',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.tint,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.tint,
    marginBottom: 4,
  },
  societyName: {
    fontSize: 14,
    opacity: 0.7,
  },
  roleItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.tint,
  },
  roleItemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  roleItemSociety: {
    fontSize: 12,
    opacity: 0.6,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

