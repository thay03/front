document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/api';
    const gameModal = document.getElementById('gameModal');
    const gameForm = document.getElementById('gameForm');
    const addGameBtn = document.getElementById('addGameBtn');
    const modalTitleGame = document.getElementById('modalTitleGame');
    let editGameId = null;

    // Função para carregar plantações
    const loadGames = async () => {
        const response = await fetch(`${apiUrl}/games`);
        const games = await response.json();
        const tableBody = document.querySelector('#gamesTable tbody');
        tableBody.innerHTML = '';

        games.forEach(game => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${game.name}</td>
                <td>${game.description}</td>
                <td>${game.responsible ? game.responsible.name : 'N/A'}</td>
                <td>
                    <button class="editGameBtn" data-id="${game._id}">Editar</button>
                    <button class="deleteGameBtn" data-id="${game._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar eventos de edição e deleção
        document.querySelectorAll('.editGameBtn').forEach(button => {
            button.addEventListener('click', (e) => openEditGameModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deleteGameBtn').forEach(button => {
            button.addEventListener('click', (e) => deleteGame(e.target.dataset.id));
        });
    };

    // Função para adicionar jogo
    const addGame = async (game) => {
        await fetch(`${apiUrl}/games`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(game)
        });
        loadGames();
    };

    // Função para atualizar jogo
    const updateGame = async (id, game) => {
        await fetch(`${apiUrl}/games/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(game)
        });
        loadGames();
    };

    // Função para deletar 
    const deleteGame = async (id) => {
        await fetch(`${apiUrl}/games/${id}`, {
            method: 'DELETE'
        });
        loadGames();
    };

    // Abrir modal para editar 
    const openEditGameModal = async (id) => {
        editGameId = id;
        modalTitleGame.innerText = 'Editar Jogo';

        // Buscar os dados para preencher o modal
        const response = await fetch(`${apiUrl}/games/${id}`);
        if (response.status === 404) {
            console.error('Jogo não encontrada');
            return;
        }
        const game = await response.json();

        document.getElementById('nameGame').value = game.name;
        document.getElementById('description').value = game.description;
        await loadcreators(game.responsible ? game.responsible._id : null);

        gameModal.style.display = 'block';
    };

    // Abrir modal para adicionar nova jogo
    const openAddGameModal = async () => {
        editGameId = null;
        modalTitleGame.innerText = 'Adicionar Jogo';
        gameForm.reset();
        await loadcreators(); // Carrega os usuários sem pré-selecionar nenhum
        gameModal.style.display = 'block';
    };
// Carregar usuários para o select de responsável
const loadcreators = async (selectedUserId = null) => {
    try {
        const response = await fetch(`${apiUrl}/users`);
        const users = await response.json();
        const select = document.getElementById('responsible');
        select.innerHTML = ''; // Limpa o select

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user._id;
            option.textContent = user.name;
            if (user._id === selectedUserId) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar criadores:', error);
    }
};

// Fechar modal ao clicar no "x"
document.querySelector('.close').addEventListener('click', () => {
    gameModal.style.display = 'none';
});

// Fechar modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === gameModal) {
        gameModal.style.display = 'none';
    }
});

// Submissão do formulário
gameForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const gameData = {
        name: document.getElementById('nameGame').value,
        description: document.getElementById('description').value,
        responsible: document.getElementById('responsible').value
    };

    try {
        if (editGameId) {
            await updateGame(editGameId, gameData);
        } else {
            await addGame(gameData);
        }

        gameModal.style.display = 'none';
        loadGames();
    } catch (error) {
        console.error('Erro ao salvar jogo:', error);
    }
});

// Inicialização dos eventos e carregamento dos dados
addGameBtn.addEventListener('click', openAddGameModal);
loadGames();
});
