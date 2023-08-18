import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";
import { CartContext } from "../context/cart";
import { useContext } from 'react';
import { IconContext } from "react-icons";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const { cartItems, setCartItems, changeQuantity, totalAmount } = useContext(CartContext);
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangeQuantity = (productId, itemCounts) => {
    changeQuantity(productId, itemCounts);
  };
  const isQuantityValid = (quantity) => {
    return quantity >= 1;
  };

  const canProceedToPayment = cartItems.every((item) => isQuantityValid(item.itemCounts));

  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cartItems];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCartItems(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cartItems,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCartItems([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cartItems?.length
                  ? `You Have ${cartItems.length} items in your cart ${auth?.token ? "" : "please login to checkout !"
                  }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              {cartItems?.map((item) => (
                <div className="row card flex-row" key={item._id}>
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${item._id}`}
                      className="card-img-top"
                      alt={item.name}
                      width="100%"
                      height={"130px"}
                    />
                  </div>
                  <div className="col-md-4">
                    <b>{item.name}</b>
                    <p>{item.description.substring(0, 60)}...</p>
                    <p>Price : Rs. {item.price}</p>
                  </div>
                  <div className="col-md-4 d-flex justify-content-center flex-column">
                    <div className=" d-flex justify-content-center align-items-center">
                      <button onClick={() => handleChangeQuantity(item._id, item.itemCounts - 1)} className="itembtns" disabled={item.itemCounts === 1}>
                        <IconContext.Provider value={{ color: "rgb(0, 191, 255)", className: "global-class-name", size: "1.2em" }}>
                          <div>
                            <FaMinusSquare />
                          </div>
                        </IconContext.Provider>
                      </button>
                      <input
                        type="number"
                        style={{ width: '40px', textAlign: 'center' }}
                        class="itembtns no-arrows"
                        min="1"
                        value={item.itemCounts}
                        onChange={(e) => handleChangeQuantity(item._id, parseInt(e.target.value))}
                      />
                      <button onClick={() => handleChangeQuantity(item._id, item.itemCounts + 1)} className="itembtns">
                        <IconContext.Provider value={{ color: "rgb(0, 191, 255)", className: "global-class-name", size: "1.2em" }}>
                          <div>
                            <FaPlusSquare />
                          </div>
                        </IconContext.Provider>
                      </button>
                      <button className="itembtns"
                        style={{ marginLeft: '10px' }}
                        onClick={() => removeCartItem(item._id)}
                      >
                        <IconContext.Provider value={{ color: "rgb(255, 44, 44)", className: "global-class-name", size: "1.2em" }}>
                          <div>
                            <RiDeleteBin5Fill />
                          </div>
                        </IconContext.Provider>
                      </button>
                    </div>
                    <div>
                      {(item.itemCounts < 1 || !item.itemCounts) && (<p style={{ margin: '2px', textAlign: 'center', fontSize: '12px', color: 'red' }}>*Enter valid quantity to enable payment</p>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-sm-6 cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalAmount.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })} </h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Please Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !auth?.token || !cartItems?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary mb-3"
                      onClick={handlePayment}
                      disabled={(!canProceedToPayment) || loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
