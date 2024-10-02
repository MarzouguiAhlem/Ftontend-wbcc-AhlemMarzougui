import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignIn = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse e-mail valide.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.10/entretien_vehicules/index.php', {
        action: 'login',
        email: email,
        mot_de_passe: password,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = response.data; // Récupère directement les données de la réponse

      if (data.status !== false) {
        // Connexion réussie
        console.log('Connexion réussie', data);
        
        // Stocker le token dans le stockage local
        const token = data.token; // Assurez-vous que le token est inclus dans la réponse
        await AsyncStorage.setItem('jwtToken', token); // Stockage du token

        navigation.replace('Accueil'); // Redirige vers la page d'accueil
      } else {
        // Affiche un message d'erreur en cas d'échec
        Alert.alert('Erreur', data.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    }
  };


  return (
    <ImageBackground
      source={require('../assets/back2.jpg')}
      style={styles.background}
      blurRadius={5}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue</Text>

        <View style={styles.inputContainer}>
          <Icon name="envelope" size={15} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Adresse e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <Text style={styles.link} onPress={() => navigation.navigate('Inscription')}>
          Créer un compte ?
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    marginTop: 160,
    width: '85%',
    padding: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    height: 400,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
  },
  button: {
    backgroundColor: '#3403c1',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#fff',
    marginTop: 25,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SignInScreen;
