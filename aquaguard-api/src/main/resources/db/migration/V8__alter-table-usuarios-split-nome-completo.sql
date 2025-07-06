ALTER TABLE usuarios ADD COLUMN nome VARCHAR(100);
ALTER TABLE usuarios ADD COLUMN sobrenome VARCHAR(155);

UPDATE usuarios SET
    nome = SUBSTRING_INDEX(nome_completo, ' ', 1),
    sobrenome = SUBSTRING(nome_completo, LENGTH(SUBSTRING_INDEX(nome_completo, ' ', 1)) + 2);

ALTER TABLE usuarios MODIFY COLUMN nome VARCHAR(100) NOT NULL;
ALTER TABLE usuarios DROP COLUMN nome_completo;