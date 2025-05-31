document.addEventListener("DOMContentLoaded", () => {
  const tablaVehiculos = document.querySelector("#tablaVehiculos tbody");
  const tablaClientes = document.querySelector("#tablaClientes tbody");

  function cargarVehiculos() {
    fetch("http://localhost:8000/api/vehiculos")
      .then(response => response.json())
      .then(vehiculos => {
        tablaVehiculos.innerHTML = "";
        vehiculos.forEach(vehiculo => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${vehiculo.id}</td>
            <td>${vehiculo.marca}</td>
            <td>${vehiculo.modelo}</td>
            <td>${vehiculo.anio}</td>
            <td>${vehiculo.categoria}</td>
            <td>${vehiculo.estado}</td>
            <td><button class="eliminar-vehiculo" data-id="${vehiculo.id}">Eliminar</button></td>
          `;
          tablaVehiculos.appendChild(fila);
        });
      });
  }

  function cargarClientes() {
    fetch("http://localhost:8000/api/clientes")
      .then(response => response.json())
      .then(clientes => {
        tablaClientes.innerHTML = "";
        clientes.forEach(cliente => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.correo}</td>
            <td>${cliente.numero_licencia}</td>
            <td><button class="eliminar-cliente" data-id="${cliente.id}">Eliminar</button></td>
          `;
          tablaClientes.appendChild(fila);
        });
      });
  }

  document.body.addEventListener("click", e => {
    if (e.target.classList.contains("eliminar-vehiculo")) {
      const id = e.target.dataset.id;
      if (confirm("¿Deseas eliminar este vehículo?")) {
        fetch(`http://localhost:8000/api/vehiculos/${id}`, {
          method: "DELETE",
          headers: { "Accept": "application/json" }
        })
        .then(res => res.json())
        .then(() => cargarVehiculos());
      }
    }

    if (e.target.classList.contains("eliminar-cliente")) {
      const id = e.target.dataset.id;
      if (confirm("¿Deseas eliminar este cliente?")) {
        fetch(`http://localhost:8000/api/clientes/${id}`, {
          method: "DELETE",
          headers: { "Accept": "application/json" }
        })
        .then(res => res.json())
        .then(() => cargarClientes());
      }
    }
  });

  cargarVehiculos();
  cargarClientes();
});

