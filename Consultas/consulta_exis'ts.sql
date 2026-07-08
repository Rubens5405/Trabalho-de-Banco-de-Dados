#listar todos os voos cadastrados, mas apenas aqueles que possuem pelo menos um cliente 
#associado  

SELECT v.ID_voo, v.Origem, v.Destino, v.Data_saida 
FROM Voo v 
WHERE EXISTS ( 
SELECT 1  
FROM Cliente c  
WHERE c.id_voo = v.ID_voo 
);
