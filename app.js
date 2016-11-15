//Espress - Backend
var express = require('express')
var app = express()
app.use(express.static('public'))

//Ejs - Frontend
app.set('view engine', 'ejs')



//================================================================== PAGINA INICIO ===============================================================

app.get('/Inicio', function(req, res) {
var Contactos = []
var db = new sqlite3.Database("Contactos.sqlite3")

res.render('index', {Contactos:Contactos})

db.close();
})


//Sqlite3 - BDD

var sqlite3 = require('sqlite3').verbose()


//================================================================== FUNCION AGREGAR ===============================================================
//app.get('/Agregar', function(req, res) {
//res.render('agregar', { })
//})


//================================================================== FUNCION ELIMINAR ===============================================================
app.get('/Eliminar', function(req, res) {
var Contactos = []
var db = new sqlite3.Database("Contactos.sqlite3")

        var stmt = db.prepare("DELETE FROM Contactos WHERE Nombre = ?")
        stmt.run(req.query.Nombre)
        stmt.finalize()

	db.all("select * from Contactos;", function(err, rows)
	{  
	rows.forEach(function (row) {
	Contactos.push([row.Nombre, row.Correo, row.Telefono, row.Identidad, row.Direccion])
	})

       var updateStatement = db.prepare("UPDATE Contactos SET Nombre = ?, Telefono = ?, Direccion = ?, Identidad = ?, Direccion = ?")
       	
       updateStatement.finalize()
       

res.render('eliminar', { Contactos: Contactos })
});

db.close();
});

//================================================================== FUNCION BUSCAR ===============================================================
app.get('/Buscar', function(req, res) {
var Contactos = []
var Resultados=[]
var db = new sqlite3.Database("Contactos.sqlite3")
	if(req.query.Nombre){
	 var params={$nombre:'%'+req.query.Nombre+'%'}
         console.log(params)
	 db.all("SELECT * FROM Contactos WHERE Nombre like $nombre",params,function(err,rows){
		Resultados=rows
		res.render('buscar', {Resultados:Resultados,query:req.query })		
	 })	
	
	}else{
		res.render('buscar',{query:req.query,Resultados:null});	
	}
db.close();
});


//================================================================== FUNCION MOSTRAR ===============================================================

app.get('/Mostrar', function(req, res) {
var Contactos = []
var db = new sqlite3.Database("Contactos.sqlite3")

	db.all("select * from Contactos;", function(err, rows)
	{  
	rows.forEach(function (row) {
	Contactos.push([row.Nombre, row.Correo, row.Telefono, row.Identidad, row.Direccion])
	})


res.render('mostrar', { Contactos: Contactos })
});
db.close();
});


//================================================================== FUNCION EDITAR ===============================================================

app.get('/Editar', function(req, res) {
var Contactos = []
var db = new sqlite3.Database("Contactos.sqlite3")


	var updateStatement = db.prepare("UPDATE Contactos SET Nombre = ? WHERE Nombre = ?")
        var updateStatementC = db.prepare("UPDATE Contactos SET Correo = ? WHERE Correo = ?")
        var updateStatementT = db.prepare("UPDATE Contactos SET Telefono = ? WHERE Telefono = ?")
        var updateStatementI = db.prepare("UPDATE Contactos SET Identidad = ? WHERE Identidad = ?")
        var updateStatementD = db.prepare("UPDATE Contactos SET Direccion = ? WHERE Direccion = ?")
       	
        updateStatement.run(req.query.Nombre1, req.query.Nombre)
        updateStatementC.run(req.query.Correo1, req.query.Correo)
        updateStatementT.run(req.query.Telefono1, req.query.Telefono)
        updateStatementI.run(req.query.Identidad1, req.query.Identidad)  
        updateStatementD.run(req.query.Direccion1, req.query.Direccion) 
        

        updateStatement.finalize()
        updateStatementC.finalize()
        updateStatementT.finalize()
        updateStatementI.finalize()
        updateStatementD.finalize()

	db.all("select * from Contactos;", function(err, rows)
	{  
	rows.forEach(function (row) {
	Contactos.push([row.Nombre, row.Correo, row.Telefono, row.Identidad, row.Direccion])
	})


res.render('editar', { Contactos: Contactos })
});
db.close();
});


//================================================================== FUNCION AGREGAR ===============================================================


app.get('/Agregar', function(req, res) {

var db = new sqlite3.Database("Contactos.sqlite3")
db.serialize(function() {

var stmt = db.prepare("INSERT INTO Contactos VALUES (?,?,?,?,?)")
stmt.run(req.query.Nombre,req.query.Correo,req.query.Telefono,req.query.Identidad,req.query.Direccion)
stmt.finalize()
   
var Contactos = []
	db.all("select * from Contactos;", function(err, rows)
	{
		rows.forEach(function (row) {  
			Contactos.push([req.query.Nombre,req.query.Correo,req.query.Telefono,req.query.Identidad,req.query.Direccion])
		})
		res.render('agregar', {Contactos:Contactos})
	

});
});

db.close();

})




app.listen(8000)
