/**
 * mascaras.js
 * Máscaras de digitação e formatadores de exibição (pt-BR).
 * Máscaras recebem o valor bruto do input; formatadores recebem o valor
 * normalizado que vem da API (somente dígitos, ISO date, number).
 */

export const somenteDigitos = (v = '') => String(v ?? '').replace(/\D/g, '');

export const mascaraCPF = (v = '') =>
  somenteDigitos(v)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');

export const mascaraCNPJ = (v = '') =>
  somenteDigitos(v)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');

/** CPF até 11 dígitos; a partir do 12º passa a formatar como CNPJ. */
export const mascaraDocumento = (v = '') => {
  const d = somenteDigitos(v);
  return d.length <= 11 ? mascaraCPF(d) : mascaraCNPJ(d);
};

export const mascaraTelefone = (v = '') => {
  const d = somenteDigitos(v).slice(0, 11);
  if (d.length <= 10) {
    return d
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }
  return d
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
};

// ─────────────────────────────────────────────
// Formatadores de exibição
// ─────────────────────────────────────────────

export const formatarDocumento = (d = '') => {
  const digitos = somenteDigitos(d);
  if (!digitos) return '—';
  return digitos.length === 11 ? mascaraCPF(digitos) : mascaraCNPJ(digitos);
};

export const tipoDocumento = (d = '') =>
  somenteDigitos(d).length === 11 ? 'CPF' : 'CNPJ';

export const formatarTelefone = (d = '') => {
  const digitos = somenteDigitos(d);
  return digitos ? mascaraTelefone(digitos) : '—';
};

const moedaBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const formatarMoeda = (valor) => moedaBRL.format(Number(valor) || 0);

export const formatarData = (iso) => {
  if (!iso) return '—';
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '—';
  return data.toLocaleDateString('pt-BR');
};

export const formatarDataHora = (iso) => {
  if (!iso) return '—';
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '—';
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};
