const moment = require('../node_modules/moment/moment')


var idOrigem = undefined
var idDestino = undefined
var idClients = []
var idProduto = undefined
var idVeiculo = undefined
var idPiloto = undefined
var dataVoo = undefined
var valorVoo = undefined
var duracaoVoo = undefined


// Produtos
let productsLoaded = false
function loadProducts() {
    if (!productsLoaded) {
        productsLoaded = true
        ipcRenderer.send('list-products')
    }
}

ipcRenderer.on("list-products", (ev, data) => {
    data.forEach(p => {
        let el = document.createElement('option')
        el.innerHTML = p._nome
        el.value = p._id
        document.getElementById('tipoVoo').appendChild(el)
    })
})

function selectProduct() {
    let value = parseInt($('#tipoVoo :selected').val())
    if (!isNaN(value))
        idProduto = value
    else
        idProduto = undefined
}


// Aeroporto origem
function findAeroportoOrigem(){
    let aeroportoOrigem = document.getElementById('aeroportoOrigem')
    ipcRenderer.send('update-aeroporto-origem', aeroportoOrigem.value)
}

ipcRenderer.on('update-aeroporto-origem', function(event, data){

    let aeroportoOrigem = data[0]
    if(aeroportoOrigem){
        document.getElementById("origem-encontrado").style.display = "block"
        document.getElementById("origem-encontrado").innerHTML = `<p onclick='defineAeroportoOrigem()'> ${aeroportoOrigem._nome} </p>`
    }
    else if(data == ""){
        document.getElementById("origem-encontrado").style.display = "none";
    }
    else{
        document.getElementById("origem-encontrado").style.display = "block";
        document.getElementById("origem-encontrado").innerHTML = "<p> Aeroporto não encontrado</p>"
    }
});

function defineAeroportoOrigem(){
    ipcRenderer.send('define-aeroporto-origem')
}

ipcRenderer.on('define-aeroporto-origem', function(event, listAeroportosOrigem){
    let formAeroportoOrigem = document.getElementById("aeroportoOrigem")
    formAeroportoOrigem.value = listAeroportosOrigem[0]._nome
    idOrigem = listAeroportosOrigem[0]._id
    document.getElementById("origem-encontrado").style.display = "none"
});


// Aeroporto destino
function findAeroportoDestino(){
    let aeroportoDestino = document.getElementById('aeroportoDestino')
    ipcRenderer.send('update-aeroporto-destino', aeroportoDestino.value)
}

ipcRenderer.on('update-aeroporto-destino', function(event, data){

    let aeroportoDestino = data[0]
    if(aeroportoDestino){
        document.getElementById("destino-encontrado").style.display = "block"
        document.getElementById("destino-encontrado").innerHTML = `<p onclick='defineAeroportoDestino()'> ${aeroportoDestino._nome} </p>`
    }
    else if(data == ""){
        document.getElementById("destino-encontrado").style.display = "none"
    }
    else{
        document.getElementById("destino-encontrado").style.display = "block"
        document.getElementById("destino-encontrado").innerHTML = "<p> Aeroporto não encontrado</p>"
    }
});

function defineAeroportoDestino(){
    ipcRenderer.send('define-aeroporto-destino')
}

ipcRenderer.on('define-aeroporto-destino', function(event, listAeroportosDestino){
    let formAeroportoDestino = document.getElementById("aeroportoDestino")
    formAeroportoDestino.value = listAeroportosDestino[0]._nome
    idDestino = listAeroportosDestino[0]._id
    document.getElementById("destino-encontrado").style.display = "none"
});


// Piloto
function listPilots() {
    ipcRenderer.send('list-pilots', dataVoo)
}

ipcRenderer.on('list-pilots', (ev, data) => {
    const select = $('#piloto')

    select.prop('open', (i, val) => {
        if (!val) {
            select.empty().append('<option selected disabled>Selecione um piloto</option>')
            data.forEach(p => {
                let el = $(`<option value="${p._cpf}">${p._nome}</option>`)
                select.append(el)
            })
        }
        return !val
    })
})

function selectPilot() {
    let value = $('#piloto :selected').val()
    idPiloto = value
}


// Data e hora
function updateDate() {
    let m = moment($('#dataEmbarque').val() + ' ' +
                   $('#horaPartida').val(), 'DD/MM/YYYY hh:mm')
    if (m.isValid())
        dataVoo = m.toDate()
    else
        dataVoo = undefined

    $('#piloto').empty().append('<option selected disabled>Selecione um piloto</option>')
    idPiloto = undefined
    $('#veiculo').empty().append('<option selected disabled>Selecione um veículo</option>')
    idVeiculo = undefined
    
}


// Valor voo
function updateValor() {
    let v = parseFloat($('#valorVenda').val()
                                       .replaceAll('.', '')
                                       .replace(',','.'))
    if (isNaN(v))
        valorVoo = undefined
    else
        valorVoo = v
}


// Veiculos
function listVehicles() {
    ipcRenderer.send('list-vehicles', dataVoo)
}

ipcRenderer.on('list-vehicles', (ev, data) => {
    const select = $('#veiculo')

    select.prop('open', (i, val) => {
        if (!val) {
            select.empty().append('<option selected disabled>Selecione um veículo</option>')
            data.forEach(p => {
                let el = $(`<option value="${p._id}">${p._nome}</option>`)
                select.append(el)
            })
        }
        return !val
    })
})

function selectVehicle() {
    let value = parseInt($('#veiculo :selected').val())
    if (!isNaN(value))
        idVeiculo = value
    else
        idVeiculo = undefined
}


// Clientes
function findClient(){
    let cpf = $('#buscarCliente').val();
    ipcRenderer.send('update-client', cpf);
}

ipcRenderer.on('update-client', function(event, data){
    let client = data[0];
    let cpf = data[1];
    if(client){
        document.getElementById("cpf-encontrado").style.display = "block";
        document.getElementById("cpf-encontrado").innerHTML = `<p onclick='defineClient()'> ${client._nome} </p>`;
    }
    else if(cpf == ""){
        document.getElementById("cpf-encontrado").style.display = "none";
    }
    else{
        document.getElementById("cpf-encontrado").style.display = "block";
        document.getElementById("cpf-encontrado").innerHTML = "<p> Cliente não encontrado</p>";
    }
});

function defineClient(){
    $('#cpf-encontrado').hide()
    $('#buscarCliente').val('')
    ipcRenderer.send('define-client')
}

function make_row_name(cpf) {
    return `row_${cpf}`
}

function removeClient(id) {
    document.getElementById(make_row_name(id)).remove()
    idClients = idClients.filter(cpf => cpf != id)
}

ipcRenderer.on('define-client', function(event, cliente){
    if (idClients.find(el => el == cliente._cpf) == undefined)
    {
        let row = $(`<tr id="${make_row_name(cliente._cpf)}">
                         <td scope="row">${cliente._nome}</td>
                         <td>${cliente._cpf}</td>
                         <td>${cliente._rg}</td>
                         <td>${cliente._telefone}</td>
                         <td>${cliente._endereco}</td>
                         <td onclick="removeClient('${cliente._cpf}')">
                            <i class="fas fa-times-circle"
                               aria-label="Opção para remover o passageiro"></i>
                         </td>
                     </tr>`)
        $('#clientsList').append(row)
        idClients.push(cliente._cpf)
    }
});


// Duracao
function updateDuracao() {
    let v = parseInt($('#duracao').val())
    if (!isNaN(v))
        duracaoVoo = v
    else
        duracaoVoo = undefined
}


// Cadastrar venda
function addOrder() {
    clearLastModalType()
    if (dataVoo == undefined)
        modalError('Data ou hora inválidos')
    if (idProduto == undefined)
        modalError('Produto inválido')
    if (idVeiculo == undefined)
        modalError('Veiculo inválido')
    if (idOrigem == undefined)
        modalError('Origem inválida')
    if (idDestino == undefined)
        modalError('Destino inválido')
    if (idPiloto == undefined)
        modalError('Piloto inválido')
    if (duracaoVoo == undefined)
        modalError('Duração inválida')
    if (idClients.length == 0)
        modalError('Nenhum cliente foi escolhido')
    
    if (!wasErrorModal())
        ipcRenderer.send('add-order', {
            idProduto, idOrigem, idDestino, idPiloto,
            idClients, idVeiculo, dataVoo, valorVoo, duracaoVoo
        })
}


function clearForm() {
    $('#dataEmbarque').val('')
    $('#horaPartida').val('')
    dataVoo = undefined
    $('#tipoVoo').empty().append('<option selected disabled>Selecione um produto</option>')
    idProduto = undefined
    productsLoaded = false
    $('#veiculo').empty().append('<option selected disabled>Selecione um veículo</option>')
    idVeiculo = undefined
    $('#aeroportoOrigem').val('')
    idOrigem = undefined
    $('#aeroportoDestino').val('')
    idDestino = undefined
    $('#piloto').empty().append('<option selected disabled>Selecione um piloto</option>')
    idPiloto = undefined
    $('#buscarCliente').val('')
    $('#clientsList').empty()
    idClients = []
    $('#valorVenda').val('')
    valorVenda = undefined
    $('#duracao').val('')
    duracao = undefined
}

ipcRenderer.on('add-order', (ev, msg) => {
    if (msg == "OK") {
        modalMsg('Cadastrado com sucesso!')
        clearForm()
    }
    else
        modalError(msg)
})