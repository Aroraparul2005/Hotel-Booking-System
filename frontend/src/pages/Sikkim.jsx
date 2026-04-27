import React from "react";
import Sikkimbg from "../assets/sikkimbg.jpg"

function Sikkim() {
    return(
    <div className="relative flex flex-col items-start justify-center 
                 px-6 md:px-16 lg:px-24 xl:px-32 
                 text-white h-screen bg-no-repeat bg-cover bg-center bg-black/40"
          style={{ backgroundImage: `url(${Sikkimbg})` }}
        >
        </div>
    )
}

export default Sikkim;