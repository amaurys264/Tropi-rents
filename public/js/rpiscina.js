var contenedor2=document.getElementById('contenedor2');
var icon_close=document.getElementById('icon_close');
var c_detalle=document.getElementById('c_detalle');
var contenido=document.querySelector('.contenido');
//-------------detalle---------------
var nombre=document.querySelector('.c_nombre');
var imagen=document.querySelector('.casa_imagen');
var provincia=document.querySelector('#c_ubi');
var zona=document.querySelector('#c_zona');
var capacidad=document.querySelector('#c_capacidad');
var descripcion=document.querySelector('#c_descripcion');
var horario=document.querySelector('#c_horario');
var costo=document.querySelector('#cl_costo');
var confort=document.querySelector('#c_confort');
var confort_l=document.querySelector('#cl_confort');
var slider=document.querySelector('.c_slider');
//-----------filtro-----------------------
var filter_ubicacion=document.querySelector('#Ubicacion-p');
var filter_precio=document.querySelector('#Precio');

var datos;

icon_close.onclick=function()
{
   contenido.style.filter='none'
   c_detalle.style.display="none";   
}
window.onload=function(){   
   
   peticion();                  
   setTimeout(cargar,(1000))               
  
}
let cargar=function()
{
   var elementos=document.querySelectorAll('.elemento')
   
   elementos.forEach((tarjeta)=>
         {
            tarjeta.onclick=function()
            {
               
               nombre.innerHTML=datos.piscina[tarjeta.id].nombre;
               botonera.innerHTML=``;                             
               slider.innerHTML=``;
               if(datos.piscina[tarjeta.id].galeria[0])
                  {
                     datos.piscina[tarjeta.id].galeria.forEach((foto,index)=>
                     {
                        slider.innerHTML+= index==0?`<img class="casa_imagen" src="./img/ofertas/${foto.path}">`:`<img class="casa_imagen2" src="./img/ofertas/${foto.path}">`;
                        botonera.innerHTML+=index==0?`<input type="radio" id="${index}" name="cambio" class="c_imagedata" checked>`:`<input type="radio" id="${index}" name="cambio" class="c_imagedata">`;
                        //`
                     }  
                  )   
                  }
                  else
                  {
                     slider.innerHTML=`<img class="casa_imagen" src="./img/no_picture.jpg">`;
                     botonera.innerHTML=`<input type="radio" id="0" name="cambio" class="c_imagedata" checked>`
                  }        
              
               provincia.innerHTML=datos.piscina[tarjeta.id].ubicacion_p;
               zona.innerHTML=datos.piscina[tarjeta.id].ubicacion_z;
               capacidad.innerHTML="Capacidad para "+ datos.piscina[tarjeta.id].capacidad+" personas."
               descripcion.innerHTML=datos.piscina[tarjeta.id].notas;              
               costo.innerHTML='$'+datos.piscina[tarjeta.id].precio_ta;
               if(datos.piscina[tarjeta.id].horario_d==false && datos.piscina[tarjeta.id].horario_n==false){horario.innerHTML='Horario a convenir.'}
               if(datos.piscina[tarjeta.id].horario_d==false && datos.piscina[tarjeta.id].horario_n==true){horario.innerHTML='Disponible en horario nocturno.'}
               if(datos.piscina[tarjeta.id].horario_d==true && datos.piscina[tarjeta.id].horario_n==false){horario.innerHTML='Disponible en horario diurno.'}
               if(datos.piscina[tarjeta.id].horario_d==true && datos.piscina[tarjeta.id].horario_n==true){horario.innerHTML='Disponible en horario diurnas y nocturnas.'}
               confort_l.style.display=(datos.piscina[tarjeta.id].gastronomia==true||datos.piscina[tarjeta.id].j_mesa==true||datos.piscina[tarjeta.id].parrillada||datos.piscina[tarjeta.id].habitaciones)?'block':'none'

               confort.innerHTML=`${datos.piscina[tarjeta.id].gastronomia?'<li class="s4">Gastronomía.</li>':''}${datos.piscina[tarjeta.id].j_mesa?'<li class="s4">Entretenimiento.</li>':''}
               ${datos.piscina[tarjeta.id].parrillada?'<li class="s4">Parrillada.</li>':''}${datos.piscina[tarjeta.id].habitaciones?'<li class="s4">Habitaciones.</li>':''}`;
               costo.innerHTML=`${datos.piscina[tarjeta.id].precio!==0? "$"+datos.piscina[tarjeta.id].precio:"Precio a convenir."}`
               contenido.style.filter='blur(3px)';
               c_detalle.style.display="block";
            }
         }
   )  

}
function peticion()
{
   const data={
      method:"POST",
      body:JSON.stringify({ubicacion_p:filter_ubicacion.value,precio:filter_precio.value}),
      headers: {
                     'Content-Type': 'application/json'
               }
   }
   fetch('/api/piscina/mostrar',data)
     .then((resp)=>{        
      return resp.json();
      })

     .then(data=>{      
        //flayer.src=document.location.origin+data.setup.pro_flayer;
        
        datos=data;
        if (data.piscina.length>0)
           {
            contenedor2.innerHTML='';
               let imagen_path="";
               data.piscina.forEach((element,index) => 
                  {         
                     if(element.galeria[0])
                     {
                        imagen_path=`ofertas/${element.galeria[0].path}`;
                     }
                     else
                     {
                        imagen_path='no_picture.jpg';
                     }
                     contenedor2.innerHTML+=`
                     <div class="elemento" id='${index}'>
                        <img src="./img/${imagen_path}">
                           <div class="c_info">
                              <div class=c_info1>
                                 <span><u>${element.nombre}</u></span>
                                 <p><i>${element.notas}</i></p>
                              </div>
                              <div>
                                    <span>Precio:</span><span class="data_precio">$${element.precio}.00</span>
                              </div>                  
                           </div>
                     </div>`        
                  })          
            }
            else
            {
               contenedor2.innerHTML=`<h4 style="display: block;text-align: center;margin:auto;">No hay artículos para mostrar</h4>`
            }
            
         })    
            .catch((error)=>
                  {
                     //console.error('Error:__',error+"__")'
                  })
}



filter_ubicacion.onchange=function()
{
   peticion();
   
   setTimeout(cargar,(1000));
}
filter_precio.onchange=function()
{
   peticion();
   
   setTimeout(cargar,(1000)); 
}