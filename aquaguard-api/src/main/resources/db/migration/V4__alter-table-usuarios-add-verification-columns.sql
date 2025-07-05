ALTER TABLE usuarios ADD COLUMN verification_code VARCHAR(10);

ALTER TABLE usuarios ADD COLUMN verification_code_expires_at TIMESTAMP;

ALTER TABLE usuarios MODIFY COLUMN ativo BOOLEAN NOT NULL DEFAULT FALSE;