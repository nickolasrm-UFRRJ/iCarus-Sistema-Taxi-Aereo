import 'dotenv/config'
import Controle from "../backend/src/Controle";
import Cliente from "../backend/src/modelo/Cliente";
import Aeroporto from "../backend/src/modelo/Aeroporto";
import Piloto from "../backend/src/modelo/Piloto";

var controle = new Controle();

console.log(controle.login("root", "12345678"))
controle.adicionarCliente("111.111.111-11", "11.111.111-1", "Nickolas", "end-Nickolas", "tel-Nickolas", false);
controle.adicionarCliente("111.222.222-22", "11.222.222-2", "Natalia", "end-Natalia", "tel-Natalia", false);
controle.adicionarAeroporto("Santos Dumont", "Rio de janeiro", "RJ");
controle.adicionarAeroporto("Guarulhos", "Sao Paulo", "SP");
controle.adicionarProduto('Salto de paraquedas');
controle.adicionarPiloto("111.333.333-33", "11.333.333-3", "Julia", "Rua Teste", "661",
  1500, new Date(), "12345", "12345");
controle.adicionarVeiculo('Boeing 747')

controle.adicionarVendedor("111.444.444-44", "11.444.444-4", "Julia", "Rua Teste", "661",
  1500, new Date(), "12345");
controle.login("111.444.444-44", "12345")

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

