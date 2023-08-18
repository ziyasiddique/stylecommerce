import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, adipisci?</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. At quis beatae culpa ratione, nobis similique.</p>
          <p>Lorem ipsum dolor sit amet consectetur.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis neque repellendus eos.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
