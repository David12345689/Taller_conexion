class ReservaHistorial {
  constructor({ id, cliente_id, vehiculo_id, fecha_inicio, fecha_fin, estado }) {
    this.id          = id;
    this.cliente_id  = cliente_id;
    this.vehiculo_id = vehiculo_id;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin   = fecha_fin;
    this.estado      = estado;
  }

  generarFilaHTML(nombreCliente, modeloVehiculo) {
    return `
      <tr>
        <td>${this.id}</td>
        <td>${nombreCliente}</td>
        <td>${modeloVehiculo}</td>
        <td>${this.fecha_inicio}</td>
        <td>${this.fecha_fin}</td>
        <td>${this.estado}</td>
      </tr>
    `;
  }
}

class GestorHistorialReservas {
  constructor(apiUrl, filtroId, tbodyId) {
    this.apiUrl       = apiUrl;
    this.filtro       = document.getElementById(filtroId);
    this.tbody        = document.getElementById(tbodyId);
    this.clientesMap  = {};
    this.vehiculosMap = {};
    this.reservas     = [];
  }

  async cargarClientesYVehiculos() {
    try {
      const [resClientes, resVehiculos] = await Promise.all([
        fetch("http://localhost:8000/api/clientes"),
        fetch("http://localhost:8000/api/vehiculos")
      ]);
      if (!resClientes.ok || !resVehiculos.ok) throw new Error("Error cargando datos");
      const clientesData  = await resClientes.json();
      const vehiculosData = await resVehiculos.json();

      
      clientesData.forEach(c => { this.clientesMap[c.id] = c.nombre; });
      vehiculosData.forEach(v => { this.vehiculosMap[v.id] = v.modelo; });
    } catch (err) {
      console.error("cargarClientesYVehiculos:", err);
      this.clientesMap = {};
      this.vehiculosMap = {};
    }
  }

  async cargarReservas() {
    try {
      const resp = await fetch(this.apiUrl);
      if (!resp.ok) throw new Error("Error cargando reservas");
      const datos = await resp.json();
      this.reservas = datos.map(r => new ReservaHistorial(r));
    } catch (err) {
      console.error("cargarReservas:", err);
      this.reservas = [];
    }
  }

  filtrarReserva(reserva) {
    const filtroVal = this.filtro.value.toLowerCase().trim();
    if (filtroVal === "todos") return true;
    return reserva.estado.toLowerCase().trim() === filtroVal;
  }

  mostrarHistorial() {
    this.tbody.innerHTML = "";
    this.reservas
      .filter(r => this.filtrarReserva(r))
      .forEach(r => {
        const nombreCliente    = this.clientesMap[r.cliente_id]  || "Desconocido";
        const modeloVehiculo   = this.vehiculosMap[r.vehiculo_id] || "Desconocido";
        this.tbody.innerHTML += r.generarFilaHTML(nombreCliente, modeloVehiculo);
      });

    if (this.tbody.innerHTML.trim() === "") {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:1em;">
            No hay reservas que mostrar.
          </td>
        </tr>
      `;
    }
  }

  iniciarEventos() {
    this.filtro.addEventListener("change", () => this.mostrarHistorial());
  }

  async iniciar() {
    await this.cargarClientesYVehiculos();
    await this.cargarReservas();
    this.iniciarEventos();
    this.mostrarHistorial();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const gestor = new GestorHistorialReservas(
    "http://localhost:8000/api/reservas",
    "filtro-historial",
    "tabla-historial"
  );
  gestor.iniciar();
});