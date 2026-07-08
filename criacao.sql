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