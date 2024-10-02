import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Pour afficher/masquer le mot de passe

  // Validation d'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation de mot de passe (au moins 8 caractères, 1 lettre majuscule, 1 lettre minuscule, 1 chiffre et 1 caractère spécial)
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async () => {
    if (username.trim() === '') {
      Alert.alert('Erreur', "Le nom d'utilisateur est obligatoire.");
      return;
    }
  
    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse e-mail valide.');
      return;
    }
  
    if (!validatePassword(password)) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.');
      return;
    }
  
    try {
      // Appel à l'API de signup avec axios
      const response = await axios.post('http://192.168.1.10/entretien_vehicules/index.php', {
        action: 'addChauffeur',
        nom: username,
        email: email,
        mot_de_passe: password,
      }, {
        headers: {
          'Content-Type':  'application/x-www-form-urlencoded'
        }
      });
  
      // Vérification de la réponse de l'API
      if (response.data && response.data.id) {
        // Si l'inscription est réussie
        Alert.alert('Succès', 'Inscription réussie !');
        navigation.navigate('ENTRETIEN VEHICULE'); // Redirige vers la page suivante
      } else {
        // Si l'API renvoie une erreur ou la réponse n'a pas d'ID
        Alert.alert('Erreur', response.data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      // Gestion des erreurs
      if (error.response) {
        // Erreur provenant de l'API (statut 4xx ou 5xx)
        Alert.alert('Erreur', error.response.data.message || 'Une erreur est survenue lors de l\'inscription.');
      } else if (error.request) {
        // La requête a été envoyée mais pas de réponse reçue
        Alert.alert('Erreur', 'Pas de réponse du serveur. Vérifiez votre connexion.');
      } else {
        // Erreur dans la configuration de la requête
        Alert.alert('Erreur', 'Une erreur est survenue lors de la configuration de l\'inscription.');
      }
    }
  };
  

  return (
    <ImageBackground
      source={require('../assets/back2.jpg')} // Image de fond
      style={styles.background}
      blurRadius={5}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Créer un Compte</Text>

        {/* Champ de nom d'utilisateur */}
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        {/* Champ d'email */}
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

        {/* Champ de mot de passe avec icône d'affichage */}
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

        {/* Bouton d'inscription */}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        <Text style={styles.link} onPress={() => navigation.navigate('ENTRETIEN VEHICULE')}>
          Déjà un compte ? Se connecter
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
    marginTop: 100,
    width: '85%',
    padding: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Fond transparent
    borderRadius: 20,
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

export default SignUpScreen;
