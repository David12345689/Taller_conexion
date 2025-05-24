const API_RESERVAS = 'http://localhost:8000/api/reservas';
const API_CLIENTES = 'http://localhost:8000/api/clientes';
const API_VEHICULOS = 'http://localhost:8000/api/vehiculos';

document.addEventListener('DOMContentLoaded', () => {
  cargarClientes();
  cargarVehiculos();
  cargarReservas();

  const form = document.getElementById('reservaForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('reservaId').value;
    const reserva = {
      cliente_id: document.getElementById('cliente_id').value,
      vehiculo_id: document.getElementById('vehiculo_id').value,
      fecha_inicio: document.getElementById('fecha_inicio').value,
      fecha_fin: document.getElementById('fecha_fin').value
    };

    if (id) {
      await fetch(`${API_RESERVAS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva)
      });
    } else {
      await fetch(API_RESERVAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva)
      });
    }

    form.reset();
    document.getElementById('reservaId').value = '';
    cargarReservas();
  });
});

async function cargarClientes() {
  const res = await fetch(API_CLIENTES);
  const clientes = await res.json();
  const select = document.getElementById('cliente_id');
  select.innerHTML = '<option value="">Seleccione</option>';
  clientes.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
  });
}

async function cargarVehiculos() {
  const res = await fetch(API_VEHICULOS);
  const vehiculos = await res.json();
  const select = document.getElementById('vehiculo_id');
  select.innerHTML = '<option value="">Seleccione</option>';
  vehiculos
    .filter(v => v.estado === 'disponible')
    .forEach(v => {
      select.innerHTML += `<option value="${v.id}">${v.marca} ${v.modelo} (${v.anio})</option>`;
    });
}

async function cargarReservas() {
  const res = await fetch(API_RESERVAS);
  const reservas = await res.json();
  const tbody = document.getElementById('reservasBody');
  tbody.innerHTML = '';

  reservas.forEach(r => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${r.id}</td>
      <td>${r.cliente?.nombre || '---'}</td>
      <td>${r.vehiculo?.marca} ${r.vehiculo?.modelo}</td>
      <td>${r.fecha_inicio}</td>
      <td>${r.fecha_fin}</td>
      <td>${r.estado}</td>
      <td>
        <button onclick="editarReserva(${r.id})">Editar</button>
        <button onclick="eliminarReserva(${r.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function editarReserva(id) {
  const res = await fetch(`${API_RESERVAS}/${id}`);
  const r = await res.json();

  document.getElementById('reservaId').value = r.id;
  document.getElementById('cliente_id').value = r.cliente_id;
  document.getElementById('vehiculo_id').value = r.vehiculo_id;
  document.getElementById('fecha_inicio').value = r.fecha_inicio;
  document.getElementById('fecha_fin').value = r.fecha_fin;
}

async function eliminarReserva(id) {
  if (confirm('¿Eliminar esta reserva?')) {
    await fetch(`${API_RESERVAS}/${id}`, { method: 'DELETE' });
    cargarReservas();
  }
}
