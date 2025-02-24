import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Cookies from 'universal-cookie';
import axios from 'axios';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
// import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';

import { environment } from "./util/baseUrl.js";
function Login() {
    const baseUrl = environment.baseUrl + "auth/signin";
    const cookies = new Cookies();
    let navigate = useNavigate();
    const toast = useRef(null);
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const handleChange = e => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    }

    const iniciarSesion = async () => {
        await axios.post(baseUrl, form)
            .then(response => {
                if (response.data.token != null) {
                    var respuesta = response.data;
                    cookies.set('token', respuesta.token, { path: '/' });
                    cookies.set('id', respuesta.id, { path: '/' });
                    cookies.set('username', respuesta.username, { path: '/' });
                    cookies.set('email', respuesta.email, { path: '/' });
                    cookies.set('nombre', respuesta.nombre, { path: '/' });
                    cookies.set('apellido', respuesta.apellido, { path: '/' });
                    cookies.set('docIdentidad', respuesta.docIdentidad, { path: '/' });
                    cookies.set('estado', respuesta.estado, { path: '/' });
                    cookies.set('role', respuesta.role, { path: '/' });
                    toast.current.show({ severity: 'success', summary: 'Logeado Correctamente', detail: 'Bienvenido ' + respuesta.nombre + ' ' + respuesta.apellido, life: 3000 });
                    setTimeout(() => {
                        navigate('/perfil');
                    }, 1000);
                }
            })
            .catch(error => {
                console.log(error);
                toast.current.show({ severity: 'error', summary: 'Datos Incorrectos', detail: 'Usuario o Contraseña incorrectos', life: 5000 });
            })
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            iniciarSesion();
        }
    };

    useEffect(() => {
        if (cookies.get('id')) {
            navigate('/');
        }
        document.documentElement.style.fontSize = 12 + 'px';
    }, []);


    const styles = {
        body: {
            // backgroundImage: "url(/logos/.png)",
            // color: 'white',
            backgroundColor: '#ae092d', //#fbd00f
            height: '100vh',
            width: '100vw',
            display: 'flex',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
        },
        component: {
            background: '#ae092d',
            color: 'white',
        },
        texto: {
            color: '#ae092d',
        },
        formulario: {
            border: 'thick solid #FFFFFF',
            opacity: '0.95',
        }

    }

    return (
        <>
            <Toast ref={toast} />
            <div style={styles.body} className="px-4 py-8 md:px-4 lg:px-8 flex align-items-center justify-content-center">
                <div style={styles.formulario} className="surface-card p-6 shadow-8 border-round w-full lg:w-4 mb-4" onKeyDown={handleKeyDown}>
                    <br />
                    <div align="center"><img src="/logos/cmch2.jpg" alt="logo cmch" height={100} /></div>
                    <br />
                    <br />
                    <div className="mb-2">
                        <div className="p-inputgroup">
                            <span style={styles.component} className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText placeholder="Usuario" id="username" type="text" name="username" onChange={handleChange} />
                        </div>
                        <br />
                        <div className="p-inputgroup mb-4">
                            <span style={styles.component} className="p-inputgroup-addon">
                                <i className="pi pi-lock"></i>
                            </span>
                            <InputText placeholder="Contraseña" id="password" type="password" name="password" onChange={handleChange} />
                        </div>
                        <br />
                        <Button style={styles.component} label="Iniciar Sesion" icon="pi pi-desktop" className="w-full" onClick={() => iniciarSesion()} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;