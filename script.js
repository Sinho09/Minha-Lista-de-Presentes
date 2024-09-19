let modoSelecao = false;

// Função para alternar o modo de seleção de presente
function toggleModoSelecao() {
    modoSelecao = !modoSelecao;
    const botao = document.getElementById('selecionarPresente');
    botao.textContent = modoSelecao ? 'Sair do Modo Seleção' : 'Selecionar Presente';
}

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
                toggleModoSelecao();
            }
        }
    }
}

function salvarEstado(id, comprado) {
    const dbRef = ref(window.database, 'presentes/' + id);
    set(dbRef, {
        comprado: comprado
    }).then(() => {
        console.log('Estado salvo com sucesso');
    }).catch((error) => {
        console.error('Erro ao salvar estado: ', error);
    });
}

function carregarEstado() {
    const dbRef = ref(window.database, 'presentes');
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

// Carrega o estado dos presentes ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarEstado);
