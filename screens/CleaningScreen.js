import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const CleaningScreen = () => {
  const [photoAvant, setPhotoAvant] = useState(null);
  const [photoApres, setPhotoApres] = useState(null);

  // Fonction pour choisir une image avant le nettoyage
  const pickImageAvant = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoAvant(result.assets[0].uri);
    }
  };

  // Fonction pour choisir une image après le nettoyage
  const pickImageApres = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoApres(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Logique de soumission des photos
    if (photoAvant && photoApres) {
      try {
        const formData = new FormData();
        formData.append('action', 'addNettoyage');
        formData.append('photo_avant', {
          uri: photoAvant,
          type: 'image/jpeg', // ou le type d'image approprié
          name: 'photo_avant.jpg',
        });
        formData.append('photo_apres', {
          uri: photoApres,
          type: 'image/jpeg', // ou le type d'image approprié
          name: 'photo_apres.jpg',
        });

        // Remplacez l'URL par celle de votre API
        const response = await axios.post('http://192.168.1.10/entretien_vehicules/index.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Assurez-vous que le type de contenu est correct
          },
        });

        console.log(response.data);
        Alert.alert('Succès', 'Photos soumises avec succès !');
        // Réinitialiser les photos après soumission
        setPhotoAvant(null);
        setPhotoApres(null);
      } catch (error) {
        console.error('Erreur lors de la soumission des photos:', error);
        Alert.alert('Erreur', 'Une erreur s\'est produite lors de la soumission des photos.');
      }
    } else {
      Alert.alert('Erreur', 'Veuillez sélectionner les deux photos.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/back2.jpg')}
      style={styles.background}
      blurRadius={5}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Nettoyage du Véhicule</Text>

        <View style={styles.photoContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImageAvant}>
            <Text style={styles.buttonText}>Photo Avant le Nettoyage</Text>
          </TouchableOpacity>
          {photoAvant && <Image source={{ uri: photoAvant }} style={styles.image} />}
        </View>

        <View style={styles.photoContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImageApres}>
            <Text style={styles.buttonText}>Photo Après le Nettoyage</Text>
          </TouchableOpacity>
          {photoApres && <Image source={{ uri: photoApres }} style={styles.image} />}
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
    marginBottom: 60,
    textAlign: 'center',
    color: '#bfb2e5',
    marginTop: 80,
  },
  photoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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

export default CleaningScreen;
