// useEffect se usa para ejecutar acciones al entrar a la pantalla.
// useState permite guardar el audio final mientras se reproduce.
import { useEffect, useState } from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Audio se usa para reproducir el mensaje final de felicitación.
import { Audio } from 'expo-av';

// AsyncStorage se usa como base de datos local para guardar el resultado.
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FinalScreen({ navigation }) {
  // Estado donde guardamos el sonido final para poder detenerlo o liberarlo.
  const [sonidoFinal, setSonidoFinal] = useState(null);

  // Esta función guarda el resultado final del juego.
  // Con esto demostramos el uso de almacenamiento local en la app.
  const guardarResultado = async () => {
    try {
      await AsyncStorage.setItem('juegoCompletado', 'si');
      await AsyncStorage.setItem('puntaje', '100');
      await AsyncStorage.setItem('nivelesCompletados', '5');

      console.log('Resultado guardado correctamente');
    } catch (error) {
      console.log('Error al guardar resultado:', error);
    }
  };

  // Esta función reproduce el audio de felicitación final.
  const reproducirFinal = async () => {
    try {
      // Si ya hay un audio final cargado, se detiene antes de reproducir otro.
      if (sonidoFinal) {
        await sonidoFinal.stopAsync();
        await sonidoFinal.unloadAsync();
      }

      // Cargamos el audio final desde la carpeta de sonidos.
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/final.mp3')
      );

      setSonidoFinal(sound);

      // Reproducimos el audio.
      await sound.playAsync();
    } catch (error) {
      console.log('Error al reproducir audio final:', error);
    }
  };

  // Al entrar a la pantalla final, se guarda el resultado y se reproduce el audio.
  useEffect(() => {
    guardarResultado();
    reproducirFinal();

    // Al salir de la pantalla, se libera el audio para evitar problemas de memoria.
    return () => {
      if (sonidoFinal) {
        sonidoFinal.unloadAsync();
      }
    };
  }, []);

  // Esta función detiene el audio y regresa al inicio para jugar otra vez.
  const jugarOtraVez = async () => {
    try {
      if (sonidoFinal) {
        await sonidoFinal.stopAsync();
        await sonidoFinal.unloadAsync();
      }
    } catch (error) {
      console.log('Error al detener audio final:', error);
    }

    navigation.navigate('Inicio');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* El ícono también sirve para repetir el audio final. */}
        <TouchableOpacity style={styles.icono} onPress={reproducirFinal}>
          <Text style={styles.iconoTexto}>🎉</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>¡Lo lograste!</Text>

        <Text style={styles.subtitulo}>
          Gracias por ayudar a preparar la fiesta.
        </Text>

        {/* Resultado visible para el usuario. */}
        <View style={styles.resultadoCaja}>
          <Text style={styles.resultadoTexto}>Puntaje obtenido: 100 puntos</Text>
          <Text style={styles.resultadoTexto}>Niveles completados: 5 de 5</Text>
        </View>

        {/* Botón para reiniciar el flujo del juego. */}
        <TouchableOpacity style={styles.boton} onPress={jugarOtraVez}>
          <Text style={styles.textoBoton}>↻ Jugar otra vez</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos de la pantalla final.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f5d8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 35,
    padding: 35,
    alignItems: 'center',
    elevation: 4,
  },
  icono: {
    width: 135,
    height: 135,
    borderRadius: 70,
    backgroundColor: '#87d4ef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  iconoTexto: {
    fontSize: 65,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#08708a',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 17,
    color: '#555',
    textAlign: 'center',
    marginBottom: 22,
  },
  resultadoCaja: {
    width: '100%',
    backgroundColor: '#e9f5d8',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    marginBottom: 28,
  },
  resultadoTexto: {
    fontSize: 16,
    color: '#08708a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 2,
  },
  boton: {
    backgroundColor: '#ffd000',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 30,
    elevation: 3,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7a6500',
  },
});