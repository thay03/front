document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/api';
    const filmModal = document.getElementById('filmModal');
    const filmForm = document.getElementById('filmForm');
    const addFilmBtn = document.getElementById('addFilmBtn');
    const modalTitleFilm = document.getElementById('modalTitleFilm');
    let editFilmId = null;

    // Função para carregar jogos
    const loadFilms = async () => {
        const response = await fetch(`${apiUrl}/films`);
        const films = await response.json();
        const tableBody = document.querySelector('#filmTable tbody');
        tableBody.innerHTML = '';

        films.forEach(film => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${film.title}</td>
                <td>${film.responsible ? film.director.name : 'N/A'}</td>
                <td>
                    <button class="editFilmBtn" data-id="${film._id}">Editar</button>
                    <button class="deleteFilmBtn" data-id="${film._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar eventos de edição e deleção
        document.querySelectorAll('.editFilmBtn').forEach(button => {
            button.addEventListener('click', (e) => openEditFilmModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deleteFilmBtn').forEach(button => {
            button.addEventListener('click', (e) => deleteFilm(e.target.dataset.id));
        });
    };

    // Carregar diretores no modal
    const loadDirectorsInModal = async () => {
        const response = await fetch(`${apiUrl}/directors`);
        const directors = await response.json();
        const directorSelect = document.getElementById('director');
        directorSelect.innerHTML = '<option value=""> Selecione um diretor</option>';

        directors.forEach(director => {
            const option = document.createElement('option');
            option.value = director._id;
            option.innerText = director.name;
            directorSelect.appendChild(option);
        });
    };

    // Função para adicionar jogo
    const addFilm = async (film) => {
        await fetch(`${apiUrl}/films`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(film)
        });
        loadFilms();
    };

    // Função para atualizar jogo
    const updateFilm = async (id, film) => {
        await fetch(`${apiUrl}/films/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(film)
        });
        loadFilms();
    };

    // Função para deletar 
    const deleteFilm = async (id) => {
        await fetch(`${apiUrl}/films/${id}`, {
            method: 'DELETE'
        });
        loadFilms();
    };

    // Abrir modal para editar 
    const openEditFilmModal = async (id) => {
        editFilmId = id;
        modalTitleFilm.innerText = 'Editar Filme';

        // Buscar os dados para preencher o modal
        const response = await fetch(`${apiUrl}/films/${id}`);
        const film = await response.json();

        document.getElementById('title').value = film.title;
        document.getElementById('director').value = film.director._id;

        filmModal.style.display = 'block';
    };

    // Abrir modal para adicionar novo filme
    const openAddFilmModal = async () => {
        editFilmId = null;
        modalTitleFilm.innerText = 'Adicionar Filme';
        filmForm.reset();
        filmModal.style.display = 'block';
    };

// Fechar modal ao clicar no "x"
document.querySelector('.close-film').addEventListener('click', () => {
    filmModal.style.display = 'none';
});

// Fechar modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === filmModal) {
        filmModal.style.display = 'none';
    }
});

// Submissão do formulário
filmForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const filmData = {
        title: document.getElementById('title').value,
        director: document.getElementById('director').value
    };

    try {
        if (editFilmId) {
            await updateFilm(editFilmId, filmData);
        } else {
            await addFilm(filmData);
        }

        filmModal.style.display = 'none';
        loadFilms();
    } catch (error) {
        console.error('Erro ao salvar filme:', error);
    }
});

// Inicialização dos eventos e carregamento dos dados
addFilmBtn.addEventListener('click', openAddFilmModal);
loadDirectorsInModal();
});
