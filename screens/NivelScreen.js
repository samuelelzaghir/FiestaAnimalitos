// Importamos hooks de React para manejar cambios en la pantalla.
import { useEffect, useState } from 'react';

// Componentes básicos de React Native para crear la interfaz.
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// Audio se usa para reproducir las instrucciones grabadas de cada nivel.
import { Audio } from 'expo-av';

// Importamos los datos de los niveles desde un archivo separado.
import { niveles } from '../data/niveles';

// Esta función mezcla los objetos para que no siempre salgan en el mismo orden.
// Así el juego se siente más dinámico para el niño.
function mezclarObjetos(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

export default function NivelScreen({ navigation }) {
  // Guarda el número del nivel actual. Empieza en 0 porque los arreglos inician desde cero.
  const [indiceNivel, setIndiceNivel] = useState(0);

  // Guarda cuántos objetos correctos ha encontrado el niño.
  const [encontrados, setEncontrados] = useState(0);

  // Guarda el audio que se está reproduciendo para poder detenerlo si hace falta.
  const [sonido, setSonido] = useState(null);

  // Guarda los objetos mezclados que se muestran en pantalla.
  const [objetosPantalla, setObjetosPantalla] = useState([]);

  // Guarda los objetos correctos que ya fueron seleccionados.
  const [seleccionados, setSeleccionados] = useState([]);

  // Mensaje corto que se muestra cuando el niño toca un objeto.
  const [mensaje, setMensaje] = useState('');

  // Obtenemos la información del nivel actual.
  const nivel = niveles[indiceNivel];

  // Función para reproducir el audio del nivel actual.
  const reproducirInstruccion = async () => {
    try {
      // Si ya hay un audio sonando, se detiene antes de iniciar otro.
      if (sonido) {
        await sonido.stopAsync();
        await sonido.unloadAsync();
      }

      // Cargamos el audio del nivel actual.
      const { sound } = await Audio.Sound.createAsync(nivel.audio);

      // Guardamos el audio en el estado para controlarlo después.
      setSonido(sound);

      // Reproducimos la instrucción.
      await sound.playAsync();
    } catch (error) {
      console.log('Error al reproducir audio:', error);
    }
  };

  // Este efecto se ejecuta cada vez que cambia el nivel.
  useEffect(() => {
    // Mezclamos los objetos del nivel para que aparezcan variados.
    setObjetosPantalla(mezclarObjetos(nivel.objetosNivel));

    // Reiniciamos los datos del nivel nuevo.
    setSeleccionados([]);
    setEncontrados(0);
    setMensaje('');

    // Reproducimos automáticamente la instrucción del nivel.
    reproducirInstruccion();

    // Al salir de la pantalla o cambiar de nivel, liberamos el audio.
    return () => {
      if (sonido) {
        sonido.unloadAsync();
      }
    };
  }, [indiceNivel]);

  // Esta función se ejecuta cuando el niño toca un objeto.
  const tocarObjeto = (objeto, index) => {
    // Si el objeto ya fue seleccionado, no se vuelve a contar.
    if (seleccionados.includes(index)) {
      return;
    }

    // Si el objeto no es correcto, no suma y se muestra un mensaje suave.
    if (!objeto.correcto) {
      setMensaje('Ese no es, intenta otra vez.');
      return;
    }

    // Si el objeto es correcto, aumenta el contador.
    const nuevoTotal = encontrados + 1;
    setEncontrados(nuevoTotal);

    // Guardamos el índice para marcarlo como seleccionado.
    setSeleccionados([...seleccionados, index]);

    // Mensaje positivo para el niño.
    setMensaje('¡Muy bien!');

    // Si ya encontró todos los objetos del nivel, pasa al siguiente.
    if (nuevoTotal === nivel.cantidad) {
      if (indiceNivel === niveles.length - 1) {
        // Si era el último nivel, va a la pantalla final.
        navigation.navigate('Final');
      } else {
        // Si quedan niveles, muestra una alerta antes de continuar.
        Alert.alert('¡Muy bien!', 'Pasemos al siguiente animalito.', [
          {
            text: 'Continuar',
            onPress: () => {
              setIndiceNivel(indiceNivel + 1);
            },
          },
        ]);
      }
    }
  };

  // Función para regresar al inicio desde la pantalla de nivel.
  const volverInicio = async () => {
    try {
      // Detenemos el audio antes de regresar para que no siga sonando.
      if (sonido) {
        await sonido.stopAsync();
        await sonido.unloadAsync();
      }
    } catch (error) {
      console.log('Error al detener audio:', error);
    }

    navigation.navigate('Inicio');
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con botón de volver, título y botón de audio. */}
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={volverInicio}>
          <Text style={styles.botonSuperior}>←</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.titulo}>La Fiesta de los</Text>
          <Text style={styles.titulo}>Animalitos</Text>
        </View>

        {/* Botón para repetir la instrucción del nivel. */}
        <TouchableOpacity onPress={reproducirInstruccion}>
          <Text style={styles.botonSuperior}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* Muestra en qué nivel va el niño. */}
      <Text style={styles.progreso}>
        Nivel {nivel.id} de {niveles.length}
      </Text>

      {/* Caja del animal actual. */}
      <View style={styles.animalCaja}>
        <Text style={styles.animal}>{nivel.emojiAnimal}</Text>
      </View>

      {/* Tarjeta principal con la instrucción y contador. */}
      <View style={styles.card}>
        <Text style={styles.instruccion}>Ayúdame a encontrar</Text>

        <View style={styles.lineaCantidad}>
          <Text style={styles.numero}>{nivel.cantidad}</Text>
          <Text style={styles.texto}> de {nivel.objeto}.</Text>
        </View>

        <Text style={styles.contador}>
          Encontrados: {encontrados} / {nivel.cantidad}
        </Text>

        <Text style={styles.mensaje}>{mensaje}</Text>
      </View>

      {/* Objetos del nivel. Algunos son correctos y otros son distractores. */}
      <View style={styles.objetos}>
        {objetosPantalla.map((objeto, index) => {
          const fueSeleccionado = seleccionados.includes(index);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => tocarObjeto(objeto, index)}
              style={[
                styles.objetoBoton,
                fueSeleccionado && styles.objetoCorrecto,
              ]}
            >
              <Text
                style={[
                  styles.objeto,
                  fueSeleccionado && styles.objetoSeleccionado,
                ]}
              >
                {objeto.emoji}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// Estilos de la pantalla de niveles.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    backgroundColor: '#f9f6ed',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  encabezado: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botonSuperior: {
    fontSize: 28,
    color: '#08708a',
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#08708a',
    textAlign: 'center',
    lineHeight: 25,
  },
  progreso: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#777',
    fontWeight: 'bold',
  },
  animalCaja: {
    width: 120,
    height: 120,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },
  animal: {
    fontSize: 75,
  },
  card: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 35,
    padding: 24,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 3,
  },
  instruccion: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  lineaCantidad: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numero: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#08708a',
  },
  texto: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  contador: {
    marginTop: 10,
    fontSize: 16,
    color: '#08708a',
    fontWeight: 'bold',
  },
  mensaje: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
    minHeight: 22,
  },
  objetos: {
    width: '95%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
  },
  objetoBoton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  objetoCorrecto: {
    backgroundColor: '#d8f7d3',
    borderWidth: 2,
    borderColor: '#67b95b',
  },
  objeto: {
    fontSize: 40,
  },
  objetoSeleccionado: {
    opacity: 0.45,
  },
});