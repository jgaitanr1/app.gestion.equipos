import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Button } from 'primereact/button';

const NotFoundPage = () => {

    const navigate = useNavigate();

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <div className="flex flex-column align-items-center justify-content-center">
                        <div
                            style={{
                                borderRadius: '56px',
                                padding: '0.3rem',
                                background: 'linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)'
                            }}
                        >
                            <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                                <div className="flex justify-content-center align-items-center bg-pink-500 border-circle" style={{ height: '3.2rem', width: '3.2rem' }}>
                                    <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                                </div>
                                <h1 className="text-900 font-bold text-5xl mb-2">Página en construcción</h1>
                                <Button icon="pi pi-arrow-left" label="volver" text onClick={() => { navigate('/'); }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default NotFoundPage;