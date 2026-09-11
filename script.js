// Opciones dinámicas para el menú desplegable secundario
const carrerasPorFacultad = {
  "UACYA": [
    "Mercadotecnia",
    "Contaduría",
    "Administración",
    "Negocios Internacionales",
    "Administración Pública"
  ],
  "Turismo y Gastronomía": [
    "Gestión e Innovación del Turismo",
    "Gastronomía"
  ],
  "Economía": [
    "Sistemas Computacionales",
    "Informática",
    "Economía",
    "Seguridad Informática",
    "Proyectos de Tecnologias de información e innovaci digital"
  ]
};

const facultadSelect = document.getElementById('facultad');
const carreraSelect = document.getElementById('carrera');
const form = document.getElementById('registroForm');
const statusMessage = document.getElementById('statusMessage');

// Cambiar dinámicamente las carreras según la facultad seleccionada
facultadSelect.addEventListener('change', function () {
  const facultadSeleccionada = this.value;

  carreraSelect.innerHTML = '<option value="">-- Selecciona una carrera --</option>';

  if (facultadSeleccionada && carrerasPorFacultad[facultadSeleccionada]) {
    carreraSelect.disabled = false;
    carrerasPorFacultad[facultadSeleccionada].forEach(function (carrera) {
      const option = document.createElement('option');
      option.value = carrera;
      option.textContent = carrera;
      carreraSelect.appendChild(option);
    });
  } else {
    carreraSelect.disabled = true;
    carreraSelect.innerHTML = '<option value="">-- Primero selecciona una facultad --</option>';
  }
});

// Envío de datos
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  statusMessage.style.color = "blue";
  statusMessage.textContent = "Obteniendo IP y enviando datos...";

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzY0-WJW9pL3f87AfxgMp5g_qvz_tgTi8h-bbR4OO9yvJlXoXrjpo2_bKukCy5i1Cg/exec";

  try {
    let userIp = "No disponible";
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      userIp = ipData.ip;
    } catch (ipErr) {
      console.warn("No se pudo obtener la IP:", ipErr);
    }

    const now = new Date();
    const fechaHora = now.toLocaleString();

    // Payload con todos los datos incluidos
    const payload = {
      nombre: document.getElementById('nombre').value.toUpperCase(),
      apellidos: document.getElementById('apellidos').value.toUpperCase(),
      matricula: document.getElementById('matricula').value,
      correo: document.getElementById('correo').value,
      genero: document.getElementById('genero').value,
      tipoParticipante: document.getElementById('tipoParticipante').value,
      rol: document.getElementById('rol').value,
      facultad: document.getElementById('facultad').value,
      carrera: document.getElementById('carrera').value,
      modalidad: document.getElementById('modalidad').value,
      conferencia: document.getElementById('conferencia').value,
      fechaHora: fechaHora,
      ip: userIp
    };

    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    statusMessage.style.color = "green";
    statusMessage.textContent = "¡Datos enviados correctamente!";
    form.reset();
    carreraSelect.disabled = true;
    carreraSelect.innerHTML = '<option value="">-- Primero selecciona una facultad --</option>';

  } catch (error) {
    console.error("Error al enviar:", error);
    statusMessage.style.color = "red";
    statusMessage.textContent = "Hubo un error al enviar el formulario.";
  }
});