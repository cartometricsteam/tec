import React, { Component } from 'react';

const themes = [
  { name: 'ACCESIBILIDAD:', description: 'Eliminación de barreras, diseño universal…' },
  { name: 'ARTE URBANO:', description: 'Educación Artística, grafiti, intervención en el espacio urbano…' },
  { name: 'ARQUITECTURA:', description: 'Patrimonio industrial, Bien de Interés Cultural…' },
  { name: 'AUTOGESTIÓN:', description: 'Gobernanza urbana, trabajo colaborativo en red…' },
  { name: 'CUIDADO:', description: 'Salud, alimentación, calidad de vida, asistencia social…' },
  { name: 'CULTO:', description: 'Religión, creencias, rito…' },
  { name: 'CULTURA:', description: 'Educación libre, aprendizaje colaborativo, cultura de libre acceso (Open Access)…' },
  { name: 'DEPORTE:', description: 'Actividad física y/o lúdica, gamificación…' },
  { name: 'DERECHOS SOCIALES:', description: 'Derechos Humanos, igualdad de derechos y deberes,  atención a población inmigrante, acogida de refugiados…' },
  { name: 'DIVERSIDAD:', description: 'Apoyo a la integración, atención a la diversidad…' },
  { name: 'EDUCACIÓN:', description: 'Aprendizaje basado en proyectos, comunidades de aprendizaje, AMPAs…' },
  { name: 'INTEGRACIÓN:', description: 'Interculturalidad, inmersión cultural, atención a colectivos en riesgo de exclusión social, atención a la diversidad…' },
  { name: 'IGUALDAD:', description: 'Perspectiva de género, feminismo…' },
  { name: 'MEDIACIÓN:', description: 'Intermediación, facilitación…' },
  { name: 'MEDIO AMBIENTE:', description: 'Ecología, permacultura, huertos urbanos, agricultura urbana…' },
  { name: 'MOVILIDAD SOSTENIBLE:', description: 'Transporte público, bicicleta, espacios tranquilos y saludables…' },
  { name: 'PARTICIPACIÓN CIUDADANA:', description: 'Trabajo colaborativo, herramientas para la organización ciudadana, empoderamiento vecinal…' },
  { name: 'PATRIMONIO MATERIAL:', description: 'Arqueología, preexistencias, vestigios…' },
  { name: 'PATRIMONIO CULTURAL INMATERIAL:', description: 'Tradiciones, costumbres, oficios…' },
  { name: 'PERSONAS MAYORES:', description: 'Atención a la tercera edad, envejecimiento activo…' },
  { name: 'POLÍTICA SOCIAL:', description: 'Banco de tiempo, crowfunding (economía colaborativa), cooperativas vecinales…' },
  { name: 'URBANISMO:', description: 'Regeneración urbana, acupuntura urbana, estrategias urbanas, solares vacíos, espacio público, derivas, rutas urbana, mapping (cartografía de diagnóstico)…' },
  { name: 'SALUD:', description: 'Bienestar, vida saludable… '}
];

class Faqs extends Component {
  render() {
    const modalHeader = <div className='modal-header'> <h5 className='modal-title'>{this.props.title}</h5><button type='button' className='close' aria-label='Close' onClick={() => this.props.handler(false)}><span aria-hidden='true'>&times;</span></button></div>;
    return (
      <div className='modal fade show' style={{ display: 'block', overflow: 'auto' }} tabIndex='-1' role='dialog' aria-labelledby='ModalLabel' aria-hidden='true'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            {modalHeader}

            <div className='modal-body'>
              <div className='backtittle'><h6 style={{ padding:'5px', marginTop: '0' }}>
                1. ¿QUÉ DIFERENCIA HAY ENTRE UNA TEMÁTICA Y OTRA?
              </h6></div>
              <div>
                <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                  {themes.map(theme => (
                    <li>
                      <span style={{ fontWeight: 'bold' }}>{theme.name}</span>
                      <span style={{ fontSize: '13px', paddingLeft: '5px' }}>{theme.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='backtittle' style={{ marginTop: '20px' }}><h6 style={{ padding:'5px' }}>
                2. ¿QUÉ PASA SI NO ME IDENTIFICO CON NINGUNA DE LAS TEMÁTICAS PROPUESTAS?
              </h6></div>
              <p className='text-justify'>
                Contacta con <a href='mailto:info@teciudadania.uma.es'>info.teciudadania@uma.es</a> para proponer nuevas temáticas y estudiaremos la propuesta para poder incorporarla al listado de temáticas.
              </p>

              <div className='backtittle' style={{ marginTop: '20px' }}><h6 style={{ padding:'5px' }}>
                3. ¿DÓNDE SITUAR EL PUNTO DE MI INICIATIVA?
              </h6></div>
              <div>
                <p className='text-justify'>Cada punto del mapa se corresponderá con una de estas opciones:</p>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ fontSize: '13px' }}>El domicilio social o de notificación si la iniciativa tiene una sede donde desarrolla su actividad.</li>
                  <li style={{ fontSize: '13px' }}>Edificio público o sede ciudadana donde tengan un espacio de trabajo: centro social/cultural/cívico, museo, coworking, taller…</li>
                  <li style={{ fontSize: '13px' }}>Espacio público representativo del barrio donde se reúnan los miembros de la iniciativa: plaza, calle…</li>
                  <li style={{ fontSize: '13px' }}>Ámbito de actuación sobre el que dirigen la acción para preservar su carácter e identidad, proponer una propuesta de intervención en el espacio, mejorar las condiciones y calidades del lugar…</li>
                </ul>
              </div>

              <div className='backtittle' style={{ marginTop: '20px' }}><h6 style={{ padding:'5px' }}>
                4. ¿QUÉ SIMBOLIZAN LAS LÍNEAS QUE APARECEN EN EL MAPA?
              </h6></div>
              <p className='text-justify'>
                Las líneas que unen puntos con otros se corresponden con las relaciones que se establecen entre iniciativas. Éstos hilos se definen por afinidad ente iniciativas, por compartir proyectos en común, por ser colaboradoras unas con otras o por apoyarse mutuamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Faqs;