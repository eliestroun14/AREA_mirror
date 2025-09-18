import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function LoginScreen() {

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validate = (text:string) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
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
    if (!form.username.trim()) {
      Alert.alert('Please enter username.');
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
    Alert.alert("Succefully signed up !")
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/AreaLogo.png')}
            style={styles.headerImg}
          />

          <Text style={styles.title}>
            Welcome to AREA
          </Text>

          <Text style={styles.subtitle}>
            Sign up here to access to your profile and more.
          </Text>
        </View>

        <View style={styles.form}>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>
              Username :
            </Text>

            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              style={styles.inputControl}
              placeholder='MyNth'
              placeholderTextColor='#6b7280'
              value={form.username}
              onChangeText={username => setForm({ ...form, username })}
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
              onChangeText={email => setForm({ ...form, email })}
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
              onChangeText={password => setForm({ ...form, password })}
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
              onChangeText={confirmPassword => setForm({ ...form, confirmPassword })}
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

          {/* <TouchableOpacity
            style={{ marginTop: 'auto'}}
            onPress={() => {
              router.push("/sign-up")
            }}>
              <Text style={styles.formFooter}>
                Don't have an account ?{' '}
                <Text style={{ textDecorationLine: 'underline'}}>Sign up</Text>
              </Text>
          </TouchableOpacity> */}

        </View>
      </View>
    </SafeAreaView>
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
