class VehiculoSimple {
  constructor({ id, marca, modelo, anio, categoria, estado }) {
    this.id        = id;
    this.marca     = marca;
    this.modelo    = modelo;
    this.anio      = anio;
    this.categoria = categoria;
    this.estado    = estado;
  }

  generarFilaHTML() {
    return `
      <tr>
        <td>${this.id}</td>
        <td>${this.marca}</td>
        <td>${this.modelo}</td>
        <td>${this.anio}</td>
        <td>${this.categoria}</td>
        <td>${this.estado}</td>
        <td><button data-id="${this.id}" class="btn-eliminar-vehiculo">Eliminar</button></td>
      </tr>
    `;
  }
}

class ClienteSimple {
  constructor({ id, nombre, telefono, correo, numero_licencia }) {
    this.id              = id;
    this.nombre          = nombre;
    this.telefono        = telefono;
    this.correo          = correo;
    this.numero_licencia = numero_licencia;
  }

  generarFilaHTML() {
    return `
      <tr>
        <td>${this.id}</td>
        <td>${this.nombre}</td>
        <td>${this.telefono}</td>
        <td>${this.correo}</td>
        <td>${this.numero_licencia}</td>
        <td><button data-id="${this.id}" class="btn-eliminar-cliente">Eliminar</button></td>
      </tr>
    `;
  }
}

class GestorEliminarElementos {
  constructor(apiVehiculosUrl, apiClientesUrl, tbodyVehId, tbodyCliId) {
    this.apiVehiculosUrl = apiVehiculosUrl;
    this.apiClientesUrl  = apiClientesUrl;
    this.tbodyVeh        = document.getElementById(tbodyVehId);
    this.tbodyCli        = document.getElementById(tbodyCliId);
    this.vehiculosArr    = [];
    this.clientesArr     = [];
  }

  async cargarVehiculos() {
    try {
      const resp = await fetch(this.apiVehiculosUrl);
      if (!resp.ok) throw new Error("Error al cargar vehículos");
      const data = await resp.json();
      this.vehiculosArr = data.map(v => new VehiculoSimple(v));
    } catch (err) {
      console.error("cargarVehiculos:", err);
      this.vehiculosArr = [];
    }
  }

  async cargarClientes() {
    try {
      const resp = await fetch(this.apiClientesUrl);
      if (!resp.ok) throw new Error("Error al cargar clientes");
      const data = await resp.json();
      this.clientesArr = data.map(c => new ClienteSimple(c));
    } catch (err) {
      console.error("cargarClientes:", err);
      this.clientesArr = [];
    }
  }

  mostrarVehiculosEliminar() {
    this.tbodyVeh.innerHTML = "";
    this.vehiculosArr.forEach(v => {
      this.tbodyVeh.innerHTML += v.generarFilaHTML();
    });
    if (this.vehiculosArr.length === 0) {
      const colspan = 7;
      this.tbodyVeh.innerHTML = `
        <tr>
          <td colspan="${colspan}" style="text-align:center; padding:1em;">
            No hay vehículos registrados.
          </td>
        </tr>
      `;
    }
  }

  mostrarClientesEliminar() {
    this.tbodyCli.innerHTML = "";
    this.clientesArr.forEach(c => {
      this.tbodyCli.innerHTML += c.generarFilaHTML();
    });
    if (this.clientesArr.length === 0) {
      const colspan = 6;
      this.tbodyCli.innerHTML = `
        <tr>
          <td colspan="${colspan}" style="text-align:center; padding:1em;">
            No hay clientes registrados.
          </td>
        </tr>
      `;
    }
  }

  async eliminarVehiculo(id) {
    try {
      const resp = await fetch(`${this.apiVehiculosUrl}/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" }
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.mensaje || "Error");
      alert("✅ " + (data.mensaje || "Vehículo eliminado."));
      await this.refrescarVehiculos();
    } catch (err) {
      console.error("eliminarVehiculo:", err);
      alert("❌ No se pudo eliminar el vehículo.");
    }
  }

  async eliminarCliente(id) {
    try {
      const resp = await fetch(`${this.apiClientesUrl}/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" }
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.mensaje || "Error");
      alert("✅ " + (data.mensaje || "Cliente eliminado."));
      await this.refrescarClientes();
    } catch (err) {
      console.error("eliminarCliente:", err);
      alert("❌ No se pudo eliminar el cliente.");
    }
  }

  iniciarEventos() {

    this.tbodyVeh.addEventListener("click", e => {
      if (e.target.classList.contains("btn-eliminar-vehiculo")) {
        const id = e.target.getAttribute("data-id");
        if (confirm("¿Deseas eliminar este vehículo?")) {
          this.eliminarVehiculo(id);
        }
      }
    });

    
    this.tbodyCli.addEventListener("click", e => {
      if (e.target.classList.contains("btn-eliminar-cliente")) {
        const id = e.target.getAttribute("data-id");
        if (confirm("¿Deseas eliminar este cliente?")) {
          this.eliminarCliente(id);
        }
      }
    });
  }

  async refrescarVehiculos() {
    await this.cargarVehiculos();
    this.mostrarVehiculosEliminar();
  }

  async refrescarClientes() {
    await this.cargarClientes();
    this.mostrarClientesEliminar();
  }

  async iniciar() {
    await Promise.all([this.refrescarVehiculos(), this.refrescarClientes()]);
    this.iniciarEventos();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const gestor = new GestorEliminarElementos(
    "http://localhost:8000/api/vehiculos",
    "http://localhost:8000/api/clientes",
    "tablaVehiculosEliminar",
    "tablaClientesEliminar"
  );
  gestor.iniciar();
});