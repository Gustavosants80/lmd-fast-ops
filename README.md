# LMD FAST Ops

Aplicacao interna para abertura de pedidos de criacao de canais FAST.

## Seguranca

- Clerk no Vercel Marketplace.
- Login Google habilitado no Clerk.
- Middleware protege todas as rotas, exceto /sign-in.
- A pagina principal valida o e-mail no servidor.
- Somente contas @livemode.com acessam o formulario.
- Mantenha tambem a allowlist livemode.com configurada no Clerk.

## Vercel

Confirme as variaveis de ambiente:
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY

Depois de subir estes arquivos no branch main, a Vercel deve iniciar o deploy automaticamente.

## Teste

1. Abra a URL em janela anonima.
2. Deve aparecer a tela de login do Clerk.
3. Entre com Google usando conta @livemode.com.
4. O formulario deve abrir.
5. Saia e teste uma conta @gmail.com.
6. A conta externa deve receber Acesso nao autorizado.

## Envio para Engenharia

O botao Enviar para Engenharia gera o resumo e abre o cliente de e-mail para isouza@livemode.com.
