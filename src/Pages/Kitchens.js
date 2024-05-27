import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_URL, VERSION } from '../Components/Globals';
import Loader from '../Components/Loader';

export default function Kitchens() {

    const [allKitchens, setAllKitchens] = useState([])
    const [locations, setLocations] = useState([])
    const [locationID, setLocationID] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    

    useEffect(() => {
        loadLocations()
        loadAllKitchens()
    }, [])

    const loadAllKitchens = () => {
        setLoading(true)
        axios.get(`${APP_URL}${VERSION}/kitchens?page=1&limit=100`).then((res) => {
            setAllKitchens(res.data.kitchens)
            setLoading(false)
        })
    }

    const loadKitchensByLocation = (id) => {
        let sendData = {
            "query": {
                "region": id,
                "state": "abuja"
            },
            "page": 1,
            "limit": 100
        }
        setLoading(true)
        axios.post(`${APP_URL}${VERSION}/kitchens/regions`, sendData).then((res) => {
            console.log(res.data.kitchens);
            setAllKitchens(res.data.kitchens)
            setLoading(false)
        })
    }

    const loadLocations = () => {
        let sendData = {
            "query": { "state_id": "abuja" }
        }
        axios.post(`${APP_URL}${VERSION}/q/districts`, sendData).then((res) => {
            
            setLocations(res.data)
        })
    }

    const handleLocationEvent = (e) => {
        if (e.target.name === "locationID") {
            setLocationID(e.target.value)
            loadKitchensByLocation(e.target.value)

        }
    }

    const moveToNextPage=(url, kitchenDetails)=>{
        navigate(url, { state: {kitchenDetails:kitchenDetails }});
    }

    return (<div>
        <div class="container-xxl py-5">
            <div class="container ">
                <div class="row g-0 gx-5  align-items-end">
                    <div class="col-lg-7">
                        <div class="section-header text-start mb-5 wow fadeInUp" data-wow-delay="0.1s" >
                            <h1 class="display-5 mb-3">Kitchens</h1>
                            <p>All kitchens on the Kitchly Platform</p>
                        </div>
                    </div>
                    <div class="col-lg-4 text-start text-lg-end wow slideInRight" data-wow-delay="0.1s">

                        <div className="row">
                            <div className="col">
                                <select name="locationID" id="" className="form-control" onChange={handleLocationEvent}>
                                    <option value="">Select District</option>
                                    {locations.map((data) => {
                                        return (<option value={`${data.name}`}>{data.name}</option>)
                                    })}
                                </select>
                            </div>
                            <div className="col-auto">
                                <button className="btn btn-success" onClick={loadAllKitchens}>Load All Kitchens</button>
                            </div>
                        </div>

                    </div>
                </div>
                <br />
                <div class="tab-content">
                    {loading ? <div className='text-center'><Loader></Loader></div> : <div id="tab-1" class="tab-pane fade show p-0 active">
                        <div class="row g-4">

                            {allKitchens.length===0?<div>No Kitchen Available in {locationID}</div>:<>{allKitchens.map((data) => {
                                return (<div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                    <div class="product-item">
                                        <div onClick={()=>moveToNextPage(`/menu/${data.kitchen_id}`, data)} >
                                            <div class="position-relative bg-light overflow-hidden">
                                                <img class="img-fluid w-100" src={`${data.large}`} alt="" />
                                                {data.open_for_order ? <></> : <div class="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">Closed For Order</div>}

                                            </div>
                                            <div class="text-center p-4">
                                                <Link class="d-block h5 mb-2 kitchen_name" to="">{data.kitchen_name}</Link>
                                                <span class="text-dark me-1 kitchen_location">{data.addr}</span>

                                            </div>
                                            <div class="d-flex border-top">
                                                <small class="w-100 text-center py-2">
                                                    <Link class="text-body" to="/menu/01"><i class="fa fa-eye text-primary me-2"></i>View detail</Link>
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>)

                            })}</>}

                            


                        </div>
                    </div>}

                </div>
            </div>
        </div>

    </div>)
}

