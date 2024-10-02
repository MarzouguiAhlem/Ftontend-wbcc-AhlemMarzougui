import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Assurez-vous d'avoir installé react-native-vector-icons

const ProfileScreen = () => {
  const chauffeur = {
    name: 'Alex BERNARD',
    email: 'AlexB@wbcc.fr',
    phone: '+216 12 345 678',
    photoUrl: 'https://via.placeholder.com/150', // Remplacez par l'URL de la photo
  };

  return (
    <ImageBackground
      source={require('../assets/back2.jpg')}
      style={styles.background}
      blurRadius={5}
    >
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          <Image source={{ uri: chauffeur.photoUrl }} style={styles.photo} />
        </View>

        <Text style={styles.name}>{chauffeur.name}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={24} color="#bfb2e5" />
            <Text style={styles.infoText}>{chauffeur.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={24} color="#bfb2e5" />
            <Text style={styles.infoText}>{chauffeur.phone}</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    padding: 20,
    marginTop:40
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  photoContainer: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 75, // Pour un cercle
    overflow: 'hidden',
    marginBottom: 20,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75, // Pour un cercle
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop:40,
    marginLeft:160
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default ProfileScreen;
