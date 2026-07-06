// Importamos el contenedor de navegación principal.
// Esto permite que la aplicación pueda moverse entre pantallas.
import { NavigationContainer } from '@react-navigation/native';

// Importamos el Stack Navigator, que es el tipo de navegación pedido en el proyecto.
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos las tres pantallas principales de la aplicación.
import InicioScreen from './screens/InicioScreen';
import NivelScreen from './screens/NivelScreen';
import FinalScreen from './screens/FinalScreen';

// Creamos el objeto Stack que se usará para registrar las pantallas.
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // NavigationContainer envuelve toda la navegación de la app.
    <NavigationContainer>
      {/* Stack.Navigator define el orden y configuración general de las pantallas. */}
      <Stack.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          // Ocultamos el encabezado por defecto para usar nuestro propio diseño.
          headerShown: false,
        }}
      >
        {/* Pantalla inicial donde el niño empieza el juego. */}
        <Stack.Screen name="Inicio" component={InicioScreen} />

        {/* Pantalla donde se muestran los niveles y los objetos del juego. */}
        <Stack.Screen name="Nivel" component={NivelScreen} />

        {/* Pantalla final que aparece cuando el niño completa todos los niveles. */}
        <Stack.Screen name="Final" component={FinalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}