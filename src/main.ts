import 'dotenv/config'
import Controle from "../backend/src/Controle";
import Cliente from "../backend/src/modelo/Cliente";
import Aeroporto from "../backend/src/modelo/Aeroporto";
import Piloto from "../backend/src/modelo/Piloto";

var controle = new Controle();

console.log(controle.login("root", "12345678"))
controle.adicionarCliente("111.111.111-11", "11.111.111-1", "Nickolas", "end-Nickolas", "tel-Nickolas", false); // adicionado na venda com id 0
controle.adicionarCliente("111.222.222-22", "11.222.222-2", "Natalia", "end-Natalia", "tel-Natalia", false); // adicionado na venda com id 0
controle.adicionarAeroporto("Santos Dumont", "Rio de janeiro", "RJ"); // adicionado na venda com id 0
controle.adicionarAeroporto("Guarulhos", "Sao Paulo", "SP"); // adicionado na venda com id 0
controle.adicionarProduto('Salto de paraquedas'); // adicionado na venda com id 0
controle.adicionarPiloto("111.333.333-33", "11.333.333-3", "Julia", "Rua Teste", "661",
  1500, new Date(), "12345", "12345");
controle.adicionarVeiculo('Boeing 747') // adicionado na venda com id 0

controle.adicionarVendedor("111.444.444-44", "11.444.444-4", "Julia", "Rua Teste", "661",
  1500, new Date(), "12345");
controle.login("111.444.444-44", "12345")

let date = new Date('2021-12-21T10:00:00')
let origin = controle.buscarAeroporto(
  controle.listarAeroportos('', '', '')[0].id).id
let destino = controle.buscarAeroporto(
  controle.listarAeroportos('', '', '')[1].id).id

let cpfsClentes : Array<string> = ["111.111.111-11", "111.222.222-22"]

console.log(controle.adicionarVenda(date, origin, destino, 100, 100, controle.buscarVeiculo(
  controle.listarVeiculosDisponiveis(new Date())[0].id).id, controle.buscarProduto(controle.listarProdutos()[0].id).id, cpfsClentes, "111.333.333-33" ) )

//console.log("Aeroporto:",controle.listarAeroportos("Guarulho","",""));

var cliente: Cliente;
var listAeroportos: Array<Aeroporto>;

import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

var mainWindow: BrowserWindow;

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      plugins: true
    }
  });

  await mainWindow.loadFile("../../static/venda.html");
  mainWindow.webContents.openDevTools();

  ipcMain.on('update-aeroporto-origem', function (event, data) {
    listAeroportos = controle.listarAeroportos(data, "", "");
    mainWindow.webContents.send('update-aeroporto-origem', listAeroportos);
  });

  ipcMain.on('define-aeroporto-origem', function (event, data) {
    mainWindow.webContents.send('define-aeroporto-origem', listAeroportos);
  });

  ipcMain.on('update-aeroporto-destino', function (event, data) {
    listAeroportos = controle.listarAeroportos(data, "", "");
    mainWindow.webContents.send('update-aeroporto-destino', listAeroportos);
  });

  ipcMain.on('define-aeroporto-destino', function (event, data) {
    mainWindow.webContents.send('define-aeroporto-destino', listAeroportos);
  });

  ipcMain.on('list-products', (event, data) => {
    let listProdutos = controle.listarProdutos()
    mainWindow.webContents.send('list-products', listProdutos)
  });

  ipcMain.on('list-pilots', (ev, data) => {
    let lst = controle.listarPilotosDisponiveis(data)
    mainWindow.webContents.send('list-pilots', lst)
  })

  ipcMain.on('list-vehicles', (ev, data) => {
    let lst = controle.listarVeiculosDisponiveis(data)
    mainWindow.webContents.send('list-vehicles', lst)
  })

  ipcMain.on('update-client', function (event, data) {
    cliente = controle.buscarCliente(data);
    mainWindow.webContents.send('update-client', [cliente, data]);
  })

  ipcMain.on('define-client', function (event, data) {
    mainWindow.webContents.send('define-client', cliente);
  });

  ipcMain.on('add-order', (ev, data) => {
    let msg = controle.adicionarVenda(data.dataVoo, data.idOrigem, data.idDestino,
      data.valorVoo, data.duracaoVoo, data.idVeiculo, data.idProduto, data.idClients, data.idPiloto)
    mainWindow.webContents.send('add-order', msg)
  })
}

app.on("ready", () => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

