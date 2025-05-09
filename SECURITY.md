# 🛡️ Política de Segurança – Liga Crypto Notifier Bot

Este projeto segue a filosofia **Secure by Default**, adotando padrões avançados de segurança web e integração contínua com ferramentas de análise estática e dinâmica.

---

## 🔐 Cabeçalhos de Segurança (HTTP Security Headers)

Todos os endpoints da aplicação — incluindo `/`, `/docs`, `/robots.txt`, `/sitemap.xml`, redirecionamentos e respostas 404 — aplicam os seguintes headers:

- `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), fullscreen=()`
- `Referrer-Policy: no-referrer`
- `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

Esses headers são aplicados por meio dos seguintes middlewares:

| Middleware               | Função                                                         |
| ------------------------ | -------------------------------------------------------------- |
| `applySecurityHeaders()` | Middleware global para todos os endpoints padrão               |
| `secure404()`            | Aplica headers seguros em rotas inexistentes                   |
| `rootRedirect()`         | Redireciona `/` para `/docs` com proteção                      |
| `crawlerHeaders()`       | Aplica headers específicos para `/robots.txt` e `/sitemap.xml` |

---

## 🧪 Testes de Segurança Automatizados

Este projeto integra práticas DevSecOps com escaneamento contínuo:

- **OWASP ZAP** (DAST): executado automaticamente na pipeline CI/CD para detectar falhas de runtime (XSS, CSP, SRI, etc.)
- **Snyk**: análise de dependências (SCA) para identificar CVEs
- **Semgrep**: análise estática de código (SAST) complementar
- **Gitleaks**: verificação de exposição de segredos
- **CodeQL**: análise semântica de vulnerabilidades lógicas no código

---

## 🔄 Gestão Inteligente de Issues

- Issues de segurança são **criadas automaticamente** via GitHub Actions com base nos alertas do ZAP
- O workflow identifica e **fecha automaticamente** a issue quando a vulnerabilidade for resolvida em novo commit
- O processo é auditável via histórico de workflow no `ci.yml`

---

## 🧱 Arquitetura Segura

- Branch `main` protegida (sem push direto)
- Commits validados com Husky, lint-staged e Commitlint
- CSP sem curingas (`*`), com fallback explícito e sem `unsafe-inline`
- Headers de segurança aplicados de forma centralizada e modular
- Redirecionamentos e erros 404 respondem com políticas CSP e ReferrerPolicy consistentes

---

## 📬 Reportar Vulnerabilidades

Caso você identifique qualquer falha de segurança:

1. Abra uma issue com a tag `security`
2. Detalhe ao máximo a falha observada ou suspeita

Responderemos com prioridade.

---

Última atualização: **maio de 2025**
