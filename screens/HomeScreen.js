import React, { useState , useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Modal, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import qs from 'qs';


const HomeScreen = ({ navigation }) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ marque: '', modele: '', immatriculation: '' });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://192.168.1.10/entretien_vehicules/index.php', {
          params: { action: 'getVehicules' },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        console.log('Véhicules récupérés:', response.data);
        setVehicles(response.data); // Update the state with the fetched vehicles
      } catch (error) {
        console.error('Erreur lors de la récupération des véhicules', error);
        alert('Erreur lors de la récupération des véhicules.');
      }
    };
    

    fetchVehicles();
  }, []); // Le tableau vide signifie que cela ne s'exécutera qu'une seule fois lorsque le composant sera monté

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.immatriculation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVehiclePress = (id) => {
    setSelectedVehicleId(selectedVehicleId === id ? null : id);
  };

  const handleAddVehicle = async () => {
    if (newVehicle.marque && newVehicle.modele && newVehicle.immatriculation) {
      try {
        const response = await axios.post('http://192.168.1.10/entretien_vehicules/index.php', 
          qs.stringify({
            action: 'addVehicule',
            marque: newVehicle.marque,
            modele: newVehicle.modele,
            immatriculation: newVehicle.immatriculation,
          }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
  
        console.log('Réponse du serveur:', response.data); // Ajout de ce log
  
        // Vérifier la réponse
        if (response.data) {
          setVehicles([...vehicles, { ...newVehicle, id: (vehicles.length + 1).toString() }]);
          setNewVehicle({ marque: '', modele: '', immatriculation: '' });
          setModalVisible(false);
        } else {
          alert('Erreur lors de l\'ajout du véhicule: ' + response.data.message || 'Erreur inconnue.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout du véhicule', error);
        alert('Erreur lors de l\'ajout du véhicule.'); 
      }
    } else {
      alert('Veuillez remplir tous les champs.'); 
    }
  };
  

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };


  const handleLogout = async () => {
    try {
      await axios.get('http://192.168.1.10/entretien_vehicules/index.php', {
    action: 'logout',
  }, {
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded'
    }
  });
      navigation.navigate('ENTRETIEN VEHICULE'); // Rediriger vers la page de connexion
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };


  return (
    <ImageBackground
      source={require('../assets/back2.jpg')}
      style={styles.background}
      blurRadius={5}
    >
      <View style={styles.container}>
        {/* Header avec flèche alignée à droite */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleDropdown}>
            <Icon name="angle-down" size={38} color="#1f0078" />
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdown}>
              <TouchableOpacity onPress={() => navigation.navigate('Profil')} style={styles.dropdownItem}>
                <Icon name="user" size={20} color="#1f0078" />
                <Text style={styles.dropdownText}>Profil</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
                <Icon name="sign-out" size={20} color="#1f0078" />
                <Text style={styles.dropdownText1}>Déconnexion</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Titre centré */}
        <Text style={styles.title}>Liste des Véhicules</Text>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Numéro d'immatriculation"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
        </View>

        {/* Liste des véhicules */}
        <FlatList
          data={filteredVehicles}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TouchableOpacity onPress={() => handleVehiclePress(item.id)} style={styles.vehicleButton}>
                <Text style={styles.vehicleText}>{`${item.marque} ${item.modele} (${item.immatriculation})`}</Text>
                <Icon name="car" size={20} color="#3403c1" />
              </TouchableOpacity>
              {selectedVehicleId === item.id && (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Suivi')}>
                    <Icon name="tachometer" size={14} color="#fff" />
                    <Text style={styles.optionButtonText}>Suivi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Achat de Carburant')}>
                    <Icon name="beer" size={14} color="#fff" />
                    <Text style={styles.optionButtonText}>Carburant</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Nettoyage')}>
                    <Icon name="shower" size={14} color="#fff" />
                    <Text style={styles.optionButtonText}>Nettoyage</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          keyExtractor={item => item.id}
        />

        {/* Bouton pour ajouter un véhicule */}
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Ajouter un Véhicule</Text>
        </TouchableOpacity>

        {/* Modal pour ajouter un véhicule */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Ajouter un Véhicule</Text>
              <TextInput
                style={styles.input}
                placeholder="Marque"
                value={newVehicle.marque}
                onChangeText={text => setNewVehicle({ ...newVehicle, marque: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Modèle"
                value={newVehicle.modele}
                onChangeText={text => setNewVehicle({ ...newVehicle, modele: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Numéro d'immatriculation"
                value={newVehicle.immatriculation}
                onChangeText={text => setNewVehicle({ ...newVehicle, immatriculation: text })}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.submitButton} onPress={handleAddVehicle}>
                  <Text style={styles.submitButtonText}>Ajouter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row-reverse',
    marginTop: 0,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#bfb2e5',
    textAlign: 'center',
    marginTop: 20,
    marginBottom:50,

  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    zIndex:5
  },
  dropdownItem: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  dropdownText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#1f0078',
  },
  dropdownText1: {
    marginLeft: 7,
    fontSize: 15,
    color: '#1f0078',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    margin: 10,
    elevation: 3,
    marginBottom:30
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 15,
    elevation: 3,
  },
  vehicleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vehicleText: {
    fontSize: 16,
    color: '#333',
  },
  optionsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionButton: {
    backgroundColor: '#7e76df',
    padding: 6,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#3403c1',
    padding: 12,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    elevation:8
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:28
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 250,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#58b07d',
    padding: 10,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default HomeScreen;
