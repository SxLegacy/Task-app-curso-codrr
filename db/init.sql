-- CREATE DATABASE IF NOT EXISTS codrrdb
SELECT 'CREATE DATABASE codrrdb'
WHERE NOT EXISTS (SELECT FROMpg_database WHERE datname = 'codrrdb')\gexec




// esto se usa pero en mysql
/* -- CREATE DATABASE IF NOT EXISTS codrrdatabase 
SELECT 'CREATE DATABASE codrrdatabase'
WHERE NOT EXISTS (SELECT FROMpg_database WHERE datname = 'codrrdatabase')\gexec