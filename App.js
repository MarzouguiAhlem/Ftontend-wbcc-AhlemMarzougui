// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import FuelScreen from './screens/FuelScreen';
import TrackingScreen from './screens/TrackingScreen';
import CleaningScreen from './screens/CleaningScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ENTRETIEN VEHICULE">
      <Stack.Screen
          name="ENTRETIEN VEHICULE"
          component={SignInScreen}
          options={{ headerShown: false }} />
        <Stack.Screen name="Inscription" component={SignUpScreen} />
        <Stack.Screen name="Accueil" component={HomeScreen} />
        <Stack.Screen name="Achat de Carburant" component={FuelScreen} />
        <Stack.Screen name="Suivi" component={TrackingScreen} />
        <Stack.Screen name="Nettoyage" component={CleaningScreen} />
        <Stack.Screen name="Profil" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
