import React from 'react'

export default function BreadCrum(props) {
    return (
        <div className="row gy-3 mb-4 justify-content-between" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>
            <div className="col-md-12 col-auto">
                <div className="py-10 hero h-100 w-100 overflow-hidden rounded-3 breadcrum-bg-image">
                    <div className="card-body px-4 position-relative">
                        <h1 className="mb-2 fw-semibold text-white">{props.title}<span className='text-primary'>.</span> </h1>
                        <h3 className="text-white fs-7 fw-normal lh-lg">{props.subTitle}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
