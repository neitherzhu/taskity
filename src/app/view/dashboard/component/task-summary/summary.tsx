type SummaryProps = {
  title: string;
  value: number | string;
  desc?: string;
};
const Summary: React.FC<SummaryProps> = ({ title, value, desc }) => {
  return (
    <div className="flex-1 text-center c-gray4 text-12">
      <div>
        <span className="c-primary text-22 font-weight-600">{value}</span>
        <span className="ml-4">{desc}</span>
      </div>
      <div>{title}</div>
    </div>
  );
};

export default Summary;
