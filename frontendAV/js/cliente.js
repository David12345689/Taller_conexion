document.getElementById('form-cliente').addEventListener('submit', function(e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    nombre: form.nombre.value,
    telefono: form.telefono.value,
    correo: form.correo.value,
    numero_licencia: form.numero_licencia.value
  };

  fetch('http://localhost:8000/api/clientes', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Error al guardar");
    }
    return res.json();
  })
  .then(respuesta => {
    document.getElementById('cliente-mensaje').textContent = '✅ Cliente registrado exitosamente.';
    form.reset();
  })
  .catch(error => {
    console.error('Error al registrar cliente:', error);
    document.getElementById('cliente-mensaje').textContent = '❌ Ocurrió un error al registrar el cliente.';
  });
});