import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import areaLogo from '../../assets/images/AreaLogo.png';

export default function LoginScreen() {
  console.log('(PROFILE)');
  const [sessionToken, setSessionToken] = useState<string>('');

  const { isAuthenticated, user, login, logout } = useAuth();
  console.log('Auth state on mount:', { isAuthenticated, user });
  const [error, setError] = useState("");

  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user , sessionToken});
  }, [isAuthenticated, user, sessionToken]);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });


  useEffect(() => {
    // Met à jour le token si présent dans le user
    if ((user as any)?.session_token) {
      setSessionToken((user as any).session_token);
    }
    // Récupère les connexions liées si authentifié
    const fetchConnections = async () => {
      if (!isAuthenticated || !sessionToken) return;
      try {
        const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
        const res = await fetch(`${apiUrl}/users/me/connections`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionToken,
          },
          credentials: 'include',
        });
        if (res.status === 200) {
          const result = await res.json();
          setConnections(result.connections || []);
        } else {
          setConnections([]);
        }
      } catch (err) {
        setConnections([]);
      }
    };
    fetchConnections();
  }, [user, isAuthenticated, sessionToken]);

  const validate = (text:string) => {
      console.log(text);
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(text) === false) {
        console.log("Email is Not Correct");
        return false;
      }
      else {
        console.log("Email is Correct");
        return true
    }
  }

  const checkTextInputs = () => {
    console.log('Checking text inputs:', form);
    if (!validate(form.email)) {
      Alert.alert('Please enter valid email.');
      return;
    }
    if (!form.password.trim()) {
      Alert.alert('Please enter password.');
      return;
    }
    handleSignIn();
  }

  const handleSignIn = async () => {
    setError("");
    console.log('Attempting sign in with:', form);
    const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
    try {
      const res = await fetch(`${apiUrl}/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
        credentials: "include",
      });
      const result = await res.json();
      console.log('Sign-in response:', res.status, result);
      if (res.status === 200) {
        const resUser = await fetch(`${apiUrl}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": result.session_token
          },
          credentials: "include",
        });
        const resultUser = await resUser.json();
        console.log("User info :", resultUser); 
        setSessionToken(result.session_token);
        login({ name: resultUser.name || resultUser.user?.name, email: resultUser.email || resultUser.user?.email }, result.session_token);
        console.log('Called login with:', {
          name: resultUser.name || resultUser.user?.name,
          email: resultUser.email || resultUser.user?.email,
        }, result.session_token);
        Alert.alert("Succefully signed in !")
      } else if (res.status === 401) {
        Alert.alert("Invalid email or password.")
        setError(result.data || "Invalid email or password.");
      } else {
        setError("Failed to login. Please check your credentials.");
      }
    } catch (err) {
      console.log('Sign-in error:', err);
      setError("Failed to login. Please check your credentials.");
    }
  };
  const [editField, setEditField] = useState<'email' | 'name' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  type Connection = {
    id: number;
    service_id: number;
    service_name: string;
    service_color?: string;
    icon_url?: string;
    connection_name: string;
    account_identifier: string;
    is_active?: boolean;
    created_at?: string;
    last_used_at?: string | null;
  };
  const [connections, setConnections] = useState<Connection[]>([]);

  if (isAuthenticated === false) {
    console.log('Rendering login screen. Authenticated:', isAuthenticated, 'User:', user);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <View style={styles.header}>
                <Image
                  source={areaLogo}
                  style={styles.headerImg}
                  alt="Area Logo"
                />

                <Text style={styles.title}>
                  Sign in to AREA
                </Text>

                <Text style={styles.subtitle}>
                  Get access to your profile and more.
                </Text>
              </View>

              {/* Extra padding for keyboard */}
              <View style={[styles.form, { paddingBottom: 60 }]}> 
                <View style={styles.input}>
                  <Text style={styles.inputLabel}>
                    Email address :
                  </Text>

                  <TextInput
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='email-address'
                    style={styles.inputControl}
                    placeholder='john@example.com'
                    placeholderTextColor='#6b7280'
                    value={form.email}
                    onChangeText={(email: string) => setForm({ ...form, email })}
                  />
                </View>

                <View style={styles.input}>
                  <Text style={styles.inputLabel}>
                    Password :
                  </Text>

                  <TextInput
                    secureTextEntry={true}
                    style={styles.inputControl}
                    placeholder='*********'
                    placeholderTextColor='#6b7280'
                    value={form.password}
                    onChangeText={(password: string) => setForm({ ...form, password })}
                  />
                </View>

                <View style={styles.formAction}>
                  <TouchableOpacity
                    onPress={() => {
                      checkTextInputs()
                    }}>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}> Sign in </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{ marginTop: 'auto'}}
                  onPress={() => {
                    router.push("/sign-up")
                  }}>
                    <Text style={styles.formFooter}>
                      Don&apos;t have an account ?{' '}
                      <Text style={{ textDecorationLine: 'underline'}}>Sign up</Text>
                    </Text>
                </TouchableOpacity>

              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  } else {
    // Fonction pour modifier email ou nom
    const handleEditProfile = async () => {
      if (!editField || !editValue.trim() || !user) return;
      setIsLoading(true);
      try {
        const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
        const body = editField === 'email' ? { email: editValue, name: user.name } : { email: user.email, name: editValue };
        const res = await fetch(`${apiUrl}/users/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionToken,
          },
          body: JSON.stringify(body),
          credentials: 'include',
        });
        const result = await res.json();
        if (res.status === 200) {
          login({ name: result.name, email: result.email }, sessionToken);
          Alert.alert('Profile updated!');
          setEditField(null);
          setEditValue('');
        } else {
          Alert.alert('Error', result.message || 'Unable to update profile.');
        }
      } catch (err) {
        Alert.alert('Error', 'Unable to update profile.');
      }
      setIsLoading(false);
    };

    // Fonction pour supprimer le compte
    const handleDeleteAccount = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
        const res = await fetch(`${apiUrl}/users/me`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionToken,
          },
          credentials: 'include',
        });
        if (res.status === 204) {
          Alert.alert('Account deleted', 'Your account has been deleted.');
          logout();
        } else {
          const result = await res.json();
          Alert.alert('Error', result.message || 'Unable to delete account.');
        }
      } catch (err) {
        Alert.alert('Error', 'Unable to delete account.');
      }
      setIsLoading(false);
    };

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Image
                source={areaLogo}
                style={styles.profileImg}
                alt="Area Logo"
              />
              <Text style={styles.title}>
                {user?.name || "Profile name"}
              </Text>
              <Text style={styles.subtitle}>
                Welcome {user?.name} :)
              </Text>
            </View>

            {/* Formulaire de modification */}
            <View style={[styles.form, { marginBottom: 32 }]}> 
              {editField ? (
                <View style={styles.input}>
                  <Text style={styles.inputLabel}>
                    Edit {editField === 'email' ? 'email' : 'name'}:
                  </Text>
                  <TextInput
                    style={styles.inputControl}
                    value={editValue}
                    onChangeText={setEditValue}
                    autoCapitalize={editField === 'email' ? 'none' : 'words'}
                    keyboardType={editField === 'email' ? 'email-address' : 'default'}
                    placeholder={editField === 'email' ? (user?.email || '') : (user?.name || '')}
                  />
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TouchableOpacity
                      style={[styles.button, { marginRight: 10 }]}
                      onPress={handleEditProfile}
                      disabled={isLoading}
                    >
                      <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.disconnectButton}
                      onPress={() => { setEditField(null); setEditValue(''); }}
                      disabled={isLoading}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                  <TouchableOpacity
                    style={[styles.button, { marginRight: 10 }]}
                    onPress={() => setEditField('email')}
                  >
                    <Text style={styles.buttonText}>Edit email</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setEditField('name')}
                  >
                    <Text style={styles.buttonText}>Edit name</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Connexions liées */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>Linked Accounts</Text>
              {connections.length === 0 ? (
                <Text style={{ textAlign: 'center', color: '#929292' }}>No linked accounts found.</Text>
              ) : (
                connections.map((conn, idx) => (
                  <View key={conn.id || idx} style={{ backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{conn.service_name || 'Service'}</Text>
                    <Text style={{ color: '#222' }}>Account: {conn.account_identifier}</Text>
                    <Text style={{ color: '#929292' }}>Connection name: {conn.connection_name}</Text>
                  </View>
                ))
              )}
            </View>

            {/* Bouton suppression de compte */}
            <View style={[styles.formAction, { marginBottom: 24 }]}> 
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Confirmation',
                    'Are you sure you want to delete your account? This action is irreversible.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: handleDeleteAccount },
                    ]
                  );
                }}
                disabled={isLoading}
              >
                <View style={styles.disconnectButton}>
                  <Text style={styles.buttonText}>Delete my account</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Bouton déconnexion */}
            <View style={styles.formAction}>
              <TouchableOpacity
                onPress={() => {
                  console.log('Signing out...');
                  logout();
                  form.password = '';
                  console.log('After logout. Authenticated:', isAuthenticated, 'User:', user);
                }}
              >
                <View style={styles.disconnectButton}>
                  <Text style={styles.buttonText}>Sign out</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },

  header: {
    marginVertical: 36,
  },

  headerImg: {
    width: 125,
    height: 125,
    alignSelf: 'center',
    marginBottom: 15
  },

  profileImg: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius: 15
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginBottom: 6,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center'
  },

  form: {
    marginBottom: 24,
    flex: 1,
  },

  formAction: {
    marginVertical: 24
  },

  formFooter: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15
  },

  input: {
    marginBottom: 16
  },

  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },

  inputControl: {
    height: 44,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },

  button: {
    backgroundColor: '#075eec',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#075eec',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },

  disconnectButton: {
    backgroundColor: '#ec0707ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ec0707ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    maxWidth: 130,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

});
