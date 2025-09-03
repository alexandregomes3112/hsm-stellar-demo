# 🎨 Formatação de Código Automática

Este projeto está configurado com **formatação automática de código** usando **Prettier** e **ESLint** para manter a consistência e qualidade do código em todo o projeto.

## ✨ Recursos Configurados

### 🔧 **Formatação Automática**
- **Prettier** para formatação de código
- **ESLint** para linting e correção de problemas
- **Formatação ao salvar** no VS Code
- **Organização de imports** automática
- **Suporte completo** para TypeScript, React, Prisma

### 🎯 **Configurações por Projeto**

#### **Backend (NestJS)**
- TypeScript + Prettier + ESLint
- Suporte para arquivos `.prisma`
- Plugin `prettier-plugin-prisma`
- Regras específicas para NestJS
- Permite `any` quando necessário para HSM SDK

#### **Frontend (React)**
- TypeScript + React + Prettier + ESLint
- Suporte para JSX/TSX
- Regras de acessibilidade (jsx-a11y)
- React Hooks linting
- Integração com TailwindCSS

## 🚀 Scripts Disponíveis

### **Backend**
```bash
cd backend

# Formatar código
npm run format

# Verificar formatação
npm run format:check

# Lint e corrigir
npm run lint

# Verificar lint
npm run lint:check

# Formatar + Lint (tudo junto)
npm run lint:fix
```

### **Frontend**
```bash
cd frontend

# Formatar código
npm run format

# Verificar formatação
npm run format:check

# Lint e corrigir
npm run lint

# Verificar lint
npm run lint:check

# Formatar + Lint (tudo junto)
npm run lint:fix
```

## 🔧 **Configuração do VS Code**

### **Extensões Recomendadas**
O projeto já inclui uma lista de extensões recomendadas em `.vscode/extensions.json`:

- **Prettier** - Formatador de código
- **ESLint** - Linter para JavaScript/TypeScript
- **Tailwind CSS IntelliSense** - Autocomplete para classes
- **Prisma** - Suporte para arquivos .prisma
- **Auto Rename Tag** - Renomeia tags automaticamente
- **Path Intellisense** - Autocomplete para caminhos

### **Configurações Automáticas**
As configurações em `.vscode/settings.json` garantem:

✅ **Formatação ao salvar**
✅ **Correção de ESLint ao salvar**
✅ **Organização de imports automática**
✅ **Prettier como formatador padrão**
✅ **Configurações específicas por tipo de arquivo**

## 📁 **Estrutura de Configuração**

```
hsm-stellar-demo/
├── .vscode/
│   ├── settings.json      # Configurações do editor
│   ├── extensions.json    # Extensões recomendadas
│   └── tasks.json         # Tarefas de formatação
├── backend/
│   ├── .prettierrc        # Configuração Prettier
│   ├── .prettierignore    # Arquivos ignorados
│   └── .eslintrc.js       # Configuração ESLint
└── frontend/
    ├── .prettierrc        # Configuração Prettier
    ├── .prettierignore    # Arquivos ignorados
    └── .eslintrc.js       # Configuração ESLint
```

## ⚙️ **Configurações Personalizadas**

### **Prettier**
```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "avoid"
}
```

### **ESLint - Regras Especiais**
```javascript
{
  "@typescript-eslint/no-explicit-any": "off",  // Permite 'any' para HSM SDK
  "@typescript-eslint/ban-ts-comment": "off",   // Permite @ts-ignore
  "react/react-in-jsx-scope": "off",            // React 17+ não precisa import
  "react/prop-types": "off"                     // TypeScript cuida das props
}
```

## 🎯 **Como Usar**

### **1. Formatação Automática**
Basta salvar qualquer arquivo no VS Code e ele será formatado automaticamente.

### **2. Formatação Manual**
```bash
# Backend
cd backend && npm run format

# Frontend
cd frontend && npm run format

# Ou usar as tarefas do VS Code
# Ctrl+Shift+P → "Tasks: Run Task" → "Format All"
```

### **3. Verificação Antes do Commit**
```bash
# Verificar se está tudo formatado
cd backend && npm run format:check
cd frontend && npm run format:check

# Ou corrigir tudo de uma vez
cd backend && npm run lint:fix
cd frontend && npm run lint:fix
```

## 🛡️ **Boas Práticas**

### ✅ **DO - Faça**
- Instale as extensões recomendadas
- Use a formatação automática ao salvar
- Execute `lint:fix` antes de commits
- Mantenha as configurações consistentes

### ❌ **DON'T - Não Faça**
- Não desative a formatação automática
- Não ignore erros de lint importantes
- Não modifique as configurações base sem discussão
- Não commite código não formatado

## 🔍 **Troubleshooting**

### **Formatação não está funcionando?**
1. Verifique se as extensões estão instaladas
2. Reinicie o VS Code
3. Execute manualmente: `npm run format`

### **ESLint mostrando muitos erros?**
1. Execute: `npm run lint:fix`
2. Verifique se as dependências estão instaladas
3. Reinicie o VS Code

### **Conflitos entre Prettier e ESLint?**
As configurações já estão sincronizadas usando `eslint-config-prettier`. Se houver conflitos:

1. Verifique se todas as dependências estão atualizadas
2. Execute: `npm run lint:fix`
3. Se persistir, reporte o problema

## 📚 **Referências**

- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [React Hooks ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks)

---

**🎉 Agora seu código sempre estará bonito e organizado automaticamente!**
