import React, {useState} from "react";

export default function Modal(props){
    const [showModal, setShowModal] = useState(false);

    return(
        <>
        <button
            className={props.buttonClassName}
            onClick={() => {
                setShowModal(true);
            }}
        >
            {props.buttonText}
        </button>
            {showModal && (
                <>
                    <div className='flex items-center justify-center fixed inset-0'>
                        <div className="relative card bg-white z-50">
                            <button className="" onClick={() => {setShowModal(false)}}>
                                <span className="opacity-5 outline-none focus:outline-none">×</span>
                            </button>
                            {props.children}
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"/>
                    </div>
                </>
            )}
        </>
    )
}