const tabla = document.getElementById("tabla-historial");
const filtro = document.getElementById("filtro-historial");

let clientes = {};
let vehiculos = {};

Promise.all([
  fetch("http://localhost:8000/api/clientes").then(res => res.json()),
  fetch("http://localhost:8000/api/vehiculos").then(res => res.json())
]).then(([clientesData, vehiculosData]) => {
  clientesData.forEach(c => clientes[c.id] = c.nombre);
  vehiculosData.forEach(v => vehiculos[v.id] = `${v.marca} ${v.modelo}`);

  cargarHistorial();
});

function cargarHistorial(filtroEstado = "todos") {
  fetch("http://localhost:8000/api/reservas")
    .then(res => res.json())
    .then(reservas => {
      tabla.innerHTML = "";

      reservas
        .filter(r => {
          if (filtroEstado === "todos") return true;
          return r.estado?.trim().toLowerCase() === filtroEstado;
        })
        .forEach(r => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${r.id}</td>
            <td>${clientes[r.cliente_id] || r.cliente_id}</td>
            <td>${vehiculos[r.vehiculo_id] || r.vehiculo_id}</td>
            <td>${r.fecha_inicio} → ${r.fecha_fin}</td>
            <td>${r.estado}</td>
          `;
          tabla.appendChild(fila);
        });
    });
}

filtro.addEventListener("change", () => {
  cargarHistorial(filtro.value);
});
