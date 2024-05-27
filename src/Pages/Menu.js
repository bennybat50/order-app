import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { APP_URL, VERSION } from '../Components/Globals';
import { useLocation } from 'react-router-dom';
import Loader from '../Components/Loader';

export default function Menu(props) {
    const { state } = useLocation();
    const { kitchenDetails } = state;
    const [menus, setMenus] = useState([])
    const [cartData, setcartData] = useState({})
    const [kitchenData, setKitchenData] = useState({})
    const [cartItems, setcartItems] = useState([])
    const [locations, setLocations] = useState([])
    const [locationID, setLocationID] = useState("")
    const [loading, setLoading] = useState(false)
    const [cartLoading, setCartLoading] = useState(false)
    const [districtLoading, setDistrictLoading] = useState(false)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [first_name, setfirst_name] = useState("")
    const [last_name, setlast_name] = useState("")
    const [phone, setphone] = useState("")
    const [email, setemail] = useState("")
    const [addr, setaddr] = useState("")
    const [selectedDistrict, setSelectedDistrict] = useState("")
    const [deliveryTile, setDeliveryTile] = useState()
    const [deliveryCompanies, setdeliveryCompanies] = useState([])
    const [deliveryMeans, setdeliveryMeans] = useState({})
    const [comment, setcomment] = useState("")
    const [paymentLink, setPaymentLink] = useState("")
    const [quantity, setquantity] = useState()
    const [delivery_type, setDelivery_type] = useState()
    const [delivery_date, setDelivery_date] = useState()
    const [delivery_company, setDelivery_company] = useState()
    useEffect(() => {

        loadLocations()
        loadMenu()
    }, [])

    const handleEvent = (e) => {

        if (e.target.name === "first_name") {

            setfirst_name(e.target.value)
        }

        if (e.target.name === "last_name") {
            setlast_name(e.target.value)
        }

        if (e.target.name === "phone") {
            setphone(e.target.value)
        }

        if (e.target.name === "email") {
            setemail(e.target.value)
            loadCartData()

        }
        if (e.target.name === "addr") {
            setaddr(e.target.value)
        }

        if (e.target.name === "comment") {
            setcomment(e.target.value)
        }
        if (e.target.name === "quantity") {
            setquantity(e.target.value)
        }

        if (e.target.name === "date") {
            setDelivery_date(e.target.value)
        }

        if (e.target.name === "district") {
            setSelectedDistrict(e.target.value)
            getDeliverCompanies(e.target.value)
        }

        if (e.target.name === "delivery_type") {
            setDelivery_type(e.target.value)
        }

        if (e.target.name === "company") {
            alert(e.target.value)
           let index=e.target.value
           setDelivery_company(deliveryCompanies[index])
        }


    }


    const addItemToCart = (dish_id) => {

        if (first_name === "" || last_name === "" || email === "" || phone === "" || addr === "" || comment === "" || quantity === "") {
            alert("Please provide Customer details by the right and also add the comment and quantity")
        } else {
            let cartItem = {
                "first_name": first_name,
                "last_name": last_name,
                "phone": phone,
                "email": email,
                "addr": addr,
                "kitchen_id": kitchenDetails.kitchen_id,
                "comment": "",
                "item": {
                    "dish_id": dish_id,
                    "comment": comment,
                    "quantity": quantity
                }
            }

            axios.post(`${APP_URL}${VERSION}/carts/create-order`, cartItem).then((res) => {
                setcomment("")
                setquantity()
                loadCartData()
            })


        }


    }

    const deleteCartItem = (cart_id, item_id) => {
        console.log(item_id);
        console.log(cart_id);
        if (window.confirm("Delete Item?")) {
            let sendData = {
                "cart_dish_id": item_id
            }
            axios.put(`${APP_URL}${VERSION}/carts/${cart_id}/remove/dish`, sendData).then((res) => {
                loadCartData()
            }).catch((e) => {
                console.log(e);
            })
        }


    }

    const loadLocations = () => {
        let sendData = {
            "query": { "state_id": "abuja" }
        }
        axios.post(`${APP_URL}${VERSION}/q/districts`, sendData).then((res) => {
            setLocations(res.data)
        })
    }

    const loadKitchenData = () => {
        let sendData = {
            "id": kitchenDetails.kitchen_id
        }
        axios.post(`${APP_URL}${VERSION}/kitchens/details`, sendData).then((res) => {
            console.log(res.data);
            setKitchenData(res.data)
        })
    }

    const loadCartData = async() => {
        setCartLoading(true)
        if (email !== "") {
            let sendData = {
                "email": email
            }
            axios.post(`${APP_URL}${VERSION}/carts/get-order`, sendData).then((res) => {
               
                if (res.data.type == null) {
                    setcartData(res.data)
                    setcartItems(res.data.items)
                } else {
                    setcartData({})
                    setcartItems([])
                }
                setCartLoading(false)
            })
        }
    }

    const loadMenu = () => {
        setLoading(true)
        let sendData = {
            "query": {
                "kitchen_id": kitchenDetails.kitchen_id
            }
        }
        axios.post(`${APP_URL}${VERSION}/dishes/info`, sendData).then((res) => {
            setMenus(res.data.dishes)
            setLoading(false)
            loadKitchenData()
            getDeliverTypes()
        })

    }

    const getDay = (ahead) => {
        let day = {};
        if (kitchenDetails['openings'] != null) {
            var days = kitchenDetails['openings'];
            let date = new Date();



            var weekDay = 0;
            if (date.getDay() + ahead <= 7) {
                weekDay = date.getDay() + ahead;
            } else if (date.getDay() + ahead == 8) {
                weekDay = 1;
            } else if (date.getDay() + ahead == 9) {
                weekDay = 2;
            } else if (date.getDay() + ahead == 10) {
                weekDay = 3;
            }

            var newDate = `${date.getDate() + ahead}-${getMonth(date.getMonth())}-${date.getDate()}`;
            switch (weekDay) {
                case 1:
                    if (days['monday'] != null) {
                        day = {
                            "day": "Monday",
                            "time": newDate,
                            "from":
                                `${days['monday'][0]['time'] ?? "0:00"}${days['monday'][0]['period'] ?? ""}`,
                            "to":
                                `${days['monday'][1]['time'] ?? "0:00"}${days['monday'][1]['period'] ?? ""}`
                        };
                    } else {
                        return day = null;
                    }
                    break;
                case 2:
                    if (days['tuesday'] != null) {
                        day = {
                            "day": "Tuesday",
                            "time": newDate,
                            "from":
                                `${days['tuesday'][0]['time'] ?? "0:00"}${days['tuesday'][0]['period'] ?? ""}`,
                            "to":
                                `${days['tuesday'][1]['time'] ?? "0:00"}${days['tuesday'][1]['period'] ?? ""}`
                        };
                    } else {
                        return day = null;
                    }
                    break;
                case 3:
                    if (days['wednesday'] != null) {
                        day = {
                            "day": "Wednesday",
                            "time": newDate,
                            "from":
                                `${days['wednesday'][0]['time'] ?? "0:00"}${days['wednesday'][0]['period'] ?? ""}`,
                            "to":
                                `${days['wednesday'][1]['time'] ?? "0:00"}${days['wednesday'][1]['period'] ?? ""}`
                        };
                    } else {
                        return day = null;
                    }
                    break;
                case 4:
                    if (days['thursday'] != null) {
                        day = {
                            "day": "Thursday",
                            "time": newDate,
                            "from":
                                `${days['thursday'][0]['time'] ?? "0:00"}${days['thursday'][0]['period'] ?? ""}`,
                            "to":
                                `${days['thursday'][1]['time'] ?? "0:00"}${days['thursday'][1]['period'] ?? ""}`
                        };
                    } else {
                        return day = null;
                    }
                    break;
                case 5:
                    if (days['friday'] != null) {
                        day = {
                            "day": "Friday",
                            "time": newDate,
                            "from":
                                `${days['friday'][0]['time'] ?? "0:00"}${days['friday'][0]['period'] ?? ""}`,
                            "to":
                                `${days['friday'][1]['time'] ?? "0:00"}${days['friday'][1]['period'] ?? ""}`
                        };
                    } else {
                        return day = null;
                    }
                    break;
                case 6:
                    if (days['saturday'] != null) {
                        day = {
                            "day": "Saturday",
                            "time": newDate,
                            "from":
                                `${days['saturday'][0]['time'] ?? "0:00"}${days['saturday'][0]['period'] ?? ""}`,
                            "to":
                                `${days['saturday'][1]['time'] ?? "0:00"}${days['saturday'][1]['period'] ?? ""}`
                        };
                    } else {
                        return day = null;
                    }
                    break;
                case 7:
                    if (days['sunday'] != null) {
                        day = {
                            "day": "Sunday",
                            "time": newDate,
                            "from":
                                `${days['sunday'][0]['time'] ?? "0:00"}${days['sunday'][0]['period'] ?? ""}`,
                            "to":
                                `${days['sunday'][1]['time'] ?? "0:00"}${days['sunday'][1]['period'] ?? ""}`
                        };
                    } else {
                        return day = null;
                    }

                    break;
                default:
                    return day = null;
            }
        }
        return day;
    }

    const getMonth = (month) => {
        switch (month) {
            case 1:
                return "Jan";
            case 2:
                return "Feb";
            case 3:
                return "Mar";
            case 4:
                return "Apr";
            case 5:
                return "May";
            case 6:
                return "Jun";
            case 7:
                return "Jul";
            case 8:
                return "Aug";
            case 9:
                return "Sep";
            case 10:
                return "Oct";
            case 11:
                return "Nov";
            case 12:
                return "Dec";
        }
    }

    const getDeliverCompanies = (data) => {
        setDistrictLoading(true)
        let sendData = {
            "query": {
                "from": kitchenData.district,
                "to": data
            }
        }
        axios.post(`${APP_URL}/carriage/delivery/query`, sendData).then((res) => {
            console.log(res.data);
            setdeliveryCompanies(res.data.companies)
            setDistrictLoading(false)
        })
    }

    const getDeliverTypes = () => {

        let sendData = {
            "id": kitchenDetails.kitchen_id
        }
        axios.post(`${APP_URL}${VERSION}/kitchens/deliveries`, sendData).then((res) => {
            console.log(res.data);
            setdeliveryMeans(res.data)

        })
    }

    const updateDeliveryData=()=>{
        console.log(delivery_type);
        let sendData;
        if(delivery_type===""){
            alert("Please selecte delivery Type")
        }else if(delivery_type===3 && delivery_company==null){
            alert("Please selected Delivery Company")
        }

        if(delivery_type!==""){
            if(delivery_type==="3"){

                alert("Sending Delivery company")
                setPaymentLoading(true)
                sendData={
                    "cart_id": cartData.cart_id,
                    "delivery_type": parseInt(delivery_type),
                    "delivery": delivery_company
                  }
            }else{
                setPaymentLoading(true)
                alert("Sending self pickup")
                sendData={
                    "cart_id": cartData.cart_id,
                    "delivery_type": parseInt(delivery_type),
                  }
            }
            console.log(sendData);
           
            axios.post(`${APP_URL}${VERSION}/carts/delivery`, sendData).then((res) => {
                console.log(res.data);
                
                if(res.data.code!==200){
                    setPaymentLoading(false)
                    alert(res.data.msg)
                }else{
                    updateDeliveryTime()
                }
                

            }).catch((e)=>{
                console.log(e);
                setPaymentLoading(false)
            })
        }

       

    }

    const updateDeliveryTime=()=>{
       if(delivery_date===""){
        alert("Please choose delivery Time")
        setPaymentLoading(false)
       }else{
        let sendData={
            "cart_id": cartData.cart_id,
            "delivery_time": delivery_date,
          }
          console.log(sendData);

        axios.post(`${APP_URL}${VERSION}/carts/set-delivery-time`, sendData).then(async(res) => {
            console.log(res.data);
            if(res.data.code!==200){
                setPaymentLoading(false)
                alert(res.data.msg)
            }else{
                await loadCartData()
                makePayment()
            }

            
        }).catch((e)=>{
            console.log(e);
            setPaymentLoading(false)
        })
       }
    }

    const makePayment= async()=>{
        await loadCartData()
       
        let sendData={
            "email": email,
            "amount": cartData.cart_total_price,
            "phone": phone,
            "full_name": `${first_name} ${last_name}`,
            "currency": "NGN",
            "dropoff_lat": 9.022737051855007,
            "dropoff_lng":7.466229866811429,
            "country": "Nigeria",
            "device_id": "admin",
            "device_type": "WEB",
            "metadata": cartData
          }
          console.log(sendData);
        //   alert("Sent data")
        //setPaymentLoading(false)
          axios.post(`${APP_URL}${VERSION}/payment/initiate`, sendData).then((res) => {
            console.log(res.data);
            setPaymentLink( res.data.data.authorization_url)
            setPaymentLoading(false)
          })
    }



    return (<div>
        <div className="kitchen_banner" style={{ backgroundImage: `url(${kitchenDetails.large})` }}></div>
        <div class="container-xxl py-5">
            <div class="container">
                <div class="row g-0 gx-5 ">
                    <div className="col-xl-8 col-lg-8 col-md-12">
                        <div className="row text-start">
                            <div className="col-md-2">
                                <img src={`${kitchenDetails.profile}`} alt="" className='profile_img' />
                            </div>
                            <div className="col-md-10 ">
                                <h4>{kitchenDetails.kitchen_name}</h4>
                                <p>{kitchenDetails.caption}</p>
                                <p><span><i class="bi bi-star-fill text-warning"></i> {kitchenDetails.rating}</span> <span>
                                    {kitchenDetails.open_for_order === true ? <span className='text-success'>Accepting Orders</span> : <span className='text-danger'>Closed</span>}
                                </span></p>
                            </div>
                        </div>
                        <br />
                        <div className="card">
                            <div className="card-header">
                                <h4><i class="bi bi-menu-app-fill"></i> Kitchen Menu</h4>
                            </div>
                            <div className="card-body">
                                {loading ? <div className='text-center'><Loader></Loader></div> :
                                    <>
                                        {menus.map((data,menu_i) => {
                                            return (<div className="menu-item mt-2">
                                                <div className="bg-light p-2">
                                                    <h3>{data.name}</h3>
                                                </div>
                                                {data.dishes.map((dish, index) => {
                                                    return (<div className="row border-bottom">
                                                        <div className="col-lg-8 col-md-12">
                                                            <div className="p-3">
                                                                <h5>{dish.name}.</h5>
                                                                <p>{dish.descp}.</p>
                                                                <div className="row">
                                                                    <div className="col"><h6><i class="bi bi-egg-fried"></i> ₦{dish.total_amount}</h6></div>
                                                                    <div className="col"><h6><i class="bi bi-box2-fill"></i> ₦{dish.package_cost}</h6></div>
                                                                    <div className="col-auto">
                                                                        <div className="badge bg-dark">Serving ({dish.serving})</div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-lg-4  col-md-12">
                                                            <div className="item-img">
                                                                <img src={`${dish.image}`} alt="" />
                                                                {dish.instock ? <button className="btn btn-success w-100" data-bs-toggle="modal" data-bs-target={`#dishModal${dish.id}`}>Add +</button> : <div className='text-center bg-danger p-1 text-white'>Out Of Stock</div>}
                                                                <div class="modal fade" id={`dishModal${dish.id}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                    <div class="modal-dialog modal-dialog-centered">
                                                                        <div class="modal-content">
                                                                            <div class="modal-header">
                                                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Add {dish.name} to cart</h1>
                                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                            </div>
                                                                            <div class="modal-body">
                                                                                <div className="row">
                                                                                    <div className="col-md-8">
                                                                                        <label htmlFor="">Customer Comment</label>
                                                                                        <textarea name="comment" className='form-control' id="" cols="3" rows="1" onChange={handleEvent}>

                                                                                        </textarea>
                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                        <label htmlFor="">Quantity</label>
                                                                                        <input type="number" className="form-control" name='quantity' placeholder='quantity' onChange={handleEvent} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="modal-footer">
                                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                                <button type="button" class="btn btn-success" data-bs-dismiss="modal" onClick={() => addItemToCart(dish.id)}>Add To Cart</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>)
                                                })}


                                            </div>)
                                        })}
                                    </>}

                            </div>
                        </div>

                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-12 cart_body" style={{ position: "sticky", top: "60px", height: "fit-content" }}>
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col"> {cartLoading ? <Loader></Loader> : <h5> <span className='badge bg-success'><i class="bi bi-basket"></i> Cart ({cartData.total_item_count != null ? <>{cartData.total_item_count}</> : <></>})</span></h5>} </div>
                                    <div className="col-auto">
                                        <h5>{cartData.cart_id != null ? <>{cartData.kitchen.name}</> : <></>}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" >
                                <div style={{ overflowY: "scroll", height: "500px", paddingTop: "10px", paddingBottom: "100px", paddingLeft: "20px", paddingRight: "20px" }}>

                                    <div className="bg-light p-2">
                                        <h5>Customer Details</h5>
                                    </div>

                                    <div className="card">
                                        <div className="p-2">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control" name='first_name' placeholder='First Name' onChange={handleEvent} />
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control" name='last_name' placeholder='Last Name' onChange={handleEvent} />
                                                </div>

                                            </div>
                                            <br />
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control" name='phone' placeholder='Phone' onChange={handleEvent} />
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control" name='email' placeholder='Email' onChange={handleEvent} />
                                                </div>
                                            </div>
                                            <br />
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input type="text" className="form-control" name='addr' placeholder='Address' onChange={handleEvent} />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <br />

                                    {cartData.items !== null ? <>{cartItems.map((data) => {
                                        return (<div className="row border-bottom ">

                                            <div className="col-md-4">
                                                <div className="item-img-cart">
                                                    <img src={`${data.img}`} alt="" />
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="item">
                                                    <div className="row">
                                                        <div className="col">
                                                            <h6>{data.name}</h6>
                                                        </div>
                                                        <div className="col-auto">
                                                            <i onClick={() => deleteCartItem(cartData.cart_id, data.cart_dish_id)} class="bi bi-trash-fill text-danger"></i>
                                                        </div>
                                                    </div>
                                                    <small><span className='bg-dark p-1 text-light'><b>Customer Note:</b></span> {data.comment}</small>
                                                    <div className="row">
                                                        <div className="col"><p><b>N{data.total_price}</b></p></div>
                                                        <div className="col-auto">
                                                            <div className="badge bg-secondary">
                                                                <div className="row cart-btn">
                                                                    <div className="col"><h6><i class="bi bi-plus-square-fill "></i></h6></div>
                                                                    <div className="col"><h6>{data.quantity}</h6></div>
                                                                    <div className="col-auto"><h6><i class="bi bi-dash-square-fill"></i></h6></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)
                                    })}</> : <>Cart Empty</>}

                                    <br />
                                    <div className="bg-light p-2">
                                        <h5>Delivery Date</h5>
                                    </div>

                                    <div className="card">
                                        <div className="p-2">

                                            <div className="row cart_date">
                                                <div className="col">
                                                    <h6>{`${getDay(1)["day"]}`} </h6>
                                                    <small>{`${`${getDay(1)["time"]}\n${getDay(1)["from"]} - ${getDay(1)["to"]}`}`}</small>
                                                </div>
                                                <div className="col-auto">
                                                    <input type="radio" name='date' value={getDay(1)["time"]} onChange={handleEvent} />
                                                </div>
                                            </div>
                                            <div className="row cart_date">
                                                <div className="col">
                                                    <h6>{`${getDay(2)["day"]}`} </h6>
                                                    <small>{`${`${getDay(2)["time"]}\n${getDay(2)["from"]} - ${getDay(2)["to"]}`}`}</small>
                                                </div>
                                                <div className="col-auto">
                                                    <input type="radio" name='date' value={getDay(2)["time"]} onChange={handleEvent} />
                                                </div>
                                            </div>
                                            <div className="row cart_date">
                                                <div className="col">
                                                    <h6>{`${getDay(3)["day"]}`} </h6>
                                                    <small>{`${`${getDay(3)["time"]}\n${getDay(3)["from"]} - ${getDay(3)["to"]}`}`}</small>
                                                </div>
                                                <div className="col-auto">
                                                    <input type="radio" name='date' value={getDay(3)["time"]} onChange={handleEvent} />
                                                </div>
                                            </div>
                                            <div className="row cart_date">
                                                <div className="col">
                                                    <h6>{`${getDay(4)["day"]}`} </h6>
                                                    <small>{`${`${getDay(4)["time"]}\n${getDay(4)["from"]} - ${getDay(4)["to"]}`}`}</small>
                                                </div>
                                                <div className="col-auto">
                                                    <input type="radio" name='date' value={getDay(4)["time"]} onChange={handleEvent} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="bg-light p-2">
                                        <h5>Delivery Type</h5>
                                    </div>

                                    <div className="card">
                                        <div className="p-2">
                                        {deliveryMeans.eat_in != null && deliveryMeans.eat_in.value===true ? <div className="row ">
                                                <div className="col">
                                                    <h6>Eat In</h6><br />
                                                </div>
                                                <div className="col-auto">
                                                    <input type="radio" value={1} name='delivery_type' onChange={handleEvent} />
                                                </div>
                                            </div> : <></>}

                                            {deliveryMeans.self_pickup != null && deliveryMeans.self_pickup.value ===true? <div className="row ">
                                                <div className="col">
                                                    <h6>Pick Up</h6><br />
                                                </div>
                                                <div className="col-auto">
                                                    <input type="radio" value={2} name='delivery_type' onChange={handleEvent} />
                                                </div>
                                            </div> : <></>}
                                           

                                            {deliveryMeans.shipment != null && deliveryMeans.shipment.length > 0 ? <div className="row ">
                                                <div className="col">
                                                    <h6>Deliver To Customer</h6><br />
                                                </div>
                                                <div className="col-auto">
                                                    <input type="radio" value={3} name='delivery_type' onChange={handleEvent} />
                                                </div>
                                            </div> : <></>}
                                        </div>
                                    </div>
                                    <br />


                                    <div className="bg-light p-2">
                                        <h5>Delivery Company</h5>
                                    </div>

                                    <div className="card">
                                        <div className="p-2">
                                            <select name="district" id="" className="form-control" onChange={handleEvent}>
                                                <option value="">Select Delivery District</option>
                                                {locations.map((data) => {
                                                    return (<option value={data.name}>{data.name}</option>)
                                                })}
                                            </select>
                                            {districtLoading ? <Loader></Loader> :
                                                <div className='district_tab'>
                                                    <hr />
                                                    <h6>Avaliable Districts </h6>
                                                    <p><b>{kitchenData.district} - {selectedDistrict}</b></p>
                                                    <hr />
                                                    {deliveryCompanies.map((data, index) => {
                                                        return (<div className="row ">
                                                            <div className="col">
                                                                <h6>{data.company_name} - (₦{data.delivery_price})</h6><br />
                                                            </div>
                                                            <div className="col-auto">
                                                                <input type="radio" value={index} name='company' onChange={handleEvent} />
                                                            </div>
                                                        </div>)
                                                    })}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <br />
                                    {paymentLink !== "" ? 
                                    <div className="paymentlink">
                                        {paymentLink}
                                    </div> : <></>}
                                    <button className="btn btn-success w-100 p-2" onClick={updateDeliveryData}> {paymentLoading?<Loader></Loader>:`Make Payment`}  </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>)
}

