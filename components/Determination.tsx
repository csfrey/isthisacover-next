const Determination = ({ data }: { data: any }) => {
  console.log(data);

  return <div>{data.isCover ? "is a cover" : "is not a cover"}</div>;
};

export default Determination;
