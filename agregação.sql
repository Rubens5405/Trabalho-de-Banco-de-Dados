#O administrador quer saber a quantidade de passageiros cadastrados por voo, mas só voos 
#com mais de 1 passageiro  

SELECT  
v.ID_voo, 
v.Origem, 
v.Destino, 
COUNT(c.CPF) AS Total_Passageiros 
FROM Voo v 
INNER JOIN Cliente c ON v.ID_voo = c.id_voo 
GROUP BY v.ID_voo, v.Origem, v.Destino 
HAVING COUNT(c.CPF) > 1;