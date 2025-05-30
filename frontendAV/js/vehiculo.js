const form = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");

const catalogo = {
  "Coche pequeño": [
    { marca: "Renault", modelo: "Kwid", anio: 2023 },
    { marca: "Chevrolet", modelo: "Spark", anio: 2022 },
    { marca: "Hyundai", modelo: "i10", anio: 2023 },
    { marca: "Fiat", modelo: "Mobi", anio: 2024 },
    { marca: "Volkswagen", modelo: "Gol", anio: 2022 }
  ],
  "Coche mediano": [
    { marca: "Nissan", modelo: "Versa", anio: 2024 },
    { marca: "Chevrolet", modelo: "Onix", anio: 2023 },
    { marca: "Volkswagen", modelo: "Virtus", anio: 2024 },
    { marca: "Hyundai", modelo: "Accent", anio: 2022 },
    { marca: "Kia", modelo: "Rio", anio: 2023 }
  ],
  "Berlina": [
    { marca: "Mazda", modelo: "3", anio: 2024 },
    { marca: "Toyota", modelo: "Corolla", anio: 2023 },
    { marca: "Honda", modelo: "Civic", anio: 2024 },
    { marca: "Volkswagen", modelo: "Jetta", anio: 2023 },
    { marca: "Mercedes-Benz", modelo: "Clase C", anio: 2023 }
  ],
  "Familiar": [
    { marca: "Chevrolet", modelo: "Captiva", anio: 2023 },
    { marca: "Toyota", modelo: "RAV4", anio: 2024 },
    { marca: "Honda", modelo: "CR-V", anio: 2023 },
    { marca: "Volkswagen", modelo: "Tiguan", anio: 2024 },
    { marca: "Nissan", modelo: "X-Trail", anio: 2023 }
  ],
  "SUV": [
    { marca: "Jeep", modelo: "Wrangler", anio: 2024 },
    { marca: "Toyota", modelo: "Fortuner", anio: 2023 },
    { marca: "Ford", modelo: "Bronco", anio: 2024 },
    { marca: "Land Rover", modelo: "Discovery", anio: 2023 },
    { marca: "Mitsubishi", modelo: "Montero", anio: 2022 }
  ],
  "Monovolumen": [
    { marca: "Chevrolet", modelo: "Traverse", anio: 2024 },
    { marca: "Kia", modelo: "Carnival", anio: 2023 },
    { marca: "Honda", modelo: "Odyssey", anio: 2024 },
    { marca: "Chrysler", modelo: "Pacifica", anio: 2023 },
    { marca: "Toyota", modelo: "Sienna", anio: 2024 }
  ],
  "Especial": [
    { marca: "Ford", modelo: "Mustang", anio: 2024 },
    { marca: "BMW", modelo: "Z4", anio: 2023 },
    { marca: "Porsche", modelo: "911", anio: 2024 },
    { marca: "Audi", modelo: "A5 Cabriolet", anio: 2023 },
    { marca: "Tesla", modelo: "Model S", anio: 2024 }
  ]
};

const categoriaSelect = document.getElementById("categoria");
const modeloSelect = document.getElementById("modelo");
const marcaInput = document.getElementById("marca");
const anioInput = document.getElementById("anio");

categoriaSelect.addEventListener("change", () => {
  const seleccion = catalogo[categoriaSelect.value];
  modeloSelect.innerHTML = '<option value="">Seleccione un modelo</option>';
  marcaInput.value = "";
  anioInput.value = "";

  if (seleccion) {
    seleccion.forEach(item => {
      const option = document.createElement("option");
      option.value = item.modelo;
      option.textContent = item.modelo;
      modeloSelect.appendChild(option);
    });
  }
});

modeloSelect.addEventListener("change", () => {
  const seleccion = catalogo[categoriaSelect.value];
  const modeloElegido = modeloSelect.value;
  const info = seleccion.find(item => item.modelo === modeloElegido);
  if (info) {
    marcaInput.value = info.marca;
    anioInput.value = info.anio;
  } else {
    marcaInput.value = "";
    anioInput.value = "";
  }
});

form.addEventListener("submit", e => {
  e.preventDefault();

  const vehiculo = {
    marca: marcaInput.value,
    modelo: modeloSelect.value,
    anio: parseInt(anioInput.value),
    categoria: categoriaSelect.value,
    estado: "disponible"
  };

  fetch("http://localhost:8000/api/vehiculos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(vehiculo)
  })
    .then(res => res.json())
    .then(data => {
      mensaje.textContent = "✅ Vehículo registrado correctamente";
      form.reset();
      modeloSelect.innerHTML = '<option value="">Seleccione un modelo</option>';
    })
    .catch(() => {
      mensaje.textContent = "❌ Error al registrar vehículo";
    });
});
