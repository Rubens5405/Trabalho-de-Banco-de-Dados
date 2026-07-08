var API_URL = 'http://localhost:3000/api';

if (document.getElementById('tabela-clientes')) {
    listarClientes();
}

function listarClientes() {
    fetch(API_URL + '/clientes')
        .then(function (resposta) { return resposta.json(); })
        .then(function (dados) {
            var tbody = document.getElementById('tbody-clientes');
            if (!tbody) return;
            tbody.innerHTML = '';

            for (var i = 0; i < dados.length; i++) {
                var cliente = dados[i];
                var linha = '<tr>' +
                    '<td>' + cliente.cpf + '</td>' +
                    '<td>' + cliente.nome + '</td>' +
                    '<td>' + (cliente.data_nascimento || '-') + '</td>' +
                    '<td>' + (cliente.telefone || '-') + '</td>' +
                    '<td>' + (cliente.voo_id || '-') + '</td>' +
                    '<td><button onclick="deletarCliente(\'' + cliente.cpf + '\')">Excluir</button></td>' +
                    '</tr>';
                tbody.innerHTML += linha;
            }
        })
        .catch(function (erro) { console.log("Erro ao buscar clientes: " + erro); });
}

var formCliente = document.getElementById('form-cliente');
if (formCliente) {
    formCliente.addEventListener('submit', function (event) {
        event.preventDefault();
        var novoCliente = {
            cpf: document.getElementById('cli-cpf').value,
            nome: document.getElementById('cli-nome').value,
            data_nascimento: document.getElementById('cli-nasc').value,
            telefone: document.getElementById('cli-tel').value,
            voo_id: document.getElementById('voo_id').value
        };

        fetch(API_URL + '/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoCliente)
        })
            .then(function (resposta) {
                if (resposta.ok) {
                    alert('Cliente salvo com sucesso!');
                    listarClientes();
                    formCliente.reset();
                } else {
                    alert('Erro ao salvar no banco de dados. Verifique os campos.');
                }
            });
    });
}

function deletarCliente(cpf) {
    var confirmacao = confirm("Tem certeza que deseja excluir?");
    if (confirmacao) {
        fetch(API_URL + '/clientes/' + cpf, { method: 'DELETE' })
            .then(function (resposta) {
                if (resposta.ok) {
                    alert('Cliente excluído!');
                    listarClientes();
                }
            });
    }
}

if (document.getElementById('tabela-avioes')) {
    listarAvioes();
}

function listarAvioes() {
    fetch(API_URL + '/avioes')
        .then(function (resposta) { return resposta.json(); })
        .then(function (dados) {
            var tbody = document.getElementById('tbody-avioes');
            if (!tbody) return;
            tbody.innerHTML = '';

            for (var i = 0; i < dados.length; i++) {
                var aviao = dados[i];
                var linha = '<tr>' +
                    '<td>' + aviao.n_aviao + '</td>' +
                    '<td>' + aviao.modelo + '</td>' +
                    '<td>' + aviao.capacidade_passageiros + '</td>' +
                    '<td>' + aviao.data_aquisicao + '</td>' +
                    '<td>' + aviao.companhia_aerea + '</td>' +
                    '<td><button onclick="deletarAviao(\'' + aviao.n_aviao + '\')">Excluir</button></td>' +
                    '</tr>';
                tbody.innerHTML += linha;
            }
        })
        .catch(function (erro) { console.log("Erro ao buscar aviões: " + erro); });
}

var formAviao = document.getElementById('form-aviao');
if (formAviao) {
    formAviao.addEventListener('submit', function (event) {
        event.preventDefault();
        var novoAviao = {
            n_aviao: document.getElementById('aviao-n').value,
            modelo: document.getElementById('aviao-modelo').value,
            capacidade_passageiros: document.getElementById('aviao-cap').value,
            data_aquisicao: document.getElementById('aviao-data').value,
            companhia_aerea: document.getElementById('aviao-cia').value
        };

        fetch(API_URL + '/avioes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoAviao)
        })
            .then(function (resposta) {
                if (resposta.ok) {
                    alert('Avião salvo com sucesso!');
                    listarAvioes();
                    formAviao.reset();
                } else {
                    alert('Erro ao salvar avião.');
                }
            });
    });
}

function deletarAviao(id) {
    var confirmacao = confirm("Tem certeza que deseja excluir este avião?");
    if (confirmacao) {
        fetch(API_URL + '/avioes/' + id, { method: 'DELETE' })
            .then(function (resposta) {
                if (resposta.ok) {
                    alert('Avião excluído!');
                    listarAvioes();
                }
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('aviao_id')) {
        carregarAvioesParaSelect();
    }
    if (document.querySelector('#tabela-voos tbody')) {
        carregarVoos();
    }

    var formVoo = document.getElementById('form-voo');
    if (formVoo) {
        formVoo.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dados = {
                id_voo: document.getElementById('id_voo').value,
                origem: document.getElementById('origem').value,
                destino: document.getElementById('destino').value,
                data_saida: document.getElementById('data_voo').value,
                data_pouso: document.getElementById('data_voo').value,
                aviao_n_aviao: document.getElementById('aviao_id').value
            };

            await fetch(API_URL + '/voos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            formVoo.reset();
            carregarVoos();
        });
    }

    async function carregarAvioesParaSelect() {
        try {
            const response = await fetch(API_URL + '/avioes');
            const avioes = await response.json();
            const select = document.getElementById('aviao_id');
            if (!select) return;

            select.innerHTML = '<option value="">Selecione um Avião</option>';
            avioes.forEach(aviao => {
                const option = document.createElement('option');
                option.value = aviao.n_aviao;
                option.textContent = `Avião ${aviao.n_aviao} - ${aviao.modelo}`;
                select.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar aviões:", error);
        }
    }

    async function carregarVoos() {
        const response = await fetch(API_URL + '/voos');
        const voos = await response.json();
        const tbody = document.querySelector('#tabela-voos tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        voos.forEach(voo => {
            tbody.innerHTML += `
                <tr>
                    <td>${voo.id_voo}</td>
                    <td>${voo.origem}</td>
                    <td>${voo.destino}</td>
                    <td>${voo.data_saida.split('T')[0]}</td>
                    <td>${voo.aviao_n_aviao}</td>
                    <td><button onclick="deletarVoo(${voo.id_voo})">Excluir</button></td>
                </tr>
            `;
        });
    }
});

async function deletarVoo(id) {
    if (confirm("Tem certeza que deseja excluir este voo?")) {
        await fetch(API_URL + '/voos/' + id, { method: 'DELETE' });
        location.reload();
    }
}

const formSimples = document.getElementById('form-consulta-simples');
if (formSimples) {
    formSimples.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('busca-nome').value;

        try {
            const response = await fetch(`${API_URL}/consultas/cliente-por-nome?nome=${nome}`);
            const dados = await response.json();

            const tbody = document.getElementById('tbody-resultados');
            if (!tbody) return;
            tbody.innerHTML = '';

            if (dados.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Nenhum cliente encontrado.</td></tr>';
                return;
            }

            dados.forEach(c => {
                tbody.innerHTML += `
                    <tr>
                        <td>${c.nome}</td>
                        <td>${c.cpf}</td>
                        <td>${c.telefone || 'Sem Telefone'}</td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
        }
    });
}

const formAvancado = document.getElementById('form-consulta-avancada');
if (formAvancado) {
    formAvancado.addEventListener('submit', async (e) => {
        e.preventDefault();
        const vooId = document.getElementById('busca-voo').value;

        try {
            const response = await fetch(`${API_URL}/consultas/clientes-por-voo?voo_id=${vooId}`);
            const dados = await response.json();

            const tbody = document.getElementById('tbody-resultados');
            if (!tbody) return;
            tbody.innerHTML = '';

            if (dados.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Nenhum passageiro neste voo.</td></tr>';
                return;
            }

            dados.forEach(item => {
                const nomeCliente = item.cliente ? item.cliente.nome : 'Passageiro Anônimo';
                const codigoVoo = item.voo_id || vooId;

                tbody.innerHTML += `
                    <tr>
                        <td>${nomeCliente}</td>
                        <td>Voo: ${codigoVoo}</td>
                        <td>Passagem Confirmada</td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Erro ao buscar voo avançado:", error);
        }
    });
}
const formDestino = document.getElementById('form-consulta-destino');
if (formDestino) {
    formDestino.addEventListener('submit', async (e) => {
        e.preventDefault();
        const destino = document.getElementById('busca-destino').value;
        try {
            const response = await fetch(`${API_URL}/consultas/voos-por-destino?destino=${destino}`);
            const dados = await response.json();
            const tbody = document.getElementById('tbody-resultados');
            if (!tbody) return;
            tbody.innerHTML = '';

            if (dados.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Nenhum voo para este destino.</td></tr>';
                return;
            }
            dados.forEach(v => {
                tbody.innerHTML += `<tr><td>Voo: ${v.id_voo}</td><td>Origem: ${v.origem}</td><td>Destino: ${v.destino}</td></tr>`;
            });
        } catch (error) { console.error("Erro ao buscar destino:", error); }
    });
}

const formSubquery = document.getElementById('form-consulta-subquery');
if (formSubquery) {
    formSubquery.addEventListener('submit', async (e) => {
        e.preventDefault();
        const modelo = document.getElementById('busca-modelo-aviao').value;
        try {
            const response = await fetch(`${API_URL}/consultas/clientes-fora-modelo-aviao?modelo=${modelo}`);
            const dados = await response.json();
            const tbody = document.getElementById('tbody-resultados');
            if (!tbody) return;
            tbody.innerHTML = '';

            if (dados.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Nenhum cliente restou no filtro.</td></tr>';
                return;
            }
            dados.forEach(c => {
                tbody.innerHTML += `<tr><td>${c.nome}</td><td>CPF: ${c.cpf}</td><td>Livre do avião: ${modelo}</td></tr>`;
            });
        } catch (error) { console.error("Erro na subconsulta:", error); }
    });
}