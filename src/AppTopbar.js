import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import Cookies from 'universal-cookie';

export const AppTopbar = (props) => {
    let navigate = useNavigate();
    // const cookies = new Cookies();
    const cookies = useMemo(() => new Cookies(), []);

    const cerrarSesion = () => {
        cookies.remove('token', { path: '/' });
        cookies.remove('id', { path: '/' });
        cookies.remove('username', { path: '/' });
        cookies.remove('email', { path: '/' });
        cookies.remove('nombre', { path: '/' });
        cookies.remove('apellido', { path: '/' });
        cookies.remove('docIdentidad', { path: '/' });
        cookies.remove('nroTelefono', { path: '/' });
        cookies.remove('estado', { path: '/' });
        cookies.remove('role', { path: '/' });
        navigate('/login');
    }

    useEffect(() => {
        if (!cookies.get('id')) {
            navigate('/login');
        }
    }, [cookies, navigate]);

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src="/logos/clini3.jpg" alt="" style={{ width: "80%", height: "80%" }} />
                {/* <div className="text-black-900 font-bold"> Unidad Academica </div> */}
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <ul className={classNames("layout-topbar-menu lg:flex origin-top", { "layout-topbar-menu-mobile-active": props.mobileTopbarMenuActive })}>
                {/* <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-calendar" />
                        <span>Eventos</span>
                    </button>
                </li>
                <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-cog" />
                        <span>Configuraciones</span>
                    </button>
                </li>
                <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-user" />
                        <span>Perfil</span>
                    </button>
                </li> */}
                <li>
                    <button className="p-link layout-topbar-button" onClick={cerrarSesion}>
                        <i className="pi pi-sign-out" />
                        <span>Cerrar Sesion</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};
