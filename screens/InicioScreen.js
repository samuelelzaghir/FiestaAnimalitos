// useFocusEffect se usa para actualizar la pantalla cada vez que volvemos a ella.
import { useFocusEffect } from '@react-navigation/native';

// useCallback y useState permiten manejar estados y funciones dentro del componente.
import { useCallback, useState } from 'react';

import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// AsyncStorage funciona como una base de datos local sencilla.
// Lo usamos para leer y borrar el último puntaje guardado.
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InicioScreen({ navigation }) {
  // Estado para guardar el último puntaje recuperado desde AsyncStorage.
  const [puntaje, setPuntaje] = useState(null);

  // Estado para guardar la cantidad de niveles completados.
  const [nivelesCompletados, setNivelesCompletados] = useState(null);

  // Esta función carga el progreso guardado en el dispositivo.
  const cargarProgreso = async () => {
    try {
      const puntajeGuardado = await AsyncStorage.getItem('puntaje');
      const nivelesGuardados = await AsyncStorage.getItem('nivelesCompletados');

      // Si existe un puntaje guardado, lo mostramos en la pantalla de inicio.
      if (puntajeGuardado !== null) {
        setPuntaje(puntajeGuardado);
      } else {
        setPuntaje(null);
      }

      // Si existen niveles guardados, también se muestran.
      if (nivelesGuardados !== null) {
        setNivelesCompletados(nivelesGuardados);
      } else {
        setNivelesCompletados(null);
      }
    } catch (error) {
      console.log('Error al cargar progreso:', error);
    }
  };

  // Esta función borra el progreso guardado.
  // Sirve para reiniciar los datos almacenados localmente.
  const borrarProgreso = async () => {
    try {
      await AsyncStorage.removeItem('juegoCompletado');
      await AsyncStorage.removeItem('puntaje');
      await AsyncStorage.removeItem('nivelesCompletados');

      setPuntaje(null);
      setNivelesCompletados(null);

      Alert.alert('Progreso borrado', 'El puntaje guardado fue eliminado.');
    } catch (error) {
      console.log('Error al borrar progreso:', error);
    }
  };

  // Cada vez que la pantalla de inicio vuelve a enfocarse,
  // se actualiza la información guardada.
  useFocusEffect(
    useCallback(() => {
      cargarProgreso();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Caja principal con el título de la aplicación. */}
      <View style={styles.cajaTitulo}>
        <Text style={styles.titulo}>La Fiesta de los Animalitos</Text>
        <Text style={styles.subtitulo}>Aprendamos los números jugando.</Text>
      </View>

      {/* Círculo decorativo con los animalitos que aparecen en el juego. */}
      <View style={styles.circulo}>
        <Text style={styles.animales}>🐻 🐰 🐼</Text>
        <Text style={styles.animales}>🐥 🐵</Text>
      </View>

      {/* Esta caja solo aparece si ya hay un resultado guardado. */}
      {puntaje !== null && (
        <View style={styles.progresoCaja}>
          <Text style={styles.progresoTexto}>Último puntaje: {puntaje} puntos</Text>
          <Text style={styles.progresoTexto}>
            Niveles completados: {nivelesCompletados}
          </Text>

          <TouchableOpacity style={styles.botonBorrar} onPress={borrarProgreso}>
            <Text style={styles.textoBorrar}>Borrar progreso</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botón para iniciar el juego y pasar a la pantalla de nivel. */}
      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate('Nivel')}
      >
        <Text style={styles.textoBoton}>Comenzar ▶</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos de la pantalla de inicio.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cdefff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cajaTitulo: {
    backgroundColor: '#ffffff',
    width: '90%',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    marginBottom: 35,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#08708a',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
  },
  circulo: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#7bd3f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  animales: {
    fontSize: 45,
    textAlign: 'center',
  },
  progresoCaja: {
    backgroundColor: '#ffffff',
    width: '85%',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    marginBottom: 25,
  },
  progresoTexto: {
    fontSize: 15,
    color: '#08708a',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botonBorrar: {
    marginTop: 10,
    backgroundColor: '#f4f4f4',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  textoBorrar: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 13,
  },
  boton: {
    backgroundColor: '#ffd000',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 3,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7a6500',
  },
});