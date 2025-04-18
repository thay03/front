document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/api';
    const directorModal = document.getElementById('directorModal');
    const directorForm = document.getElementById('directorForm');
    const addDirectorBtn = document.getElementById('addDirectorBtn');
    const modalTitle = document.getElementById('modalTitle');
    let editDirectorId = null;

    // Função para carregar 
    const loadDirectors = async () => {
        const response = await fetch(`${apiUrl}/directors`);
        const directors = await response.json();
        const tableBody = document.querySelector('#directorsTable tbody');
        tableBody.innerHTML = '';

        directors.forEach(director => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${director.name}</td>
                <td>${director.profile}</td>
                <td>
                    <button class="editDirectorBtn" data-id="${director._id}">Editar</button>
                    <button class="deleteDirectorBtn" data-id="${director._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar eventos de edição e deleção
        document.querySelectorAll('.editDirectorBtn').forEach(button => {
            button.addEventListener('click', (e) => openEditDirectorModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deleteDirectorBtn').forEach(button => {
            button.addEventListener('click', (e) => deleteDirector(e.target.dataset.id));
        });
    };

    // Função para adicionar usuário
    const addDirector = async (director) => {
        await fetch(`${apiUrl}/directors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(director)
        });
        loadDirectors();
    };

    // Função para atualizar usuário
    const updateDirector = async (id, director) => {
        await fetch(`${apiUrl}/directors/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(director)
        });
        loadDirectors();
    };

    // Função para deletar usuário
    const deleteDirector = async (id) => {
        await fetch(`${apiUrl}/directors/${id}`, {
            method: 'DELETE'
        });
        loadDirectors();
    };

    // Abrir modal para editar usuário
    const openEditDirectorModal = async (id) => {
        editDirectorId = id;
        modalTitle.innerText = 'Editar Diretor';

        // Buscar os dados para preencher o modal
        const response = await fetch(`${apiUrl}/directors/${id}`);
        const director = await response.json();


        document.getElementById('name').value = director.name;
        directorModal.style.display = 'block';
    };

    // Abrir modal para adicionar novo diretor
    const openAddDirectorModal = () => {
        editDirectorId = null;
        modalTitle.innerText = 'Adicionar Criador';
        directorForm.reset();
        directorModal.style.display = 'block';
    };

    // Fechar modal ao clicar no "x"
    document.querySelector('.close-director').addEventListener('click', () => {
        directorModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === directorModal) {
            directorModal.style.display = 'none';
        }
    });

    // Submissão do formulário
    directorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const directorData = {
            name: document.getElementById('name').value,
        };

        if (editDirectorId) {
            await updateDirector(editDirectorId, directorData);
        } else {
            await addDirector(directorData);
        }

        directorModal.style.display = 'none';
        loadDirectors();
    });

    // Inicializando o carregamento de usuários e eventos
    addDirectorBtn.addEventListener('click', openAddDirectorModal);
    loadDirectors();
});
