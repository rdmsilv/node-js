/*
    0 - Obter um usuário
    1 - Obter o número de telefone de um usuário a partir de seu ID
    2 - Obter o endereço do usuário pelo ID
*/
// importamos um módulo interno node.js 
 const util = require('util')
 const obterEnderecoAsync = util.promisify(obterEndereco)

function obterUsuario() {
    // quando der algum problema -> Reject(ERROR)
    // quando sucesso -> RESOLVER
    return new Promise(function resolverPromise(resolve, reject) {
        setTimeout(() => {
           // return reject(new Error('Deu Ruim de Verdade!'))

            return resolve({
                id: 1,
                nome: 'Rudimar',
                dataNascimento: new Date()
            })
        }, 1000)
    })
}

function obterTelefone(idUsuario) {
    return new Promise(function resolverPromise(resolve, reject){
        setTimeout(() => {
            return(null, {
                telefone: '92345-6789',
                ddd: 11
            })
        }, 2000)
    })
 

}

function obterEndereco(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            rua: 'sei lá',
            numero: 0
        })
    }, 2000);
}

// 1º Passo adicionar a palavra async -> automaticamente ela retornará uma Promise.
main()
async function main() {
    try {
        console.time('medida-promise')
        const usuario = await obterUsuario()
      /*   const telefone = await obterTelefone(usuario.id)
        const endereco = await obterEnderecoAsync(usuario.id) */
        const resultado = await Promise.all([
            obterTelefone(usuario.id),
            obterEnderecoAsync(usuario.id)
        ])
        const telefone = [1]
        const endereco = [0]

        console.log(`
            Nome: ${usuario.nome}
            Telefone: (${telefone.ddd}) - ${telefone.telefone},
            Endereço: ${endereco.rua} - ${endereco.numero}
        `)
        console.timeEnd('medida-promise')
    }catch (error) {
        console.error('Deu Ruim', error);
    }
}

/* const usuarioPromise = obterUsuario()
// para manibular o sucesso usamos a função .then
// para manibular o erros usamos a função .catch

usuarioPromise
    .then(function (usuario) {
        return obterTelefone(usuario.id)
            .then(function resolverTelefone(result) {
                return {
                    usuario: {
                        nome: usuario.nome,
                        id: usuario.id
                    },
                    telefone: result
                }
            })
    })

    .then(function (resultado) {
        const endereco = obterEnderecoAsync(resultado.usuario.id)
        return endereco.then(function resolverEndereco(result) {
            return {
                usuario: resultado.usuario,
                telefone: resultado.telefone,
                endereco: result
            }
        })
    })

    .then(function(resultado) {
        console.log(`
            Nome : ${resultado.usuario.nome}
            Endereço: ${resultado.endereco.rua} - ${resultado.endereco.numero}
            Telefone: (${resultado.telefone.ddd}) ${resultado.telefone.telefone}
        `)
    })
    .catch(function (error) {
        console.log('Deu Ruim', error)
    }) */

/* obterUsuario(function resolverUsuario(error, usuario) {
    if (error) {
        console.error('DEU RUIM em USUÁRIO', error)
        return;
    }
    obterTelefone(usuario.id, function resolverTelefone(error1, telefone) {
        if (error1) {
            console.error('DEU RUIM em TELEFONE', error)
            return;
        }
        obterEndereco(usuario.id, function resolverEndereco(error2, endereco){
            if (error2) {
                console.error('DEU RUIM em ENDEREÇO', error)
                return;
            }

            console.log(`
                Nome: ${usuario.nome},
                Endereço: ${endereco.rua} - ${endereco.numero},
                Telefone: (${telefone.ddd}) ${telefone.telefone}
            `)
        })
    })
}) */

/*
*   const usuario = obterUsuario()
    const telefone = obterTelefone(usuario.id)

    cosole.log('usuario', usuario)
    cosole.log('telefone', telefone)
 */
 