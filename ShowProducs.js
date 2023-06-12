import react,{useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowProducs = () =>{
    const url= 'http://api-products-run';
    const [products, setProducts]=useState([]);
    const [id, setId]=useState("");
    const [name, setName]=useState("");
    const [description, setDescription]=useState("");
    const [price, setPrice]=useState("");
    const [operation, setOperation]=useState(1);
    const [title, setTitle]=useState("");

    useEffect( () =>{
        getProducts();
    },[]);

    const getProducts = async () =>{
        const respuesta = await axios.get(url);
        setProducts(respuesta.data);
    }

    const openmodal = (op,id, name, description, price) =>{
        setId("");
        setName("");
        setDescription("");
        setPrice("");
        setOperation(op);
        if(op === 1){
            setTitle('registar producto');
        }
        else if(op === 2){
            setTitle('editar producto');
            setId(id);
        setName(name);
        setDescription(description);
        setPrice(price);
        }
        window.setTimeout(function(){
            document.getElementById('nombre').focus();
        },500);
    }
    const validar =() =>{
        var parametros;
        var metodo;
        if(name.trim()===''){
            show_alerta('escriba el nombre del producto', 'warning');
        }
        else if(description.trim() ===''){
            show_alerta('escriba la descripcion del produto', 'warning')
        }
        else if(price ===''){
            show_alerta('escriba el precio del produto', 'warning')
        }
        else{
            if(operation===1){
                parametros={name:name.trim(), description:description.trim(), price:price}
                metido= 'POST';
            }
            else{
                parametros={name:name.trim(), description:description.trim(), price:price}
                metido= 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    }
    const enviarSolicitud = async(metodo, parametros) =>{
        await axios({ method:metodo, url:url, data:parametros}).then(function(respuesta){
            var tipo = respuesta.data[0];
            var msj = respuesta.data[1];
            show_alerta(msj, tipo);
            if (tipo=== 'success'){
                document.getElementById('boton cerrar').click();
                getProducts();
            }
        })
        .catch(function(error){
            show_alerta('error en la solicitud', 'error');
            console.log(error);
        });

    }
    const deleteProduct= (id, name) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            litle: ' ¿seguro desea elimunar el producto' +name+'?',
            icon: 'question', text:'no se podra dar marcha atras',
            showCancelButton:true,confirmButtonText:'si, eliminar', cancelButtonText:'cancelat'
        }).then((result)=>{
            if (result.isConfirmed){
                setId(id);
                enviarSolicitud('DELETE', {id:id});
            }
            else{
                show_alerta('el producto no fue eliminado', 'info');
            }
        });
    }

    return(
        <div className='app'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={()=>openmodal} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='modalProducts'>
                                <i className='fa-solid fa-circle-plus'></i> añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-lg.12'>
                        <div className='table-responsive'>
                            <div className='table table-bordered'>
                                <thead>
                                    <tr><th>#</th><th>PRODUCTO</th><th>DESCRIPCION</th><th>PRECIO</th><th></th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {products.map((product,i)=>(
                                        <tr key={product.id}>
                                            <td>{(i+1)}</td>
                                            <td>{product.name}</td>
                                            <td>{product.description}</td>
                                            <td>${new Intl.NumberFormat('es-mx').format(product.price)} </td>
                                            <td>
                                                <button onClick={()=> openmodal(2, product.id, product.name, product.description, product.price)} 
                                                className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={()=>deleteProduct(product.id, product.name)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>

                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='hs'>{litle}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='nombre' value={name}
                                onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                                <input type='text' id='descripcion' className='form-control' placeholder='descripcion' value={description}
                                onChange={(e) => setDescription(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                                <input type='text' id='precio' className='form-control' placeholder='precio' value={price}
                                onChange={(e) => setPrice(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={()=> validar} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> guardar
                            </button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' id='boton cerrar' className='btn btn-secondary' data-bs-dismiss='modal'>cerrar</button>
                    </div>
                </div>
                
            </div>

        </div>
     </div>

)}

export default ShowProducs

