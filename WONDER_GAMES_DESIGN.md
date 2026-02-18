# 🎮 Wonder Games Design System - MAX Task Manager

**Aplicado em:** 18 Fev 2026
**Versão:** v2.0
**Commit:** `82c3898`

---

## 🎨 VISÃO GERAL

Wonder Games Design System aplicado ao MAX Task Manager com **Neon Aesthetic** (verde limão neon #D4FB08) e **Glassmorphism**.

### Identidade Visual
- **Cor Primária:** Neon Green (#D4FB08)
- **Fundo:** Branco (light) / Preto (dark)
- **Estilo:** Cyberpunk minimalista com toques neon
- **Animações:** Glows, scales, smooth transitions

---

## 🎨 PALETA DE CORES

### Brand Colors (Neon)
```css
--neon-400: #D4FB08  /* Primary - botões, links, highlights */
--neon-500: #BAE200  /* Hover - botões ativos */
--neon-950: #253300  /* Texto sobre fundo neon */
```

### Base Colors
```css
/* Light Mode */
--background: #FFFFFF
--foreground: #000000
--card: #FFFFFF
--border: #E5E5E5

/* Dark Mode */
--dark-background: #0A0A0A
--dark-foreground: #FFFFFF
--dark-card: #252525
--dark-border: #828282
```

### Status Colors
```css
status-online:  #22C55E  /* Verde */
status-offline: #6B7280  /* Cinza */
status-busy:    #EF4444  /* Vermelho */
status-idle:    #F59E0B  /* Amarelo */
```

### Task Status Colors
```css
task-pending:      #F59E0B  /* Laranja */
task-in-progress:  #3B82F6  /* Azul */
task-done:         #22C55E  /* Verde */
task-blocked:      #EF4444  /* Vermelho */
```

### Priority Colors
```css
priority-alta:  #EF4444  /* Vermelho */
priority-media: #F59E0B  /* Amarelo */
priority-baixa: #22C55E  /* Verde */
```

---

## 📐 LAYOUT & ESPAÇAMENTO

### Grid System
```css
--gap: 8px         /* Gap base */
--radius: 16px     /* Border radius padrão */
--h-controller: 80px  /* Altura da navbar */
```

### Container
- **Max-width:** `1400px` (Wonder Games standard)
- **Padding:** `8px` (mobile) → `24px` (desktop)
- **Gaps:** `8px`, `16px`, `24px`, `32px`, `64px`

### Component Sizes
```css
Botão Neon Pill:      112px × 42px
Botão CTA Grande:     280px × 88px
Icon Button Neon:     54px × 54px
Agent Card:           288px width
Sidebar Width:        288px (w-72)
Header Height:        80px
```

---

## 🎭 COMPONENTES UI

### 1. Botões

#### Neon Pill Button
```css
background: #D4FB08
color: #253300
border-radius: 9999px
padding: 12px 28px
font-weight: 700
letter-spacing: 0.7px
text-transform: uppercase
transition: all 1s cubic-bezier(0.3, 0, 0.04, 1)

hover:
  background: #BAE200
  box-shadow: 0 0 4px rgb(212, 251, 8)
  scale: 1.05
```

#### Neon Circle Button
```css
background: #D4FB08
border-radius: 50%
width: 54px
height: 54px

hover:
  background: #BAE200
  scale: 1.1
```

### 2. Cards

#### Standard Card
```css
border-radius: 16px
background: #FFFFFF (light) / #252525 (dark)
border: 1px solid #E5E5E5
box-shadow: 0 1px 1px 0 rgba(255, 255, 255, 0.2),
            0 1px 3px 0 rgba(0, 0, 0, 0.3)

hover:
  scale: 1.02
  shadow: 0 0 4px rgb(212, 251, 8)
```

#### Wonder Games Gradient Card (Agent Tree)
```css
background: linear-gradient(
  to bottom right,
  var(--agent-color),
  adjustBrightness(--agent-color, -40)
)

Top bar:
  height: 4px
  background: #D4FB08
  animation: glow 2s ease-in-out infinite
```

### 3. Badges

#### Status Badge
```css
border-radius: 9999px
padding: 4px 12px
font-size: 12px
font-weight: 700
text-transform: uppercase

colors:
  online:  bg-status-online (green)
  offline: bg-status-offline (gray)
  busy:    bg-status-busy (red)
  idle:    bg-status-idle (yellow)
```

#### Neon Badge
```css
background: #D4FB08
color: #253300
border-radius: 9999px
animation: glow 2s ease-in-out infinite
```

---

## ✨ ANIMAÇÕES

### Glow Animation
```css
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 4px rgb(212, 251, 8);
  }
  50% {
    box-shadow: 0 0 12px rgb(212, 251, 8),
                0 0 20px rgb(186, 226, 0);
  }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}
```

### Transitions
```css
/* Smooth Wonder Games transition */
transition: all 1s cubic-bezier(0.3, 0, 0.04, 1);

/* Snappy transition */
transition: all 0.3s cubic-bezier(0.2, 0.8, 0.4, 1);

/* Sharp transition */
transition: all 0.5s cubic-bezier(0.77, 0, 0.175, 1);
```

---

## 🌑 DARK MODE

### Tokens CSS
```css
:root {
  /* Light Mode (default) */
  --background: 255 255 255;
  --foreground: 0 0 0;
  --card: 255 255 255;
  --border: 229 229 229;
}

.dark {
  /* Dark Mode */
  --background: 10 10 10;      /* #0A0A0A */
  --foreground: 255 255 255;
  --card: 37 37 37;            /* #252525 */
  --border: 130 130 130;
}
```

### Classes Tailwind
```tsx
// Light mode
className="bg-background text-foreground"

// Dark mode
className="dark:bg-dark-background dark:text-dark-foreground"

// Responsive
className="bg-white dark:bg-neutral-900"
```

---

## 🎨 TIPOGRAFIA

### Font Sizes
```css
text-xs:      12px   /* Caption */
text-sm:      14px   /* Body Small, Label */
text-base:    16px   /* Body Base */
text-lg:      18px   /* Body Large */
text-xl:      20px   /* H3, Body Large */
text-2xl:     24px   /* H2, Body Large Bold */
text-3xl:     30px   /* H1 */
text-4xl:     36px   /* Display Small */
text-5xl:     48px   /* Display */
```

### Font Weights
```css
font-normal:   400  /* Regular body */
font-semibold: 600  /* Subtítulos, labels */
font-bold:     700  /* CTAs, headings */
```

### Letter Spacing
```css
tracking-tight:    -0.025em  /* Display headings */
tracking-normal:   0em        /* Body text */
tracking-wide:     0.025em    /* Uppercase labels */
```

---

## 🖼️ SOMBRAS & EFEITOS

### Glassmorphism
```css
.glass {
  backdrop-filter: blur(16px);
  box-shadow:
    inset 0 1px 3px 0 rgba(255, 255, 255, 0.05),
    inset -1px -1px 3px 0 rgba(0, 0, 0, 0.1),
    inset -1px -1px 0 0 rgba(0, 0, 0, 0.2);
}
```

### Neon Glow
```css
.neon-glow {
  box-shadow: 0 0 4px rgb(212, 251, 8);
}

.neon-glow-lg {
  box-shadow:
    0 0 12px rgb(212, 251, 8),
    0 0 20px rgb(186, 226, 0);
}
```

### Card Shadow
```css
.card-elevated {
  box-shadow:
    0 1px 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 1px 0 inset rgba(0, 0, 0, 0.1),
    0 1px 3px 0 rgba(0, 0, 0, 0.3);
}
```

---

## 🚀 COMPONENTES IMPLEMENTADOS

### Layout
- ✅ **AppLayout** - Container com max-width 1400px
- ✅ **Sidebar** - Navegação com neon logo
- ✅ **Header** - Status badge + theme toggle

### Pages
- ✅ **Dashboard** - Metrics com glow bars, task cards
- ✅ **Agent Tree** - Wonder Games gradient cards
- ⏳ **Kanban** - Pendente implementação

### UI Components
- ✅ **Card** - Standard card
- ✅ **GradientCard** - Wonder Games gradient style
- ✅ **Button** - Neon pill variant
- ✅ **Badge** - Status badges

---

## 📱 RESPONSIVIDADE

### Breakpoints (Tailwind)
```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Adaptive Components
```tsx
// Sidebar: hidden on mobile
className="hidden md:flex"

// Grid: responsive columns
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// Typography: responsive sizing
className="text-2xl md:text-4xl"
```

---

## 🎯 USO EM COMPONENTES

### Botão Neon Pill
```tsx
<Button variant="neon-pill" size="default">
  Create Task
</Button>
```

### Card com Glow
```tsx
<Card className="card-elevated hover:shadow-neon transition-all">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Badge Neon
```tsx
<Badge className="bg-neon-400 text-neon-950 animate-glow">
  LIVE
</Badge>
```

### Gradient Card (Agent Tree)
```tsx
<Card
  style={{
    background: `linear-gradient(to bottom right, #3B82F6, #1E40AF)`
  }}
>
  <div className="h-1 w-full bg-neon-400 animate-glow" />
  {/* Content */}
</Card>
```

---

## 🔧 CUSTOMIZAÇÃO

### Mudar cor primária
```css
/* globals.css */
:root {
  --neon-400: 212 251 8;  /* Mude para sua cor */
}
```

### Adicionar novo agente com cor custom
```typescript
const agent = {
  name: "New Agent",
  color: "#FF6B6B",  // Cor custom
  // ...
}
```

### Criar gradiente custom
```css
.gradient-custom {
  background: linear-gradient(to bottom right, #COLOR1, #COLOR2);
}
```

---

## 📚 REFERÊNCIAS

- **Design Original:** Wonder Games Website
- **Cores:** Neon green palette
- **Animações:** Smooth transitions (1s)
- **Estilo:** Cyberpunk minimalista

---

**Status:** ✅ Wonder Games Design System v2.0 Fully Applied

*Built with 🎮 Wonder Games aesthetic*
