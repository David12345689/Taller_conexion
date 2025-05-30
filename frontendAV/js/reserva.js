const form = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");
const clienteSelect = document.getElementById("cliente_id");
const vehiculoSelect = document.getElementById("vehiculo_id");

// Cargar clientes
fetch("http://localhost:8000/api/clientes")
  .then(res => res.json())
  .then(clientes => {
    clientes.forEach(c => {
      const op = document.createElement("option");
      op.value = c.id;
      op.textContent = c.nombre;
      clienteSelect.appendChild(op);
    });
  });


fetch("http://localhost:8000/api/vehiculos")
  .then(res => res.json())
  .then(vehiculos => {
    vehiculos.filter(v => v.estado?.trim().toLowerCase() === "disponible")
      .forEach(v => {
        const op = document.createElement("option");
        op.value = v.id;
        op.textContent = `${v.marca} ${v.modelo}`;
        vehiculoSelect.appendChild(op);
      });
  });

form.addEventListener("submit", e => {
  e.preventDefault();

  const reserva = {
    cliente_id: parseInt(form.cliente_id.value),
    vehiculo_id: parseInt(form.vehiculo_id.value),
    fecha_inicio: form.fecha_inicio.value,
    fecha_fin: form.fecha_fin.value,
    estado: "activa" // asignado automáticamente
  };

  fetch("http://localhost:8000/api/reservas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(reserva)
  })
    .then(res => res.json())
    .then(data => {
      mensaje.textContent = "✅ Reserva creada correctamente";
      form.reset();
    })
    .catch(() => {
      mensaje.textContent = "❌ Error al crear reserva";
    });
});