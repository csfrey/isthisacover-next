const Determination = ({ data }: { data: any }) => {
  console.log(data);

  return <div>{data.iscover ? "is a cover" : "is not a cover"}</div>;
};

export default Determination;
