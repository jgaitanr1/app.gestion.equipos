import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
//import Cookies from 'universal-cookie';

import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
// import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { environment } from "./util/baseUrl";
import { MarcaEntity } from './../Entity/MarcaEntity';

import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

export const Marca = () => {

    let empty = MarcaEntity;

    const baseUrl = environment.baseUrl + "marca/";
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
        await axios.post(baseUrl, product)
            .then(response => {
                setData(data.concat(response.data));
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingreso Correcto', life: 3000 });
            }).catch(error => {
                console.log(error);
                toast.current.show({ severity: 'error', summary: 'Datos Incorrectos', detail: 'Datos Incorrectos', life: 5000 });
            })
    }

    const peticionPut = async () => {
        try {
            await axios.put(baseUrl, product)
                .then(() => {
                    var dataNueva = data.map(u => {
                        if (u.id === product.id) {
                            u.nombre = product.nombre;
                        }
                        return u;
                    });
                    setData(dataNueva);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingreso Modificado', life: 3000 });
                })
                .catch(error => {
                    console.log(error);
                    toast.current.show({ severity: 'error', summary: 'Datos Incorrectos', detail: 'Datos Incorrectos', life: 5000 });
                });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (cookies.get('role') === 'USER') {
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
        setSubmitted(false);
        setEntidadNewDialog(false);
    }
    const editProduct = (product) => {
        setProduct({ ...product });
        setEntidadNewDialog(true);
    }

    const saveProduct = () => {
        setSubmitted(true);
        if (product.nombre) {
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
            setData(_products);
            setProduct(empty);
        } else {
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

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Registrar Marca" icon="pi pi-plus-circle" className="p-button-outlined p-button-success mr-2" onClick={openNew} />
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
                {rowData.id}
            </>
        );
    }

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.nombre}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button title="Modificar Marca" icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-success mr-2" onClick={() => editProduct(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Configuración de Marcas</h5>
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
                        currentPageReportTemplate="Ver {first} a {last} de {totalRecords} Marcas"
                        globalFilter={globalFilter} emptyMessage="No existen registros." header={header}>
                        <Column field="id" header="id" body={idBodyTemplate}></Column>
                        <Column field="nombre" header="Nombre" body={nombreBodyTemplate}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                    <Dialog visible={EntidadNewDialog} style={{ width: '700px' }} header="Datos de Marca" modal className="p-fluid" footer={productDialogFooterNew} onHide={hideDialogNew}>
                        <div className="field col-12">
                            <div className="formgrid grid">
                                <div className="field col-12 md:col-12">
                                    <label htmlFor="nombre">Nombre de Marca</label>
                                    <InputText id="nombre" name="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                                    {submitted && !product.nombre && <small className="p-invalid">El nombre de la marca es requerido.</small>}
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Marca;
