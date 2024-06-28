DROP TRIGGER IF EXISTS update_matelas_count_on_insert;
DROP TRIGGER IF EXISTS update_matelas_count_on_delete;

CREATE TRIGGER update_matelas_count_on_insert
AFTER INSERT ON produit
FOR EACH ROW 
UPDATE bloc b 
SET nb_matelas = nb_matelas + 1   
WHERE b.bloc_id = NEW.bloc_id;

CREATE TRIGGER update_matelas_count_on_delete
AFTER DELETE ON Produit
FOR EACH ROW
UPDATE bloc b
SET nb_matelas = nb_matelas - 1
WHERE b.bloc_id = OLD.bloc_id;


