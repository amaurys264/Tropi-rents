const express=require('express');
const server=express();
const puerto=process.env.port||3002;


server.set('view engine','ejs');
server.set('views',__dirname + '/views')

server.use
(
    express.static(__dirname+'/public')
)
server.use('/',require('./rutas/rutas_primarias'));


/*server.post('/api/casas',upload.single('imagenes'),(req,res,next)=>
    {
        console.log("formulario recibido#1")
        console.log(req.head);       
        console.log(req.body);
        res.end()
    })*/


server.listen(
    puerto,(red,res)=>
    {
        console.log("Servidor a la escucha!")
        
    }
)




