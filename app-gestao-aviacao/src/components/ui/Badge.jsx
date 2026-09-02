/**
 * Badge de status — reutilizável em todos os módulos.
 *
 * Props:
 *   ativo  boolean
 */
export default function Badge({ ativo }) {
  return (
    <span className={`badge ${ativo ? "badge-ativo" : "badge-inativo"}`}>
      {ativo ? "Ativo" : "Inativo"}
    </span>
  );
}
