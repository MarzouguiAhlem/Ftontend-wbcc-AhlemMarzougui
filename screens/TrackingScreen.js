// screens/TrackingScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const TrackingScreen = () => {
  const [kilometrage, setKilometrage] = useState('');
  const [carburant, setCarburant] = useState('');
  const [proofUrl, setProofUrl] = useState(null);
  const [entretienId, setEntretienId] = useState(''); // Assurez-vous de définir une manière d'obtenir l'ID de l'entretien

  // Fonction pour choisir une image de preuve
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProofUrl(result.assets[0].uri);
    }
  };

  // Fonction pour gérer la soumission des données
  const handleSubmit = async () => {
    // Créer un objet FormData pour envoyer des données de formulaire
    const formData = new FormData();
    formData.append('action', 'addSuivi');
    //formData.append('entretien_id', entretienId);
    formData.append('kilometrage', kilometrage);
    formData.append('carburant', carburant);

    if (proofUrl) {
      const fileName = proofUrl.split('/').pop(); // Obtenir le nom du fichier
      const type = `image/${fileName.split('.').pop()}`; // Obtenir le type d'image
      formData.append('photo_carburant', {
        uri: proofUrl,
        name: fileName,
        type: type,
      });
    }

    try {
      const response = await axios.post('http://192.168.1.10/entretien_vehicules/index.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Logique après la soumission des données
      console.log(response.data);
      Alert.alert('Succès', 'Données soumises avec succès !');

      // Réinitialiser les champs après soumission
      setKilometrage('');
      setCarburant('');
      setProofUrl(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la soumission des données.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/back2.jpg')}
      style={styles.background}
      blurRadius={5}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Suivi Quotidien</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Entrer le kilométrage"
            value={kilometrage}
            onChangeText={setKilometrage}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Entrer le niveau de carburant (litres)"
            value={carburant}
            onChangeText={setCarburant}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.photoContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Ajouter une Preuve</Text>
          </TouchableOpacity>
          {proofUrl && <Image source={{ uri: proofUrl }} style={styles.image} />}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Soumettre</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#bfb2e5',
    marginTop: 80,
  },
  inputContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '70%',
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
  photoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
    width: '70%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 24,
  },
  image: {
    width: 250,
    height: 250,
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#3403c1',
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    margin: 30,
    marginHorizontal: 120,
    elevation: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TrackingScreen;
