interface FeatureCardProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}
const FeatureCard = ({ Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="p-4 md:p-6 border border-1 border-[#DBDBDB] rounded-xl bg-[#F8F8F8] space-y-2">
      <div className="flex flex-row space-x-2 items-center">
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
        <h2 className="text-sm md:text-md font-extrabold">{title}</h2>
      </div>
      <p className="text-xs md:text-sm font-light">{description}</p>
    </div>
  );
};

export default FeatureCard;
