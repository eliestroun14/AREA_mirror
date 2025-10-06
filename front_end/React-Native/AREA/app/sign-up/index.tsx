import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import areaLogo from '../../assets/images/AreaLogo.png';
import { Stack } from 'expo-router';


export default function SignUpScreen() {
  console.log('(SIGN UP)');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validate = (text:string) => {
    console.log(text);
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false)
      return false;
    return true
}

  const checkTextInputs = async () => {
    if (!form.name.trim()) {
      Alert.alert('Please enter name.');
      return;
    }
    if (!validate(form.email)) {
      Alert.alert('Please enter valid email.');
      return;
    }
    if (!form.password.trim()) {
      Alert.alert('Please enter password.');
      return;
    }
    if (form.confirmPassword.toString() != form.password.toString()) {
      Alert.alert('Confirm password not validated.');
      return;
    }

    const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${apiUrl}/auth/sign-up`, { // FIXME: belek à l'ip, c'est celle d'Epitech
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        }),
      });

      if (response.ok) {
        Alert.alert("Successfully signed up !");
      } else {
        const error = await response.json();
        // Alert.alert(
        //   "Error",
        //   typeof error.message === "string"
        //     ? error.message
        //     : JSON.stringify(error)
        // );
        Alert.alert("Email already used.");
      }
    } catch {
      Alert.alert("Network error");
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sign Up',
          headerStyle: {
            backgroundColor: '#075eec',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
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
                  Welcome to AREA
                </Text>

                <Text style={styles.subtitle}>
                  Sign up here to access to your profile and more.
                </Text>
              </View>

              {/* Extra padding for keyboard */}
              <View style={[styles.form, { paddingBottom: 60 }]}>
                <View style={styles.input}>
                  <Text style={styles.inputLabel}>
                    Name :
                  </Text>

                  <TextInput
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={styles.inputControl}
                    placeholder='MyNth'
                    placeholderTextColor='#6b7280'
                    value={form.name}
                    onChangeText={(name: string) => setForm({ ...form, name })}
                  />
                </View>

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

                <View style={styles.input}>
                  <Text style={styles.inputLabel}>
                    Confirm Password :
                  </Text>

                  <TextInput
                    secureTextEntry={true}
                    style={styles.inputControl}
                    placeholder='*********'
                    placeholderTextColor='#6b7280'
                    value={form.confirmPassword}
                    onChangeText={(confirmPassword: string) => setForm({ ...form, confirmPassword })}
                  />
                </View>

                <View style={styles.formAction}>
                  <TouchableOpacity
                    onPress={() => {
                      checkTextInputs()
                    }}>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}> Sign Up </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },

  header: {
    marginVertical: 0,
  },

  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },

  title: {
    fontSize: 27,
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


});
