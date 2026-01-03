import React from 'react'
import { Icon } from "@iconify/react/dist/iconify.js";

export default function BreadCrum(props) {
    return (
        <div className="row gy-3 mb-4 justify-content-between" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>
            <div className="col-md-12 col-auto">
                <div className="card py-6 h-100 w-100 overflow-hidden position-relative breadcrum-bg-image">
                    <div className="card-body ps-lg-6 ps-4 position-relative">
                        <h1 className="mb-2 fw-600 d-flex align-items-center gap-2">
                            <span>
                                {props.icon}
                            </span>
                            {props.title}
                        </h1>
                        <h3 className="fs-7 fw-normal lh-lg">{props.subTitle}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
