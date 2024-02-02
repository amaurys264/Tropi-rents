var hideshow=document.getElementById('hideshow');
var navegacion=document.getElementById('navegacion');
var vista=2;

var botonera=document.getElementById('botonera');

hideshow.onclick=function()
{
   
    vista=3-vista;
    if(vista===1)
        {
            navegacion.style.display="flex";
        }
     else
        {
            navegacion.style.display="none";
        }   
}


botonera.addEventListener('input',(e)=>
    {
        let galeria=document.querySelectorAll('.c_slider > img');
    
        
        galeria.forEach((element,index) => {
            if(index==e.target.id)
                {
                    element.className="casa_imagen";
                }
                else
                {
                    element.className="casa_imagen2";
                }
        });
    }
)