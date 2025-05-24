const API_URL = ''; // Ajusta si es necesario

document.addEventListener('DOMContentLoaded', () => {
  cargarVehiculos();

  const form = document.getElementById('vehiculoForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('vehiculoId').value;
    const vehiculo = {
      marca: document.getElementById('marca').value,
      modelo: document.getElementById('modelo').value,
      anio: document.getElementById('anio').value,
      categoria: document.getElementById('categoria').value,
      estado: document.getElementById('estado').value
    };

    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculo)
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculo)
      });
    }

    form.reset();
    document.getElementById('vehiculoId').value = '';
    cargarVehiculos();
  });
});

async function cargarVehiculos() {
  const response = await fetch(API_URL);
  const data = await response.json();

  const tbody = document.getElementById('vehiculosBody');
  tbody.innerHTML = '';

  data.forEach((v) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${v.id}</td>
      <td>${v.marca}</td>
      <td>${v.modelo}</td>
      <td>${v.anio}</td>
      <td>${v.categoria || ''}</td>
      <td>${v.estado}</td>
      <td>
        <button onclick="editarVehiculo(${v.id})">Editar</button>
        <button onclick="eliminarVehiculo(${v.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function editarVehiculo(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const v = await res.json();

  document.getElementById('vehiculoId').value = v.id;
  document.getElementById('marca').value = v.marca;
  document.getElementById('modelo').value = v.modelo;
  document.getElementById('anio').value = v.anio;
  document.getElementById('categoria').value = v.categoria;
  document.getElementById('estado').value = v.estado;
}

async function eliminarVehiculo(id) {
  if (confirm('¿Estás seguro de eliminar este vehículo?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarVehiculos();
  }
}
