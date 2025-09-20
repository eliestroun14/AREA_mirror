import { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import areaLogo from '../../assets/images/AreaLogo.png';

export default function LoginScreen() {

  const { isAuthenticated, login, logout } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

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
    if (!validate(form.email)) {
      Alert.alert('Please enter valid email.');
      return;
    }
    if (!form.password.trim()) {
      Alert.alert('Please enter password.');
      return;
    }
    Alert.alert("Succefully signed in !")
    login();
  }

  if (isAuthenticated === false) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
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

          <View style={styles.form}>
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
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
        <View style={styles.container}>

          <View style={styles.header}>
            <Image
              source={areaLogo}
              style={styles.profileImg}
              alt="Area Logo"
            />

            <Text style={styles.title}>
              Profile name
            </Text>

            <Text style={styles.subtitle}>
              Welcome profile name :)
            </Text>
          </View>

          <View style={styles.formAction}>
              <TouchableOpacity
                onPress={() => {
                  logout();
                }}>
                <View style={styles.disconnectButton}>
                  <Text style={styles.buttonText}> Sign out </Text>
                </View>
              </TouchableOpacity>
            </View>

        </View>
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
