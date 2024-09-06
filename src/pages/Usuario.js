import React, { useState, useEffect, useRef } from 'react';
// import { useCallback } from 'react';

import axios from 'axios';
//import Cookies from 'universal-cookie';

import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
// import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { environment } from "./util/baseUrl";
import { Dropdown } from 'primereact/dropdown';
import { UsuarioEntity } from '../Entity/UsuarioEntity';

import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

export const Usuario = () => {

    // const currentDate = new Date();

    let empty = UsuarioEntity;

    const baseUrl = environment.baseUrl + "usuario/";
    const [data, setData] = useState(null);
    const [EntidadNewDialog, setEntidadNewDialog] = useState(false);

    let navigate = useNavigate();
    const cookies = new Cookies();

    const [product, setProduct] = useState(empty);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    //Dropdowns especiales

    const [rolId, setRolId] = useState(null);
    const optionsRol = [
        { label: 'ADMIN', value: 'ADMIN' },
        { label: 'ING', value: 'ING' },
        { label: 'USER', value: 'USER' },
    ];


    const peticionGet = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionPost = async () => {
        delete product.id;
        product.password = product.docIdentidad;
        console.log(product);
        await axios.post(environment.baseUrl + "auth/signup", product)
            .then(response => {
                // setData(data.concat(response.data));
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingreso Correcto', life: 3000 });
                setTimeout(() => {
                    window.location.reload();
                }, 200);
            }).catch(error => {
                console.log(error);
                toast.current.show({ severity: 'error', summary: 'Datos Incorrectos', detail: 'Datos Incorrectos', life: 5000 });
            })
    }

    const peticionPut = async () => {
        try {
            // Actualiza las propiedades del objeto product
            // Realiza la solicitud PUT
            await axios.put(baseUrl, product)
                .then(() => {
                    // Actualiza la data en función del nuevo objeto
                    var dataNueva = data.map(u => {
                        if (u.id === product.id) {
                            u.nombre = product.nombre;
                            u.apellido = product.apellido;
                            u.email = product.email
                        }
                        return u;
                    });
                    // Actualiza el estado con la nueva data
                    setData(dataNueva);
                    // Muestra un mensaje de éxito
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingreso Modificado', life: 3000 });
                    setTimeout(() => {
                        window.location.reload();
                    }, 200);
                })
                .catch(error => {
                    // Maneja errores de manera adecuada
                    console.log(error);
                    // Muestra un mensaje de error
                    toast.current.show({ severity: 'error', summary: 'Datos Incorrectos', detail: 'Datos Incorrectos', life: 5000 });
                });
        } catch (error) {
            console.error(error);
        }
    };

    const peticionPutReiniciarPass = async (product) => {
        console.log('Ingresa peticionPutReiniciarPass');
        console.log(baseUrl + 'passgenerico', product);
        await axios.post(baseUrl + 'passgenerico', product)
            .then(response => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingreso Correcto', life: 3000 });
            }).catch(error => {
                console.log(error);
                toast.current.show({ severity: 'error', summary: 'Datos Incorrectos', detail: 'Datos Incorrectos', life: 5000 });
            })
    }

    useEffect(() => {
        if (cookies.get('role') !== 'ADMIN') {
            navigate('/');
        }
        peticionGet();
    }, []);

    const openNew = () => {
        setProduct(empty);
        setSubmitted(false);
        setEntidadNewDialog(true);
    }
    const hideDialogNew = () => {
        setRolId(null);
        product.role = null;

        setSubmitted(false);
        setEntidadNewDialog(false);
    }
    const editProduct = (product) => {
        setProduct({ ...product });
        setEntidadNewDialog(true);
    }

    const restaurarPass = (product) => {
        setProduct({ ...product });
        peticionPutReiniciarPass(product);
    }

    const saveProduct = () => {
        setSubmitted(true);
        if (product.docIdentidad.trim() && product.nombre && product.apellido && product.username && product.email) {
            let _products = [...data];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);
                _products[index] = _product;
                peticionPut();
            }
            else {
                peticionPost();
                _products.push(_product);
            }
            setEntidadNewDialog(false);
            // setData(_products);
            setProduct(empty);
        }
        else {
            toast.current.show({ severity: 'error', summary: 'Datos Incompletos', detail: 'Datos Incompletos', life: 5000 });
        }
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    // const exportCSV = () => {
    //     dt.current.exportCSV();
    // }



    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;
        setProduct(_product);
    }


    const handleChangeRol = (event) => {
        setRolId(event.value);
        product.role = event.value;
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Registrar Usuario" icon="pi pi-user-plus" className="p-button-outlined p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" /> */}
                {/* <Button label="Exportar" icon="pi pi-upload" className="p-button-outlined p-button-help" onClick={exportCSV} /> */}
            </React.Fragment>
        )
    }

    const idBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.docIdentidad}
            </>
        );
    }

    // const usernameBodyTemplate = (rowData) => {
    //     return (
    //         <>
    //             {rowData.username}
    //         </>
    //     );
    // }

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.nombre + ' ' + rowData.apellido}
            </>
        );
    }

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.email}
            </>
        );
    }

    const telefonoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.nroTelefono}
            </>
        );
    }

    const roleBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.role}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                {/* <Button title="Modificar Usuario" icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-success mr-2" onClick={() => editProduct(rowData)} /> */}
                <Button title="Restaurar Contraseña" icon="pi pi-lock-open" className="p-button-rounded p-button-outlined p-button-success mr-2" onClick={() => restaurarPass(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Configuración de Usuarios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooterNew = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialogNew} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-success" onClick={saveProduct} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable ref={dt} value={data} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Ver {first} a {last} de {totalRecords} Usuarios"
                        globalFilter={globalFilter} emptyMessage="No existen registros." header={header}>
                        <Column field="id" header="DNI" body={idBodyTemplate}></Column>
                        <Column field="nombre" header="Nombre" body={nombreBodyTemplate}></Column>
                        {/* <Column field="username" header="Usuario" sortable body={usernameBodyTemplate}></Column> */}
                        <Column field="email" header="Email" body={emailBodyTemplate}></Column>
                        <Column field="nroTelefono" header="Contacto" body={telefonoBodyTemplate}></Column>
                        <Column field="role" header="Permisos" body={roleBodyTemplate}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                    <Dialog visible={EntidadNewDialog} style={{ width: '700px' }} header="Datos de Usuario" contentStyle={{ overflow: 'visible' }} modal className="p-fluid" footer={productDialogFooterNew} onHide={hideDialogNew}>
                        <div className="field col-12">
                            <div className="formgrid grid">
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="docIdentidad">Doc. de Identidad</label>
                                    <div className="p-inputgroup">
                                        <InputText id="docIdentidad" name="docIdentidad" value={product.docIdentidad} onChange={(e) => onInputChange(e, 'docIdentidad')} required className={classNames({ 'p-invalid': submitted && !product.docIdentidad })} />
                                    </div>
                                    {/* {submitted && !product.docIdentidad && <small className="p-invalid">el documento de identidad es requerido.</small>} */}
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="username">Nombre de Usuario</label>
                                    <InputText id="username" name="username" value={product.username} onChange={(e) => onInputChange(e, 'username')} required className={classNames({ 'p-invalid': submitted && !product.username })} />
                                </div>
                            </div>
                            <div className="formgrid grid">
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="nombre">Nombres</label>
                                    <InputText id="nombre" name="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="apellido">Apellidos</label>
                                    <InputText id="apellido" name="apellido" value={product.apellido} onChange={(e) => onInputChange(e, 'apellido')} required className={classNames({ 'p-invalid': submitted && !product.apellido })} />
                                </div>
                            </div>
                            <div className="formgrid grid">
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="email">Correo</label>
                                    <InputText id="email" name="email" value={product.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !product.email })} />
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="nroTelefono">Número de Celular</label>
                                    <InputText id="nroTelefono" name="nroTelefono" value={product.nroTelefono} onChange={(e) => onInputChange(e, 'nroTelefono')} required />
                                </div>
                            </div>
                            {/* <div className="formgrid grid">
                                <div className="field col-12 md:col-12">
                                    <label htmlFor="role">Permisos</label>
                                    <Dropdown placeholder={product.role} id="role" name="role" options={optionsRol} value={rolId} onChange={handleChangeRol} appendTo={'self'} className={classNames({ 'p-invalid': submitted && !product.role })} />
                                </div>
                            </div> */}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Usuario;
