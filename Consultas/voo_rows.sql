INSERT INTO voo (id_voo, origem, destino, data_saida, data_pouso, aviao_n_aviao) VALUES (2, 'asfv', 'dwse', '3453-03-23 00:00:00', '3453-03-23 00:00:00', 6), (3, 'Bahia', 'Rio de Janeiro', '2009-09-26 00:00:00', '2009-09-26 00:00:00', 7);

INSERT INTO Cliente (CPF, Nome, Telefone, Data_nascimento, id_voo) VALUES 
('11122233344', 'Augusto Almeida', '21983438456', '2001-02-20', 1), 
('55566677788', 'Alberto Guiles', '21983438609', '2000-09-24', 2), 
('99900011122', 'Mariana Souza', '11977778888', '1995-05-12', 1), 
('33344455566', 'Carlos Eduardo', '31966665555', '1988-10-30', 3), 
('77788899900', 'Beatriz Rocha', '41955554444', '1992-07-04', 4); 
TRUNCATE TABLE Cliente, Voo, Aviao RESTART IDENTITY CASCADE;  
