interface FeatureCardProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const FeatureCard = (props: FeatureCardProps) => {
  return (
    <div className="p-6 border border-1 border-[#DBDBDB] rounded-xl bg-[#F8F8F8] space-y-2">
      <div className="flex flex-row space-x-2 items-center">
        <props.Icon className="w-6 h-6" />
        <h2 className="text-md font-extrabold">{props.title}</h2>
      </div>
      <p className="text-sm font-light">{props.description}</p>
    </div>
  );
};

export default FeatureCard;
