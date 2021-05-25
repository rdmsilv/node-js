// docker ps
// docker exec -it 8fe64047533f mongo -u rudimarsilva -p ananda1902 --authenticationDatabase herois

// databases
// ==> show dbs

// mudando o contexto para uma database
// ==> use herois

// mostrar tabelas (coleções)
// ==> show collections


db.herois.find()
db.herois.find().pretty()

for(let i = 0; i <= 100000; i ++) {
    db.herois.insert({
        nome: `Clone - ${i}`,
        poder: 'Velocidade',
        dataNascimento: '1999-01-10'
    })
}

db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({ nome: -1 })
db.herois.find({}, { poder: 1, _id: 0})

//Create
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1999-01-10'
})

//Read
db.herois.find()

//Update
db.herois.update({ _id:ObjectId("609464d6151590acb21f9ffb") },
                { nome: 'Munher Maravinha'})

db.herois.update({ _id:ObjectId("609464d6151590acb21f9ffb") },
                { $set: { nome: 'Lanterna Verde'}})

db.herois.update({ poder: 'Velocidade' },
                { $set: { poder: 'Super Força'}})

//Delete
db.herois.remove()
db.herois.remove({})
