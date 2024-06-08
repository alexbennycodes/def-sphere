import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
  return <div>{JSON.stringify(params)}</div>;
};

export default Page;
