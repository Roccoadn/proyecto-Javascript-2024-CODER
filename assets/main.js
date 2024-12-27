// LOCALSTORAGE //
// LOCALSTORAGE //
// ARRAY PRODUCTOS //
const productosTienda = [
    { img: "./assets/img/air-alpha-force-a.jpg", nombre: "Air Alpha Force", id: 1, precio: 95000},
    { img: "./assets/img/air-force-1-a.jpg", nombre: "Air Force 1", id: 2, precio: 120000},
    { img: "./assets/img/air-force-1-black-a.jpg", nombre: "Air Force 1 Black", id: 3, precio: 120000},
    { img: "./assets/img/air-force-1-green-a.jpg", nombre: "Air Force 1 Verdes", id: 4, precio: 150000},
    { img: "./assets/img/air-jordan-1-retro-a.jpg", nombre: "Air Jordan 1 Retro", id: 5, precio: 285000},
    { img: "./assets/img/sb-zoom-janoskiog-a.jpg", nombre: "SB Zoom Janoski OG", id: 6, precio: 263000},
    { img: "./assets/img/nike-dunk-low-retro-a.jpg", nombre: "Dunk Low Retro", id: 7, precio: 170000},
    { img: "./assets/img/air-jordan-3-retro-a.jpg", nombre: "Air Jordan 3 Retro", id: 8, precio: 300000},
    { img: "./assets/img/air-jordan-1-zoom-a.jpg", nombre: "Air Jordan 1 Zoom", id: 9, precio: 135000},
]
// ARRAY PRODUCTOS //

const productos = document.getElementById("productos")
const header = document.getElementById("navbar");
const panelCarrito = document.getElementById("panelCarrito");
const topCarrito = document.getElementById("topCarrito");
const productosCarrito = document.getElementById("productosCarrito");
const botonCarrito = document.getElementById("botonCarrito");
const totalCarrito = document.getElementById("totalDeCompra");
const botonPagar = document.getElementById("botonPagar");

const carritoTienda = []

// CARDS PRODUCTOS //
const items = () => {
    const productos = document.getElementById("productos");
    productos.innerHTML = "";
    
    productosTienda.forEach(el =>{
        productos.innerHTML +=`
        <div data-aos="fade-up" data-aos-duration="4000">
        <img src="${el.img}"/>
        <h2>${el.nombre}</h2>
        <p>$${el.precio}</p>
        <button class="botonAgregar">Agregar al carrito</button>
        </div>
        `
    })
    
    const botonesAgregar = document.querySelectorAll(".botonAgregar");
    botonesAgregar.forEach((boton, index) => {
        boton.addEventListener("click", () => {
            const productoExistente = carritoTienda.find(
                item => item.nombre === productosTienda[index].nombre
            );
            
            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                carritoTienda.push({
                    img: productosTienda[index].img,
                    nombre: productosTienda[index].nombre,
                    precio: Number(productosTienda[index].precio),
                    cantidad: 1
                });
            }
            actualizadorCarrito();
        });
    });
};

// CARDS PRODUCTOS //

function actualizadorCarrito() {
    productosCarrito.innerHTML = "";
    
    carritoTienda.forEach((el, index) => {
        productosCarrito.innerHTML += `
            <div class="producto">
                <img src="${el.img}"/>
                <div>
                <h3>${el.nombre}</h3>
                <p>Precio: $${el.precio}</p>
                <p>Cantidad: ${el.cantidad}</p>
                </div>
                <button class="botonesEliminar">X</button>
                </div>
                `;
            });
            
            totalCarrito.innerText = "$" + carritoTienda.reduce((acc, el) => {
                return acc + el.precio * el.cantidad;
            }, 0);

            botonCarrito.children[0].innerText = carritoTienda.reduce((acc, el) => {
                return acc + el.cantidad;
            }, 0);
            
            guardarCarritoEnLocalStorage();
            
            const botonesEliminar = document.querySelectorAll(".botonesEliminar");
            botonesEliminar.forEach(boton => {
                boton.addEventListener("click", (e) => {
                    const nombreProducto = e.target.parentElement.querySelector("h3").innerText;
            const itemABorrar = carritoTienda.find(el => el.nombre === nombreProducto);
            
            if (itemABorrar.cantidad === 1){
                carritoTienda.splice(carritoTienda.indexOf(itemABorrar), 1)
            }
            else{ 
                itemABorrar.cantidad = itemABorrar.cantidad - 1
            }
            actualizadorCarrito();
        });
    });
}

function pagar(){
    botonPagar.addEventListener("click", (evento) => {
        if (carritoTienda.length >= 1){
            panelCarrito.classList.add("panelOculto")
            carritoTienda.splice(0, 10);
            Swal.fire({
                text: "¡Compra realizada con exito!",
                icon: "success",
                confirmButtonColor: "#700f0f",
              });
        }
        else{
            Swal.fire({
                text: "¡No hay productos en tu carrito!",
                icon: "error",
                confirmButtonColor: "#700f0f",
            });
        }
        actualizadorCarrito();
    })
}

function abrirCerrarCarrito(){
    botonCarrito.addEventListener("click", () => {
        if (panelCarrito.classList.contains("panelOculto")) {
            panelCarrito.classList.remove("panelOculto");
            panelCarrito.classList.add("panelVisible");
        } else {
            panelCarrito.classList.remove("panelVisible");
            panelCarrito.classList.add("panelOculto");
        }
    });
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carritoTienda", JSON.stringify(carritoTienda));
}

function cargarCarritoDeLocalStorage() {
    const carritoGuardado = localStorage.getItem("carritoTienda");
    if (carritoGuardado) {
        carritoTienda = JSON.parse(carritoGuardado);
        actualizadorCarrito();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    items();
    abrirCerrarCarrito()
    guardarCarritoEnLocalStorage();
    cargarCarritoDeLocalStorage();
    pagar();
})


