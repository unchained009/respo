const SectionCard = ({ title, subtitle, action, children }) => (
  <section className="section-card">
    <div className="section-card__header">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </section>
);

export default SectionCard;
