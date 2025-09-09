# Certificados TLS para PostgreSQL

Gere certificados autoassinados (apenas desenvolvimento):

```bash
mkdir -p infra/postgres/certs
openssl req -new -x509 -days 365 -nodes \
  -out infra/postgres/certs/server.crt \
  -keyout infra/postgres/certs/server.key \
  -subj "/CN=postgres"
chmod 600 infra/postgres/certs/server.key
```

Em produção, use certificados emitidos por CA interna ou ACME e mantenha as chaves fora do repositório (montar via secret manager/orquestrador). 