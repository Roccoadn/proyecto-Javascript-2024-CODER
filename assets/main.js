function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carritoTienda", JSON.stringify(carritoTienda));
    actualizadorCarrito();
}

function cargarCarritoDeLocalStorage() {
    const carritoGuardado = localStorage.getItem("carritoTienda");
    if (carritoGuardado) {
        carritoTienda.length = 0;
        carritoTienda.push(...JSON.parse(carritoGuardado));
        actualizadorCarrito();
    }
}
const productos = document.getElementById("productos")
const header = document.getElementById("navbar");
const panelCarrito = document.getElementById("panelCarrito");
const topCarrito = document.getElementById("topCarrito");
const productosCarrito = document.getElementById("productosCarrito");
const botonCarrito = document.getElementById("botonCarrito");
const totalCarrito = document.getElementById("totalDeCompra");
const botonPagar = document.getElementById("botonPagar");

const carritoTienda = []
let productosTienda = [];

async function cargarProductos() {
    try {
        const response = await fetch('../assets/prod.json');
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
       productosTienda = await response.json();
        console.log("Productos cargados:", productosTienda);
        items();
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

console.log(productos);
const items = () => {
    const productos = document.getElementById("productos");
    productos.innerHTML = "";
    console.log("Datos para crear tarjetas:", productosTienda);
    
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
            guardarCarritoEnLocalStorage();
        });
    });
};

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
            guardarCarritoEnLocalStorage();
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
              guardarCarritoEnLocalStorage();
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

document.addEventListener("DOMContentLoaded", async() => {
    await cargarProductos();
    items();
    abrirCerrarCarrito()
    cargarCarritoDeLocalStorage();
    pagar();
})


