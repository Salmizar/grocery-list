/*Enable scram*/
ALTER SYSTEM SET password_encryption = 'scram-sha-256';
SELECT pg_reload_conf();
/*create temporary user with unencrypted password*/
CREATE USER tmp_user_to_create_a_password
WITH PASSWORD 'enter_password_to_encrypt';
/*Obtain encrypted password and drop tempoary user*/
SELECT rolpassword FROM pg_catalog.pg_authid WHERE rolname='tmp_user_to_create_a_password';
DROP USER IF EXISTS tmp_user_to_create_a_password;