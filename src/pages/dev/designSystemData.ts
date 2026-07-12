export const colorGroups = [
  {
    name: 'Primary (Purple)',
    prefix: 'primary',
    shades: [
      { shade: 100, hex: '#EDE5F9', class: 'bg-primary-100' },
      { shade: 200, hex: '#D4C2F2', class: 'bg-primary-200' },
      { shade: 300, hex: '#B794E8', class: 'bg-primary-300' },
      { shade: 400, hex: '#9560DE', class: 'bg-primary-400' },
      { shade: 500, hex: '#7430D9', class: 'bg-primary-500' },
      { shade: 600, hex: '#5E22B8', class: 'bg-primary-600' },
      { shade: 700, hex: '#491A91', class: 'bg-primary-700' },
      { shade: 800, hex: '#34136A', class: 'bg-primary-800' },
      { shade: 900, hex: '#200D43', class: 'bg-primary-900' },
    ],
  },
  {
    name: 'Success (Green)',
    prefix: 'success',
    shades: [
      { shade: 100, hex: '#E5FAE7', class: 'bg-success-100' },
      { shade: 200, hex: '#BFF2C4', class: 'bg-success-200' },
      { shade: 300, hex: '#82E68D', class: 'bg-success-300' },
      { shade: 400, hex: '#4DDA5B', class: 'bg-success-400' },
      { shade: 500, hex: '#28D439', class: 'bg-success-500' },
      { shade: 600, hex: '#1FB32E', class: 'bg-success-600' },
      { shade: 700, hex: '#188C24', class: 'bg-success-700' },
      { shade: 800, hex: '#12661A', class: 'bg-success-800' },
      { shade: 900, hex: '#0C4011', class: 'bg-success-900' },
    ],
  },
  {
    name: 'Danger (Red)',
    prefix: 'danger',
    shades: [
      { shade: 100, hex: '#FAE5E5', class: 'bg-danger-100' },
      { shade: 200, hex: '#F2BFBF', class: 'bg-danger-200' },
      { shade: 300, hex: '#E68282', class: 'bg-danger-300' },
      { shade: 400, hex: '#DA4D4D', class: 'bg-danger-400' },
      { shade: 500, hex: '#D42828', class: 'bg-danger-500' },
      { shade: 600, hex: '#B31F1F', class: 'bg-danger-600' },
      { shade: 700, hex: '#8C1818', class: 'bg-danger-700' },
      { shade: 800, hex: '#661212', class: 'bg-danger-800' },
      { shade: 900, hex: '#400C0C', class: 'bg-danger-900' },
    ],
  },
  {
    name: 'Info (Blue)',
    prefix: 'info',
    shades: [
      { shade: 100, hex: '#E5EDFA', class: 'bg-info-100' },
      { shade: 200, hex: '#BFD2F2', class: 'bg-info-200' },
      { shade: 300, hex: '#829FE6', class: 'bg-info-300' },
      { shade: 400, hex: '#4D76DA', class: 'bg-info-400' },
      { shade: 500, hex: '#2963D6', class: 'bg-info-500' },
      { shade: 600, hex: '#1F4FB3', class: 'bg-info-600' },
      { shade: 700, hex: '#183E8C', class: 'bg-info-700' },
      { shade: 800, hex: '#122D66', class: 'bg-info-800' },
      { shade: 900, hex: '#0C1D40', class: 'bg-info-900' },
    ],
  },
  {
    name: 'Warning (Amber)',
    prefix: 'warning',
    shades: [
      { shade: 100, hex: '#FBF0E1', class: 'bg-warning-100' },
      { shade: 200, hex: '#F5D9B3', class: 'bg-warning-200' },
      { shade: 300, hex: '#EDB96E', class: 'bg-warning-300' },
      { shade: 400, hex: '#E5A043', class: 'bg-warning-400' },
      { shade: 500, hex: '#DE902A', class: 'bg-warning-500' },
      { shade: 600, hex: '#BC7621', class: 'bg-warning-600' },
      { shade: 700, hex: '#935C1A', class: 'bg-warning-700' },
      { shade: 800, hex: '#6B4313', class: 'bg-warning-800' },
      { shade: 900, hex: '#432A0C', class: 'bg-warning-900' },
    ],
  },
  {
    name: 'Neutrals (Purple-Tinted)',
    prefix: 'neutral',
    shades: [
      { shade: 0, hex: '#FFFFFF', class: 'bg-neutral-0' },
      { shade: 100, hex: '#F4F2F6', class: 'bg-neutral-100' },
      { shade: 200, hex: '#E8E4ED', class: 'bg-neutral-200' },
      { shade: 300, hex: '#D1CBD9', class: 'bg-neutral-300' },
      { shade: 400, hex: '#A89DB5', class: 'bg-neutral-400' },
      { shade: 500, hex: '#7F7290', class: 'bg-neutral-500' },
      { shade: 600, hex: '#5C5169', class: 'bg-neutral-600' },
      { shade: 700, hex: '#3D3548', class: 'bg-neutral-700' },
      { shade: 800, hex: '#261F30', class: 'bg-neutral-800' },
      { shade: 900, hex: '#120D1A', class: 'bg-neutral-900' },
    ],
  },
];

export const semanticTokens = [
  { token: 'bg-app', value: 'neutral-100', usage: 'Page background', preview: 'bg-neutral-100' },
  { token: 'bg-surface', value: 'neutral-0', usage: 'Cards, modals', preview: 'bg-neutral-0' },
  { token: 'bg-muted', value: 'neutral-200', usage: 'Disabled fills', preview: 'bg-neutral-200' },
  { token: 'fg-primary', value: 'neutral-800', usage: 'Headings', preview: 'bg-neutral-800' },
  { token: 'fg-default', value: 'neutral-700', usage: 'Body text', preview: 'bg-neutral-700' },
  { token: 'fg-secondary', value: 'neutral-500', usage: 'Helper text', preview: 'bg-neutral-500' },
  { token: 'fg-link', value: 'primary-600', usage: 'Links', preview: 'bg-primary-600' },
  { token: 'fg-error', value: 'danger-600', usage: 'Error text', preview: 'bg-danger-600' },
  { token: 'fg-success', value: 'success-600', usage: 'Success text', preview: 'bg-success-600' },
  { token: 'border-default', value: 'neutral-300', usage: 'Default borders', preview: 'bg-neutral-300' },
  { token: 'border-focus', value: 'primary-500', usage: 'Focus rings', preview: 'bg-primary-500' },
  { token: 'border-error', value: 'danger-500', usage: 'Error borders', preview: 'bg-danger-500' },
];

export const typeScale = [
  { name: 'Display', size: '48px', lineHeight: '1.1', weight: 700, font: 'Poppins', class: 'text-display font-heading font-bold leading-display' },
  { name: 'H1', size: '32px', lineHeight: '1.2', weight: 700, font: 'Poppins', class: 'text-h1 font-heading font-bold leading-h1' },
  { name: 'H2', size: '24px', lineHeight: '1.3', weight: 600, font: 'Poppins', class: 'text-h2 font-heading font-semibold leading-h2' },
  { name: 'H3', size: '20px', lineHeight: '1.4', weight: 600, font: 'Poppins', class: 'text-h3 font-heading font-semibold leading-h3' },
  { name: 'H4', size: '18px', lineHeight: '1.4', weight: 600, font: 'Poppins', class: 'text-h4 font-heading font-semibold leading-h4' },
  { name: 'Body Large', size: '18px', lineHeight: '1.6', weight: 400, font: 'Inter', class: 'text-body-lg font-body leading-body-lg' },
  { name: 'Body', size: '16px', lineHeight: '1.6', weight: 400, font: 'Inter', class: 'text-body font-body leading-body' },
  { name: 'Body Small', size: '14px', lineHeight: '1.5', weight: 400, font: 'Inter', class: 'text-body-sm font-body leading-body-sm' },
  { name: 'Caption', size: '12px', lineHeight: '1.4', weight: 400, font: 'Inter', class: 'text-caption font-body leading-caption' },
  { name: 'Mono', size: '14px', lineHeight: '1.5', weight: 500, font: 'JetBrains Mono', class: 'text-mono font-mono font-medium' },
];

export const spacingScale = [
  { name: '0.5', value: '2px', desc: 'Hairline gaps' },
  { name: '1', value: '4px', desc: 'Tight internal' },
  { name: '1.5', value: '6px', desc: 'Small gaps' },
  { name: '2', value: '8px', desc: 'Compact padding' },
  { name: '3', value: '12px', desc: 'Default element gaps' },
  { name: '4', value: '16px', desc: 'Card padding' },
  { name: '5', value: '20px', desc: 'Mobile container' },
  { name: '6', value: '24px', desc: 'Section gaps' },
  { name: '8', value: '32px', desc: 'Large sections' },
  { name: '10', value: '40px', desc: 'Between majors' },
  { name: '12', value: '48px', desc: 'Page-level' },
  { name: '16', value: '64px', desc: 'Nav height' },
];

export const radiiScale = [
  { name: 'sm', value: '6px', usage: 'Inputs', class: 'rounded-sm' },
  { name: 'md', value: '8px', usage: 'Buttons', class: 'rounded-md' },
  { name: 'lg', value: '12px', usage: 'Cards', class: 'rounded-lg' },
  { name: 'xl', value: '16px', usage: 'Modals', class: 'rounded-xl' },
  { name: '2xl', value: '24px', usage: 'Large cards', class: 'rounded-2xl' },
  { name: 'full', value: '9999px', usage: 'Pills, avatars', class: 'rounded-full' },
];

export const shadowScale = [
  { name: 'sm', value: '0 1px 2px rgba(18,13,26,0.06)', usage: 'Inputs', class: 'shadow-sm' },
  { name: 'md', value: '0 4px 8px rgba(18,13,26,0.08)', usage: 'Cards', class: 'shadow-md' },
  { name: 'lg', value: '0 8px 24px rgba(18,13,26,0.12)', usage: 'Dropdowns', class: 'shadow-lg' },
  { name: 'xl', value: '0 16px 48px rgba(18,13,26,0.16)', usage: 'Modals', class: 'shadow-xl' },
  { name: 'focus', value: '0 0 0 3px primary@30%', usage: 'Focus ring', class: 'shadow-focus' },
  { name: 'focus-error', value: '0 0 0 3px danger@30%', usage: 'Error focus', class: 'shadow-focus-error' },
];

export const zIndexScale = [
  { name: 'base', value: 0, usage: 'Default' },
  { name: 'dropdown', value: 10, usage: 'Dropdowns, popovers' },
  { name: 'sticky', value: 20, usage: 'Sticky headers, nav' },
  { name: 'overlay', value: 30, usage: 'Backdrop overlays' },
  { name: 'modal', value: 40, usage: 'Modals, bottom sheets' },
  { name: 'toast', value: 50, usage: 'Toast notifications' },
];

export const motionTokens = [
  { name: 'fast', duration: '150ms', easing: 'ease-out', usage: 'Hover, focus' },
  { name: 'normal', duration: '250ms', easing: 'ease-in-out', usage: 'Toggles, state' },
  { name: 'slow', duration: '400ms', easing: 'ease-in-out', usage: 'Page, modals' },
  { name: 'spring', duration: '500ms', easing: 'cubic-bezier(0.34,1.56,0.64,1)', usage: 'Playful entrances' },
];

export const sidebarSections = [
  { id: 'colors', label: 'Colors', icon: 'Palette' },
  { id: 'typography', label: 'Typography', icon: 'Type' },
  { id: 'spacing', label: 'Spacing', icon: 'Ruler' },
  { id: 'radii', label: 'Corners', icon: 'Square' },
  { id: 'shadows', label: 'Shadows', icon: 'Layers' },
  { id: 'zindex', label: 'Z-Index', icon: 'Layers' },
  { id: 'motion', label: 'Motion', icon: 'Zap' },
  { id: 'buttons', label: 'Buttons', icon: 'MousePointerClick' },
  { id: 'forms', label: 'Forms', icon: 'FormInput' },
  { id: 'cards', label: 'Cards', icon: 'CreditCard' },
  { id: 'badges', label: 'Chips & Badges', icon: 'Tag' },
  { id: 'avatars', label: 'Avatars', icon: 'User' },
  { id: 'toggles', label: 'Toggles', icon: 'ToggleRight' },
  { id: 'accordion', label: 'Accordion', icon: 'ChevronDown' },
  { id: 'skeleton', label: 'Loading States', icon: 'Loader' },
  { id: 'modals', label: 'Modals & Sheets', icon: 'PanelTop' },
  { id: 'toasts', label: 'Toasts', icon: 'Bell' },
  { id: 'datastate', label: 'Data States', icon: 'Database' },
  { id: 'stickybar', label: 'Sticky Bar', icon: 'PanelBottom' },
  { id: 'layout', label: 'Layout', icon: 'PanelTop' },
];
