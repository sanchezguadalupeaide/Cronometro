import React, { useState, useEffect } from 'react';

const Cronometro = () => {
  // creamos estados para controlar el tiempo y el estado del cronómetro
  const [isActive, setIsActive] = useState(false); // estado del cronómetro para controlar si esta activo o detenido
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 }); // estado para almacenar horas, minutos y segundos
  const [laps, setLaps] = useState([]); // lista de vueltas (parciales)

  useEffect(() => { //se ejecuta cuando 'isActive' cambia
    let interval = null;

    if (isActive) { // si el cronómetro está activo, establece un intervalo para actualizar el tiempo cada segundo
      interval = setInterval(() => {
        setTime((prevTime) => {
          // calcula el nuevo tiempo
          let { hours, minutes, seconds } = prevTime;
          seconds += 1;

          // ajustar minutos y horas si los segundos superan 59
          if (seconds === 60) {
            seconds = 0;
            minutes += 1;
          }
          if (minutes === 60) {
            minutes = 0;
            hours += 1;
          }

          return { hours, minutes, seconds };
        });
      }, 1000);
    } else if (!isActive && interval) {
      // cuando el cronómetro se detiene, limpia el intervalo
      clearInterval(interval);
    }

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [isActive]);

  // maneja el inicio/detención del cronómetro
  const toggle = () => {
    setIsActive(!isActive);
  };

  //reinicia el cronómetro a 0 y reinicia la lista de parciales
  const reset = () => {
    setIsActive(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setLaps([]);
  };

  //guardar el tiempo parcial actual y agregarlo en la lista de vueltas
  const addLap = () => {
    const newLap = {
      lapNumber: laps.length + 1,
      partialTime: formatTime(time),
      totalTime: formatTime(time),
    };
    setLaps([...laps, newLap]);
  };

  //formatea el tiempo en el formato solicitado (horas, minutos, segundos)
  const formatTime = ({ hours, minutes, seconds }) => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}.${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>{formatTime(time)}</h1>
      <button onClick={toggle}> {/*boton que maneja la funcion "toggle"*/}
        {isActive ? 'Detener' : 'Iniciar'}
      </button>
      <button onClick={reset}>Reiniciar</button>
      <button onClick={addLap} disabled={!isActive}>Parcial</button>

      {/* tabla para mostrar los tiempos parciales */}
      {laps.length > 0 && (
        <table>
          <thead>
            <tr>
              <th># de Vuelta</th>
              <th>Tiempo Parcial</th>
              <th>Tiempo Total</th>
            </tr>
          </thead>
          <tbody>
            {laps.map((lap) => (
              <tr key={lap.lapNumber}>
                <td>{lap.lapNumber}</td>
                <td>{lap.partialTime}</td>
                <td>{lap.totalTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Cronometro;
