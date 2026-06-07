const formLogin = document.getElementById('form-login');

if (formLogin) {

    formLogin.addEventListener('submit', function(evento) {
        
        evento.preventDefault();

        const usuarioIngresado = document.getElementById('login-usuario').value;
        const passwordIngresada = document.getElementById('login-password').value;

        fetch('data/usuarios.xml')
            .then(respuesta => respuesta.text())
            .then(textoXML => {
                
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(textoXML, 'text/xml');

                const usuarios = xmlDoc.getElementsByTagName('usuario');
                let accesoConcedido = false;

                for(let i = 0; i < usuarios.length; i++) {
                    
                    let userXML = usuarios[i].getElementsByTagName('username')[0].textContent;
                    let passXML = usuarios[i].getElementsByTagName('password')[0].textContent;

                    if(usuarioIngresado === userXML && passwordIngresada === passXML) {
                        accesoConcedido = true;
                        break; 
                    }
                }

                if(accesoConcedido) {
                    alert("¡Bienvenido de nuevo, " + usuarioIngresado + "!");
                    window.location.href = "index.html";
                } else {
                    alert("Usuario o contraseña incorrectos.");
                }
            })
            .catch(error => {
                console.error("Error al leer el archivo XML:", error);
                alert("Hubo un error al conectarse con la base de datos.");
            });
    });
}

const tablaDirectorio = document.getElementById('tabla-directorio');
const filtroCategoria = document.getElementById('filtro-categoria');
const heroPueblo = document.querySelector('.hero-pueblo');

if (tablaDirectorio && heroPueblo) {
    
    const puebloActual = heroPueblo.querySelector('h2').textContent.trim();
    let datosOriginalesXML = []; 

    fetch('data/turismo.xml')
        .then(respuesta => respuesta.text())
        .then(textoXML => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(textoXML, 'text/xml');
            const lugares = xmlDoc.getElementsByTagName('lugar');

            for (let i = 0; i < lugares.length; i++) {
                const puebloXML = lugares[i].getElementsByTagName('pueblo')[0].textContent;
                
                if (puebloXML === puebloActual) {
                    datosOriginalesXML.push({
                        categoria: lugares[i].getElementsByTagName('categoria')[0].textContent,
                        nombre: lugares[i].getElementsByTagName('nombre')[0].textContent,
                        descripcion: lugares[i].getElementsByTagName('descripcion')[0].textContent
                    });
                }
            }

            renderizarTabla(datosOriginalesXML);
        })
        .catch(error => console.error("Error al cargar turismo.xml:", error));

    function renderizarTabla(datos) {
        const tbody = tablaDirectorio.querySelector('tbody');
        tbody.innerHTML = ''; 
        
        datos.forEach(lugar => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><strong>${lugar.nombre}</strong></td>
                <td>${lugar.categoria}</td>
                <td>${lugar.descripcion}</td>
            `;
            tbody.appendChild(fila);
        });
    }

    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', function(evento) {
            const categoriaSeleccionada = evento.target.value;
            
            if (categoriaSeleccionada === "Todas") {
                renderizarTabla(datosOriginalesXML);
            } else {
                const datosFiltrados = datosOriginalesXML.filter(lugar => lugar.categoria === categoriaSeleccionada);
                renderizarTabla(datosFiltrados);
            }
        });
    }
}