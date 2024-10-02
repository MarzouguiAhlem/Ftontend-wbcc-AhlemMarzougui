import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, ImageBackground, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'; // Importez axios

const FuelScreen = () => {
  const [montant, setMontant] = useState('');
  const [litres, setLitres] = useState('');
  const [factureUrl, setFactureUrl] = useState(null);
  const [entretienId, setEntretienId] = useState(''); // Ajoutez une variable d'état pour l'ID d'entretien

  // Fonction pour choisir une image de la facture
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFactureUrl(result.assets[0].uri);
    }
  };

  // Fonction pour gérer la soumission des données
  const handleSubmit = async () => {
    if (montant && litres && factureUrl) { // Vérifiez que tous les champs sont remplis
      try {
        const formData = new FormData();
        formData.append('action', 'addCarburant');
        formData.append('entretien_id', entretienId); // Ajoutez l'entretien_id
        formData.append('montant', montant);
        formData.append('litres', litres);
        formData.append('facture', {
          uri: factureUrl,
          type: 'image/jpeg', // Assurez-vous de mettre le type correct ici
          name: 'facture.jpg', // Nommez le fichier
        });

        const response = await axios.post('http://192.168.1.10/entretien_vehicules/index.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(response.data);
        Alert.alert('Succès', 'Données soumises avec succès !');

        // Réinitialiser les champs après soumission
        setMontant('');
        setLitres('');
        setFactureUrl(null);
      } catch (error) {
        console.error('Erreur lors de la soumission des données:', error);
        Alert.alert('Erreur', 'Une erreur s\'est produite lors de la soumission des données.');
      }
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/back2.jpg')}
      style={styles.background}
      blurRadius={5}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Achat de Carburant</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Montant (en TND)"
            value={montant}
            onChangeText={setMontant}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de Litres"
            value={litres}
            onChangeText={setLitres}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.photoContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Ajouter la Facture</Text>
          </TouchableOpacity>
          {factureUrl && <Image source={{ uri: factureUrl }} style={styles.image} />}
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
    width: '60%',
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor:"white"
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
    width: '60%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal:24
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

export default FuelScreen;
