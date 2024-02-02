const express=require('express');
const router=express.Router();
const postgres=require('pg');
const multer  = require('multer');
const ip6=require('net');
const path = require('path');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/img/ofertas/')
    },
    filename: function (req, file, cb) {           
      cb(null, +parseInt(Math.random()*100000000)+".jpg")
    }
  })
const newupload = multer({ storage: storage })
//--------------------conneccion a elephant sql-------------------------------------\\
var conString = "postgres://zfgcmckh:QpXviRZLMhu2uuXUYJWrhCeuUarj2Ud-@motty.db.elephantsql.com/zfgcmckh" //Can be found in the Details page
var pool = new postgres.Client(conString);

//-----------------------------------------------------------------------------------//

 /*const pool = new postgres.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'renta',
  password: 'Admin',
  port: 5432,
})*/

router.use('*',async(solicitud, respuesta, next) => {        
    if(solicitud.baseUrl=='/favicon.ico')   
    {
        
           if(solicitud.method=='GET') 
           {
                let tiempo= new Date();                
                let tiempo2=format_to_pg(tiempo);                            
                await pool.query(`insert into log(tipaccess,ipclient,fecha,num_tabla,base_url) values (1,'${solicitud.ip}','${tiempo2}',1,'${solicitud.baseUrl}')`)
                              
           }
    }       
    next()
  })
router.post('/api/casas/mostrar',express.json(),async (req,res)=>
    {
       
        let sqlquery='select * from inmueble';
        if (req.body.ubicacion_p!=='Na')
                {
                          sqlquery+=` where ubicacion_p='${req.body.ubicacion_p}'`
                }
        
                if(req.body.precio =='asc')
                 {
                    sqlquery+=` order by precio_ta asc`
                 }
                if(req.body.precio =='desc')
                 {
                    sqlquery+=` order by precio_ta desc`
                 }
        
        const resultado= await pool.query(sqlquery);        
        let imagenes= await pool.query(`select * from c_imagenes`);                      
        
        resultado.rows.forEach((indice1)=>
            {
                indice1.galeria=imagenes.rows.filter((indice2)=>
                    {
                        return indice1.nombre==indice2.owner;
                    }
                )
            }
        )        
        res.send({casas:resultado.rows});
    }
)
router.post('/api/piscina/mostrar',express.json(),async (req,res)=>
    {
        
        let sqlquery='select * from piscina';
        if (req.body.ubicacion_p!=='Na')
                {
                        sqlquery+=` where ubicacion_p='${req.body.ubicacion_p}'`
                }
        
                if(req.body.precio =='asc')
                 {
                    sqlquery+=` order by precio asc`
                 }
                if(req.body.precio =='desc')
                 {
                    sqlquery+=` order by precio desc`
                 }        
        const resultado= await pool.query(sqlquery);         
        let imagenes= await pool.query(`select * from p_imagenes`);                      
        
        resultado.rows.forEach((indice1)=>
            {
                indice1.galeria=imagenes.rows.filter((indice2)=>
                    {
                        return indice1.nombre==indice2.owner;
                    }
                )
            }
        )       
        res.send({piscina:resultado.rows});
    }
)
router.post('/api/fiesta/mostrar',express.json(),async (req,res)=>
    {
        let sqlquery='select * from fiesta';
        if (req.body.ubicacion_p!=='Na')
                {
                        sqlquery+=` where ubicacion_p='${req.body.ubicacion_p}'`
                }
        
                if(req.body.precio =='asc')
                 {
                    sqlquery+=` order by precio asc`
                 }
                if(req.body.precio =='desc')
                 {
                    sqlquery+=` order by precio desc`
                 }        
        const resultado= await pool.query(sqlquery);                
        let imagenes= await pool.query(`select * from f_imagenes`);                      
        
        resultado.rows.forEach((indice1)=>
            {
                indice1.galeria=imagenes.rows.filter((indice2)=>
                    {
                        return indice1.nombre==indice2.owner;
                    }
                )
            }
        )        
        res.send({fiesta:resultado.rows});
    }
)
router.post('/api/transporte/mostrar',express.json(),async (req,res)=>
    {
        let sqlquery='select * from transporte';       
        
                if(req.body.autonomia =='asc')
                 {
                    sqlquery+=` order by autonomia asc`
                 }
                if(req.body.autonomia =='desc')
                 {
                    sqlquery+=` order by autonomia desc`
                 }        
                
        const resultado= await pool.query(sqlquery);           
        let imagenes= await pool.query(`select * from t_imagenes`);                      
        
        resultado.rows.forEach((indice1)=>
            {
                indice1.galeria=imagenes.rows.filter((indice2)=>
                    {
                        return indice1.nombre==indice2.owner;
                    }
                )
            }
        )
        
        res.send({transporte:resultado.rows});
    }
)
router.get('/api/reporte',async (req,res)=>
    {
      
        const resultado= await pool.query('select count (distinct ipclient) from log');        
        res.send({reporte:{visitas:resultado.rows[0].count}});        
        res.end();
    }
)
router.get('/login',async (req,res)=>
    {   
       
        const filePath = path.resolve(__dirname, '../private/login.html');    
        res.sendFile(filePath);
    }
)
router.get('/login/c_form.html',(req,res)=>
    {    
        const filePath = path.resolve(__dirname, '../private/c_form.html');    
        res.sendFile(filePath);
    }
)
router.get('/login/p_form.html',(req,res)=>
    {    
        const filePath = path.resolve(__dirname, '../private/p_form.html');    
        res.sendFile(filePath);
    }
)
router.get('/login/f_form.html',(req,res)=>
    {    
        const filePath = path.resolve(__dirname, '../private/f_form.html');    
        res.sendFile(filePath);
    }    
)
router.get('/login/t_form.html',(req,res)=>
    {    
        const filePath = path.resolve(__dirname, '../private/t_form.html');    
        res.sendFile(filePath);
    }
)
router.get('/login/listado.html',(req,res)=>
    {    
        const filePath = path.resolve(__dirname, '../private/listado.html');    
        res.sendFile(filePath);
    }
)
router.get('/login/reporte.html',(req,res)=>
    {    
        const filePath = path.resolve(__dirname, '../private/reporte.html');    
        res.sendFile(filePath);
    }
)

router.post('/api/casas',newupload.array('imagenes'),async (req,res,next)=>
    {
        console.log("formulario recibido#1")
        let resultado1= await pool.query(`insert into inmueble (nombre,ubicacion_p,ubicacion_z,descripcion,precio_ta,precio_tb,telefono,fecha_creado,email,estado,posteado,piscina,cocina) values ('${req.body.nombre}','${req.body.ubicacion_p}','${req.body.ubicacion_z}','${req.body.descripcion}',${req.body.precio_ta}, 0,'+5354310877','19-12-2023','amaurys264@gmail.com','Disponible', true,${(req.body.piscina)?'true':'false'},${(req.body.cocina)?'true':'false'})`);          
        req.files.forEach(async(element) => {
            await pool.query(`insert into c_imagenes (path,nombre,owner) values ('${element.filename}','${element.originalname}','${req.body.nombre}')`);
        });      
        res.send("Informacion Recibida.")
    })
router.post('/api/pasadias',newupload.array('p_imagenes'),async (req,res,next)=>
    {
        console.log("formulario recibido#2")        
        let resultado1= await pool.query(`insert into piscina (nombre, ubicacion_p, ubicacion_z, horario_d, horario_n, capacidad, gastronomia, precio, notas, j_mesa, fecha, telefono,parrillada,habitaciones) values ('${req.body.p_nombre}','${req.body.p_ubicacion_p}','${req.body.p_ubicacion_z}',${(req.body.p_horario_d)?'true':'false'},${(req.body.p_horario_n)?'true':'false'},${req.body.p_capacidad},${(req.body.p_gastronomia)?'true':'false'},${req.body.p_precio},'${req.body.p_notas}',${(req.body.p_juegos)?'true':'false'},'19-12-2023','${req.body.p_telefono}',${(req.body.p_parrillada)?'true':'false'},${(req.body.p_habitaciones)?'true':'false'})`);                       
        req.files.forEach(async(element) => {
            await pool.query(`insert into p_imagenes (path,nombre,owner) values ('${element.filename}','${element.originalname}','${req.body.p_nombre}')`);
        });
       
        res.send("Informacion Recibida.")
    })
router.post('/api/fiesta',newupload.array('f_imagenes'),async (req,res,next)=>
    {
        console.log("formulario recibido#3")      
        let resultado1= await pool.query(`insert into fiesta (nombre, ubicacion_p, ubicacion_z, local, capacidad, horario_d, horario_n, decoracion, piscina, gastronomia, entretenimiento, e_audio, precio, fecha, nota) values ('${req.body.f_nombre}','${req.body. f_ubicacion_p}','${req.body.f_ubicacion_z}' ,'${req.body.f_local}' ,${req.body. f_capacidad},${(req.body. f_horacio_d)?'true':'false'},${(req.body. f_horario_n)?'true':'false'},${(req.body.f_decoracion)?'true':'false'},${(req.body.f_piscina)?'true':'false'},${(req.body.f_gastronomia)?'true':'false'},${(req.body.f_entretenimiento)?'true':'false'},${(req.body.f_audio)?'true':'false'},${req.body.f_precio},'4-1-2024','${req.body.f_nota}')`)
                                                           
        req.files.forEach(async(element) => {
            await pool.query(`insert into f_imagenes (path,nombre,owner) values ('${element.filename}','${element.originalname}','${req.body.f_nombre}')`);
        });       
        res.send("Informacion Recibida.")
    })
    
router.post('/api/transporte',newupload.array('t_imagenes'),async (req,res,next)=>
    {
        console.log("formulario recibido#4")
        let resultado1= await pool.query(`insert into transporte (nombre, modelo, capacidad, embrage, autonomia, nota, fecha) values ('${req.body.t_nombre}','${req.body.t_modelo}',${req.body.t_capacidad},'${req.body.t_embrague}',${req.body.t_autonomia},'${req.body.t_nota}','11-4-2024')`);          
        req.files.forEach(async(element) => {
            await pool.query(`insert into t_imagenes (path,nombre,owner) values ('${element.filename}','${element.originalname}','${req.body.t_nombre}')`);
        });  
        res.send("Informacion Recibida #4.")
    })     

router.post('/api/check',express.json(),async (solicitud,respuesta)=>
        {
          let resultado1
          if(!/['"`,:]/ .test(solicitud.body.data))
          {          
          switch (solicitud.body.hacer)          
          {              
           case 1:
                 resultado1= await pool.query(`SELECT COUNT(*) AS total FROM inmueble WHERE nombre = '${solicitud.body.data}'`);
                 break;
           case 2:
                 resultado1= await pool.query(`SELECT COUNT(*) AS total FROM piscina WHERE nombre = '${solicitud.body.data}'`);     
                 break;
           case 3:
                 resultado1= await pool.query(`SELECT COUNT(*) AS total FROM fiesta WHERE nombre = '${solicitud.body.data}'`);
                 break;
           case 4:
                 resultado1= await pool.query(`SELECT COUNT(*) AS total FROM transporte WHERE nombre = '${solicitud.body.data}'`);                 
                 break;
          }   
            respuesta.send({existe:resultado1.rows[0].total})
            respuesta.end();
        } 
        else
        {
            respuesta.send({existe:1})
            respuesta.end();
        }       
       }
    )
router.post('/login/access',urlencodedParser,(solicitud,respuesta)=>
    {

               
                if(solicitud.body.usuario=="Magnate" && solicitud.body.pass=="Lamismadesiempre")
                {
                    const filePath = path.resolve(__dirname, '../private/editor.html');                        
                    respuesta.sendFile(filePath);     
                     
                }
                else
                {
                    respuesta.send("Usuario o Contaseña no válido.Intentalo de nuevo!")
                    //respuesta.redirect('/login')  
                }                
        
    }
)    
router.delete('/api/all',express.json(),async (req,res,next)=>
    {       
        switch (req.body.canal)
        {
            case 1: 
                await pool.query(`DELETE FROM inmueble WHERE nombre='${req.body.campo_nombre}';`);          
                await pool.query(`DELETE FROM c_imagenes WHERE nombre='${req.body.campo_nombre}';`);            
                break;
            case 2: 
                await pool.query(`DELETE FROM piscina WHERE nombre='${req.body.campo_nombre}';`);          
                await pool.query(`DELETE FROM p_imagenes WHERE nombre='${req.body.campo_nombre}';`);            
                break;    
            case 3: 
                await pool.query(`DELETE FROM fiesta WHERE nombre='${req.body.campo_nombre}';`);          
                await pool.query(`DELETE FROM f_imagenes WHERE nombre='${req.body.campo_nombre}';`);            
                break;    
            case 4: 
                await pool.query(`DELETE FROM transporte WHERE nombre='${req.body.campo_nombre}';`);          
                await pool.query(`DELETE FROM t_imagenes WHERE nombre='${req.body.campo_nombre}';`);            
                break;                
        }        
        res.send({borrado: req.body.campo_nombre})
    })       
router.get("*",(req,res)=>
    {                 
        res.send("Error 404...Recurso no encontrado.")
    })

    function format_to_pg(tiempo)
    {   
        return(tiempo.getFullYear()+"-"+(tiempo.getMonth()+1)+"-"+tiempo.getDate()+" "+tiempo.getHours()+":"+tiempo.getMinutes()+":"+tiempo.getSeconds()+" -"+tiempo.getTimezoneOffset()/60);
    }

module.exports=router;
