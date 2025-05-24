const CLIENTE_API = ''; 

document.addEventListener('DOMContentLoaded', () => {
  cargarClientes();

  const form = document.getElementById('clienteForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('clienteId').value;
    const cliente = {
      nombre: document.getElementById('nombre').value,
      telefono: document.getElementById('telefono').value,
      correo: document.getElementById('correo').value,
      numero_licencia: document.getElementById('licencia').value
    };

    if (id) {
      await fetch(`${CLIENTE_API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
      });
    } else {
      await fetch(CLIENTE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
      });
    }

    form.reset();
    document.getElementById('clienteId').value = '';
    cargarClientes();
  });
});

async function cargarClientes() {
  const response = await fetch(CLIENTE_API);
  const data = await response.json();

  const tbody = document.getElementById('clientesBody');
  tbody.innerHTML = '';

  data.forEach((c) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.telefono || ''}</td>
      <td>${c.correo || ''}</td>
      <td>${c.numero_licencia}</td>
      <td>
        <button onclick="editarCliente(${c.id})">Editar</button>
        <button onclick="eliminarCliente(${c.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function editarCliente(id) {
  const res = await fetch(`${CLIENTE_API}/${id}`);
  const c = await res.json();

  document.getElementById('clienteId').value = c.id;
  document.getElementById('nombre').value = c.nombre;
  document.getElementById('telefono').value = c.telefono;
  document.getElementById('correo').value = c.correo;
  document.getElementById('licencia').value = c.numero_licencia;
}

async function eliminarCliente(id) {
  if (confirm('¿Estás seguro de eliminar este cliente?')) {
    await fetch(`${CLIENTE_API}/${id}`, { method: 'DELETE' });
    cargarClientes();
  }
}
