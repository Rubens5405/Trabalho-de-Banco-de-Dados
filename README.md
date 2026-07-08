# Trabalho de Banco de Dados
# Sistema de Gerenciamento de Passagens Aéreas

Tecnologias Utilizadas

*   Front-end:HTML5, CSS3 (Bootstrap para estilização), JavaScript (Fetch API para comunicação assíncrona).
*   Back-end: Python 3.11+, Flask (Framework Web).
*   Banco de Dados:PostgreSQL hospedado no Supabase.
*   Bibliotecas Python: `supabase`, `flask-cors`.

 Modelagem do Banco de Dados (SQL)

O banco de dados foi projetado focando na integridade referencial e na otimização de consultas. A tabela de Clientes se conecta diretamente aos Voos através de uma chave estrangeira (`id_voo`).

```sql
CREATE TABLE Aviao (
    N_aviao INT PRIMARY KEY,
    Modelo VARCHAR(50) NOT NULL,
    Capacidade_passageiros INT,
    Data_aquisicao DATE,
    Companhia_Aerea VARCHAR(100) NOT NULL
);

CREATE TABLE Voo (
    ID_voo SERIAL PRIMARY KEY,
    Origem VARCHAR(50) NOT NULL,
    Destino VARCHAR(50) NOT NULL,
    Data_saida TIMESTAMP NOT NULL,
    Data_pouso TIMESTAMP NOT NULL,
    Aviao_N_aviao INT,
    FOREIGN KEY (Aviao_N_aviao) REFERENCES Aviao(N_aviao)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Cliente (
    CPF VARCHAR(11) PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Telefone VARCHAR(15),
    Data_nascimento DATE,
    id_voo INT,
    FOREIGN KEY (id_voo) REFERENCES Voo(ID_voo)
);
(NO CMD)
cd Caminho/Ate/A/Pasta/TrabalhoBD
pip install flask
pip install supabase
pip install flask-cors
python app.py

Inserindo 5 aeronaves (Entidade Forte)
INSERT INTO Aviao (N_aviao, Modelo, Capacidade_passageiros, Data_aquisicao, Companhia_Aerea) VALUES
(10, 'Boeing 737', 180, '2015-03-20', 'Latam'),
(20, 'Airbus A320', 150, '2018-06-15', 'Azul'),
(30, 'Boeing 777', 350, '2012-11-01', 'Gol'),
(40, 'Embraer 195', 110, '2020-01-10', 'Azul'),
(50, 'Airbus A350', 300, '2021-08-24', 'Latam');

Inserindo 5 voos (Depende de Aviao)
INSERT INTO Voo (Origem, Destino, Data_saida, Data_pouso, Aviao_N_aviao) VALUES
('Rio de Janeiro', 'São Paulo', '2026-07-10 08:00:00', '2026-07-10 09:00:00', 10),
('São Paulo', 'Salvador', '2026-07-11 12:00:00', '2026-07-11 14:30:00', 20),
('Rio de Janeiro', 'Miami', '2026-07-12 22:00:00', '2026-07-13 06:00:00', 30),
('Belo Horizonte', 'Brasília', '2026-07-14 15:00:00', '2026-07-14 16:15:00', 40),
('Curitiba', 'Rio de Janeiro', '2026-07-15 10:00:00', '2026-07-15 11:30:00', 10);

Inserindo 5 clientes (Depende de Voo)
INSERT INTO Cliente (CPF, Nome, Telefone, Data_nascimento, id_voo) VALUES
('11122233344', 'Augusto Almeida', '21983438456', '2001-02-20', 1),
('55566677788', 'Alberto Guiles', '21983438609', '2000-09-24', 2),
('99900011122', 'Mariana Souza', '11977778888', '1995-05-12', 1),
('33344455566', 'Carlos Eduardo', '31966665555', '1988-10-30', 3),
('77788899900', 'Beatriz Rocha', '41955554444', '1992-07-04', 4);

TRUNCATE TABLE Cliente, Voo, Aviao RESTART IDENTITY CASCADE;

Retorna a quantidade de passageiros por voo, filtrando apenas voos com mais de 1 passageiro
SELECT 
    v.ID_voo,
    v.Origem,
    v.Destino,
    COUNT(c.CPF) AS Total_Passageiros
FROM Voo v
INNER JOIN Cliente c ON v.ID_voo = c.id_voo
GROUP BY v.ID_voo, v.Origem, v.Destino
HAVING COUNT(c.CPF) > 1;

Lista aviões com capacidade maior do que QUALQUER aeronave da companhia 'Azul'
SELECT N_aviao, Modelo, Capacidade_passageiros, Companhia_Aerea
FROM Aviao
WHERE Capacidade_passageiros > ANY (
    SELECT Capacidade_passageiros 
    FROM Aviao 
    WHERE Companhia_Aerea = 'Azul'
);
Lista apenas os voos que possuem pelo menos um passageiro associado
SELECT v.ID_voo, v.Origem, v.Destino, v.Data_saida
FROM Voo v
WHERE EXISTS (
    SELECT 1 
    FROM Cliente c 
    WHERE c.id_voo = v.ID_voo
);

