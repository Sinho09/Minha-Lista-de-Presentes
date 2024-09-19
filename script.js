import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBn8X2IrFqd8CohEaXVnUBP-kOHhWs_BQk",
    authDomain: "site-de-lista-de-presentes.firebaseapp.com",
    databaseURL: "https://site-de-lista-de-presentes-default-rtdb.firebaseio.com/",
    projectId: "site-de-lista-de-presentes",
    storageBucket: "site-de-lista-de-presentes.appspot.com",
    messagingSenderId: "973927838611",
    appId: "1:973927838611:web:496b79587e1342132d6e66"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Tornar as funções do Firebase disponíveis globalmente
window.database = database;
window.ref = ref;
window.set = set;
window.get = get;

// Variável para controlar o modo de seleção
let modoSelecao = false;

// Função para alternar o modo de seleção de presente
function toggleModoSelecao() {
    modoSelecao = !modoSelecao;
    const botao = document.getElementById('selecionarPresente');
    botao.textContent = modoSelecao ? 'Sair do Modo Seleção' : 'Selecionar Presente';
}

window.toggleModoSelecao = toggleModoSelecao; // Tornar a função global

// Função para marcar ou desmarcar um presente como comprado
function marcarComprado(item) {
    if (modoSelecao) {
        const id = item.id;
        const link = item.querySelector('.botao-compra');

        if (item.classList.contains('comprado')) {
            if (confirm('Deseja reverter o status deste presente para disponível?')) {
                item.classList.remove('comprado');
                link.textContent = 'Comprar Presente';
                salvarEstado(id, false); // Atualiza o Firebase para não comprado
            }
        } else {
            if (confirm('Confirma a compra deste presente?')) {
                item.classList.add('comprado');
                link.textContent = 'Presente já foi comprado';
                salvarEstado(id, true); // Salva no Firebase como comprado
                toggleModoSelecao(); // Sai do modo de seleção
            }
        }
    }
}

window.marcarComprado = marcarComprado; // Tornar a função global

// Função para salvar o estado (presente comprado ou não) no Firebase
function salvarEstado(id, comprado) {
    const dbRef = ref(database, 'presentes/' + id);
    set(dbRef, {
        comprado: comprado
    }).then(() => {
        console.log('Estado salvo com sucesso');
    }).catch((error) => {
        console.error('Erro ao salvar estado: ', error);
    });
}

// Função para carregar o estado dos presentes do Firebase ao iniciar a página
function carregarEstado() {
    const dbRef = ref(database, 'presentes');
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const id = childSnapshot.key;
                const comprado = childSnapshot.val().comprado;

                const item = document.getElementById(id);
                if (item) {
                    const link = item.querySelector('.botao-compra');
                    if (comprado) {
                        item.classList.add('comprado');
                        link.textContent = 'Presente já foi comprado';
                    } else {
                        item.classList.remove('comprado');
                        link.textContent = 'Comprar Presente';
                    }
                }
            });
        } else {
            console.log('Nenhum dado encontrado');
        }
    }).catch((error) => {
        console.error('Erro ao carregar estado: ', error);
    });
}

window.carregarEstado = carregarEstado; // Opcional, caso queira chamar globalmente

// Função para abrir o pop-up de tutorial
function abrirPopup() {
    const popup = document.querySelector('.popup');
    popup.style.display = 'flex';
}

// Função para fechar o pop-up de tutorial
function fecharPopup() {
    const popup = document.querySelector('.popup');
    popup.style.display = 'none';
}

window.abrirPopup = abrirPopup; // Tornar a função global
window.fecharPopup = fecharPopup; // Tornar a função global

// Carrega o estado dos presentes ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarEstado();

    // Exibe o pop-up de tutorial ao carregar a página
    abrirPopup();
});

// Adiciona o evento de fechamento do pop-up ao clicar no botão "Entendi!"
document.querySelector('.popup-content button').addEventListener('click', fecharPopup);

// Adiciona o evento de fechamento do pop-up ao clicar no ícone de fechar
document.querySelector('.close').addEventListener('click', fecharPopup);
