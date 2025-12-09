# Guia de Deploy - Forex Trading AI

## Pre-Deployment Checklist

### 1. Supabase Setup
- ✅ Criar projeto em Supabase
- ✅ Copiar URL e ANON_KEY
- ✅ Adicionar variáveis de ambiente do Supabase
- ✅ Executar script SQL para criar tabelas

### 2. Variáveis de Ambiente
Adicione no Vercel (Settings > Environment Variables):
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ALPHA_VANTAGE_API_KEY=...
NEWS_API_KEY=...
\`\`\`

### 3. Executar Migrations
1. No console Supabase, abra o SQL Editor
2. Cole o conteúdo de `scripts/01_create_tables.sql`
3. Execute o script para criar as tabelas

### 4. Deploy no Vercel
\`\`\`bash
git push  # Deploy automático
# ou
vercel deploy
\`\`\`

## Checklist Pós-Deploy
- ✅ Testar login/registro
- ✅ Carregar um gráfico para análise
- ✅ Verificar histórico de análises
- ✅ Confirmar dados salvando em Supabase

## Troubleshooting

### Erro 403 - AI Gateway
- Configure crédito em Vercel

### Erro de Autenticação
- Confirme `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Dados não salvam
- Verifique se RLS policies estão ativas
- Confirme que usuário está autenticado
