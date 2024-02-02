var contenedor2=document.getElementById('contenedor2');
var icon_close=document.getElementById('icon_close');
var c_detalle=document.getElementById('c_detalle');
var contenido=document.querySelector('.contenido');
//-------------detalle---------------
var nombre=document.querySelector('.c_nombre');
var imagen=document.querySelector('.casa_imagen');
var provincia=document.querySelector('#c_ubi');
var zona=document.querySelector('#c_zona');
var local=document.querySelector('#c_local');
var descripcion=document.querySelector('#c_descripcion');
var horario=document.querySelector('#c_horario');
var costo=document.querySelector('#cl_costo');
var confort=document.querySelector('#c_confort');
var contacto=document.querySelector('#c_contacto');
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
   
   peticion()                 
   setTimeout(cargar,(500))               
  
}
let cargar=function()
{
   var elementos=document.querySelectorAll('.elemento')
   
   elementos.forEach((tarjeta)=>
         {
            tarjeta.onclick=function()
            {
               
               nombre.innerHTML=datos.fiesta[tarjeta.id].nombre;
               botonera.innerHTML=``;                             
               slider.innerHTML=``;
               if(datos.fiesta[tarjeta.id].galeria[0])
                  {
                     datos.fiesta[tarjeta.id].galeria.forEach((foto,index)=>
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
               provincia.innerHTML=datos.fiesta[tarjeta.id].ubicacion_p;
               zona.innerHTML=datos.fiesta[tarjeta.id].ubicacion_z;
               local.innerHTML=datos.fiesta[tarjeta.id].local+" con capacidad para "+ datos.fiesta[tarjeta.id].capacidad+ " personas.";
               descripcion.innerHTML=datos.fiesta[tarjeta.id].nota;
               if(datos.fiesta[tarjeta.id].horario_d==false && datos.fiesta[tarjeta.id].horario_n==false){horario.innerHTML='Horario a convenir.'}
               if(datos.fiesta[tarjeta.id].horario_d==false && datos.fiesta[tarjeta.id].horario_n==true){horario.innerHTML='Actividades en horario nocturno.'}
               if(datos.fiesta[tarjeta.id].horario_d==true && datos.fiesta[tarjeta.id].horario_n==false){horario.innerHTML='Actividades en horario diurno.'}
               if(datos.fiesta[tarjeta.id].horario_d==true && datos.fiesta[tarjeta.id].horario_n==true){horario.innerHTML='Actividades diurnas y nocturnas.'}                                                    
               costo.innerHTML='$'+datos.fiesta[tarjeta.id].precio_ta;

               confort.innerHTML=`${datos.fiesta[tarjeta.id].e_audio?'<li class="s4">Equipo de audio</li>':''}${datos.fiesta[tarjeta.id].decoracion?'<li class="s4">Servicio de decoración</li>':''}
               ${datos.fiesta[tarjeta.id].piscina?'<li class="s4">Piscina</li>':''}${datos.fiesta[tarjeta.id].gastronomia?'<li class="s4">Gastronomía</li>':''}${datos.fiesta[tarjeta.id].entretenimiento?'<li class="s4">Entretenimiento</li>':''}`
               costo.innerHTML=`${datos.fiesta[tarjeta.id].precio!==0? "$"+datos.fiesta[tarjeta.id].precio:"Precio a convenir."}`                  
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
   fetch('/api/fiesta/mostrar',data)
   .then((resp)=>{        
    return resp.json();
    })

   .then(data=>{      
      //flayer.src=document.location.origin+data.setup.pro_flayer;
      //console.log(data);
      datos=data;
      if (data.fiesta.length>0)
         {
             let imagen_path="";
             contenedor2.innerHTML="";
             data.fiesta.forEach((element,index) => 
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
                               <p><i>${element.nota}</i></p>
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
                   console.error('Error:__',error+"__")
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