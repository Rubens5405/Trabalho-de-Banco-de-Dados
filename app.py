import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

# em caso de erro, ver se python está instalado
# caso esteja ver se supabase, flask e flask-cors instalados
# caso não, usar "pip install "nome do que precisa instalar"

app = Flask(__name__)
CORS(app)

SUPABASE_URL = "https://bjoxlmlsoacoatpbrllr.supabase.co"
SUPABASE_KEY = "sb_publishable_ZTnkF5LIS3hG8axE6_9BAg_V_Z_jFU2"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/api/clientes', methods=['GET'])
def listar_clientes():
    resposta = supabase.table('cliente').select('*').execute()
    return jsonify(resposta.data), 200

@app.route('/api/clientes', methods=['POST'])
def salvar_cliente():
    dados = request.json
    resposta = supabase.table('cliente').insert({
        "cpf": dados.get('cpf'),
        "nome": dados.get('nome'),
        "telefone": dados.get('telefone'),
        "data_nascimento": dados.get('data_nascimento'),
        "voo_id": dados.get("voo_id")
    }).execute()
    return jsonify(resposta.data), 201

@app.route('/api/clientes/<string:cpf>', methods=['DELETE'])
def deletar_cliente(cpf):
    supabase.table('cliente').delete().eq('cpf', cpf).execute()
    return jsonify({"mensagem": "Cliente removido com sucesso"}), 200


@app.route('/api/avioes', methods=['GET'])
def listar_avioes():
    resposta = supabase.table('aviao').select('*').execute()
    return jsonify(resposta.data), 200

@app.route('/api/avioes', methods=['POST'])
def salvar_aviao():
    dados = request.json
    resposta = supabase.table('aviao').insert({
        "n_aviao": dados.get('n_aviao'),
        "modelo": dados.get('modelo'),
        "capacidade_passageiros": dados.get('capacidade_passageiros'),
        "data_aquisicao": dados.get('data_aquisicao'),
        "companhia_aerea": dados.get('companhia_aerea')
    }).execute()
    return jsonify(resposta.data), 201

@app.route('/api/avioes/<int:n_aviao>', methods=['DELETE'])
def deletar_aviao(n_aviao):
    supabase.table('aviao').delete().eq('n_aviao', n_aviao).execute()
    return jsonify({"mensagem": "Avião removido com sucesso"}), 200


@app.route('/api/voos', methods=['GET'])
def listar_voos():
    resposta = supabase.table('voo').select('*').execute()
    return jsonify(resposta.data), 200

@app.route('/api/voos', methods=['POST'])
def salvar_voo():
    dados = request.json
    resposta = supabase.table('voo').insert({
        "origem": dados.get('origem'),
        "destino": dados.get('destino'),
        "data_saida": dados.get('data_saida'),
        "data_pouso": dados.get('data_pouso'),
        "aviao_n_aviao": dados.get('aviao_n_aviao')
    }).execute()
    return jsonify(resposta.data), 201

@app.route('/api/voos/<int:id_voo>', methods=['DELETE'])
def deletar_voo(id_voo):
    supabase.table('voo').delete().eq('id_voo', id_voo).execute()
    return jsonify({"mensagem": "Voo removido com sucesso"}), 200

@app.route('/api/consultas/relatorio', methods=['GET'])
def consulta_avancada():
    resposta = supabase.table('voo').select('*, aviao(modelo, companhia_aerea)').execute()
    return jsonify(resposta.data), 200

@app.route('/api/consultas/cliente-por-nome', methods=['GET'])
def buscar_cliente_por_nome():
    nome = request.args.get('nome')
    resposta = supabase.table('cliente').select('*').ilike('nome', f'%{nome}%').execute()
    return jsonify(resposta.data), 200


@app.route('/api/consultas/clientes-por-voo', methods=['GET'])
def buscar_clientes_por_voo():
    voo_id = request.args.get('voo_id')
    
    if not voo_id:
        return jsonify([]), 200


    resposta = supabase.table('cliente').select('*, voo(*)').eq('voo_id', voo_id).execute()
    
    dados_formatados = []
    for c in resposta.data:
        dados_formatados.append({
            "cliente": {
                "nome": c.get("nome")
            },
            "voo": c.get("voo")
        })
    
    return jsonify(dados_formatados), 200

@app.route('/api/consultas/voos-por-destino', methods=['GET'])
def buscar_voos_por_destino():
    destino = request.args.get('destino')
    resposta = supabase.table('voo').select('*').ilike('destino', f'%{destino}%').execute()
    return jsonify(resposta.data), 200


@app.route('/api/consultas/clientes-fora-modelo-aviao', methods=['GET'])
def clientes_fora_modelo_aviao():
    modelo = request.args.get('modelo')

    avioes = supabase.table('aviao').select('n_aviao').ilike('modelo', f'%{modelo}%').execute()
    ids_avioes = [a['n_aviao'] for a in avioes.data]

    if not ids_avioes:
        resposta = supabase.table('cliente').select('*').execute()
        return jsonify(resposta.data), 200


    voos = supabase.table('voo').select('id_voo').in_('aviao_n_aviao', ids_avioes).execute()
    ids_voos = [v['id_voo'] for v in voos.data]

    if ids_voos:
        resposta = supabase.table('cliente').select('*').not_.in_('voo_id', ids_voos).execute()
    else:
        resposta = supabase.table('cliente').select('*').execute()

    return jsonify(resposta.data), 200

if __name__ == '__main__':
    app.run(port=3000, debug=True)