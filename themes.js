(()=>{
const THEMES = [
  { id: 'blue', label: '💙 Azul Caixa', group: 'Padrão' },
  { id: 'carnival', label: '🎭 Carnaval', group: 'Datas comemorativas' },
  { id: 'easter', label: '🐣 Páscoa', group: 'Datas comemorativas' },
  { id: 'junina', label: '🎏 Festa Junina', group: 'Datas comemorativas' },
  { id: 'independence', label: '🇧🇷 Independência', group: 'Datas comemorativas' },
  { id: 'halloween', label: '🎃 Halloween', group: 'Datas comemorativas' },
  { id: 'christmas', label: '🎄 Natal', group: 'Datas comemorativas' },
  { id: 'newyear', label: '🎆 Ano Novo', group: 'Datas comemorativas' },
];

function resolveTheme(choice) {
  return THEMES.find(theme => theme.id === choice)?.id ?? 'blue';
}

const selector = document.querySelector('#themeSelect');
const status = document.querySelector('#themeStatus');
const key = 'caixa-review-board-theme';

if (selector instanceof HTMLSelectElement) {
  let currentGroup;
  for (const theme of THEMES) {
    if (currentGroup?.label !== theme.group) {
      currentGroup = document.createElement('optgroup');
      currentGroup.label = theme.group;
      selector.appendChild(currentGroup);
    }
    const option = document.createElement('option');
    option.value = theme.id;
    option.textContent = theme.label;
    currentGroup.appendChild(option);
  }
  function apply(choice) {
    const id = resolveTheme(choice);
    document.body.dataset.theme = id;
    selector.value = id;
    if (status) status.textContent = `Fundo: ${THEMES.find(theme => theme.id === id)?.label}`;
  }
  let saved = 'blue';
  try { saved = localStorage.getItem(key) ?? 'blue'; } catch { /* Preferences are optional. */ }
  apply(saved);
  selector.addEventListener('change', () => {
    apply(selector.value);
    try { localStorage.setItem(key, selector.value); } catch { /* Keep the selected theme for this visit. */ }
  });
}
})();