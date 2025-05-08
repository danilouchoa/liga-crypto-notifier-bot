---

## 📁 `SECURITY.md`

```md
# 🛡️ Política de Segurança – Liga Crypto Notifier Bot

Este projeto segue a filosofia **Secure by Default**, adotando padrões avançados de segurança web e integração contínua com ferramentas de análise estática e dinâmica.

---

## 🔐 Cabeçalhos de Segurança (HTTP Security Headers)

Todos os endpoints (incluindo `/`, `/docs`, `/robots.txt`, `/sitemap.xml`, 404s e redirecionamentos) aplicam os seguintes headers:

- `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Referrer-Policy: no-referrer`
- `Cache-Control: no-store`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-Permitted-Cross-Domain-Policies: none`
- `X-XSS-Protection: 0`
- `X-DNS-Prefetch-Control: off`

Esses headers são aplicados de forma centralizada por meio dos seguintes módulos:

| Middleware               | Função                                                          |
| ------------------------ | --------------------------------------------------------------- |
| `securityMiddleware()`   | Aplica Helmet com CSP e outros headers                          |
| `secure404()`            | Aplica headers seguros em rotas inexistentes                    |
| `rootRedirect()`         | Redireciona `/` para `/docs` com proteção                       |
| `applySecurityHeaders()` | Função utilitária para aplicação de headers em respostas custom |

---

## 🧪 Testes de Segurança Automatizados

Este projeto utiliza DevSecOps com escaneamento contínuo:

- **OWASP ZAP** (DAST): executado automaticamente na pipeline, validando vulnerabilidades em tempo de execução
- **Snyk**: análise de dependências (SCA) para detectar CVEs conhecidas
- **Gitleaks**: verificação de vazamentos de segredos no repositório

---

## 🔄 Gestão Inteligente de Issues

- Issues são **criadas automaticamente** via GitHub Actions se alertas forem detectados pelo ZAP
- Script customizado analisa o `report_json.json` e **fecha issues automaticamente** se o alerta for removido em um novo commit
- Tudo isso é auditável no workflow `pipeline.yml`

---

## 🧱 Arquitetura Segura

- Sem push direto na `main` (branch protegida)
- Commits validados com Husky e Commitlint
- CSP sem `*`, com fallback explícito
- Redirecionamentos e 404s seguros com headers robustos
- Segurança modularizada em middlewares independentes

---

## 📬 Reportar Vulnerabilidades

Caso identifique alguma falha de segurança:

1. Abra uma issue marcada com a tag `security`

Responderemos com prioridade.

---

Última atualização: **maio de 2025**
