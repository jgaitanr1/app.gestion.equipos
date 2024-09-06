import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import classNames from 'classnames';

import { environment } from "./util/baseUrl";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { UsuarioEntity } from '../Entity/UsuarioEntity';

const Perfil = () => {
    let empty = UsuarioEntity;

    let pass = {
        id: null,
        oldPassword: '',
        newPassword: ''
    }

    const [errors, setErrors] = useState({
        confirmPassword: '',
        // otros campos de errores aquí
    });

    // let navigate = useNavigate();
    const cookies = new Cookies();
    const [data, setData] = useState(empty);
    const [submitted, setSubmitted] = useState(false);
    const [EntidadNewDialog, setEntidadNewDialog] = useState(false);
    const [EntidadDialog, setEntidadDialog] = useState(false);
    const [product, setProduct] = useState(empty);
    const [passw, setPassw] = useState(pass);
    const [confirmPassword, setConfirmPassword] = useState('');
    const toast = useRef(null);
    // const currentDate = new Date();


    const peticionGet = async () => {
        await axios.get(environment.baseUrl + "usuario/" + cookies.get('id'))
            .then(response => {
                setData(response.data);
                setProduct(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionPut = async () => {
        passw.id = cookies.get('id');
        await axios.post(environment.baseUrl + 'usuario/changepassword', passw)
            .then(() => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingreso Correcto', life: 3000 });
            }).catch(error => {
                console.log(error);
                toast.current.show({ severity: 'error', summary: 'Datos Incorrectos', detail: 'Datos Incorrectos', life: 5000 });
            })
    }

    const peticionPutMod = async () => {
        console.log(environment.baseUrl + "usuario/", product);
        await axios.put(environment.baseUrl + "usuario/", product)
            .then(() => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingreso Correcto', life: 3000 });
                setTimeout(() => {
                    window.location.reload();
                }, 400);
            }).catch(error => {
                console.log(error);
                toast.current.show({ severity: 'error', summary: 'Datos Incorrectos', detail: 'Datos Incorrectos', life: 5000 });
            })
    }

    const hideDialogNew = () => {
        setSubmitted(false);
        setEntidadNewDialog(false);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setEntidadDialog(false);
    }

    const openNew = () => {
        setPassw(pass);
        setSubmitted(false);
        setEntidadNewDialog(true);
    }

    const open = () => {
        setSubmitted(false);
        setEntidadDialog(true);
    }

    const saveProduct = () => {
        setSubmitted(true);
        if (product.email && product.nroTelefono) {
            peticionPutMod();
            setEntidadDialog(false);
        }
    }

    const saveProduct2 = () => {
        setSubmitted(true);
        if (passw.oldPassword.trim() && passw.newPassword.trim() && confirmPassword.trim()) {
            if (passw.newPassword === confirmPassword) {
                peticionPut();
                setEntidadNewDialog(false);
                setPassw(pass);
                setConfirmPassword('');
            } else {
                setErrors({ ...errors, confirmPassword: 'Las contraseñas no coinciden.' });
            }
            setEntidadNewDialog(false);
            setPassw(pass);
        }
    }

    const onInputChangePass = (e, name) => {
        const val = (e.target && e.target.value) || '';
        if (name === 'newPassword' || name === 'confirmPassword') {
            if (name === 'newPassword') {
                setPassw({ ...passw, [name]: val });
            } else {
                setConfirmPassword(val);
            }
            if (passw.newPassword !== val) {
                setErrors({ ...errors, confirmPassword: 'Las contraseñas no coinciden.' });
            } else {
                setErrors({ ...errors, confirmPassword: '' });
            }
        } else {
            setPassw({ ...pass, [name]: val });
        }
        let _pass = { ...passw };
        _pass[`${name}`] = val;
        setPassw(_pass);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        setProduct(_product);

        if (name === 'fecha') {
            _product[name] = val.toString();
        }
        else {
            _product[name] = val;
        }
        _product[`${name}`] = val;
    }

    const productDialogFooterNew = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialogNew} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-success" onClick={saveProduct2} />
        </>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-success" onClick={saveProduct} />
        </>
    );

    useEffect(() => {
        peticionGet();
    }, []);

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="surface-section">
                        <div className="font-medium text-3xl text-900 mb-3">Información de Usuario</div>
                        <div className="text-500 mb-5">Datos personales.</div>
                        <ul className="list-none p-0 m-0">
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Nombres: </div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{data.nombre}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Apellidos: </div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{data.apellido}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">N° Documento: </div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{data.docIdentidad}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Numero de Telefono: </div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{data.nroTelefono}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Correo Electronico: </div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{data.email}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Permisos: </div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"> {cookies.get('role')}</div>
                            </li>
                        </ul>
                    </div>
                    <br />
                    <div className="my-2">
                        <Button label="Actualizar Datos" icon="pi pi-pencil" className="p-button-outlined p-button-success mr-2" onClick={open} />
                        <Button label="Cambiar Contraseña" icon="pi pi-lock-open" className="p-button-outlined p-button-success mr-2" onClick={openNew} />
                    </div>
                </div>
                <Dialog visible={EntidadNewDialog} style={{ width: '350px' }} header="Cambiar Contraseña" modal className="p-fluid" footer={productDialogFooterNew} onHide={hideDialogNew}>
                    <div className="field">
                        <div className="p-inputgroup">
                            <InputText placeholder="Antigua contraseña" type="password" id="oldPassword" name="oldPassword" value={passw.oldPassword} onChange={(e) => onInputChangePass(e, 'oldPassword')} required autoFocus className={classNames({ 'p-invalid': submitted && !passw.oldPassword })} />
                        </div>
                    </div>
                    <div className="field">
                        <div className="p-inputgroup">
                            <InputText placeholder="Nueva contraseña" type="password" id="newPassword" name="newPassword" value={passw.newPassword} onChange={(e) => onInputChangePass(e, 'newPassword')} required className={classNames({ 'p-invalid': submitted && !passw.newPassword })} />
                        </div>
                    </div>
                    <div className="field">
                        <div className="p-inputgroup">
                            <InputText placeholder="Confirmar contraseña" type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => onInputChangePass(e, 'confirmPassword')} required className={classNames({ 'p-invalid': submitted && !confirmPassword })} />
                        </div>
                        {submitted && errors.confirmPassword && <small className="p-invalid">{errors.confirmPassword}</small>}
                    </div>
                </Dialog>
                <Dialog visible={EntidadDialog} style={{ width: '500px' }} header="Datos de Usuario" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    <div className="formgrid grid">
                        <div className="field col-12 md:col-12">
                            <label htmlFor="docIdentidad">Doc. de Identidad</label>
                            <div className="p-inputgroup">
                                <InputText id="docIdentidad" name="docIdentidad" value={product.docIdentidad} onChange={(e) => onInputChange(e, 'docIdentidad')} required disabled className={classNames({ 'p-invalid': submitted && !product.docIdentidad })} />
                            </div>
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col-12 md:col-12">
                            <label htmlFor="nombre">Nombres</label>
                            <InputText id="nombre" name="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required disabled className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col-12 md:col-12">
                            <label htmlFor="apellido">Apellidos</label>
                            <InputText id="apellido" name="apellido" value={product.apellido} onChange={(e) => onInputChange(e, 'apellido')} required disabled className={classNames({ 'p-invalid': submitted && !product.apellido })} />
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="email">Correo</label>
                            <InputText id="email" name="email" value={product.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !product.email })} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="nroTelefono">Telefono</label>
                            <InputText id="nroTelefono" name="nroTelefono" value={product.nroTelefono} onChange={(e) => onInputChange(e, 'nroTelefono')} required className={classNames({ 'p-invalid': submitted && !product.nroTelefono })} />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default Perfil;