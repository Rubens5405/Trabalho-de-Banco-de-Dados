#O administrador quer listar os dados dos aviões cuja capacidade de passageiros seja maior 
#do que a capacidade de QUALQUER (ANY) avião da companhia 'Azul'.  

SELECT N_aviao, Modelo, Capacidade_passageiros, Companhia_Aerea 
FROM Aviao 
WHERE Capacidade_passageiros > ANY ( 
SELECT Capacidade_passageiros  
FROM Aviao  
WHERE Companhia_Aerea = 'Azul' 
);
