class Cliente {
  constructor({ id, nombre, telefono, correo, numero_licencia }) {
    this.id             = id;
    this.nombre         = nombre;
    this.telefono       = telefono;
    this.correo         = correo;
    this.numero_licencia = numero_licencia;
  }

 
}

class GestorClientes {
  constructor(apiUrl, formId, mensajeId) {
    this.apiUrl      = apiUrl;
    this.form        = document.getElementById(formId);
    this.mensajeDiv  = document.getElementById(mensajeId);

   
    this.inputId      = document.getElementById("clienteId");
    this.inputNombre  = document.getElementById("nombre");
    this.inputTelefono = document.getElementById("telefono");
    this.inputCorreo  = document.getElementById("correo");
    this.inputLicencia = document.getElementById("licencia");
  }

  validarDatos({ nombre, telefono }) {
    const soloLetras  = /^[a-zA-ZÀ-ÿ\s]+$/; 
    const soloNumeros = /^\d+$/;
    if (!soloLetras.test(nombre.trim())) {
      alert("❌ El nombre solo puede contener letras y espacios.");
      return false;
    }
    if (!soloNumeros.test(telefono.trim())) {
      alert("❌ El teléfono solo puede contener números.");
      return false;
    }
    return true;
  }

  async enviarCliente(clienteObj) {
   
    let url    = this.apiUrl;
    let method = "POST";

    if (clienteObj.id) {
      url    = `${this.apiUrl}/${clienteObj.id}`;
      method = "PUT";
    }

    const resp = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(clienteObj)
    });
    return resp.ok;
  }

  async manejarEnvio(e) {
    e.preventDefault();

    const clienteData = {
      id: this.inputId.value || null,
      nombre: this.inputNombre.value.trim(),
      telefono: this.inputTelefono.value.trim(),
      correo: this.inputCorreo.value.trim(),
      numero_licencia: this.inputLicencia.value.trim()
    };

    if (!this.validarDatos(clienteData)) return;

    try {
      const exito = await this.enviarCliente(clienteData);
      if (exito) {
        this.form.reset();
        this.inputId.value = ""; 
        this.mensajeDiv.textContent = "✅ Cliente guardado correctamente.";
      } else {
        this.mensajeDiv.textContent = "❌ Ocurrió un error al guardar el cliente.";
      }
    } catch (err) {
      console.error("enviarCliente:", err);
      this.mensajeDiv.textContent = "❌ Ocurrió un error al guardar el cliente.";
    }
  }

  iniciar() {
    this.form.addEventListener("submit", e => this.manejarEnvio(e));
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const gestor = new GestorClientes("http://localhost:8000/api/clientes", "clienteForm", "cliente-mensaje");
  gestor.iniciar();
});