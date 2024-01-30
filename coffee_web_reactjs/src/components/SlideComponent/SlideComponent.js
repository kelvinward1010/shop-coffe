import { Image } from "antd";
// Nạp Image cho ảnh được sử dụng
import React from "react";
import { WrapperSliderStyle } from './style';

const SlideComponent = ({arrImages}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };
  return(
    <WrapperSliderStyle {...settings}>
    {arrImages.map((image)=>{
      return(
        <div key={image}>
        <Image src={image} alt ='slider' preview={false} width="90%" height='475px' 
        style={{marginLeft:'27px', marginTop:'35px', border: '5px solid #D3756B'}}/>
        </div>
      )
    })}
    </WrapperSliderStyle>
  )
}

export default SlideComponent