Este conteúdo é parte do curso Clean Code e Clean Architecture da Branas.io

Para mais informações acesse:

https://branas.io

**Code Smells Examples:**

1. comentários
2. ifs aninhados
3. distância margem
4. linha em branco
5. nomes ruins
6. tratamento inadequado de erros
7. magic numbers
8. código morto
9. variáveis declaradas longe da sua utilização

executar o docker-compose.yml

`docker-compose up -d`

executar o psql no terminal para criar tabelas

`docker exec -it postgres_cccat16 psql --host=localhost --username=postgres --dbname=app --command="$(cat create.sql)"`
