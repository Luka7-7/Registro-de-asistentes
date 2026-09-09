    const carrerasPorFacultad = {
      "UACYA": [
        "Mercadotecnia",
        "Contaduría",
        "Administración de Empresas",
        "Negocios Internacionales"
      ],
      "Turismo y Gastronomía": [
        "Turismo",
        "Gastronomía"
      ],
      "Economía": [
        "Sistemas Computacionales",
        "Informática",
        "Economía",
        "Ciberseguridad",
        "Proyectos Informáticos"
      ]
    };
    const facultadSelect = document.getElementById('facultad');
    const carreraSelect = document.getElementById('carrera');
    const form = document.getElementById('registroForm');
    const statusMessage = document.getElementById('statusMessage');

    // Cambiar dinámicamente las carreras según la facultad seleccionada
    facultadSelect.addEventListener('change', function () {
      const facultadSeleccionada = this.value;

      // Limpiar opciones previas
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

      // Reemplaza esta URL con la Web App URL que obtengas de Google Apps Script
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzY0-WJW9pL3f87AfxgMp5g_qvz_tgTi8h-bbR4OO9yvJlXoXrjpo2_bKukCy5i1Cg/exec";

      try {
        // Obtener IP pública del usuario mediante API externa
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIp = ipData.ip;

        // Fecha y hora actual
        const now = new Date();
        const fechaHora = now.toLocaleString();

        // Preparar payload de envío
        const payload = {
          nombre: document.getElementById('nombre').value,
          matricula: document.getElementById('matricula').value,
          correo: document.getElementById('correo').value,
          facultad: document.getElementById('facultad').value,
          carrera: document.getElementById('carrera').value,
          fechaHora: fechaHora,
          ip: userIp
        };

        // Enviar los datos al script de Google Sheets
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