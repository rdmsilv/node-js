const { obterPesssoas } = require('./service')

/*

const item = {
     nome: 'Rudimar',
     idade: 29,
 }

 const { nome, idade } = item
 cosole.log(nome, idade)
*/
Array.prototype.meuFilter = function (callback) {
    const lista = []
    for( index in this) {
        const item = this[index]
        const result = callback(item, index, this)
        // 0, "", null, underfined === false
        if (!result) continue;
        lista.push(item)
    }
    return lista;
}

async function main(){
    try {
        const { 
            results 
        } = await obterPesssoas(`a`)

     /*    const familiaLars = results.filter(function (item) {
            // por padrão precisa retonar um booleano
            // para informar se deve manter ou remover da lista
            // false > remove da lista
            //true > mantem
            //não encontrou = -1
            //encontrou = posição no Array
            const result = item.name.toLowerCase().indexOf(`lars`) !== -1
            return result
        }) */
        const familiaLars = results.meuFilter((item, index, lista) => {
            console.log(`index: ${index}`, lista.length)
           return item.name.toLowerCase().indexOf('lars') !== -1
        })
               

        const names = familiaLars.map(( pessoa ) => pessoa.name)
        console.log(names);

    } catch (error) {
        console.error('DEU RUIM', error);
    }
} 

main()
