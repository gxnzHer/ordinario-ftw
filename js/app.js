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