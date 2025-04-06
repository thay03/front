document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/api';
    const creatorModal = document.getElementById('creatorModal');
    const creatorForm = document.getElementById('creatorForm');
    const addCreatorBtn = document.getElementById('addCreatorBtn');
    const modalTitle = document.getElementById('modalTitle');
    let editCreatorId = null;

    // Função para carregar usuários
    const loadCreators = async () => {
        const response = await fetch(`${apiUrl}/creators`);
        const creators = await response.json();
        const tableBody = document.querySelector('#creatorsTable tbody');
        tableBody.innerHTML = '';

        creators.forEach(creator => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${creator.name}</td>
                <td>${creator.profile}</td>
                <td>
                    <button class="editCreatorBtn" data-id="${creator._id}">Editar</button>
                    <button class="deletecreatorBtn" data-id="${creator._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar eventos de edição e deleção
        document.querySelectorAll('.editCreatorBtn').forEach(button => {
            button.addEventListener('click', (e) => openEditCreatorModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deleteCreatorBtn').forEach(button => {
            button.addEventListener('click', (e) => deleteCreator(e.target.dataset.id));
        });
    };

    // Função para adicionar usuário
    const addCreator = async (creator) => {
        await fetch(`${apiUrl}/creators`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(creator)
        });
        loadCreators();
    };

    // Função para atualizar usuário
    const updateCreator = async (id, creator) => {
        await fetch(`${apiUrl}/creators/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(creator)
        });
        loadCreators();
    };

    // Função para deletar usuário
    const deleteCreator = async (id) => {
        await fetch(`${apiUrl}/creators/${id}`, {
            method: 'DELETE'
        });
        loadCreators();
    };

    // Abrir modal para editar usuário
    const openEditCreatorModal = async (id) => {
        editCreatorId = id;
        modalTitle.innerText = 'Editar Criador';

        // Buscar os dados do usuário para preencher o modal
        const response = await fetch(`${apiUrl}/creators/${id}`);
        const creator = await response.json();

        document.getElementById('name').value = creator.name;
        document.getElementById('profile').value = creator.profile;
        document.getElementById('password').value = ''; // Não exibir senha

        creatorModal.style.display = 'block';
    };

    // Abrir modal para adicionar novo usuário
    const openAddCreatorModal = () => {
        editCreatorId = null;
        modalTitle.innerText = 'Adicionar Criador';
        creatorForm.reset();
        creatorModal.style.display = 'block';
    };

    // Fechar modal ao clicar no "x"
    document.querySelector('.close').addEventListener('click', () => {
        creatorModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === creatorModal) {
            creatorModal.style.display = 'none';
        }
    });

    // Submissão do formulário
    creatorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const creatorData = {
            name: document.getElementById('name').value,
            profile: document.getElementById('profile').value,
            password: document.getElementById('password').value
        };

        if (editCreatorId) {
            await updateCreator(editCreatorId, creatorData);
        } else {
            await addCreator(creatorData);
        }

        creatorModal.style.display = 'none';
        loadCreators();
    });

    // Inicializando o carregamento de usuários e eventos
    addCreatorBtn.addEventListener('click', openAddCreatorModal);
    loadCreators();
});
